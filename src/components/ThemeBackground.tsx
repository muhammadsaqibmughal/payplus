import Image from "next/image";

type Props = {
  /** Extra darkening on top of the image (0–1). */
  dim?: number;
};

export function ThemeBackground({ dim = 0.28 }: Props) {
  return (
    <div className="theme-bg" aria-hidden>
      <Image
        src="/assest/bg-coins.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="h-full w-full object-cover object-center"
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(3,20,32,${dim * 0.7}) 0%, rgba(3,20,32,${
            dim * 0.4
          }) 40%, rgba(3,20,32,${dim + 0.2}) 100%)`,
        }}
      />
    </div>
  );
}
