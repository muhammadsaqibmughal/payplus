import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type CsvUser = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

const HEADER = "id,name,email,passwordHash,createdAt";

function storePath() {
  // Vercel serverless is read-only except /tmp (ephemeral per instance).
  if (process.env.VERCEL) {
    return path.join("/tmp", "paypulse-users.csv");
  }
  return path.join(process.cwd(), "data", "users.csv");
}

function escapeField(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

function parseLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let quoted = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }

  fields.push(current);
  return fields;
}

function serialize(users: CsvUser[]) {
  const rows = users.map((user) =>
    [
      String(user.id),
      escapeField(user.name),
      escapeField(user.email),
      escapeField(user.passwordHash),
      escapeField(user.createdAt),
    ].join(","),
  );
  return `${HEADER}\n${rows.join("\n")}${rows.length ? "\n" : ""}`;
}

function deserialize(raw: string): CsvUser[] {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) return [];

  return lines.slice(1).flatMap((line) => {
    const [id, name, email, passwordHash, createdAt] = parseLine(line);
    const numericId = Number(id);
    if (!numericId || !email || !passwordHash) return [];
    return [
      {
        id: numericId,
        name: name ?? "",
        email: email.toLowerCase(),
        passwordHash,
        createdAt: createdAt || new Date().toISOString(),
      },
    ];
  });
}

let queue: Promise<unknown> = Promise.resolve();

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function ensureFile() {
  const file = storePath();
  try {
    await readFile(file, "utf8");
  } catch {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, `${HEADER}\n`, "utf8");
  }
}

async function readUsers() {
  await ensureFile();
  const raw = await readFile(storePath(), "utf8");
  return deserialize(raw);
}

async function writeUsers(users: CsvUser[]) {
  await mkdir(path.dirname(storePath()), { recursive: true });
  await writeFile(storePath(), serialize(users), "utf8");
}

export async function findUserByEmail(email: string) {
  const users = await withLock(readUsers);
  const normalized = email.toLowerCase();
  return users.find((user) => user.email === normalized) ?? null;
}

export async function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
}) {
  return withLock(async () => {
    const users = await readUsers();
    const email = input.email.toLowerCase();
    if (users.some((user) => user.email === email)) {
      return { error: "exists" as const };
    }

    const nextId = users.reduce((max, user) => Math.max(max, user.id), 0) + 1;
    const user: CsvUser = {
      id: nextId,
      name: input.name,
      email,
      passwordHash: input.passwordHash,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    await writeUsers(users);
    return { user };
  });
}
