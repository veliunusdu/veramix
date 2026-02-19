import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      categories: { include: { category: true } },
      images: { orderBy: { isPrimary: 'desc' } },
    },
  })

  if (!product) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  return NextResponse.json({
    ...product,
    price: (product.price as { toNumber: () => number }).toNumber().toString(),
  })
}
