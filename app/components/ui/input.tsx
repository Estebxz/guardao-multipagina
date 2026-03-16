import { cn } from "@lib/utils";
import { ComponentProps, forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 ring-offset-background transition-all duration-200",
          "file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0 focus-visible:border-primary focus-visible:bg-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
