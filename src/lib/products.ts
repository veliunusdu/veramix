import { prisma } from '@/lib/prisma'

export async function getPublishedProducts(params?: {
  search?: string
  categorySlug?: string
}) {
  return prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      ...(params?.search && {
        OR: [
          { name: { contains: params.search, mode: 'insensitive' } },
          { description: { contains: params.search, mode: 'insensitive' } },
        ],
      }),
      ...(params?.categorySlug && {
        categories: {
          some: {
            category: { slug: params.categorySlug },
          },
        },
      }),
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
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

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: {
      slug,
      status: 'PUBLISHED',
    },
    include: {
      images: true,
      categories: { include: { category: true } },
    },
  })
}