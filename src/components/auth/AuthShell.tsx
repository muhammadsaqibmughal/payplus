type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function AuthShell({ title, subtitle, children }: Props) {
  return (
    <div className="relative flex flex-1 items-center justify-center px-7 py-5 sm:px-10 sm:py-8 md:px-6">
      <div className="w-full max-w-[19rem] rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-white shadow-2xl backdrop-blur-md sm:max-w-sm sm:rounded-[2rem] sm:px-8 sm:py-7 md:max-w-md md:px-10 md:py-8">
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl md:text-[2.1rem]">
            {title}
          </h1>
          <p className="mx-auto mt-1.5 max-w-xs text-[11px] leading-relaxed text-white/65 sm:mt-2 sm:text-sm">
            {subtitle}
          </p>
        </div>
        <div className="mt-5 sm:mt-8">{children}</div>
      </div>
    </div>
  );
}
