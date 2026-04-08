interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export function SectionHeading({
  title,
  subtitle,
  centered = true,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={`mb-10 ${centered ? "text-center" : ""}`}>
      <h2
        className={`text-2xl font-bold sm:text-3xl lg:text-4xl ${
          light ? "text-white" : "text-brand"
        }`}
      >
        {title}
      </h2>
      <div
        className={`mx-auto mt-3 h-1 w-16 rounded-full ${
          centered ? "" : "mx-0"
        } bg-accent`}
      />
      {subtitle && (
        <p
          className={`mt-4 text-base ${
            light ? "text-white/70" : "text-gray-500"
          } sm:text-lg`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
