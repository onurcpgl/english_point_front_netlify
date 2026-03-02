import React from "react";

function page() {
  // --- STİLLER ---
  // Not: Eğer projenizde global bir CSS (örn. Tailwind veya Bootstrap) kullanıyorsanız,
  // bu "style" nesnelerini kaldırıp yerine uygun className'leri kullanmanız daha iyi olur.
  // Bu stiller, harici bir CSS olmadan sayfanın düzgün görünmesi içindir.

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
    marginTop: "30px",
    marginBottom: "15px",
    fontSize: "1.4rem",
    fontWeight: "600",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
  };

  const paragraphStyle = {
    marginBottom: "15px",
    textAlign: "justify",
  };

  const listStyle = {
    marginLeft: "25px",
    marginBottom: "20px",
  };

  const listItemStyle = {
    marginBottom: "8px",
  };

  const linkStyle = {
    color: "#0056b3",
    textDecoration: "underline",
  };

  const addressStyle = {
    fontStyle: "normal",
    backgroundColor: "#f9f9f9",
    padding: "15px",
    borderRadius: "8px",
    marginTop: "15px",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>
        GİZLİLİK POLİTİKASI ve KVKK AYDINLATMA METNİ (KULLANICI)
      </h1>

      <section>
        <h2 style={sectionHeaderStyle}>1. Giriş</h2>
        <p style={paragraphStyle}>
          Bu Gizlilik Politikası, English Point Eğitim ve Teknoloji Limited
          Şirketi (“EnglishPoint”, “Şirket”) tarafından işletilen
          www.englishpoint.com.tr internet sitesi ve English Point mobil
          uygulaması üzerinden elde edilen kişisel verilerin, 6698 sayılı
          Kişisel Verilerin Korunması Kanunu (“KVKK”) ve ilgili mevzuata uygun
          olarak işlenmesine ilişkin esasları açıklamaktadır.
        </p>
        <p style={paragraphStyle}>
          Platformu kullanarak veya üyelik oluşturarak, işbu metinde belirtilen
          koşulları kabul etmiş sayılırsınız.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>2. Veri Sorumlusu</h2>
        <p style={paragraphStyle}>
          KVKK uyarınca kişisel verilerinizin veri sorumlusu:
        </p>
        <address style={addressStyle}>
          <strong>English Point Eğitim ve Teknoloji LTD. ŞTİ.’dir.</strong>
          <br />
          Adres: Kaptanpaşa Mah, Piyalepaşa Blv. Famas Plaza No:77 B Blok K:4
          No:71, 34384 Şişli/İstanbul
          <br />
          E-posta:{" "}
          <a href="mailto:destek@englishpoint.com.tr" style={linkStyle}>
            destek@englishpoint.com.tr
          </a>
          <br />
          Telefon:{" "}
          <a href="tel:905454308089" rel="noopener noreferrer">
            0545 430 80 89
          </a>
        </address>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>3. Toplanan Kişisel Veriler</h2>
        <p style={paragraphStyle}>
          Kullanıcılardan aşağıdaki kategorilerde kişisel veri toplanabilir:
        </p>
        <ul style={listStyle}>
          <li style={listItemStyle}>
            <strong>Kimlik Bilgisi:</strong> Ad, soyad, doğum tarihi
          </li>
          <li style={listItemStyle}>
            <strong>İletişim Bilgisi:</strong> Adres, Anlık Konum, E-posta
            adresi, telefon numarası
          </li>
          <li style={listItemStyle}>
            <strong>Hizmet Bilgisi:</strong> Katıldığı seanslar, rezervasyon
            geçmişi, öğretmen tercihleri
          </li>
          <li style={listItemStyle}>
            <strong>Teknik Bilgi:</strong> IP adresi, çerez verileri, cihaz
            bilgisi, oturum kayıtları
          </li>
        </ul>
        <p style={paragraphStyle}>
          Ödeme işlemlerinde kullanılan kredi kartı bilgileri, English Point
          tarafından kaydedilmez; güvenli ödeme altyapısı sağlayan üçüncü taraf
          ödeme kuruluşları (ör. iyzico, Stripe vb.) tarafından işlenir.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>
          4. Kişisel Verilerin İşlenme Amaçları
        </h2>
        <p style={paragraphStyle}>
          Toplanan kişisel veriler aşağıdaki amaçlarla işlenebilir:
        </p>
        <ul style={listStyle}>
          <li style={listItemStyle}>
            Kullanıcı üyeliğinin oluşturulması ve yönetilmesi,
          </li>
          <li style={listItemStyle}>
            Rezervasyon ve ödeme işlemlerinin yürütülmesi,
          </li>
          <li style={listItemStyle}>
            Hizmet kalitesinin artırılması ve kullanıcı memnuniyetinin
            ölçülmesi,
          </li>
          <li style={listItemStyle}>
            Letişim destek hizmetlerinin sağlanması,
          </li>
          <li style={listItemStyle}>
            Yasal yükümlülüklerin yerine getirilmesi,
          </li>
          <li style={listItemStyle}>
            Kullanıcılara promosyon, kampanya ve bilgilendirme mesajlarının
            gönderilmesi (isteğe bağlı onayla).
          </li>
        </ul>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>5. Kişisel Verilerin Aktarılması</h2>
        <p style={paragraphStyle}>
          Kişisel veriler, yalnızca aşağıdaki durumlarda üçüncü kişilere
          aktarılabilir:
        </p>
        <ul style={listStyle}>
          <li style={listItemStyle}>
            Yasal yükümlülüklerin yerine getirilmesi için kamu kurum ve
            kuruluşlarına,
          </li>
          <li style={listItemStyle}>
            Ödeme işlemleri için sözleşmeli ödeme kuruluşlarına,
          </li>
          <li style={listItemStyle}>
            Hizmetin sağlanması amacıyla iş ortaklarına (ör. eğitmenler),
          </li>
          <li style={listItemStyle}>
            Teknik altyapı desteği sunan tedarikçilere (ör. bulut hizmeti
            sağlayıcıları).
          </li>
        </ul>
        <p style={paragraphStyle}>
          Bu aktarımlar, KVKK’nın 8. ve 9. maddelerine uygun şekilde
          gerçekleştirilir.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>6. Kişisel Verilerin Saklanma Süresi</h2>
        <p style={paragraphStyle}>
          Kişisel veriler, işlenme amaçlarının gerektirdiği süre boyunca ve
          ilgili mevzuatta öngörülen yasal saklama süreleri kadar muhafaza
          edilir.
        </p>
        <p style={paragraphStyle}>
          Bu sürelerin bitiminde veriler güvenli şekilde silinir, anonim hale
          getirilir veya imha edilir.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>7. Kullanıcı Hakları (KVKK Madde 11)</h2>
        <p style={paragraphStyle}>Kullanıcılar aşağıdaki haklara sahiptir:</p>
        <ul style={listStyle}>
          <li style={listItemStyle}>
            Kişisel verilerinin işlenip işlenmediğini öğrenme,
          </li>
          <li style={listItemStyle}>
            İşlenmişse buna ilişkin bilgi talep etme,
          </li>
          <li style={listItemStyle}>
            İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme,
          </li>
          <li style={listItemStyle}>
            Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,
          </li>
          <li style={listItemStyle}>
            Verilerin eksik veya yanlış işlenmiş olması hâlinde düzeltilmesini
            isteme,
          </li>
          <li style={listItemStyle}>
            KVKK’ya aykırı işlenmişse silinmesini veya yok edilmesini talep
            etme,
          </li>
          <li style={listItemStyle}>
            İşlemlerin üçüncü kişilere bildirilmesini isteme,
          </li>
          <li style={listItemStyle}>
            Münhasıran otomatik sistemler aracılığıyla analiz sonucu aleyhine
            bir sonucun ortaya çıkmasına itiraz etme,
          </li>
          <li style={listItemStyle}>
            Zarara uğraması hâlinde zararın giderilmesini talep etme.
          </li>
        </ul>
        <p style={paragraphStyle}>
          Bu haklar,{" "}
          <a href="mailto:destek@englishpoint.com.tr" style={linkStyle}>
            destek@englishpoint.com.tr
          </a>{" "}
          adresine yazılı olarak veya kayıtlı elektronik posta (KEP) yoluyla
          iletilebilir.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>8. Çerez (Cookie) Kullanımı</h2>
        <p style={paragraphStyle}>
          English Point, kullanıcı deneyimini geliştirmek, istatistiksel analiz
          yapmak ve içerik önerilerinde bulunmak için çerezlerden yararlanır.
        </p>
        <p style={paragraphStyle}>
          Kullanıcılar, tarayıcı ayarlarından çerez tercihlerini değiştirebilir
          veya çerezleri tamamen devre dışı bırakabilir.
        </p>
        <p style={paragraphStyle}>
          Çerezlerle ilgili ayrıntılı bilgi için “Çerez Politikası” sayfası
          hazırlanacaktır.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>9. Veri Güvenliği</h2>
        <p style={paragraphStyle}>
          English Point, kişisel verilerin gizliliğini ve bütünlüğünü korumak
          için gerekli tüm teknik ve idari önlemleri alır.
        </p>
        <p style={paragraphStyle}>
          Veri tabanına erişim, yalnızca yetkili personelle sınırlıdır.
        </p>
        <p style={paragraphStyle}>
          Bununla birlikte, internet üzerinden yapılan veri iletiminde %100
          güvenlik garanti edilemeyeceğini kullanıcı kabul eder.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>10. Değişiklikler</h2>
        <p style={paragraphStyle}>
          EnglishPoint, işbu Gizlilik Politikası’nı gerekli gördüğü zamanlarda
          güncelleyebilir.
        </p>
        <p style={paragraphStyle}>
          Güncellemeler, web sitesinde yayımlandığı tarihte yürürlüğe girer.
        </p>
        <p style={paragraphStyle}>
          Kullanıcıların bu sayfayı düzenli olarak kontrol etmeleri önerilir.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>11. İletişim</h2>
        <p style={paragraphStyle}>
          Bu politika ile ilgili her türlü soru, öneri veya talep için:
        </p>
        <address style={addressStyle}>
          <p style={{ margin: "5px 0" }}>
            📩 E-posta:{" "}
            <a href="mailto:destek@englishpoint.com.tr" style={linkStyle}>
              destek@englishpoint.com.tr
            </a>
          </p>
          <p style={{ margin: "5px 0" }}>
            📞 Telefon:{" "}
            <a href="tel:905454308089" rel="noopener noreferrer">
              0545 430 80 89
            </a>
          </p>
          <p style={{ margin: "5px 0" }}>
            🏢 Adres: Kaptanpaşa Mah, Piyalepaşa Blv. Famas Plaza No:77 B Blok
            K:4 No:71, 34384 Şişli/İstanbul
          </p>
        </address>
      </section>

      <p style={{ marginTop: "30px", fontSize: "0.9rem", color: "#666" }}>
        <i>
          Bu metin, English Point platformu aracılığıyla kişisel verilerin nasıl
          toplandığını, kullanıldığını ve korunduğunu açıklamakta olup,
          kullanıcı onayıyla birlikte yürürlüğe girer.
        </i>
      </p>
    </div>
  );
}

export default page;
