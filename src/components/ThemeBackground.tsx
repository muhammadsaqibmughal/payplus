import Image from "next/image";

type Props = {
  /** Which background asset to use. */
  variant?: "main" | "portrait" | "wide";
  /** Extra darkening on top of the image (0–1). */
  dim?: number;
};

const SOURCES: Record<NonNullable<Props["variant"]>, string> = {
  main: "/assest/bg main.png",
  portrait: "/assest/bg 1.png",
  wide: "/assest/bg 2.png",
};

export function ThemeBackground({ variant = "main", dim = 0.35 }: Props) {
  return (
    <div className="theme-bg" aria-hidden>
      <Image
        src={SOURCES[variant]}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(3,20,32,${dim}) 0%, rgba(3,20,32,${
            dim * 0.6
          }) 40%, rgba(3,20,32,${dim + 0.25}) 100%)`,
        }}
      />
    </div>
  );
}
