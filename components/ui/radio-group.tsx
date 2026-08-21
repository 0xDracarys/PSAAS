"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "border-white/40 bg-black/60 hover:border-[#8052ff] hover:bg-white/10 data-[state=checked]:border-[#ffb829] data-[state=checked]:bg-[#ffb829]/20 data-[state=checked]:text-[#ffb829] data-[state=checked]:shadow-[0_0_12px_rgba(255,184,41,0.4)] aspect-square size-4.5 shrink-0 rounded-full border-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#8052ff] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="fill-[#ffb829] text-[#ffb829] absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_4px_#ffb829]" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
