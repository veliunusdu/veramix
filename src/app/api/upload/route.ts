import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createAdminStorageClient, STORAGE_BUCKET } from '@/lib/supabase'
import { uploadImageToCloudinary } from '@/lib/cloudinary'
import { getStorageProvider } from '@/lib/storage'
import { sanitizeEntityId, verifySameOriginCsrf } from '@/lib/api-security'
import { logger } from '@/lib/logger'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function POST(req: NextRequest) {
  try {
    const csrfError = verifySameOriginCsrf(req)
    if (csrfError) return csrfError

    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const productIdEntry = formData.get('productId')
    const productId = sanitizeEntityId(typeof productIdEntry === 'string' ? productIdEntry : null)

    if (!file || !productId) {
      return NextResponse.json({ error: 'file ve productId zorunlu' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Sadece jpg, png, webp, gif desteklenir' }, { status: 400 })
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "Dosya 5 MB'dan büyük olamaz" }, { status: 400 })
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, slug: true },
    })
    if (!product) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 })
    }

    const provider = getStorageProvider()
    let publicUrl = ''
    let storagePath = ''

    if (provider === 'cloudinary') {
      const uploaded = await uploadImageToCloudinary(file, productId)
      publicUrl = uploaded.publicUrl
      storagePath = uploaded.storagePath
    } else {
      const supabase = createAdminStorageClient()
      const ext = file.name.split('.').pop() ?? 'jpg'
      storagePath = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, file, { contentType: file.type, upsert: false })

      if (uploadError) {
        logger.error('Supabase storage upload failed', uploadError, { productId, storagePath })
        return NextResponse.json({ error: 'Yükleme başarısız oldu. Lütfen tekrar deneyin.' }, { status: 500 })
      }

      const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath)
      publicUrl = urlData.publicUrl
    }

    const hasPrimary = await prisma.productImage.count({
      where: { productId, isPrimary: true },
    })

    const image = await prisma.productImage.create({
      data: {
        url: publicUrl,
        isPrimary: hasPrimary === 0,
        productId,
        storagePath,
      },
    })

    revalidatePath('/products')
    revalidatePath(`/products/${product.slug}`)
    revalidatePath(`/admin/products/${productId}/edit`)

    return NextResponse.json(image, { status: 201 })
  } catch (error: unknown) {
    logger.error('Upload API failed', error)
    return NextResponse.json({ error: 'Sunucu hatası oluştu. Lütfen tekrar deneyin.' }, { status: 500 })
  }
}
