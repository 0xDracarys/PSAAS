"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MessageCircle, X, Mail, Phone, Send } from "lucide-react"

export function FloatingContactButton() {
  const [isOpen, setIsOpen] = useState(false)

  const contactOptions = [
    {
      icon: Send,
      label: "Start Project",
      action: () => {
        // This would trigger the project form modal
        console.log("Open project form")
      },
      color: "bg-primary hover:bg-primary/80",
    },
    {
      icon: Mail,
      label: "Quick Email",
      action: () => window.open("mailto:alex@example.com"),
      color: "bg-secondary hover:bg-secondary/80",
    },
    {
      icon: Phone,
      label: "Call Me",
      action: () => window.open("tel:+15551234567"),
      color: "bg-primary hover:bg-primary/80",
    },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {contactOptions.map((option, index) => (
              <motion.div
                key={option.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  onClick={option.action}
                  className={`glassmorphism ${option.color} text-white shadow-lg hover:glow-amber transition-all duration-300 flex items-center gap-2 whitespace-nowrap`}
                >
                  <option.icon className="h-4 w-4" />
                  {option.label}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`glassmorphism ${
          isOpen ? "bg-destructive hover:bg-destructive/80" : "bg-primary hover:bg-primary/80"
        } text-white shadow-lg glow hover:glow-amber transition-all duration-300 rounded-full w-14 h-14 p-0`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </div>
  )
}
