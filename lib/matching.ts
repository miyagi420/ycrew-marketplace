// Matching algorithm utilities for crew-job matching

export interface MatchScore {
  score: number
  reasons: string[]
}

export interface MatchWeights {
  role: number
  certifications: number
  experience: number
  boatType: number
  availability: number
  location: number
  language: number
  rating: number
  recency: number
  subscriptionBoost: number
}

export const DEFAULT_WEIGHTS: MatchWeights = {
  role: 0.25,
  certifications: 0.2,
  experience: 0.15,
  boatType: 0.1,
  availability: 0.1,
  location: 0.07,
  language: 0.05,
  rating: 0.03,
  recency: 0.03,
  subscriptionBoost: 0.02,
}

export function calculateMatchScore(crewProfile: any, job: any, weights: MatchWeights = DEFAULT_WEIGHTS): MatchScore {
  const reasons: string[] = []
  let totalScore = 0

  // Role match
  const roleMatch = crewProfile.primaryRole === job.role || crewProfile.secondaryRoles?.includes(job.role)
  if (roleMatch) {
    totalScore += weights.role * 100
    reasons.push("Role matches your experience")
  }

  // Certifications match
  const requiredCerts = job.requiresCertTypes || []
  const crewCerts = crewProfile.certifications?.map((c: any) => c.type) || []
  const certMatch = requiredCerts.every((cert: string) => crewCerts.includes(cert))
  if (certMatch) {
    totalScore += weights.certifications * 100
    reasons.push("All required certifications verified")
  }

  // Experience match
  const experienceMonths = crewProfile.experienceMonths || 0
  const requiredMonths = job.minExpMonths || 0
  if (experienceMonths >= requiredMonths) {
    const experienceScore = Math.min(experienceMonths / (requiredMonths * 2), 1)
    totalScore += weights.experience * 100 * experienceScore
    reasons.push("Experience meets requirements")
  }

  // Boat type match
  const jobVesselType = job.vessel?.type
  const crewBoatTypes = crewProfile.boatTypes || []
  if (jobVesselType && crewBoatTypes.includes(jobVesselType)) {
    totalScore += weights.boatType * 100
    reasons.push("Experience on similar vessel type")
  }

  // Availability match
  const jobStartDate = new Date(job.startDate)
  const crewAvailStart = crewProfile.availabilityStart ? new Date(crewProfile.availabilityStart) : null
  const crewAvailEnd = crewProfile.availabilityEnd ? new Date(crewProfile.availabilityEnd) : null

  if (crewAvailStart && crewAvailEnd && jobStartDate >= crewAvailStart && jobStartDate <= crewAvailEnd) {
    totalScore += weights.availability * 100
    reasons.push("Available for start date")
  }

  // Location/homeport proximity (simplified)
  if (crewProfile.homeport && job.itinerary?.includes(crewProfile.homeport)) {
    totalScore += weights.location * 100
    reasons.push("Located in cruising area")
  }

  // Language match (simplified)
  const crewLanguages = crewProfile.languages || []
  if (crewLanguages.length > 1) {
    totalScore += weights.language * 100
    reasons.push("Multilingual")
  }

  // Rating boost
  const avgRating = 4.5 // Would come from reviews
  if (avgRating >= 4.5) {
    totalScore += weights.rating * 100
    reasons.push("Highly rated profile")
  }

  // Subscription boost
  const subscriptionPlan = crewProfile.user?.subscription?.plan
  if (subscriptionPlan === "ELITE") {
    totalScore += weights.subscriptionBoost * 100 * 2
  } else if (subscriptionPlan === "PRO") {
    totalScore += weights.subscriptionBoost * 100
  }

  return {
    score: Math.min(Math.round(totalScore), 100),
    reasons,
  }
}

export function generateMatchExplanation(score: number, reasons: string[]): string {
  if (score >= 90) {
    return `Excellent match! ${reasons.join(", ")}.`
  } else if (score >= 75) {
    return `Strong match. ${reasons.join(", ")}.`
  } else if (score >= 60) {
    return `Good match. ${reasons.join(", ")}.`
  } else {
    return `Partial match. ${reasons.join(", ")}.`
  }
}
