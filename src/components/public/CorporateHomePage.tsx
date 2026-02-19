import Link from 'next/link'

type ProductLike = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number | string | { toNumber: () => number }
  imageUrl?: string
}

type Props = {
  featuredProducts: ProductLike[]
}

const PLACEHOLDERS = {
  companyName: '{ŞİRKET_ADI}',
  email: '{EMAIL}',
  address: '{ADRES}',
  lat: '{LAT}',
  lng: '{LNG}',
  phone: '{PHONE}',
  whatsappE164: '{WHATSAPP_E164}',
  whatsappMessage: '{URLENCODEED_MESSAGE}',
  mailSubject: '{URLENCODEED_SUBJECT}',
}

function toPriceLabel(value: ProductLike['price']) {
  if (typeof value === 'number') {
    return value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
  }
  if (typeof value === 'string') {
    const asNumber = Number(value)
    if (!Number.isNaN(asNumber)) {
      return asNumber.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
    }
    return value
  }
  return value.toNumber().toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
}

function truncate(text: string | null, maxLength: number) {
  if (!text) return 'Öne çıkan ürün detaylarını görüntülemek için ürüne tıklayın.'
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1)}…`
}

function buildFeaturedCards(products: ProductLike[]) {
  const realCards = products.slice(0, 4).map((item) => ({
    key: item.id,
    name: item.name,
    description: truncate(item.description, 88),
    price: toPriceLabel(item.price),
    slug: item.slug,
    imageUrl: item.imageUrl,
  }))

  const fallbackCards = [
    {
      key: 'fallback-1',
      name: '{ÜRÜN_ADI_1}',
      description: '{ÜRÜN_KISA_AÇIKLAMA_1}',
      price: '{ÜRÜN_FİYAT_1}',
      slug: '{ÜRÜN_SLUG_1}',
      imageUrl: undefined,
    },
    {
      key: 'fallback-2',
      name: '{ÜRÜN_ADI_2}',
      description: '{ÜRÜN_KISA_AÇIKLAMA_2}',
      price: '{ÜRÜN_FİYAT_2}',
      slug: '{ÜRÜN_SLUG_2}',
      imageUrl: undefined,
    },
    {
      key: 'fallback-3',
      name: '{ÜRÜN_ADI_3}',
      description: '{ÜRÜN_KISA_AÇIKLAMA_3}',
      price: '{ÜRÜN_FİYAT_3}',
      slug: '{ÜRÜN_SLUG_3}',
      imageUrl: undefined,
    },
    {
      key: 'fallback-4',
      name: '{ÜRÜN_ADI_4}',
      description: '{ÜRÜN_KISA_AÇIKLAMA_4}',
      price: '{ÜRÜN_FİYAT_4}',
      slug: '{ÜRÜN_SLUG_4}',
      imageUrl: undefined,
    },
  ]

  const result = [...realCards]
  for (let i = realCards.length; i < 4; i += 1) {
    result.push(fallbackCards[i])
  }
  return result
}

export default function CorporateHomePage({ featuredProducts }: Props) {
  const featuredCards = buildFeaturedCards(featuredProducts)
  const mapEmbedUrl = `https://www.google.com/maps?q=${PLACEHOLDERS.lat},${PLACEHOLDERS.lng}&hl=tr&z=15&output=embed`

  return (
    <div className="bg-slate-50 text-slate-900">
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section
          aria-labelledby="hero-title"
          className="rounded-2xl bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 p-6 text-white shadow-lg sm:p-10"
        >
          <p className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wide">
            {PLACEHOLDERS.companyName}
          </p>
          <h1 id="hero-title" className="max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl">
            {PLACEHOLDERS.companyName} ile güvenilir tedarik ve güçlü kurumsal hizmet.
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-100 sm:text-base">
            {PLACEHOLDERS.companyName}, kalite ve sürdürülebilir hizmet yaklaşımıyla kurumlara ve son kullanıcıya
            doğru ürünü doğru zamanda ulaştırır.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Ürünlere Göz At
            </Link>
            <a
              href={`mailto:${PLACEHOLDERS.email}`}
              className="inline-flex items-center justify-center rounded-lg border border-white/60 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Hemen İletişime Geç
            </a>
          </div>
        </section>

        <section aria-labelledby="featured-products-title" className="mt-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 id="featured-products-title" className="text-2xl font-bold">
              Ürün Öne Çıkanlar
            </h2>
            <Link
              href="/products"
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Tümünü Gör
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCards.map((card) => (
              <article key={card.key} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 overflow-hidden rounded-lg bg-slate-100">
                  {card.imageUrl ? (
                    <img
                      src={card.imageUrl}
                      alt={card.name}
                      loading="lazy"
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-44 items-center justify-center text-sm text-slate-500">
                      Görsel yok
                    </div>
                  )}
                </div>
                <h3 className="text-base font-semibold">{card.name}</h3>
                <p className="mt-2 min-h-12 text-sm text-slate-600">{card.description}</p>
                <p className="mt-3 text-lg font-bold text-blue-700">{card.price}</p>
                <Link
                  href={`/products/${card.slug}`}
                  className="mt-4 inline-flex text-sm font-semibold text-blue-700 underline-offset-2 hover:underline"
                >
                  Detay
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="about-title" className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 id="about-title" className="text-2xl font-bold">
            Şirket Hakkında
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">
            {PLACEHOLDERS.companyName}, {`{KURULUS_YILI}`} yılında başlayan yolculuğunda tedarik, satış ve satış sonrası
            destek süreçlerini tek çatı altında birleştirerek sürdürülebilir büyüme odağıyla faaliyetlerini
            sürdürmektedir.
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">
            Misyonumuz, müşteriye güven veren şeffaf süreçler ve ölçülebilir kalite standartları ile uzun vadeli iş
            ortaklığı oluşturmaktır. {PLACEHOLDERS.companyName}, {`{SERTIFIKA_1}`} ve {`{SERTIFIKA_2}`} gibi kalite/güven
            vurgusunu destekleyen sertifikasyon hedefleriyle hareket eder.
          </p>
        </section>

        <section aria-labelledby="map-title" className="mt-12">
          <h2 id="map-title" className="text-2xl font-bold">
            Konum
          </h2>
          <p className="mt-2 text-sm text-slate-700">{PLACEHOLDERS.address}</p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <iframe
              title={`${PLACEHOLDERS.companyName} konumu`}
              src={mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-80 w-full"
            />
          </div>
        </section>

        <section aria-labelledby="contact-title" className="mt-12 rounded-2xl bg-slate-900 p-6 text-white sm:p-8">
          <h2 id="contact-title" className="text-2xl font-bold">
            Hızlı İletişim
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <a
              href={`tel:${PLACEHOLDERS.phone}`}
              className="rounded-lg border border-white/25 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/15"
            >
              Telefon: {PLACEHOLDERS.phone}
            </a>
            <a
              href={`https://wa.me/${PLACEHOLDERS.whatsappE164}?text=${PLACEHOLDERS.whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/25 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/15"
            >
              WhatsApp ile Yaz
            </a>
            <a
              href={`mailto:${PLACEHOLDERS.email}?subject=${PLACEHOLDERS.mailSubject}`}
              className="rounded-lg border border-white/25 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/15"
            >
              E-posta Gönder
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Çalışma Saatleri</h3>
            <p className="mt-2 text-sm text-slate-700">{`{CALISMA_SAATLERI}`}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">İletişim</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-700">
              <li>
                <a href={`tel:${PLACEHOLDERS.phone}`} className="hover:text-slate-900">
                  {PLACEHOLDERS.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${PLACEHOLDERS.email}`} className="hover:text-slate-900">
                  {PLACEHOLDERS.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Sosyal Medya</h3>
            <div className="mt-3 flex items-center gap-3">
              <a
                aria-label="Instagram"
                href="{INSTAGRAM_URL}"
                className="rounded-full border border-slate-300 p-2 text-slate-700 transition hover:bg-slate-100"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3.5A5.5 5.5 0 1 0 17.5 13 5.5 5.5 0 0 0 12 7.5zm0 2A3.5 3.5 0 1 1 8.5 13 3.5 3.5 0 0 1 12 9.5zm5.8-3.2a1.2 1.2 0 1 0 1.2 1.2 1.2 1.2 0 0 0-1.2-1.2z" />
                </svg>
              </a>
              <a
                aria-label="LinkedIn"
                href="{LINKEDIN_URL}"
                className="rounded-full border border-slate-300 p-2 text-slate-700 transition hover:bg-slate-100"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5 2.5 2.5 0 0 0 5 3.5zM3 9h4v12H3zm7 0h3.8v1.7h.1c.5-.9 1.8-2 3.8-2 4.1 0 4.8 2.6 4.8 6V21h-4v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4z" />
                </svg>
              </a>
              <a
                aria-label="X"
                href="{X_URL}"
                className="rounded-full border border-slate-300 p-2 text-slate-700 transition hover:bg-slate-100"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.8-6.3L6.5 22H3.4l7.2-8.2L1 2h6.3l4.4 5.9L18.9 2zm-1.1 18h1.7L6.2 3.9H4.4L17.8 20z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Gizlilik / KVKK</h3>
            <p className="mt-2 text-sm text-slate-700">
              {`{KVKK_KISA_METIN}`}. {`{GIZLILIK_POLITIKASI_URL}`} ve {`{KVKK_URL}`} üzerinden detaylara erişebilirsiniz.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
