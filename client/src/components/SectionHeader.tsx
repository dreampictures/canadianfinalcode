import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({ title, subtitle, centered = true, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-12 space-y-3", centered && "text-center", className)}>
      <h2 className="font-serif text-3xl md:text-5xl font-bold text-primary">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          {subtitle}
        </p>
      )}
      <div className={cn("h-1 w-20 bg-secondary mt-4", centered && "mx-auto")} />
    </div>
  );
}
