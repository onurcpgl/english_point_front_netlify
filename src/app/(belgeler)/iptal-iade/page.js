import React from "react";

function page() {
  // --- STİLLER ---
  // Diğer sayfalarla tutarlılık sağlamak için aynı inline stiller kullanılmıştır.
  // Projenizde global CSS varsa, bu stilleri ilgili sınıflarla değiştirebilirsiniz.

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
      <h1 style={headerStyle}>İPTAL & İADE ŞARTLARI</h1>

      <section>
        <h2 style={sectionHeaderStyle}>1. Genel Hükümler</h2>
        <p style={paragraphStyle}>
          İşbu İptal & İade Şartları, English Point Eğitim ve Teknoloji LTD.
          ŞTİ. tarafından sağlanan tüm konuşma seansları ve ücretli içerikler
          için geçerlidir.
        </p>
        <p style={paragraphStyle}>
          Platform üzerinden yapılan rezervasyon ve ödemeler, bu şartlara
          tabidir.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>2. Kullanıcı Tarafından İptal</h2>
        <p style={paragraphStyle}>
          Kullanıcı, planlanan seans saatinden en az 12 saat önce iptal
          talebinde bulunabilir. Bu durumda, ödeme iadesi yapılır veya
          kullanıcıya alternatif seans hakkı sunulur.
        </p>
        <p style={paragraphStyle}>
          12 saatten az süre kala yapılan iptallerde ücret iadesi yapılmaz.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>3. English Point Tarafından İptal</h2>
        <p style={paragraphStyle}>
          Eğitmen veya teknik/operasyonel sebeplerle seans iptal edilirse,
          English Point kullanıcıya:
        </p>
        <ul style={listStyle}>
          <li style={listItemStyle}>Tam iade seçeneği veya</li>
          <li style={listItemStyle}>Alternatif tarih / seans hakkı</li>
        </ul>
        <p style={paragraphStyle}>
          sunar. Bu durumda, kullanıcı herhangi bir ek ücret ödemez.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>4. Ödeme ve İade Süreci</h2>
        <p style={paragraphStyle}>
          İade talepleri, ödeme yapıldığı yöntem üzerinden gerçekleştirilir.
        </p>
        <p style={paragraphStyle}>
          İade işlemleri en geç 7 iş günü içinde tamamlanır.
        </p>
        <p style={paragraphStyle}>
          Ödemelerin üçüncü taraf ödeme sağlayıcıları (iyzico, Stripe vb.)
          üzerinden yapılması durumunda, iade süresi sağlayıcı kaynaklı
          gecikmelerde uzayabilir.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>5. Platform Dışı İşlemler</h2>
        <p style={paragraphStyle}>
          Kullanıcı, seans ve ödeme işlemlerini yalnızca English Point platformu
          üzerinden gerçekleştirmekle yükümlüdür.
        </p>
        <p style={paragraphStyle}>
          Platform dışı rezervasyon veya ödeme talepleri geçersizdir ve iade
          hakkı doğurmaz.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>6. İletişim</h2>
        <p style={paragraphStyle}>İptal ve iade talepleriniz için:</p>
        <address style={addressStyle}>
          <p style={{ margin: "5px 0" }}>
            📩 E-posta:{" "}
            <a href="mailto:destek@englishpoint.com" style={linkStyle}>
              destek@englishpoint.com
            </a>
          </p>
          <p style={{ margin: "5px 0" }}>📞 Telefon: [iletişim numarası]</p>
        </address>
      </section>
    </div>
  );
}

export default page;
