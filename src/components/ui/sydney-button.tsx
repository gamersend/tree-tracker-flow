
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const sydneyButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sydney-green focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sydney-button-glow",
  {
    variants: {
      variant: {
        default: "bg-sydney-green text-black hover:bg-sydney-green/90 shadow-lg shadow-sydney-green/30",
        destructive: "bg-red-500 text-white hover:bg-red-500/90 shadow-lg shadow-red-500/30",
        outline: "border-2 border-sydney-green text-sydney-green hover:bg-sydney-green hover:text-black shadow-lg shadow-sydney-green/20",
        secondary: "bg-slate-700 text-sydney-green hover:bg-slate-600 border border-sydney-green/30",
        ghost: "text-sydney-green hover:bg-sydney-green/10",
        link: "text-sydney-green underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface SydneyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sydneyButtonVariants> {
  asChild?: boolean
}

const SydneyButton = React.forwardRef<HTMLButtonElement, SydneyButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : motion.button
    
    // Separate motion props from HTML button props
    const { onAnimationStart, onAnimationComplete, ...buttonProps } = props
    
    return (
      <Comp
        className={cn(sydneyButtonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        {...buttonProps}
      />
    )
  }
)
SydneyButton.displayName = "SydneyButton"

export { SydneyButton, sydneyButtonVariants }
