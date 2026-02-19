import { createHash } from 'crypto'
import { assertCloudinaryEnv, getCloudinaryFolder } from '@/lib/storage'

type UploadResult = {
  publicUrl: string
  storagePath: string
}

function getConfig() {
  assertCloudinaryEnv()

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME as string
  const apiKey = process.env.CLOUDINARY_API_KEY as string
  const apiSecret = process.env.CLOUDINARY_API_SECRET as string

  return { cloudName, apiKey, apiSecret }
}

function sign(params: Record<string, string | number>, apiSecret: string) {
  const serialized = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&')
  return createHash('sha1').update(serialized + apiSecret).digest('hex')
}

export async function uploadImageToCloudinary(file: File, productId: string): Promise<UploadResult> {
  const { cloudName, apiKey, apiSecret } = getConfig()
  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

  const timestamp = Math.floor(Date.now() / 1000)
  const ext = file.name.includes('.') ? file.name.split('.').pop() : file.type.split('/').pop() || 'jpg'
  const publicId = `${getCloudinaryFolder(productId)}/${timestamp}-${Math.random().toString(36).slice(2)}.${ext}`
  const signature = sign({ public_id: publicId, timestamp }, apiSecret)

  const form = new FormData()
  form.append('file', file)
  form.append('api_key', apiKey)
  form.append('timestamp', String(timestamp))
  form.append('public_id', publicId)
  form.append('signature', signature)

  const res = await fetch(endpoint, { method: 'POST', body: form })
  const payload = (await res.json()) as { secure_url?: string; public_id?: string; error?: { message?: string } }

  if (!res.ok || !payload.secure_url || !payload.public_id) {
    throw new Error(payload.error?.message || 'Cloudinary upload başarısız')
  }

  return {
    publicUrl: payload.secure_url,
    storagePath: payload.public_id,
  }
}

export async function deleteImageFromCloudinary(publicId: string) {
  const { cloudName, apiKey, apiSecret } = getConfig()
  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`

  const timestamp = Math.floor(Date.now() / 1000)
  const signature = sign({ public_id: publicId, timestamp }, apiSecret)

  const body = new URLSearchParams({
    api_key: apiKey,
    timestamp: String(timestamp),
    public_id: publicId,
    signature,
  })

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Cloudinary silme başarısız: ${text}`)
  }
}
