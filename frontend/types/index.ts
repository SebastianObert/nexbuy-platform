export type ProductStatus = "active" | "funded" | "shipping" | "completed"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  creator: string
  moq: number
  moqProgress: number
  joinCount: number
  deadline: string
  aiProbability: number
  trustScore: number
  status: ProductStatus
  variants?: ProductVariant[]
}

export interface ProductVariant {
  name: string
  options: string[]
}

export type DashboardRole = "collector" | "creator" | "admin"

export interface Review {
  id: string
  name: string
  avatar: string
  role: string
  rating: number
  content: string
}

export interface Order {
  id: string
  productId: string
  productName: string
  productImage: string
  quantity: number
  total: number
  status: "pending" | "confirmed" | "shipping" | "delivered"
  date: string
}

export interface AIAnomaly {
  id: string
  type: "fraud" | "unusual_activity" | "trust_drop"
  severity: "low" | "medium" | "high"
  description: string
  date: string
}

export interface CreatorAnalytics {
  totalRevenue: number
  activeProjects: number
  totalParticipants: number
  avgTrustScore: number
  fillRate: number
  revenueTrend: { month: string; revenue: number }[]
  participationTrend: { month: string; participants: number }[]
}

export interface AdminStat {
  totalUsers: number
  totalProjects: number
  totalTransactions: number
  fraudAlerts: number
  platformRevenue: number
}
