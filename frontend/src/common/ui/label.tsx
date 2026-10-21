import * as React from "react"
import { cn } from "@/common/lib/utils"

function Label({ className, visuallyHidden = false, ...props }: React.ComponentProps<"label"> & { visuallyHidden?: boolean }) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        visuallyHidden && "sr-only",
        className
      )}
      {...props}
    />
  )
}

export { Label }
