import { prisma } from '@/lib/prisma'
import { buildProductsWhere } from '@/lib/products-query'

export async function getProducts(params?: { search?: string }) {
  return prisma.product.findMany({
    where: buildProductsWhere(params),
    include: {
      images: { orderBy: [{ isPrimary: 'desc' }, { id: 'asc' }], take: 1 },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isFeatured: true },
    include: {
      images: { orderBy: [{ isPrimary: 'desc' }, { id: 'asc' }], take: 1 },
    },
    orderBy: { updatedAt: 'desc' },
    take: 8,
  })
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug },
    include: {
      images: { orderBy: [{ isPrimary: 'desc' }, { id: 'asc' }] },
    },
  })
}
