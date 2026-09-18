export function Logo({
  className = "",
  iconOnly = false,
  size = "md",
}: {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const iconSizes = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-12 w-12",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src="/logo-icon.png"
        alt="BeautyFolio"
        className={`${iconSizes[size]} shrink-0 object-contain`}
      />
      {!iconOnly && (
        <span className={`font-display font-bold tracking-tight ${textSizes[size]}`}>
          <span className="text-foreground">Beauty</span>
          <span className="text-gradient-brand">Folio</span>
        </span>
      )}
    </span>
  );
}

