const AI_BASE_URL = process.env.NEXT_PUBLIC_AI_URL ?? "http://localhost:8000"

export interface MOQInput {
  goal_usd: number
  main_category: string
  country: string
  duration_days: number
}

export interface MOQOutput {
  recommended_moq: number
  moq_range_low: number
  moq_range_high: number
  confidence: "low" | "medium" | "high"
  category_insight: string
}

export interface SuccessInput {
  goal: number
  category: string
  country: string
  duration_days: number
  has_staff_pick?: boolean
  has_spotlight?: boolean
  name_length?: number
  desc_length?: number
}

export interface SuccessOutput {
  probability: number
  risk_level: "low" | "medium" | "high"
}

export async function predictMOQ(input: MOQInput): Promise<MOQOutput> {
  const res = await fetch(`${AI_BASE_URL}/predict/moq`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(`AI Engine error: ${res.status}`)
  return res.json() as Promise<MOQOutput>
}

export async function predictSuccess(input: SuccessInput): Promise<SuccessOutput> {
  const res = await fetch(`${AI_BASE_URL}/predict/success`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name_length: 20,
      desc_length: 200,
      has_staff_pick: false,
      has_spotlight: false,
      ...input,
    }),
  })
  if (!res.ok) throw new Error(`AI Engine error: ${res.status}`)
  return res.json() as Promise<SuccessOutput>
}
