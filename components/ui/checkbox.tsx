"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-white/40 bg-black/60 hover:border-[#8052ff] data-[state=checked]:bg-[#8052ff] data-[state=checked]:text-white data-[state=checked]:border-[#8052ff] data-[state=checked]:shadow-[0_0_10px_rgba(128,82,255,0.4)] focus-visible:border-ring focus-visible:ring-ring/50 size-4.5 shrink-0 rounded-[4px] border-2 transition-all duration-200 outline-none focus-visible:ring-[2px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-white transition-none font-bold"
      >
        <CheckIcon className="size-3.5 stroke-[3]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
