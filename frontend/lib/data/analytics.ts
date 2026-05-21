import { CreatorAnalytics, AdminStat, AIAnomaly } from "@/types"

export const creatorAnalytics: CreatorAnalytics = {
  totalRevenue: 48750,
  activeProjects: 3,
  totalParticipants: 342,
  avgTrustScore: 4.7,
  fillRate: 78,
  revenueTrend: [
    { month: "Jan", revenue: 5200 },
    { month: "Feb", revenue: 6800 },
    { month: "Mar", revenue: 6100 },
    { month: "Apr", revenue: 8900 },
    { month: "May", revenue: 10200 },
    { month: "Jun", revenue: 11550 },
  ],
  participationTrend: [
    { month: "Jan", participants: 45 },
    { month: "Feb", participants: 52 },
    { month: "Mar", participants: 48 },
    { month: "Apr", participants: 67 },
    { month: "May", participants: 78 },
    { month: "Jun", participants: 92 },
  ],
}

export const adminStats: AdminStat = {
  totalUsers: 2847,
  totalProjects: 156,
  totalTransactions: 12430,
  fraudAlerts: 12,
  platformRevenue: 284500,
}

export const aiAnomalies: AIAnomaly[] = [
  {
    id: "a1",
    type: "unusual_activity",
    severity: "high",
    description: "Unusual spike in join activity for GMK Eclipse — 47 joins in 2 hours from new accounts.",
    date: "2026-05-20",
  },
  {
    id: "a2",
    type: "trust_drop",
    severity: "medium",
    description: "Creator 'Kaiyodo Studios' trust score dropped from 4.8 to 4.6 due to delayed shipment reports.",
    date: "2026-05-19",
  },
  {
    id: "a3",
    type: "fraud",
    severity: "low",
    description: "Suspected duplicate account cluster detected. 3 accounts sharing same shipping address flagged.",
    date: "2026-05-18",
  },
]
