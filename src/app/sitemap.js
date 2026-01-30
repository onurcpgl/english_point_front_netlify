export default function sitemap() {
  const baseUrl = "https://englishpoint.com.tr";

  // new Date() her build'de güncellenir, bu statik sayfalar için uygundur.
  const currentDate = new Date();

  return [
    // --- 1. EN ÖNEMLİ SAYFALAR (Vitrini) ---
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly", // Ana sayfa sık değişebilir
      priority: 1, // En yüksek öncelik
    },
    {
      url: `${baseUrl}/become-instructors`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8, // Önemli bir pazarlama sayfası
    },

    // --- 2. İÇERİK ve KURS SAYFALARI (Sık Güncellenmeli) ---
    // Burası 'yearly' kalmamalı, yeni kurs eklenince Google hemen görmeli.
    {
      url: `${baseUrl}/course-sessions`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/find-session`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    // --- 3. GİRİŞ & KAYIT SAYFALARI (Kullanıcı Kolaylığı) ---
    // İndekslensin ama içerik sayfaları kadar öncelikli değil.
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/instructor-login`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/instructor-register`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.4,
    },

    // --- 4. YASAL & STATİK SAYFALAR (Düşük Öncelik) ---
    // Google buraya enerjisini harcamasın. 0.3 idealdir.
    {
      url: `${baseUrl}/kullanici-sozlesmesi`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/kvkk`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/iptal-iade`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/sozlesme-seti`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/mentor-kvkk`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
