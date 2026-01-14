import React from "react";

function page() {
  // --- STİLLER ---
  // Diğer sayfalarla tutarlılık için aynı temel stiller kullanılmıştır.
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

  // Kritik alt başlıklar için özel stil (Örn: 3.a maddesi)
  const criticalSubHeaderStyle = {
    marginTop: "25px",
    marginBottom: "15px",
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#d9534f", // Vurgu için hafif kırmızı ton
    borderBottom: "1px solid #f2dede",
    paddingBottom: "5px",
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

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>
        MENTOR AGREEMENT AND DATA PROTECTION NOTICE (KVKK)
      </h1>

      <section>
        <h2 style={sectionHeaderStyle}>1. Parties and Introduction</h2>
        <p style={paragraphStyle}>
          This agreement is made between English Point Eğitim ve Teknoloji LTD.
          ŞTİ. (“EnglishPoint” or “the Company”) and the teacher participating
          in the platform as a mentor (“the Mentor”).
        </p>
        <p style={paragraphStyle}>
          By registering on the platform or starting to provide lessons through
          it, the Mentor declares that they have read, understood, and accepted
          this Agreement.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>2. Purpose of the Agreement</h2>
        <p style={paragraphStyle}>
          This Agreement sets forth the rights and obligations of mentors who
          conduct individual or group English conversation sessions through the
          EnglishPoint platform.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>3. Mentor’s Rights and Obligations</h2>
        <p style={paragraphStyle}>
          The Mentor is responsible for announcing and managing their sessions
          through the platform.
        </p>
        <p style={paragraphStyle}>
          The Mentor must adhere to scheduled session times, ensure user
          satisfaction, and comply with all platform rules.
        </p>
        <p style={paragraphStyle}>
          Making reservations or accepting payments outside the platform is
          strictly prohibited. The Mentor is solely responsible for any
          consequences arising from such actions.
        </p>
        <p style={paragraphStyle}>
          The Mentor receives payments only through the platform, and payments
          are processed in accordance with the platform’s payment policies.
        </p>
        <p style={paragraphStyle}>
          The Mentor’s personal data are processed under the Law on the
          Protection of Personal Data (KVKK) and used solely for
          platform-related purposes.
        </p>
        <p style={paragraphStyle}>
          The Mentor is responsible for managing cancellations and schedule
          changes in compliance with platform policies.
        </p>
        <ul style={listStyle}>
          <li style={listItemStyle}>
            a. The Mentor may cancel a scheduled session up to 12 hours before
            the session start time.
          </li>
          <li style={listItemStyle}>
            b. Repeated or unjustified cancellations may result in certain
            sanctions or restrictions within the platform.
          </li>
        </ul>

        {/* Alt Bölüm 3.a - Vurgulu Başlık */}
        <h3 style={criticalSubHeaderStyle}>
          3.a. Prohibition of Off-Platform Activities and Sanctions
        </h3>
        <p style={paragraphStyle}>
          The Mentor shall not engage with, contact, or provide lessons to any
          student introduced through the platform outside of EnglishPoint,
          whether online or in person, nor accept any payment outside the
          platform.
        </p>
        <p style={paragraphStyle}>
          If such conduct is detected, the Mentor’s contract shall be
          immediately terminated, and all rights related to the platform shall
          be revoked.
        </p>
        <p style={paragraphStyle}>
          The Mentor shall be liable for any financial losses or damages
          incurred by the platform as a result of off-platform activities.
        </p>
        <p style={paragraphStyle}>
          Under applicable laws, any legal responsibility arising from such
          off-platform activities shall rest solely with the Mentor.
        </p>
        <p style={paragraphStyle}>
          EnglishPoint reserves the right to impose monetary penalties, seek
          compensation, and pursue any other legal remedies in case of such
          violations.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>4. Payment</h2>
        <p style={paragraphStyle}>
          The Mentor’s earnings are calculated dynamically based on the number
          of students participating in the session, as specified on the
          platform.
        </p>
        <p style={paragraphStyle}>
          Payments are transferred to the Mentor’s account by the platform after
          the completion of the session.
        </p>
        <p style={paragraphStyle}>
          In cases where a session is canceled by the user or cannot be held due
          to technical reasons, refund and payment procedures are carried out in
          accordance with the platform’s Cancellation & Refund Policy.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>5. Intellectual Property</h2>
        <p style={paragraphStyle}>
          Any content or materials uploaded by the Mentor to the platform may be
          used by EnglishPoint for educational purposes.
        </p>
        <p style={paragraphStyle}>
          The Mentor declares that they own the copyrights of the uploaded
          materials or have obtained the necessary permissions.
        </p>
        <p style={paragraphStyle}>
          Unauthorized distribution, copying, or reproduction of the content is
          strictly prohibited.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>6. Termination of Agreement</h2>
        <p style={paragraphStyle}>
          The Company may unilaterally terminate this Agreement if the Mentor
          violates any platform rules.
        </p>
        <p style={paragraphStyle}>
          The Mentor may also terminate this Agreement by providing written
          notice; however, user rights for sessions already scheduled but not
          yet completed must be preserved.
        </p>
      </section>

      <section>
        <h2 style={sectionHeaderStyle}>8. Governing Law and Jurisdiction</h2>
        <p style={paragraphStyle}>
          This Agreement is governed by the laws of the Republic of Turkey.
        </p>
        <p style={paragraphStyle}>
          In the event of any disputes, the Istanbul Central (Çağlayan) Courts
          and Execution Offices shall have exclusive jurisdiction.
        </p>
      </section>
    </div>
  );
}

export default page;
