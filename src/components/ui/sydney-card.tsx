
import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const SydneyCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <motion.div
    ref={ref}
    whileHover={{ 
      scale: 1.02,
      boxShadow: "0 0 25px rgba(0, 255, 102, 0.3)"
    }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={cn(
      "rounded-xl border-2 border-sydney-green/30 bg-gradient-to-br from-slate-900/90 to-purple-900/90 backdrop-blur-sm text-card-foreground shadow-lg shadow-sydney-green/10 sydney-card-glow",
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
))
SydneyCard.displayName = "SydneyCard"

const SydneyCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 border-b border-sydney-green/20", className)}
    {...props}
  />
))
SydneyCardHeader.displayName = "SydneyCardHeader"

const SydneyCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight text-sydney-green sydney-glow",
      className
    )}
    {...props}
  />
))
SydneyCardTitle.displayName = "SydneyCardTitle"

const SydneyCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-300", className)}
    {...props}
  />
))
SydneyCardDescription.displayName = "SydneyCardDescription"

const SydneyCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
SydneyCardContent.displayName = "SydneyCardContent"

const SydneyCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 border-t border-sydney-green/20", className)}
    {...props}
  />
))
SydneyCardFooter.displayName = "SydneyCardFooter"

export { SydneyCard, SydneyCardHeader, SydneyCardFooter, SydneyCardTitle, SydneyCardDescription, SydneyCardContent }
