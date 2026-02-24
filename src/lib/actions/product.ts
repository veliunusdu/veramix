'use server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { productSchema } from '@/lib/validation'
import { logger } from '@/lib/logger'
import { revalidatePath } from 'next/cache'
import { deleteImageFromCloudinary } from '@/lib/cloudinary'
import { createAdminStorageClient, STORAGE_BUCKET } from '@/lib/supabase'
import { getStorageProvider } from '@/lib/storage'
import {
  chunkStrings,
  collectSupabaseCandidatePaths,
  mapListedObjectsToSupabasePaths,
  normalizeStoragePaths,
} from '@/lib/storage-cleanup'

export type ProductFieldErrors = Partial<
  Record<'name' | 'slug' | 'description' | 'price' | 'stock', string>
>

type ProductActionResult =
  | { ok: true; productId?: string }
  | { ok: false; formError: string; fieldErrors: ProductFieldErrors }

type ProductImageDeleteInput = {
  storagePath: string
  url: string
}

function isIgnorableSupabaseRemoveError(message: string) {
  const normalized = message.toLowerCase()
  return (
    normalized.includes('not found') ||
    normalized.includes('no such file') ||
    normalized.includes('404')
  )
}

async function removeSupabasePaths(
  supabase: ReturnType<typeof createAdminStorageClient>,
  paths: string[],
  productId: string,
) {
  const batches = chunkStrings(paths, 100)
  for (const batch of batches) {
    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove(batch)
    if (!error) continue

    // Fallback to per-file removal so one stale path does not block full product deletion.
    for (const path of batch) {
      const { error: singleError } = await supabase.storage.from(STORAGE_BUCKET).remove([path])
      if (!singleError) continue
      if (isIgnorableSupabaseRemoveError(singleError.message)) {
        logger.warn('Supabase storage path already missing during product delete', {
          productId,
          storagePath: path,
          error: singleError.message,
        })
        continue
      }

      throw new Error(`Supabase dosya silme başarısız: ${singleError.message}`)
    }
  }
}

async function deleteCloudinaryAssets(images: ProductImageDeleteInput[]) {
  const paths = normalizeStoragePaths(images.map((image) => image.storagePath))
  for (const path of paths) {
    await deleteImageFromCloudinary(path)
  }
}

async function listSupabasePathsForProduct(
  supabase: ReturnType<typeof createAdminStorageClient>,
  productId: string,
) {
  const listedPaths: string[] = []
  const limit = 1000
  let offset = 0

  while (true) {
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).list(productId, {
      limit,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    })

    if (error) {
      throw new Error(`Supabase klasör listesi alınamadı: ${error.message}`)
    }

    if (!data || data.length === 0) break

    listedPaths.push(...mapListedObjectsToSupabasePaths(productId, data))

    if (data.length < limit) break
    offset += data.length
  }

  return listedPaths
}

async function deleteSupabaseAssets(productId: string, images: ProductImageDeleteInput[]) {
  const supabase = createAdminStorageClient()
  const referencedPaths = collectSupabaseCandidatePaths(images, STORAGE_BUCKET)
  const listedPaths = await listSupabasePathsForProduct(supabase, productId)
  const allPaths = normalizeStoragePaths([...referencedPaths, ...listedPaths])

  if (allPaths.length === 0) return

  await removeSupabasePaths(supabase, allPaths, productId)
}

async function deleteProductAssets(productId: string, images: ProductImageDeleteInput[]) {
  const storageProvider = getStorageProvider()

  if (storageProvider === 'cloudinary' && images.length > 0) {
    await deleteCloudinaryAssets(images)
  }

  if (storageProvider === 'supabase') {
    await deleteSupabaseAssets(productId, images)
    return
  }

  // Also clean Supabase bucket remnants when credentials exist, even on non-Supabase provider setups.
  if (process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    await deleteSupabaseAssets(productId, images)
  }
}

function zodFieldErrors(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) {
  const flattened = error.flatten().fieldErrors
  return {
    name: flattened.name?.[0],
    slug: flattened.slug?.[0],
    description: flattened.description?.[0],
    price: flattened.price?.[0],
    stock: flattened.stock?.[0],
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
    })

    if (!parsed.success) {
      return {
        ok: false,
        formError: 'Lütfen form alanlarını kontrol edin.',
        fieldErrors: zodFieldErrors(parsed.error),
      }
    }

    const product = await prisma.product.create({ data: parsed.data })

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
    })

    if (!parsed.success) {
      return {
        ok: false,
        formError: 'Lütfen form alanlarını kontrol edin.',
        fieldErrors: zodFieldErrors(parsed.error),
      }
    }

    await prisma.product.update({ where: { id }, data: parsed.data })

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

    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
        images: {
          select: {
            storagePath: true,
            url: true,
          },
        },
      },
    })

    if (!product) {
      return {
        ok: false,
        formError: 'Ürün bulunamadı.',
        fieldErrors: {},
      }
    }

    try {
      await deleteProductAssets(product.id, product.images)
    } catch (storageError) {
      // Do not block product deletion if storage cleanup has partial failures.
      logger.warn('Product storage cleanup failed; continuing with DB delete', {
        productId: product.id,
        error: storageError instanceof Error ? storageError.message : String(storageError),
      })
    }
    await prisma.product.delete({ where: { id } })

    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath(`/products/${product.slug}`)
    revalidatePath('/admin/products')

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

