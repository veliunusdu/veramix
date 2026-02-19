'use server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { createAdminStorageClient, STORAGE_BUCKET } from '@/lib/supabase'
import { deleteImageFromCloudinary } from '@/lib/cloudinary'
import { getStorageProvider } from '@/lib/storage'
import { logger } from '@/lib/logger'
import { revalidatePath } from 'next/cache'

export async function setImageAsPrimary(imageId: string, productId: string) {
  try {
    await requireAdmin()
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { slug: true },
    })
    if (!product) throw new Error('Ürün bulunamadı')

    await prisma.$transaction(async (tx) => {
      const target = await tx.productImage.findFirst({
        where: { id: imageId, productId },
        select: { id: true },
      })

      if (!target) throw new Error('Görsel bulunamadı')

      await tx.productImage.updateMany({
        where: { productId },
        data: { isPrimary: false },
      })

      await tx.productImage.update({
        where: { id: target.id },
        data: { isPrimary: true },
      })
    })

    revalidatePath(`/admin/products/${productId}/edit`)
    revalidatePath('/products')
    revalidatePath(`/products/${product.slug}`)
  } catch (error) {
    logger.error('setImageAsPrimary action failed', error, { imageId, productId })
    throw new Error('Birincil görsel güncellenemedi.')
  }
}

export async function deleteImage(imageId: string, productId: string) {
  try {
    await requireAdmin()
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { slug: true },
    })
    if (!product) return

    const image = await prisma.productImage.findFirst({ where: { id: imageId, productId } })
    if (!image) return

    if (image.storagePath) {
      if (getStorageProvider() === 'cloudinary') {
        try {
          await deleteImageFromCloudinary(image.storagePath)
        } catch (error) {
          logger.warn('Cloudinary image delete failed', {
            imageId,
            productId,
            storagePath: image.storagePath,
            error: error instanceof Error ? error.message : String(error),
          })
        }
      } else {
        const supabase = createAdminStorageClient()
        const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([image.storagePath])
        if (error) {
          logger.warn('Supabase storage image delete failed', {
            imageId,
            productId,
            storagePath: image.storagePath,
            error: error.message,
          })
        }
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.productImage.delete({ where: { id: image.id } })

      const hasPrimary = await tx.productImage.findFirst({
        where: { productId, isPrimary: true },
        select: { id: true },
      })

      if (!hasPrimary) {
        const remaining = await tx.productImage.findFirst({
          where: { productId },
          orderBy: { id: 'asc' },
          select: { id: true },
        })

        if (remaining) {
          await tx.productImage.update({
            where: { id: remaining.id },
            data: { isPrimary: true },
          })
        }
      }
    })

    revalidatePath(`/admin/products/${productId}/edit`)
    revalidatePath('/products')
    revalidatePath(`/products/${product.slug}`)
  } catch (error) {
    logger.error('deleteImage action failed', error, { imageId, productId })
    throw new Error('Görsel silinemedi.')
  }
}
