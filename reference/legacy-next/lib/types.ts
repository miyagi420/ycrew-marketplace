import type { Role, JobStatus, ApplicationStatus, ContractType, SubscriptionPlan } from "@prisma/client"

export type { Role, JobStatus, ApplicationStatus, ContractType, SubscriptionPlan }

export interface CrewProfileData {
  name: string
  nationality?: string
  languages: string[]
  homeport?: string
  primaryRole: string
  secondaryRoles: string[]
  experienceMonths: number
  minDayRate?: number
  minMonthly?: number
  boatTypes: string[]
  boatLengthMin?: number
  boatLengthMax?: number
  availabilityStart?: Date
  availabilityEnd?: Date
  bio?: string
}

export interface JobPostingData {
  title: string
  role: string
  contractType: ContractType
  startDate: Date
  durationDays?: number
  requiresCertTypes: string[]
  minExpMonths?: number
  dayRate?: number
  monthlyRate?: number
  description?: string
  itinerary?: string
}

export const YACHT_ROLES = [
  "Captain",
  "First Officer",
  "Engineer",
  "Chef",
  "Deckhand",
  "Stew",
  "Bosun",
  "Skipper",
  "Purser",
] as const

export const BOAT_TYPES = ["Motor Yacht", "Sailing Yacht", "Catamaran", "Superyacht", "Expedition", "Classic"] as const

export const CERT_TYPES = [
  "STCW Basic Safety",
  "STCW Advanced",
  "ENG1 Medical",
  "Certificate of Competency",
  "Certificate of Endorsement",
  "Food Safety",
  "ML5 (UK)",
  "Yacht Rating",
  "RYA Yachtmaster",
] as const
