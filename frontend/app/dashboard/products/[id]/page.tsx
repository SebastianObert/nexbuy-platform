import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductDetailExperience } from "@/components/product-detail-experience"
import { products } from "@/lib/data/products"

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }))
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const product = products.find((item) => item.id === id)

  if (!product) {
    return {
      title: "Produk tidak ditemukan - NexBuy",
    }
  }

  return {
    title: `${product.name} - NexBuy Collector`,
    description: product.description,
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params
  const product = products.find((item) => item.id === id)

  if (!product) {
    notFound()
  }

  const relatedProducts = products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 3)

  const fallbackRelatedProducts = products.filter((item) => item.id !== product.id).slice(0, 3)

  return (
    <ProductDetailExperience
      product={product}
      relatedProducts={relatedProducts.length ? relatedProducts : fallbackRelatedProducts}
    />
  )
}
