import Link from 'next/link'
import { getFeaturedProducts } from '@/lib/products'

export const metadata = {
  title: 'Veramix | Premium Su Armatürleri',
  description: 'Veramix — estetik tasarim ve kusursuz akisin bulustugu modern su armaturu cozumleri.',
}

// Always render server-side — homepage reads live featured products from DB
export const dynamic = 'force-dynamic'

const WHATSAPP =
  'https://wa.me/905425129747?text=Merhaba%20Veramix%2C%20bilgi%20almak%20istiyorum.'
const TEL = 'tel:05425129747'
// Use the contact address shown on the page for maps and directions
const MAPS_QUERY = encodeURIComponent('8 Mart Mahallesi Gülşilan Sokak A Blok No:25, Nusaybin, Mardin')

const CATEGORIES = [
  { icon: 'kitchen',    label: 'Mutfak',      sub: 'Eviye bataryaları',      slug: 'mutfak' },
  { icon: 'water_drop', label: 'Lavabo',      sub: 'Banyo bataryaları',      slug: 'lavabo' },
  { icon: 'shower',     label: 'Duş',         sub: 'Sistemler & Başlıklar',  slug: 'dus' },
  { icon: 'towel',      label: 'Aksesuarlar', sub: 'Tamamlayıcı ürünler',    slug: 'aksesuarlar' },
  { icon: 'grid_view',  label: 'Ankastre',    sub: 'Gömme sistemler',        slug: 'ankastre' },
]

const FEATURES = [
  { icon: 'shield',        text: '%100 Pirinç Gövde' },
  { icon: 'settings',      text: 'Seramik Kartuş' },
  { icon: 'verified',      text: '5 Yıl Garanti' },
  { icon: 'flag',          text: 'Yerli Üretim' },
  { icon: 'support_agent', text: '7/24 Teknik Destek' },
]

export default async function Page() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <>
      {/* Header */}
      <header className="fixed w-full top-0 z-50 glass-effect border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex iadrestems-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-icons">water_drop</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Veramix</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">Ürünler</Link>
            <a href="#about"   className="text-sm font-medium hover:text-primary transition-colors">Hakkımızda</a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">İletişim</a>
          </nav>

          <div className="flex items-center gap-3">
            <a href={TEL} className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
              <span className="material-icons text-lg">call</span>
              <span>0542 512 97 47</span>
            </a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-all shadow-md">
              <span className="material-icons text-lg">chat</span>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero */}
        <section className="relative bg-white overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-6 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-semibold tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Premium Su Armatürleri
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-[1.1]">
                Estetik Tasarım,<br />
                <span className="text-primary">Kusursuz Akış.</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                Veramix, yaşam alanlarınıza değer katan modern, dayanıklı ve şık armatür
                çözümleri sunar. Mutfak ve banyo için geliştirilmiş üstün pirinç gövde teknolojisi.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/products"
                  className="px-8 py-4 bg-primary text-white rounded-xl font-medium shadow-lg hover:bg-primary-dark transition-all hover:-translate-y-0.5">
                  Ürünleri İncele
                </Link>
                <a href="#contact"
                  className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <span className="material-icons text-primary">storefront</span>
                  Showroom / İletişim
                </a>
              </div>
              <div className="pt-8 flex items-center gap-8 border-t border-slate-100">
                <div><p className="text-2xl font-bold text-slate-900">10+</p><p className="text-sm text-slate-500">Yıllık Tecrübe</p></div>
                <div className="w-px h-10 bg-slate-200" />
                <div><p className="text-2xl font-bold text-slate-900">500+</p><p className="text-sm text-slate-500">Ürün Çeşidi</p></div>
                <div className="w-px h-10 bg-slate-200" />
                <div><p className="text-2xl font-bold text-slate-900">5.000+</p><p className="text-sm text-slate-500">Mutlu Müşteri</p></div>
              </div>
            </div>

            <div className="flex-1 relative w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden bg-slate-50">
              <div className="absolute top-10 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-10 left-10 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Modern krom mutfak bataryası"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwfTSYpncaMczuAycdgq39qAPVciwNBJ0F5vAt29k0HPCv4umlwBPQ9K-N95sxaRCI1sH8jc2LuyPDBZf4f0kkbuEkBS-Ysfkrt6Ay-4NfaBGXS4hMlXSm8MbZsjTXZrg2csvOnSlpaeNBZcZ6yfkRYrhtuEm0NzpJfAD5jXQZ7mqiWabV3YW_KyrW2BGak9NuNiFXnIaqCBe2GTClVaP3T82bOjw0mcBDppntNlOh-_yVFWx1mKjaNRPWbUdqMtdiEcVuSK-4K1aK"
              />
              <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur p-4 rounded-xl shadow-xl max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <span className="material-icons text-sm">eco</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Su Tasarrufu</p>
                    <p className="text-xs text-slate-500">%40 varan verimlilik</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section id="categories" className="py-20 bg-background-light">
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Kategoriler</h2>
                <p className="text-slate-500">Ihtiyaciniza uygun urun grubunu kesfedin.</p>
              </div>
              <Link href="/products" className="hidden sm:flex items-center gap-1 text-primary font-medium hover:underline">
                Tum Urunler <span className="material-icons text-sm">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {CATEGORIES.map((cat) => (
                <Link key={cat.slug} href={`/products?category=${cat.slug}`}
                  className="group block bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-slate-100 text-center">
                  <div className="w-14 h-14 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                    <span className="material-icons text-2xl">{cat.icon}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">{cat.label}</h3>
                  <p className="text-xs text-slate-500 mt-1">{cat.sub}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products — admin-controlled */}
        {featuredProducts.length > 0 && (
          <section className="py-20 bg-white">
            <div className="max-w-[1440px] mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Öne Çıkan Ürünler</h2>
                  <p className="text-slate-500 max-w-2xl mx-auto">En çok tercih edilen, yüksek kaliteli ve modern tasarımlı ürünlerimiz.</p>
                </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map((p) => {
                  const image = p.images[0]?.url
                  const categoryName = p.categories[0]?.category.name ?? ''
                  return (
                    <Link key={p.id} href={`/products/${p.slug}`}
                      className="group bg-background-light rounded-xl overflow-hidden border border-slate-100 hover:border-primary/50 transition-all hover:shadow-lg block">
                      <div className="relative aspect-square bg-white flex items-center justify-center overflow-hidden">
                        {image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img alt={p.name}
                            className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-300"
                            src={image}
                          />
                        ) : (
                          <span className="material-icons text-7xl text-slate-200">water_drop</span>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-primary/80 uppercase tracking-wider">{categoryName}</span>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            <span className="material-icons text-[12px] text-green-600">verified</span>
                            5 Yil Garanti
                          </div>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">{p.name}</h3>
                        <span className="w-full py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all flex items-center justify-center gap-2">
                          Detaylı İncele <span className="material-icons text-sm">arrow_forward</span>
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
              <div className="text-center mt-12">
                <Link href="/products"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-lg">
                  Tum Urunleri Gor <span className="material-icons">arrow_forward</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Trust Band */}
        <section className="bg-primary text-white py-14">
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {FEATURES.map((f) => (
                <div key={f.text} className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <span className="material-icons">{f.icon}</span>
                  </div>
                  <span className="text-sm font-semibold opacity-90">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-20 bg-background-light">
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="bg-white rounded-2xl p-8 lg:p-16 border border-slate-200 shadow-xl overflow-hidden relative">
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
              <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-10">
                <div className="max-w-2xl">
                  <span className="text-primary font-bold tracking-wide text-sm uppercase">Hakkimizda</span>
                  <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-4">Veramix Su Armaturleri</h2>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    Veramix olarak 10 yili askin tecrubemizle kaliteli malzeme ve ustun iscilikte
                    uretilen su armuturlerini Turkiye genelinde sunuyoruz. Musteri memnuniyeti ve
                    guvenilirlik is yapis seklimizin temelini olusturur.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Sektordeki gelismeleri yakından takip ediyor, urun portfoyumuzu surekli
                    genisletiyoruz. %100 pirinc govde ve seramik kartus teknolojisiyle uzun
                    omurlu cozumler sunuyoruz.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <button className="flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary transition-colors">
                      <span className="material-icons">download</span>
                      2024 Katalogunu Indir
                    </button>
                    <Link href="/products"
                      className="flex items-center gap-3 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors">
                      Urunleri Incele
                    </Link>
                  </div>
                </div>
                <div className="flex-shrink-0 hidden md:block">
                  <div className="w-48 h-56 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg shadow-2xl rotate-3 flex items-center justify-center border border-white/20">
                    <div className="text-center">
                      <span className="material-icons text-6xl text-primary mb-2">menu_book</span>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Veramix</p>
                      <p className="text-[10px] text-slate-400">2024 Collection</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Showroom / Contact */}
        <section id="contact" className="py-20 bg-white border-t border-slate-100">
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 rounded-2xl overflow-hidden bg-background-light border border-slate-200">
              <div className="relative h-80 lg:h-auto min-h-[400px]">
                <iframe
                  src={`https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`}
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  title="Veramix Showroom Konumu"
                />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white p-4 rounded-xl shadow-lg flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Merkez Showroom</p>
                      <p className="text-xs text-slate-500">Nusaybin, Mardin</p>
                    </div>
                    <a href={`https://maps.google.com/?q=${MAPS_QUERY}`} target="_blank" rel="noopener noreferrer"
                       className="bg-primary p-2 rounded-lg text-white hover:bg-primary-dark transition-colors">
                      <span className="material-icons text-sm">near_me</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <span className="text-primary font-bold tracking-wide text-sm uppercase mb-2">Bize Ulasin</span>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Showroomumuzu Ziyaret Edin</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-icons text-xl">location_on</span>
                    </div>
                    <div>
                          <h4 className="font-semibold text-slate-900">Adres</h4>
                          <p className="text-slate-600 mt-1">8 Mart Mahallesi Gülşilan Sokak A Blok No:25</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-icons text-xl">schedule</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Çalışma Saatleri</h4>
                      <p className="text-slate-600 mt-1">Pazartesi - Cuma: 08:30 - 18:00<br/>Cumartesi: 09:00 - 13:00</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-icons text-xl">call</span>
                    </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Telefon</h4>
                        <a href={TEL} className="text-slate-600 hover:text-primary transition-colors mt-1 block">0542 512 97 47</a>
                        <p className="text-xs text-slate-500 mt-1">Ferhat Özkan</p>
                      </div>
                  </div>
                </div>
                <div className="mt-10 flex flex-wrap gap-4">
                  <a href={`https://maps.google.com/?q=${MAPS_QUERY}`} target="_blank" rel="noopener noreferrer"
                     className="flex-1 min-w-[140px] px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex justify-center items-center gap-2">
                    <span className="material-icons text-sm">directions</span>
                    Yol Tarifi Al
                  </a>
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                     className="flex-1 min-w-[140px] px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors flex justify-center items-center gap-2">
                    <span className="material-icons text-sm">chat</span>
                    WhatsApp
                  </a>
                  <a href={TEL}
                     className="flex-1 min-w-[140px] px-6 py-3 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex justify-center items-center gap-2">
                    <span className="material-icons text-sm">call</span>
                    Hemen Ara
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white mb-2">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                  <span className="material-icons text-sm">water_drop</span>
                </div>
                <span className="text-xl font-bold">Veramix</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">Yuksek kaliteli su armaturleri ve banyo cozumleri ile yasam alanlariniza deger katiyoruz.</p>
              <div className="flex gap-4 pt-2">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"><span className="text-xs font-bold">FB</span></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"><span className="text-xs font-bold">IG</span></a>
                <a href="https://linkedin.com"  target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"  className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"><span className="text-xs font-bold">IN</span></a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Hızlı Erişim</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/"         className="hover:text-primary transition-colors">Anasayfa</Link></li>
                <li><Link href="/products" className="hover:text-primary transition-colors">Ürünler</Link></li>
                <li><a    href="#about"    className="hover:text-primary transition-colors">Hakkımızda</a></li>
                <li><a    href="#contact"  className="hover:text-primary transition-colors">İletişim</a></li>
                <li><Link href="/login"    className="hover:text-primary transition-colors">Admin Girisi</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Ürün Grupları</h4>
              <ul className="space-y-3 text-sm">
                {CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/products?category=${c.slug}`} className="hover:text-primary transition-colors">{c.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">İletişim</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>8 Mart Mahallesi Gülşilan Sokak A Blok No:25<br/>Nusaybin/Mardin</li>
                <li>
                  <a href={TEL} className="hover:text-primary transition-colors">0542 512 97 47</a>
                  <div className="text-xs text-slate-400 mt-1">Ferhat Özkan</div>
                </li>
                <li><a href="mailto:info@veramix.com" className="hover:text-primary transition-colors">info@veramix.com</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>2024–2026 Veramix Armatür San. ve Tic. A.Ş. Tüm hakları saklıdır.</p>
            <div className="flex gap-6">
              <span>Gizlilik Politikası</span>
              <span>Kullanım Şartları</span>
              <span>KVKK</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
