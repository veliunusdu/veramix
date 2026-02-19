'use server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { productSchema } from '@/lib/validation'

export async function createProduct(formData: FormData) {
  await requireAdmin()

  const parsed = productSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    price: formData.get('price'),
    stock: formData.get('stock'),
    status: formData.get('status'),
    categoryId: formData.get('categoryId'),
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  const { categoryId, ...data } = parsed.data
  // `categoryId` currently contains the category slug from the form.
  // Resolve the category record first and use its UUID when creating the product relation.
  const category = await prisma.category.findUnique({ where: { slug: categoryId } })
  if (!category) throw new Error('Kategori bulunamadı')

  const product = await prisma.product.create({
    data: {
      ...data,
      categories: {
        create: { categoryId: category.id },
      },
    },
  })

  redirect(`/admin/products/${product.id}/edit`)
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin()

  const parsed = productSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    price: formData.get('price'),
    stock: formData.get('stock'),
    status: formData.get('status'),
    categoryId: formData.get('categoryId'),
  })

  if (!parsed.success) throw new Error(parsed.error.issues[0].message)

  const { categoryId, ...data } = parsed.data

  const category = await prisma.category.findUnique({ where: { slug: categoryId } })
  if (!category) throw new Error('Kategori bulunamadı')

  await prisma.product.update({
    where: { id },
    data: {
      ...data,
      categories: {
        deleteMany: {},
        create: { categoryId: category.id },
      },
    },
  })

  redirect('/admin/products')
}

export async function deleteProduct(id: string) {
  await requireAdmin()
  await prisma.product.delete({ where: { id } })
  redirect('/admin/products')
}

export async function toggleProductStatus(id: string, currentStatus: string) {
  await requireAdmin()
  await prisma.product.update({
    where: { id },
    data: { status: currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' },
  })
  redirect('/admin/products')
}