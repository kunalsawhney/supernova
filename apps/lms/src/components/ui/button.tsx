import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:opacity-90 hover:shadow-md active:translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:opacity-90 hover:shadow-md",
        outline:
          "border border-border/60 bg-background shadow-sm hover:border-border hover:bg-background-secondary/50 hover:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:opacity-90 hover:shadow-md",
        ghost: 
          "text-muted-foreground hover:bg-background-secondary hover:text-foreground",
        link: 
          "text-secondary underline-offset-4 hover:underline",
        soft:
          "bg-primary/10 text-primary hover:bg-primary/20",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        md: "h-10 rounded-md px-4",
        lg: "h-12 rounded-md px-6 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded-md [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
