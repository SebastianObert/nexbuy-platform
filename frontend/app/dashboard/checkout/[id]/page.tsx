import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CheckoutValidationExperience } from "@/components/checkout-validation-experience"
import { products } from "@/lib/data/products"

interface CheckoutPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function getFirstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

function parseQuantity(value: string | string[] | undefined, maxQuantity: number) {
  const parsed = Number(getFirstValue(value) ?? "1")

  if (!Number.isFinite(parsed)) {
    return 1
  }

  return Math.min(Math.max(1, Math.trunc(parsed)), Math.max(1, maxQuantity))
}

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }))
}

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
  const { id } = await params
  const product = products.find((item) => item.id === id)

  if (!product) {
    return {
      title: "Checkout tidak ditemukan - NexBuy",
    }
  }

  return {
    title: `Checkout ${product.name} - NexBuy Collector`,
    description: `Validasi pembayaran escrow untuk ${product.name}.`,
  }
}

export default async function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
  const { id } = await params
  const query = await searchParams
  const product = products.find((item) => item.id === id)

  if (!product) {
    notFound()
  }

  const maxQuantity = product.availableSlots ?? Math.max(product.moq - product.joinCount, 1)
  const quantity = parseQuantity(query.qty, maxQuantity)
  const selectedOptions = (product.variants ?? []).reduce<Record<string, string>>((acc, variant) => {
    acc[variant.name] = getFirstValue(query[variant.name]) ?? variant.options[0] ?? ""
    return acc
  }, {})

  return <CheckoutValidationExperience product={product} quantity={quantity} selectedOptions={selectedOptions} />
}
