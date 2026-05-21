import { Order } from "@/types"

export const orders: Order[] = [
  {
    id: "ORD-2026-001",
    productId: "neo65-aluminum",
    productName: "Neo65 Aluminum Keyboard Kit",
    productImage: "/images/placeholder.svg",
    quantity: 1,
    total: 349,
    status: "confirmed",
    date: "2026-05-15",
  },
  {
    id: "ORD-2026-002",
    productId: "gmk-eclipse",
    productName: "GMK Eclipse Keycaps",
    productImage: "/images/placeholder.svg",
    quantity: 2,
    total: 270,
    status: "pending",
    date: "2026-05-18",
  },
  {
    id: "ORD-2026-003",
    productId: "cyberpunk-deskmat",
    productName: "Cyberpunk Deskmat",
    productImage: "/images/placeholder.svg",
    quantity: 1,
    total: 34,
    status: "delivered",
    date: "2026-05-10",
  },
  {
    id: "ORD-2026-004",
    productId: "titanium-switch-puller",
    productName: "Titanium Switch Puller",
    productImage: "/images/placeholder.svg",
    quantity: 3,
    total: 126,
    status: "shipping",
    date: "2026-05-12",
  },
]
