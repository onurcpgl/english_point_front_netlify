import React from "react";

function page() {
  // --- STİLLER ---
  // Önceki bileşenlerle tutarlılık için aynı temel stiller kullanılmıştır.
  const containerStyle = {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "sans-serif",
    lineHeight: "1.6",
    color: "#333",
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "2rem",
    fontWeight: "bold",
    lineHeight: "1.3",
  };

  const sectionHeaderStyle = {
    marginTop: "35px",
    marginBottom: "20px",
    fontSize: "1.5rem",
    fontWeight: "bold",
    borderBottom: "2px solid #eee",
    paddingBottom: "10px",
    color: "#2c3e50",
  };

  const subSectionHeaderStyle = {
    marginTop: "25px",
    marginBottom: "15px",
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#34495e",
    backgroundColor: "#f8f9fa",
    padding: "10px",
    borderRadius: "5px",
  };

  const paragraphStyle = {
    marginBottom: "15px",
  };

  const listStyle = {
    marginLeft: "25px",
    marginBottom: "20px",
  };

  const listItemStyle = {
    marginBottom: "8px",
  };

  // Özet bölümleri için özel paragraf stili (Label: Açıklama şeklinde)
  const summaryBlockStyle = {
    marginBottom: "20px",
    paddingLeft: "10px",
    borderLeft: "3px solid #0056b3",
  };

  const linkStyle = {
    color: "#0056b3",
    textDecoration: "underline",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>KULLANICI SÖZLEŞMESİ SETİ</h1>

      <section>
        <h2 style={sectionHeaderStyle}>1. Taraflar ve Giriş</h2>
        <p style={paragraphStyle}>
          İşbu Kullanıcı Sözleşmesi Seti (“Sözleşme”); bir tarafta English Point
          Eğitim ve Teknoloji LTD. ŞTİ. (“EnglishPoint” veya “Şirket”) ile,
          diğer tarafta platformu kullanan kullanıcı (“Kullanıcı”) arasında
          akdedilmiştir.
        </p>
        <p style={paragraphStyle}>
          Kullanıcı, platforma kayıt olarak veya platformu kullanarak işbu
          Sözleşmenin tamamını okuduğunu, anladığını ve kabul ettiğini beyan
          eder.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>2. Sözleşmenin Konusu</h2>
        <p style={paragraphStyle}>
          Bu set, konuşma seansları ve ücretli içerik hizmetleri için:
        </p>
        <ul style={listStyle}>
          <li style={listItemStyle}>Kullanıcı Sözleşmesi,</li>
          <li style={listItemStyle}>
            Gizlilik Politikası ve KVKK Aydınlatma Metni,
          </li>
          <li style={listItemStyle}>İptal & İade Şartları</li>
        </ul>
        <p style={paragraphStyle}>
          başlıklarını kapsar ve tüm kullanım koşullarını düzenler.
        </p>
      </section>

      {/* --- BÖLÜM A --- */}
      <section>
        <h2 style={subSectionHeaderStyle}>A. KULLANICI SÖZLEŞMESİ ÖZETİ</h2>

        <div style={summaryBlockStyle}>
          <p style={paragraphStyle}>
            <strong>Hizmetin Tanımı:</strong>
            <br />
            EnglishPoint, ana dili İngilizce olan eğitmenler aracılığıyla
            birebir veya grup konuşma seansları sağlar. Tüm hizmetler English
            Point markası altında sunulur; eğitmenler platformun bir parçasıdır.
          </p>
        </div>

        <div style={summaryBlockStyle}>
          <p style={paragraphStyle}>
            <strong>Kayıt ve Üyelik:</strong>
            <br />
            18 yaş altı kullanıcılar yalnızca yasal veli onayıyla üye olabilir.
            Üyelik bilgileri doğru ve güncel tutulmalıdır. EnglishPoint, üyelik
            başvurularını gerekçe göstermeksizin reddedebilir.
          </p>
        </div>

        <div style={summaryBlockStyle}>
          <p style={paragraphStyle}>
            <strong>Ücretlendirme ve Ödeme:</strong>
            <br />
            Tüm ödemeler platform üzerinden tahsil edilir. Fatura, English Point
            Eğitim ve Teknoloji LTD. ŞTİ. adına düzenlenir.
          </p>
        </div>

        <div style={summaryBlockStyle}>
          <p style={paragraphStyle}>
            <strong>Hizmet Kullanımı ve Sorumluluklar:</strong>
            <br />
            Platform dışı iletişim veya ödeme yasaktır. Sözleşmede belirtilen
            kurallara aykırı davranışlarda, hesap askıya alınabilir veya
            sonlandırılabilir.
          </p>
        </div>

        <div style={summaryBlockStyle}>
          <p style={paragraphStyle}>
            <strong>Fikri Mülkiyet:</strong>
            <br />
            Platformdaki tüm içerik, materyal ve marka unsurları English Point’e
            aittir. İzinsiz kullanım yasaktır.
          </p>
        </div>

        <div style={summaryBlockStyle}>
          <p style={paragraphStyle}>
            <strong>Sözleşmenin Feshi:</strong>
            <br />
            Yanıltıcı bilgi, platform dışı işlem, kötüye kullanım veya ahlaka
            aykırı davranışta, üyelik derhal sonlandırılabilir.
          </p>
        </div>

        <div style={summaryBlockStyle}>
          <p style={paragraphStyle}>
            <strong>Sorumluluk Sınırlaması:</strong>
            <br />
            Teknik arızalardan kaynaklı kesintilerden English Point sorumlu
            değildir.
          </p>
        </div>

        <div style={summaryBlockStyle}>
          <p style={paragraphStyle}>
            <strong>Uygulanacak Hukuk ve Yetki:</strong>
            <br />
            Türkiye Cumhuriyeti kanunları uygulanır; İstanbul Merkez (Çağlayan)
            Mahkemeleri yetkilidir.
          </p>
        </div>
      </section>

      {/* --- BÖLÜM B --- */}
      <section>
        <h2 style={subSectionHeaderStyle}>
          B. GİZLİLİK POLİTİKASI & KVKK AYDINLATMA METNİ ÖZETİ
        </h2>

        <div style={summaryBlockStyle}>
          <p style={paragraphStyle}>
            <strong>Veri Sorumlusu:</strong>
            <br />
            English Point Eğitim ve Teknoloji LTD. ŞTİ.
          </p>
        </div>

        <div style={summaryBlockStyle}>
          <p style={paragraphStyle}>
            <strong>Toplanan Veriler:</strong>
            <br />
            Kimlik, iletişim, hizmet ve finansal bilgiler, teknik/veri
            kayıtları.
          </p>
        </div>

        <div style={summaryBlockStyle}>
          <p style={paragraphStyle}>
            <strong>Veri İşleme Amaçları:</strong>
            <br />
            Üyelik yönetimi, rezervasyon ve ödeme işlemleri, müşteri desteği,
            kampanya ve bilgilendirme, yasal yükümlülüklerin yerine getirilmesi.
          </p>
        </div>

        <div style={summaryBlockStyle}>
          <p style={paragraphStyle}>
            <strong>Veri Aktarımı:</strong>
            <br />
            Kamu kurumları, ödeme sağlayıcıları, hizmet ortakları ve teknik
            altyapı sağlayıcılarıyla paylaşılabilir.
          </p>
        </div>

        <div style={summaryBlockStyle}>
          <p style={paragraphStyle}>
            <strong>Saklama Süresi:</strong>
            <br />
            Amaç ve yasal süreler kadar saklanır; süresi biten veriler güvenli
            şekilde silinir.
          </p>
        </div>

        <div style={summaryBlockStyle}>
          <p style={paragraphStyle}>
            <strong>Kullanıcı Hakları (KVKK Madde 11):</strong>
            <br />
            İşlenip işlenmediğini öğrenme, eksik/yanlış veriyi düzeltme,
            silinmesini isteme, yurt içi/dışı aktarımı öğrenme, itiraz etme,
            zararın giderilmesini talep etme vb.
          </p>
        </div>

        <div style={summaryBlockStyle}>
          <p style={paragraphStyle}>
            <strong>Çerez Kullanımı:</strong>
            <br />
            Kullanıcı deneyimi ve istatistik için çerezler kullanılır. Tarayıcı
            ayarlarından çerezler yönetilebilir.
          </p>
        </div>

        <div style={summaryBlockStyle}>
          <p style={paragraphStyle}>
            <strong>Veri Güvenliği:</strong>
            <br />
            Teknik ve idari tedbirler alınmıştır; internet üzerinden %100
            güvenlik garanti edilemez.
          </p>
        </div>

        <div style={summaryBlockStyle}>
          <p style={paragraphStyle}>
            <strong>Güncellemeler ve İletişim:</strong>
            <br />
            Politika değişiklikleri web sitesinde yayımlanır. Soru veya talepler
            için:{" "}
            <a href="mailto:destek@englishpoint.com.tr" style={linkStyle}>
              destek@englishpoint.com.tr
            </a>
          </p>
        </div>
      </section>

      {/* --- BÖLÜM C --- */}
      <section>
        <h2 style={subSectionHeaderStyle}>C. İPTAL & İADE ŞARTLARI ÖZETİ</h2>

        <div style={summaryBlockStyle}>
          <p style={paragraphStyle}>
            <strong>Kullanıcı Tarafından İptal:</strong>
            <br />
            Seans saatinden 12 saat önce iptal edilebilir; ücret iadesi yapılır
            veya alternatif seans hakkı sunulur. 12 saatten kısa sürede
            iptallerde ücret iadesi yapılmaz.
          </p>
        </div>

        <div style={summaryBlockStyle}>
          <p style={paragraphStyle}>
            <strong>English Point Tarafından İptal:</strong>
            <br />
            Eğitmen veya operasyonel sebeplerle seans iptali durumunda
            kullanıcıya iade veya alternatif tarih hakkı verilir.
          </p>
        </div>

        <div style={summaryBlockStyle}>
          <p style={paragraphStyle}>
            <strong>Ödeme ve İade Süreci:</strong>
            <br />
            İadeler ödeme yapılan yöntem üzerinden 7 iş günü içinde tamamlanır.
            Üçüncü taraf ödeme sağlayıcıları kaynaklı gecikmeler olabilir.
          </p>
        </div>

        <div style={summaryBlockStyle}>
          <p style={paragraphStyle}>
            <strong>Platform Dışı İşlemler:</strong>
            <br />
            Platform dışı rezervasyon veya ödeme geçersizdir; iade hakkı
            doğurmaz.
          </p>
        </div>
      </section>

      <p
        style={{
          marginTop: "40px",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#666",
        }}
      >
        <i>Not: Bu metin, ilgili sözleşmelerin bir özetidir.</i>
      </p>
    </div>
  );
}

export default page;
