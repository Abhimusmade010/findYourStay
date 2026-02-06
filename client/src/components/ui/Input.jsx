import { forwardRef } from "react"
import { cn } from "../../lib/utils"
import { motion } from "framer-motion"

const Input = forwardRef(({ className, type, ...props }, ref) => {
  return (
    <motion.input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background/50 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        "hover:bg-background/70 focus:bg-background/80",
        className
      )}
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input }
