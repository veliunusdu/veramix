import { prisma } from '@/lib/prisma'
import { buildPublishedProductsWhere } from '@/lib/products-query'

export async function getPublishedProducts(params?: {
  search?: string
  categorySlug?: string
}) {
  return prisma.product.findMany({
    where: buildPublishedProductsWhere(params),
    include: {
      images: { orderBy: [{ isPrimary: 'desc' }, { id: 'asc' }], take: 1 },
      categories: { include: { category: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { status: 'PUBLISHED', isFeatured: true },
    include: {
      images: { orderBy: [{ isPrimary: 'desc' }, { id: 'asc' }], take: 1 },
      categories: { include: { category: true } },
    },
    orderBy: { updatedAt: 'desc' },
    take: 8,
  })
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: {
      slug,
      status: 'PUBLISHED',
    },
    include: {
      images: { orderBy: [{ isPrimary: 'desc' }, { id: 'asc' }] },
      categories: { include: { category: true } },
    },
  })
}
