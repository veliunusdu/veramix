'use server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { createAdminStorageClient, STORAGE_BUCKET } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function setImageAsPrimary(imageId: string, productId: string) {
  await requireAdmin()

  // Clear primary flag on all images of this product, then set the chosen one
  await prisma.$transaction([
    prisma.productImage.updateMany({
      where: { productId },
      data: { isPrimary: false },
    }),
    prisma.productImage.update({
      where: { id: imageId },
      data: { isPrimary: true },
    }),
  ])

  revalidatePath(`/admin/products/${productId}/edit`)
}

export async function deleteImage(imageId: string, productId: string) {
  await requireAdmin()

  const image = await prisma.productImage.findUnique({ where: { id: imageId } })
  if (!image) return

  // Delete from Supabase Storage if storagePath exists
  if (image.storagePath) {
    const supabase = createAdminStorageClient()
    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([image.storagePath])
    if (error) console.error('Storage delete error:', error.message)
  }

  await prisma.productImage.delete({ where: { id: imageId } })

  // If deleted image was primary, make the next one primary
  const remaining = await prisma.productImage.findFirst({ where: { productId } })
  if (remaining) {
    await prisma.productImage.update({
      where: { id: remaining.id },
      data: { isPrimary: true },
    })
  }

  revalidatePath(`/admin/products/${productId}/edit`)
}
