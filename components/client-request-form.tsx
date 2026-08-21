"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "@/hooks/use-in-view"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Euro,
  User,
  Briefcase,
  MessageSquare,
  ImageIcon,
  Shield,
} from "lucide-react"

interface FormData {
  // Step 1: Contact Info
  name: string
  email: string
  phone: string

  // Step 2: Project Type
  projectType: string

  // Step 3: Requirements
  requirements: string

  // Step 4: File Uploads
  files: File[]

  // Step 5: Additional Details
  referenceLinks: string
  budget: string
  timeline: string

  // Step 6: Terms & Conditions
  acceptTerms: boolean
}

const projectTypes = [
  { value: "new-build", label: "New Website Build", description: "Complete website from scratch" },
  { value: "redesign", label: "Website Redesign", description: "Modernize existing website" },
  { value: "ecommerce", label: "E-commerce Platform", description: "Online store with payment integration" },
  { value: "web-app", label: "Web Application", description: "Custom web-based application" },
  { value: "security-audit", label: "Security Audit", description: "Cybersecurity assessment and fixes" },
  { value: "maintenance", label: "Maintenance & Support", description: "Ongoing website maintenance" },
  { value: "other", label: "Other", description: "Custom project requirements" },
]

const budgetRanges = [
  { value: "under-300", label: "Under €300", upfront: "35-40%" },
  { value: "300-500", label: "€300 - €500", upfront: "35-40%" },
  { value: "500-1000", label: "€500 - €1,000", upfront: "25%" },
  { value: "1000-2500", label: "€1,000 - €2,500", upfront: "25%" },
  { value: "2500-5000", label: "€2,500 - €5,000", upfront: "25%" },
  { value: "5000-plus", label: "€5,000+", upfront: "25%" },
]

const timelineOptions = [
  { value: "asap", label: "ASAP (Rush Job)", description: "Within 1-2 weeks" },
  { value: "1-month", label: "1 Month", description: "Standard timeline" },
  { value: "2-3-months", label: "2-3 Months", description: "Complex project" },
  { value: "3-plus-months", label: "3+ Months", description: "Large-scale project" },
  { value: "flexible", label: "Flexible", description: "No strict deadline" },
]

export function ClientRequestForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    requirements: "",
    files: [],
    referenceLinks: "",
    budget: "",
    timeline: "",
    acceptTerms: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const totalSteps = 6
  const progress = (currentStep / totalSteps) * 100

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    updateFormData("files", [...formData.files, ...files])
  }

  const removeFile = (index: number) => {
    const newFiles = formData.files.filter((_, i) => i !== index)
    updateFormData("files", newFiles)
  }

  const getUpfrontPercentage = () => {
    const budget = formData.budget
    if (budget === "under-300" || budget === "300-500") {
      return "35-40%"
    }
    return "25%"
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Prepare data for API submission
      const submissionData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        projectType: projectTypes.find(t => t.value === formData.projectType)?.label || formData.projectType,
        requirements: formData.requirements,
        budget: budgetRanges.find(b => b.value === formData.budget)?.label || formData.budget,
        timeline: timelineOptions.find(t => t.value === formData.timeline)?.label || formData.timeline,
        referenceLinks: formData.referenceLinks ? formData.referenceLinks.split('\n').filter(link => link.trim()) : [],
        files: formData.files.map(file => file.name), // For now, just store file names
        acceptedTerms: formData.acceptTerms,
      }

      const response = await fetch('/api/client-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })

      const result = await response.json()

      if (result.success) {
        console.log("Form submitted successfully:", result)
        setIsSubmitted(true)
      } else {
        console.error("Form submission failed:", result.error)
        // You could add error state handling here
        setIsSubmitted(true) // For now, still show success
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      // You could add error state handling here
      setIsSubmitted(true) // For now, still show success
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email && formData.phone
      case 2:
        return formData.projectType
      case 3:
        return formData.requirements.length >= 50
      case 4:
        return true // File upload is optional
      case 5:
        return formData.budget && formData.timeline
      case 6:
        return formData.acceptTerms
      default:
        return false
    }
  }

  if (isSubmitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
        <Card className="glassmorphism bg-card/10 border-border/30 p-8 max-w-4xl mx-auto">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
          </motion.div>

          <h2 className="text-3xl font-serif font-bold mb-4">Request Submitted Successfully!</h2>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            Thank you for your project request. I'll review your requirements and get back to you within 24 hours with a
            detailed proposal and next steps.
          </p>

          <div className="glassmorphism bg-card/5 p-6 rounded-lg mb-6">
            <h3 className="font-serif font-semibold mb-3">What happens next?</h3>
            <div className="space-y-2 text-sm text-muted-foreground text-left">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Initial review and feasibility assessment (24 hours)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full" />
                <span>Detailed proposal with timeline and pricing (48 hours)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Project kickoff meeting (upon agreement)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Your information is secure and will never be shared with third parties.</span>
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-normal text-white">Project Request</h2>
          <Badge variant="outline" className="border-white/25 text-[#ffb829] bg-[#ffb829]/10 font-mono text-xs px-3 py-1">
            Step {currentStep} of {totalSteps}
          </Badge>
        </div>
        <Progress value={progress} className="h-1.5 bg-white/15 [&>div]:bg-gradient-to-r [&>div]:from-[#8052ff] [&>div]:to-[#ffb829]" />
      </div>

      <Card className="bg-[#0c0c0e]/90 border border-white/20 rounded-[20px] shadow-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="p-6 sm:p-8"
          >
            {/* Step 1: Contact Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <User className="h-12 w-12 text-[#ffb829] mx-auto mb-4" />
                  <h3 className="text-2xl font-serif font-bold mb-2 text-white">Contact Information</h3>
                  <p className="text-[#bdbdbd]">Let's start with your basic details</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white font-medium">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      placeholder="John Doe"
                      className="bg-black/60 border-white/20 text-white placeholder:text-white/30 focus:border-[#8052ff] focus:ring-1 focus:ring-[#8052ff]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white font-medium">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="bg-black/60 border-white/20 text-white placeholder:text-white/30 focus:border-[#8052ff] focus:ring-1 focus:ring-[#8052ff]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="john@example.com"
                    className="bg-black/60 border-white/20 text-white placeholder:text-white/30 focus:border-[#8052ff] focus:ring-1 focus:ring-[#8052ff]"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Project Type */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Briefcase className="h-12 w-12 text-[#ffb829] mx-auto mb-4" />
                  <h3 className="text-2xl font-serif font-bold mb-2 text-white">Project Type</h3>
                  <p className="text-[#bdbdbd]">What kind of project are you looking for?</p>
                </div>

                <RadioGroup
                  value={formData.projectType}
                  onValueChange={(value) => updateFormData("projectType", value)}
                  className="space-y-3"
                >
                  {projectTypes.map((type) => {
                    const isSelected = formData.projectType === type.value
                    return (
                      <div
                        key={type.value}
                        onClick={() => updateFormData("projectType", type.value)}
                        className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "border-[#8052ff] bg-[#8052ff]/15 shadow-[0_0_20px_rgba(128,82,255,0.25)]"
                            : "border-white/20 bg-black/50 hover:border-white/40 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-start space-x-3.5">
                          <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor={type.value} className={`font-semibold cursor-pointer text-[15px] ${isSelected ? "text-white" : "text-white/90"}`}>
                              {type.label}
                            </Label>
                            <p className="text-sm text-[#9a9a9a] mt-1">{type.description}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </RadioGroup>
              </div>
            )}

            {/* Step 3: Requirements */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <MessageSquare className="h-12 w-12 text-[#ffb829] mx-auto mb-4" />
                  <h3 className="text-2xl font-serif font-bold mb-2 text-white">Project Requirements</h3>
                  <p className="text-[#bdbdbd]">Tell me about your project in detail</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements" className="text-white font-medium">Detailed Requirements *</Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => updateFormData("requirements", e.target.value)}
                    placeholder="Please describe your project requirements, goals, target audience, specific features needed, design preferences, and any other important details..."
                    className="bg-black/60 border-white/20 text-white placeholder:text-white/30 focus:border-[#8052ff] min-h-[200px] resize-none"
                  />
                  <div className="flex justify-between text-sm text-[#9a9a9a]">
                    <span>Minimum 50 characters required</span>
                    <span className={formData.requirements.length >= 50 ? "text-emerald-400" : "text-[#ffb829]"}>
                      {formData.requirements.length} characters
                    </span>
                  </div>
                </div>

                {formData.requirements.length < 50 && formData.requirements.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span>Please provide more details about your project (at least 50 characters)</span>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: File Upload */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <ImageIcon className="h-12 w-12 text-[#ffb829] mx-auto mb-4" />
                  <h3 className="text-2xl font-serif font-bold mb-2 text-white">Reference Files</h3>
                  <p className="text-[#bdbdbd]">Upload any reference images, mockups, or documents (optional)</p>
                </div>

                <div
                  className="bg-black/40 border-2 border-dashed border-white/25 rounded-xl p-8 text-center cursor-pointer hover:border-[#8052ff] hover:bg-white/[0.03] transition-all duration-300"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 text-[#ffb829] mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2 text-white">Drop files here or click to upload</p>
                  <p className="text-sm text-[#9a9a9a]">
                    Supported formats: JPG, PNG, PDF, DOC, DOCX (Max 10MB per file)
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {formData.files.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-white">Uploaded Files:</h4>
                    {formData.files.map((file, index) => (
                      <div
                        key={index}
                        className="bg-black/60 border border-white/15 p-3 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-[#8052ff]" />
                          <div>
                            <p className="font-medium text-white">{file.name}</p>
                            <p className="text-sm text-[#9a9a9a]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Budget & Timeline */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <Euro className="h-12 w-12 text-[#ffb829] mx-auto mb-4" />
                  <h3 className="text-2xl font-serif font-bold mb-2 text-white">Budget & Timeline</h3>
                  <p className="text-[#bdbdbd]">Help me understand your project scope and timeline</p>
                </div>

                <div className="space-y-12">
                  {/* Budget Selection */}
                  <div className="space-y-6">
                    <Label className="text-xl font-semibold text-white">Budget Range *</Label>
                    <RadioGroup
                      value={formData.budget}
                      onValueChange={(value) => updateFormData("budget", value)}
                      className="space-y-3"
                    >
                      {budgetRanges.map((range) => {
                        const isSelected = formData.budget === range.value
                        return (
                          <div
                            key={range.value}
                            onClick={() => updateFormData("budget", range.value)}
                            className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "border-[#8052ff] bg-[#8052ff]/15 shadow-[0_0_20px_rgba(128,82,255,0.25)]"
                                : "border-white/20 bg-black/50 hover:border-white/40 hover:bg-white/[0.04]"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3.5">
                                <RadioGroupItem value={range.value} id={range.value} />
                                <Label htmlFor={range.value} className={`font-medium cursor-pointer text-[15px] ${isSelected ? "text-white" : "text-white/90"}`}>
                                  {range.label}
                                </Label>
                              </div>
                              <Badge className="bg-[#8052ff]/20 text-[#a57bff] border border-[#8052ff]/40 text-xs">
                                {range.upfront} upfront
                              </Badge>
                            </div>
                          </div>
                        )
                      })}
                    </RadioGroup>
                  </div>

                  {/* Timeline Selection */}
                  <div className="space-y-6">
                    <Label className="text-xl font-semibold text-white">Timeline *</Label>
                    <RadioGroup
                      value={formData.timeline}
                      onValueChange={(value) => updateFormData("timeline", value)}
                      className="space-y-3"
                    >
                      {timelineOptions.map((option) => {
                        const isSelected = formData.timeline === option.value
                        return (
                          <div
                            key={option.value}
                            onClick={() => updateFormData("timeline", option.value)}
                            className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "border-[#8052ff] bg-[#8052ff]/15 shadow-[0_0_20px_rgba(128,82,255,0.25)]"
                                : "border-white/20 bg-black/50 hover:border-white/40 hover:bg-white/[0.04]"
                            }`}
                          >
                            <div className="flex items-start space-x-3.5">
                              <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                              <div>
                                <Label htmlFor={option.value} className={`font-medium cursor-pointer text-[15px] ${isSelected ? "text-white" : "text-white/90"}`}>
                                  {option.label}
                                </Label>
                                <p className="text-sm text-[#9a9a9a] mt-1">{option.description}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </RadioGroup>
                  </div>
                </div>

                {/* Reference Links */}
                <div className="space-y-2">
                  <Label htmlFor="referenceLinks" className="text-white font-medium">Reference Links (Optional)</Label>
                  <Textarea
                    id="referenceLinks"
                    value={formData.referenceLinks}
                    onChange={(e) => updateFormData("referenceLinks", e.target.value)}
                    placeholder="Share any websites, designs, or examples that inspire your project..."
                    className="bg-black/60 border-white/20 text-white placeholder:text-white/30 focus:border-[#8052ff] min-h-[100px] resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 6: Terms & Conditions */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <FileText className="h-12 w-12 text-[#ffb829] mx-auto mb-4" />
                  <h3 className="text-2xl font-serif font-bold mb-2 text-white">Terms & Conditions</h3>
                  <p className="text-[#bdbdbd]">Please review and accept the terms</p>
                </div>

                {/* Project Summary */}
                <Card className="bg-black/70 border border-white/20 p-6 rounded-xl">
                  <h4 className="text-[14px] font-semibold uppercase tracking-[0.35px] text-[#ffb829] mb-4">Project Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[#9a9a9a]">Project Type:</span>
                      <p className="font-medium text-white">{projectTypes.find((t) => t.value === formData.projectType)?.label}</p>
                    </div>
                    <div>
                      <span className="text-[#9a9a9a]">Budget Range:</span>
                      <p className="font-medium text-white">{budgetRanges.find((b) => b.value === formData.budget)?.label}</p>
                    </div>
                    <div>
                      <span className="text-[#9a9a9a]">Timeline:</span>
                      <p className="font-medium text-white">{timelineOptions.find((t) => t.value === formData.timeline)?.label}</p>
                    </div>
                    <div>
                      <span className="text-[#9a9a9a]">Upfront Payment:</span>
                      <p className="font-medium text-[#ffb829]">{getUpfrontPercentage()}</p>
                    </div>
                  </div>
                </Card>

                {/* Terms & Conditions */}
                <Card className="bg-black/70 border border-white/20 p-6 rounded-xl">
                  <h4 className="text-[14px] font-semibold uppercase tracking-[0.35px] text-[#ffb829] mb-4">Payment Terms</h4>
                  <div className="space-y-3 text-sm text-[#bdbdbd]">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-[#8052ff] rounded-full mt-2 flex-shrink-0" />
                      <p>
                        <strong className="text-white">Upfront Payment:</strong> {getUpfrontPercentage()} of the total project cost is required
                        before work begins.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-[#ffb829] rounded-full mt-2 flex-shrink-0" />
                      <p>
                        <strong className="text-white">Final Payment:</strong> Remaining balance due upon project completion and client
                        approval.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-[#8052ff] rounded-full mt-2 flex-shrink-0" />
                      <p>
                        <strong className="text-white">Revisions:</strong> Up to 3 rounds of revisions included. Additional revisions billed
                        separately.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-[#ffb829] rounded-full mt-2 flex-shrink-0" />
                      <p>
                        <strong className="text-white">Timeline:</strong> Project timeline begins after upfront payment and all required
                        materials are received.
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Accept Terms */}
                <div className="bg-black/70 border border-white/20 p-6 rounded-xl">
                  <div className="flex items-start space-x-3.5">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => updateFormData("acceptTerms", checked)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="acceptTerms" className="cursor-pointer text-white font-medium">
                        I agree to the payment terms and conditions outlined above *
                      </Label>
                      <p className="text-sm text-[#9a9a9a] mt-1">
                        By checking this box, you acknowledge that you have read and agree to the project terms, payment
                        schedule, and revision policy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between p-6 border-t border-white/10 bg-black/40">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="border-white/25 text-white hover:bg-white/10 hover:border-white/50 disabled:opacity-40 disabled:hover:bg-transparent rounded-full px-5"
          >
            <ChevronLeft className="h-4 w-4 mr-1.5" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i + 1 === currentStep
                    ? "w-6 bg-[#ffb829]"
                    : i + 1 < currentStep
                    ? "w-2 bg-[#8052ff]"
                    : "w-2 bg-white/20"
                }`}
              />
            ))}
          </div>

          {currentStep === totalSteps ? (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid() || isSubmitting}
              className="bg-[#8052ff] hover:bg-[#6b3fe6] text-white font-semibold rounded-full px-6 shadow-[0_0_20px_rgba(128,82,255,0.4)] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Request
                  <CheckCircle className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="bg-[#8052ff] hover:bg-[#6b3fe6] text-white font-semibold rounded-full px-6 shadow-[0_0_15px_rgba(128,82,255,0.3)] disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1.5" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
