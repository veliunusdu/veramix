import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const productSchema = z.object({
  name: z.string().min(1, 'İsim zorunlu'),
  slug: z.string().min(1, 'Slug zorunlu'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Fiyat pozitif olmalı'),
  stock: z.coerce.number().int().min(0, 'Stok negatif olamaz'),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  categoryId: z.string().min(1, 'Kategori zorunlu'),
})

export type ProductInput = z.infer<typeof productSchema>