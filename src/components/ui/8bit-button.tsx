import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "retro inline-flex items-center justify-center",
        "bg-foreground text-background",
        "px-8 py-3 text-sm tracking-[0.2em] uppercase font-bold",
        "shadow-[4px_4px_0px_0px_var(--accent)]",
        "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--accent)]",
        "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        "transition-all duration-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
