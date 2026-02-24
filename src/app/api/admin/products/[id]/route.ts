import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizeEntityId } from '@/lib/api-security'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: rawId } = await params
  const id = sanitizeEntityId(rawId)
  if (!id) return NextResponse.json({ error: 'Geçersiz ürün kimliği' }, { status: 400 })

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { isPrimary: 'desc' } },
    },
  })

  if (!product) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  return NextResponse.json({
    ...product,
    price: (product.price as { toNumber: () => number }).toNumber().toString(),
  })
}
