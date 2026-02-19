# Veramix — Production Deploy Kılavuzu

## Gereksinimler

- [Vercel](https://vercel.com) hesabı
- [Supabase](https://supabase.com) projesi (zaten var)
- Git deposu (GitHub / GitLab / Bitbucket)

---

## 1 — Production Ortam Değişkenleri

Vercel Dashboard → Project → Settings → **Environment Variables** bölümünde
aşağıdaki değişkenleri ekle:

| Değişken | Açıklama | Örnek |
|---|---|---|
| `DATABASE_URL` | Supabase **pooler** bağlantı (port 6543) | `postgresql://postgres.xyz:pass@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | Supabase **direct** bağlantı (port 5432 — sadece migrate için) | `postgresql://postgres.xyz:pass@aws-0-region.pooler.supabase.com:5432/postgres` |
| `AUTH_SECRET` | NextAuth gizli anahtarı — üret: `openssl rand -hex 32` | `a1b2c3d4...` |
| `NEXTAUTH_URL` | Yayına giren domainin tam adresi | `https://veramix.vercel.app` |
| `SUPABASE_URL` | Supabase proje URL'i | `https://xyz.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase servis anahtarı (gizli) | `sb_secret_...` |
| `SUPABASE_ANON_KEY` | Supabase anonim anahtar | `sb_publishable_...` |
| `SUPABASE_STORAGE_BUCKET` | Storage bucket adı | `product-images` |
| `IMAGE_STORAGE_PROVIDER` | Storage sağlayıcısı | `supabase` |

> **Not:** Cloudinary değişkenlerini ekleme — kullanılmıyor.

---

## 2 — Production Migration Çalıştır

Vercel'e deploy etmeden **önce** production veritabanına migrate uygula:

```bash
# Yerel makinende, .env dosyan DIRECT_URL'i production DB'yi gösteriyor olmalı
npx prisma migrate deploy
```

> `migrate deploy` yalnızca bekleyen migration'ları uygular, yeni migration oluşturmaz.
> Güvenli şekilde tekrar çalıştırılabilir.

İlk kurulumda admin kullanıcı oluşturmak için:

```bash
npx prisma db seed
```

---

## 3 — Vercel'e Deploy

### Yöntem A — Vercel CLI (hızlı)

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Yöntem B — GitHub entegrasyonu (önerilen)

1. Kodu GitHub'a push et:
   ```bash
   git add .
   git commit -m "chore: production deploy"
   git push origin main
   ```
2. [vercel.com/new](https://vercel.com/new) → Import Git Repository
3. Repository'yi seç; Vercel Next.js'i otomatik algılar
4. **Environment Variables** adımında yukarıdaki tüm değişkenleri gir
5. **Deploy** butonuna bas

Bundan sonra `main` branch'e her push otomatik deploy başlatır.

---

## 4 — Supabase Storage Bucket Kontrolü

Storage bucket `product-images` zaten mevcut; public erişim ayarını kontrol et:

```
Supabase Dashboard → Storage → product-images → Policies
```

Resimlerin public okunabilmesi için en az bir SELECT policy gerekli:

```sql
-- Supabase SQL Editor'de çalıştır
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');
```

---

## 5 — Deploy Sonrası Doğrulama

| Kontrol | URL |
|---|---|
| Anasayfa açılıyor mu? | `https://yourdomain.com` |
| Ürünler sayfası çalışıyor mu? | `https://yourdomain.com/products` |
| Admin login çalışıyor mu? | `https://yourdomain.com/login` |
| Görsel yükleme çalışıyor mu? | Admin → Ürün Düzenle |
| 404 sayfası özelleştirilmiş mi? | `https://yourdomain.com/olmayan-sayfa` |

---

## Özet — Build Süreci

`package.json` içinde `build` scripti şu şekilde yapılandırıldı:

```
prisma generate → next build
```

Vercel otomatik olarak her deploy'da `npm run build` çalıştırır;
bu sayede Prisma Client her zaman en güncel schema ile üretilir.
