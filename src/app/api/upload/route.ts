import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createAdminStorageClient, STORAGE_BUCKET } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function POST(req: NextRequest) {
  // 1. Auth
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Parse form data
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const productId = formData.get('productId') as string | null

  if (!file || !productId) {
    return NextResponse.json({ error: 'file ve productId zorunlu' }, { status: 400 })
  }

  // 3. Validate
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Sadece jpg, png, webp, gif desteklenir' }, { status: 400 })
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'Dosya 5 MB\'dan büyük olamaz' }, { status: 400 })
  }

  // 4. Upload to Supabase Storage
  const supabase = createAdminStorageClient()
  const ext = file.name.split('.').pop() ?? 'jpg'
  const storagePath = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, file, { contentType: file.type, upsert: false })

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    return NextResponse.json({ error: 'Yükleme başarısız: ' + uploadError.message }, { status: 500 })
  }

  // 5. Get public URL
  const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath)
  const publicUrl = urlData.publicUrl

  // 6. Check if this is the first image (make it primary automatically)
  const existingCount = await prisma.productImage.count({ where: { productId } })

  // 7. Save to DB
  const image = await prisma.productImage.create({
    data: {
      url: publicUrl,
      isPrimary: existingCount === 0,
      productId,
      storagePath,
    },
  })

  return NextResponse.json(image, { status: 201 })
}
