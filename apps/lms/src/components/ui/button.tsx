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
          "bg-button-primary text-white shadow hover:opacity-90 hover:shadow-md active:translate-y-0.5",
        destructive:
          "bg-red-500 text-white shadow-sm hover:opacity-90 hover:shadow-md",
        outline:
          "border border-border/60 bg-background shadow-sm hover:border-border hover:bg-background-secondary/50 hover:text-text-primary",
        secondary:
          "bg-button-secondary text-white shadow-sm hover:opacity-90 hover:shadow-md",
        ghost: 
          "text-text-secondary hover:bg-background-secondary hover:text-text-primary",
        link: 
          "text-link underline-offset-4 hover:underline",
        soft:
          "bg-button-primary/10 text-button-primary hover:bg-button-primary/20",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        md: "h-11 rounded-md px-6",
        lg: "h-12 rounded-md px-8 text-base",
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
