import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'

dotenv.config()

dotenv.config({ path: require('path').resolve(__dirname, '../.env') })

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const elektronik = await prisma.category.upsert({ where: { slug: 'elektronik' }, update: {}, create: { name: 'Elektronik', slug: 'elektronik' } })
  const giyim = await prisma.category.upsert({ where: { slug: 'giyim' }, update: {}, create: { name: 'Giyim', slug: 'giyim' } })
  const kitap = await prisma.category.upsert({ where: { slug: 'kitap' }, update: {}, create: { name: 'Kitap', slug: 'kitap' } })

  const hashedPassword = await bcrypt.hash('Admin1234!', 10)
  await prisma.user.upsert({ where: { email: 'admin@veramix.com' }, update: {}, create: { email: 'admin@veramix.com', password: hashedPassword, role: 'ADMIN' } })

  const urunler = [
    { name: 'Kablosuz Kulaklik', slug: 'kablosuz-kulaklik', description: 'Gurultu engelleyici.', price: 1299.99, stock: 15, status: 'PUBLISHED' as const, kategori: elektronik },
    { name: 'Mekanik Klavye', slug: 'mekanik-klavye', description: 'RGB aydinlatmali.', price: 899.99, stock: 8, status: 'PUBLISHED' as const, kategori: elektronik },
    { name: 'Pamuklu T-Shirt', slug: 'pamuklu-tshirt', description: '%100 organik pamuk.', price: 199.99, stock: 50, status: 'PUBLISHED' as const, kategori: giyim },
    { name: 'Oversize Hoodie', slug: 'oversize-hoodie', description: 'Kislik polar ic astar.', price: 449.99, stock: 0, status: 'PUBLISHED' as const, kategori: giyim },
    { name: 'Temiz Kod', slug: 'temiz-kod', description: 'Robert C. Martin.', price: 129.99, stock: 25, status: 'PUBLISHED' as const, kategori: kitap },
    { name: 'Taslak Urun', slug: 'taslak-urun', description: 'Henuz yayinda degil.', price: 999.99, stock: 5, status: 'DRAFT' as const, kategori: elektronik },
  ]

  for (const { kategori, ...data } of urunler) {
    const product = await prisma.product.upsert({ where: { slug: data.slug }, update: {}, create: { ...data } })
    await prisma.productCategory.upsert({ where: { productId_categoryId: { productId: product.id, categoryId: kategori.id } }, update: {}, create: { productId: product.id, categoryId: kategori.id } })
  }

  console.log('Seed tamamlandi!')
}

main().catch(console.error).finally(() => prisma.$disconnect())