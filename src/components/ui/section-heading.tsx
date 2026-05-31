type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  centered?: boolean;
  headingLevel?: "h1" | "h2";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
  headingLevel = "h2",
}: SectionHeadingProps) {
  const Heading = headingLevel;

  return (
    <div className={centered ? "mx-auto max-w-3xl text-center flex flex-col items-center" : "max-w-3xl flex flex-col items-start"}>
      {/* Sleek, simple eyebrow using brand orange */}
      <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#ff5400]">
        {eyebrow}
      </span>
      
      {/* Clean, bold uppercase headline */}
      <Heading className="mt-2.5 font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-black leading-[1.1]">
        {title}
      </Heading>
      
      {/* Simplified and elegant description */}
      <p className="mt-3 text-sm sm:text-base font-medium text-black/50 leading-relaxed max-w-2xl">
        {description}
      </p>
    </div>
  );
}
