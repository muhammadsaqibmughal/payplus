type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function AuthShell({ title, subtitle, children }: Props) {
  return (
    <div className="relative flex flex-1 items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 px-7 py-8 text-white shadow-2xl backdrop-blur-md sm:px-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-[2.1rem]">
            {title}
          </h1>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-white/65">
            {subtitle}
          </p>
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
