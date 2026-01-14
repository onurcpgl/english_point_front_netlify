import React from "react";

function page() {
  // Sayfa içi temel stiller (Projenizde global CSS varsa bunları kaldırabilirsiniz)
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
  };

  const sectionHeaderStyle = {
    marginTop: "25px",
    marginBottom: "15px",
    fontSize: "1.3rem",
    fontWeight: "600",
  };

  const paragraphStyle = {
    marginBottom: "12px",
  };

  const listStyle = {
    marginLeft: "20px",
    marginBottom: "12px",
  };

  const signatureBlockStyle = {
    marginTop: "40px",
    borderTop: "1px solid #eee",
    paddingTop: "20px",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>KULLANICI SÖZLEŞMESİ</h1>

      <section>
        <h2 style={sectionHeaderStyle}>1. Taraflar</h2>
        <p style={paragraphStyle}>
          İşbu Kullanıcı Sözleşmesi (“Sözleşme”); bir tarafta English Point
          Eğitim ve Teknoloji Limited Şirketi ile, diğer tarafta
          www.englishpoint.com.tr internet sitesi veya English Point mobil
          uygulaması üzerinden hizmet alan kullanıcı (“Kullanıcı”) arasında
          akdedilmiştir.
        </p>
        <p style={paragraphStyle}>
          Kullanıcı, platforma kaydolarak veya platformu kullanarak, işbu
          sözleşmenin tamamını okuduğunu, anladığını ve hükümlerini kabul
          ettiğini beyan eder.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>2. Sözleşmenin Konusu</h2>
        <p style={paragraphStyle}>
          Bu sözleşmenin konusu, English Point tarafından işletilen dijital
          platform aracılığıyla Kullanıcılara sunulan yüz yüze İngilizce konuşma
          seansları ve ücretli içerik hizmetlerinin koşullarının
          düzenlenmesidir.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>3. Hizmetin Tanımı</h2>
        <p style={paragraphStyle}>
          English Point, anadili İngilizce olan eğitmenler ve İngilizce
          öğretmenleri (Türk) aracılığıyla birebir veya grup halinde konuşma
          pratik seansları düzenler.
        </p>
        <p style={paragraphStyle}>
          Tüm seanslar English Point markası altında yürütülür; eğitmenler
          English Point adına hizmet verir.
        </p>
        <p style={paragraphStyle}>
          Kullanıcılar platform üzerinden ödeme yaparak rezervasyon oluşturur ve
          hizmeti alır.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>4. Kayıt ve Üyelik</h2>
        <p style={paragraphStyle}>
          Platforma kayıt işlemi tamamlandığında, kullanıcıya özel bir hesap
          oluşturulur.
        </p>
        <p style={paragraphStyle}>
          Kullanıcı, üyelik bilgilerini doğru ve güncel tutmakla yükümlüdür.
        </p>
        <p style={paragraphStyle}>
          18 yaşından küçük kişiler, yasal veli onayı olmaksızın üye olamaz.
        </p>
        <p style={paragraphStyle}>
          English Point, üyelik başvurularını gerekçe göstermeksizin
          reddedebilir veya iptal edebilir.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>5. Ücretlendirme ve Ödeme Koşulları</h2>
        <p style={paragraphStyle}>
          Tüm ödemeler English Point ödeme altyapısı üzerinden (ör. kredi kartı,
          iyzico, Stripe vb.) tahsil edilir.
        </p>
        <p style={paragraphStyle}>
          Ödemesi tamamlanmayan rezervasyonlar geçerli değildir.
        </p>
        <p style={paragraphStyle}>
          Fatura, English Point Eğitim ve Teknoloji Ltd. Şti. tarafından
          Kullanıcı adına düzenlenir.
        </p>
        <p style={paragraphStyle}>
          English Point, hizmet bedellerini ve kampanya koşullarını önceden
          bildirmek kaydıyla değiştirme hakkını saklı tutar.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>6. İptal ve İade Koşulları</h2>
        <p style={paragraphStyle}>
          Kullanıcı, planlanan seans saatinden en az 12 saat önce iptal
          talebinde bulunabilir.
        </p>
        <p style={paragraphStyle}>
          12 saatten az süre kala yapılan iptallerde ücret iadesi yapılmaz.
        </p>
        <p style={paragraphStyle}>
          English Point, eğitmen veya operasyonel sebeplerle seansı iptal etmek
          zorunda kalırsa, kullanıcıya ücret iadesi veya yeniden planlama
          seçeneği sunar.
        </p>
        <p style={paragraphStyle}>
          Tüm iptal ve iade süreçleri, “İptal & İade Şartları” sayfasında ayrıca
          açıklanır.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>
          7. Hizmetin Kullanımı ve Sorumluluklar
        </h2>
        <p style={paragraphStyle}>
          Kullanıcı, hizmeti yalnızca English Point platformu üzerinden almayı
          kabul eder.
        </p>
        <p style={paragraphStyle}>
          Kullanıcı ile eğitmen arasında English Point dışı iletişim, seans
          planlama veya ödeme girişimleri yasaktır.
        </p>
        <p style={paragraphStyle}>
          English Point, bu tür platform dışı işlemleri tespit etmesi halinde
          kullanıcının hesabını askıya alma veya sonlandırma hakkına sahiptir.
        </p>
        <p style={paragraphStyle}>
          Kullanıcı, seanslarda saygılı davranmakla, genel ahlak ve nezaket
          kurallarına uymakla yükümlüdür.
        </p>
        <p style={paragraphStyle}>
          English Point, hizmetin kesintisiz sağlanması için azami çabayı
          göstermekle birlikte, teknik arızalardan doğan gecikme veya
          aksaklıklardan sorumlu tutulamaz.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>8. Fikri Mülkiyet Hakları</h2>
        <p style={paragraphStyle}>
          English Point platformunda yer alan tüm görseller, yazılar, içerikler,
          logolar, öğretim materyalleri ve marka unsurları English Point’e
          aittir.
        </p>
        <p style={paragraphStyle}>
          İzinsiz kopyalanamaz, çoğaltılamaz veya ticari amaçla kullanılamaz.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>9. Gizlilik ve Veri Koruma</h2>
        <p style={paragraphStyle}>
          Kullanıcı bilgileri, 6698 sayılı Kişisel Verilerin Korunması Kanunu
          (KVKK) ve ilgili mevzuata uygun şekilde işlenir.
        </p>
        <p style={paragraphStyle}>
          Detaylı bilgi için Gizlilik Politikası ve KVKK Aydınlatma Metni
          geçerlidir.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>10. Sözleşmenin Feshi</h2>
        <p style={paragraphStyle}>
          EnglishPoint, aşağıdaki durumlarda üyeliği derhal sonlandırma hakkını
          saklı tutar:
        </p>
        <ul style={listStyle}>
          <li>Yanıltıcı bilgi verilmesi,</li>
          <li>Platform dışı ödeme veya seans girişimi,</li>
          <li>Hizmetin kötüye kullanılması,</li>
          <li>Genel ahlak kurallarına aykırı davranış.</li>
        </ul>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>11. Sorumluluk Sınırlaması</h2>
        <p style={paragraphStyle}>
          English Point, hizmeti “olduğu gibi” sunar. Teknik arızalar, internet
          kesintileri veya kullanıcı kaynaklı sorunlardan doğan zararlardan
          sorumlu değildir.
        </p>
        <p style={paragraphStyle}>
          Kullanıcı, hizmetin doğası gereği belirli zamanlarda değişiklik veya
          iptaller yaşanabileceğini kabul eder.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>
          12. Uygulanacak Hukuk ve Yetkili Mahkeme
        </h2>
        <p style={paragraphStyle}>
          İşbu sözleşme Türkiye Cumhuriyeti kanunlarına tabidir.
        </p>
        <p style={paragraphStyle}>
          Her türlü uyuşmazlıkta İstanbul Merkez (Çağlayan) Mahkemeleri ve İcra
          Daireleri yetkilidir.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>13. Yürürlük</h2>
        <p style={paragraphStyle}>
          Kullanıcı, platforma kaydolarak işbu sözleşmenin tamamını okuduğunu,
          anladığını ve kabul ettiğini beyan eder.
        </p>
        <p style={paragraphStyle}>
          Sözleşme, kullanıcının elektronik ortamda onay verdiği tarih
          itibariyle yürürlüğe girer.
        </p>
      </section>

      <div style={signatureBlockStyle}>
        <h2 style={sectionHeaderStyle}>İMZA</h2>
        <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
          English Point Eğitim ve Teknoloji LTD. ŞTİ.
        </p>
        <address style={{ fontStyle: "normal" }}>
          <p style={{ margin: "5px 0" }}>
            Adres: Kaptanpaşa Mah, Piyalepaşa Blv. Famas Plaza No:77 B Blok K:4
            No:71, 34384 Şişli/İstanbul
          </p>
          <p style={{ margin: "5px 0" }}>
            E-posta:{" "}
            <a
              href="mailto:destek@englishpoint.com.tr"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              destek@englishpoint.com.tr
            </a>
          </p>
          <p style={{ margin: "5px 0" }}>Telefon: iletişim numarası</p>
        </address>
      </div>
    </div>
  );
}

export default page;
