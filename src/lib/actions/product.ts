'use server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { productSchema } from '@/lib/validation'
import { logger } from '@/lib/logger'

export type ProductFieldErrors = Partial<
  Record<'name' | 'slug' | 'description' | 'price' | 'stock' | 'status' | 'categoryId', string>
>

type ProductActionResult =
  | { ok: true; productId?: string; nextStatus?: 'DRAFT' | 'PUBLISHED' }
  | { ok: false; formError: string; fieldErrors: ProductFieldErrors }

function zodFieldErrors(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) {
  const flattened = error.flatten().fieldErrors
  return {
    name: flattened.name?.[0],
    slug: flattened.slug?.[0],
    description: flattened.description?.[0],
    price: flattened.price?.[0],
    stock: flattened.stock?.[0],
    status: flattened.status?.[0],
    categoryId: flattened.categoryId?.[0],
  } satisfies ProductFieldErrors
}

export async function createProduct(formData: FormData): Promise<ProductActionResult> {
  try {
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
      return {
        ok: false,
        formError: 'Lütfen form alanlarını kontrol edin.',
        fieldErrors: zodFieldErrors(parsed.error),
      }
    }

    const { categoryId, ...data } = parsed.data
    const category = await prisma.category.findUnique({ where: { slug: categoryId } })
    if (!category) {
      return {
        ok: false,
        formError: 'Kategori bilgisi geçersiz.',
        fieldErrors: { categoryId: 'Kategori bulunamadı' },
      }
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        categories: {
          create: { categoryId: category.id },
        },
      },
    })

    return { ok: true, productId: product.id }
  } catch (error) {
    logger.error('createProduct action failed', error)
    return {
      ok: false,
      formError: 'Ürün oluşturulurken beklenmeyen bir hata oluştu.',
      fieldErrors: {},
    }
  }
}

export async function updateProduct(id: string, formData: FormData): Promise<ProductActionResult> {
  try {
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
      return {
        ok: false,
        formError: 'Lütfen form alanlarını kontrol edin.',
        fieldErrors: zodFieldErrors(parsed.error),
      }
    }

    const { categoryId, ...data } = parsed.data

    const category = await prisma.category.findUnique({ where: { slug: categoryId } })
    if (!category) {
      return {
        ok: false,
        formError: 'Kategori bilgisi geçersiz.',
        fieldErrors: { categoryId: 'Kategori bulunamadı' },
      }
    }

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

    return { ok: true }
  } catch (error) {
    logger.error('updateProduct action failed', error, { productId: id })
    return {
      ok: false,
      formError: 'Ürün güncellenirken beklenmeyen bir hata oluştu.',
      fieldErrors: {},
    }
  }
}

export async function deleteProduct(id: string): Promise<ProductActionResult> {
  try {
    await requireAdmin()
    await prisma.product.delete({ where: { id } })
    return { ok: true }
  } catch (error) {
    logger.error('deleteProduct action failed', error, { productId: id })
    return {
      ok: false,
      formError: 'Ürün silinemedi. Lütfen tekrar deneyin.',
      fieldErrors: {},
    }
  }
}

export async function toggleFeatured(id: string, current: boolean): Promise<ProductActionResult> {
  try {
    await requireAdmin()
    await prisma.product.update({ where: { id }, data: { isFeatured: !current } })
    return { ok: true }
  } catch (error) {
    logger.error('toggleFeatured action failed', error, { productId: id })
    return { ok: false, formError: 'Öne çıkarma durumu güncellenemedi.', fieldErrors: {} }
  }
}

export async function toggleProductStatus(id: string, currentStatus: string): Promise<ProductActionResult> {
  try {
    await requireAdmin()
    const nextStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    await prisma.product.update({
      where: { id },
      data: { status: nextStatus },
    })
    return { ok: true, nextStatus }
  } catch (error) {
    logger.error('toggleProductStatus action failed', error, { productId: id, currentStatus })
    return {
      ok: false,
      formError: 'Ürün durumu güncellenemedi.',
      fieldErrors: {},
    }
  }
}
