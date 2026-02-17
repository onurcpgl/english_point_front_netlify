"use client";
import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContractModal({ isOpen, onClose, onConfirm }) {
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    const node = scrollRef.current;
    if (node) {
      // scrollHeight: Toplam yükseklik
      // scrollTop: Yukarıdan olan mesafe
      // clientHeight: Görünen alanın yüksekliği
      const isBottom =
        node.scrollHeight - node.scrollTop <= node.clientHeight + 40;
      if (isBottom) setHasReadToBottom(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-black">
                Kullanıcı Sözleşmesi
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="p-8 overflow-y-auto text-sm text-gray-700 leading-relaxed bg-white custom-scrollbar select-none"
            >
              <h1 className="text-center font-extrabold text-xl mb-6 text-black uppercase tracking-tight">
                Kullanıcı Sözleşmesi
              </h1>

              <div className="space-y-6">
                <section>
                  <h3 className="font-bold text-black text-base mb-2">
                    1. Taraflar
                  </h3>
                  <p>
                    İşbu Kullanıcı Sözleşmesi (“Sözleşme”); bir tarafta{" "}
                    <strong>
                      English Point Eğitim ve Teknoloji Limited Şirketi
                    </strong>{" "}
                    ile, diğer tarafta www.englishpoint.com.tr internet sitesi
                    veya English Point mobil uygulaması üzerinden hizmet alan
                    kullanıcı (“Kullanıcı”) arasında akdedilmiştir.
                  </p>
                  <p className="mt-2">
                    Kullanıcı, platforma kaydolarak veya platformu kullanarak,
                    işbu sözleşmenin tamamını okuduğunu, anladığını ve
                    hükümlerini kabul ettiğini beyan eder.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-black text-base mb-2">
                    2. Sözleşmenin Konusu
                  </h3>
                  <p>
                    Bu sözleşmenin konusu, English Point tarafından işletilen
                    dijital platform aracılığıyla Kullanıcılara sunulan yüz yüze
                    İngilizce konuşma seansları ve ücretli içerik hizmetlerinin
                    koşullarının düzenlenmesidir.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-black text-base mb-2">
                    3. Hizmetin Tanımı
                  </h3>
                  <p>
                    English Point, anadili İngilizce olan eğitmenler ve
                    İngilizce öğretmenleri (Türk) aracılığıyla birebir veya grup
                    halinde konuşma pratik seansları düzenler. Tüm seanslar
                    English Point markası altında yürütülür; eğitmenler English
                    Point adına hizmet verir.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-black text-base mb-2">
                    4. Kayıt ve Üyelik
                  </h3>
                  <p>
                    Platforma kayıt işlemi tamamlandığında, kullanıcıya özel bir
                    hesap oluşturulur. Kullanıcı, üyelik bilgilerini doğru ve
                    güncel tutmakla yükümlüdür. 18 yaşından küçük kişiler, yasal
                    veli onayı olmaksızın üye olamaz.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-black text-base mb-2">
                    5. Ücretlendirme ve Ödeme Koşulları
                  </h3>
                  <p>
                    Tüm ödemeler English Point ödeme altyapısı üzerinden tahsil
                    edilir. Ödemesi tamamlanmayan rezervasyonlar geçerli
                    değildir. English Point, hizmet bedellerini ve kampanya
                    koşullarını önceden bildirmek kaydıyla değiştirme hakkını
                    saklı tutar.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-black text-base mb-2">
                    6. İptal ve İade Koşulları
                  </h3>
                  <p>
                    Kullanıcı, planlanan seans saatinden en az 12 saat önce
                    iptal talebinde bulunabilir. 12 saatten az süre kala yapılan
                    iptallerde ücret iadesi yapılmaz.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-black text-base mb-2">
                    7. Hizmetin Kullanımı ve Sorumluluklar
                  </h3>
                  <p>
                    Kullanıcı, hizmeti yalnızca English Point platformu
                    üzerinden almayı kabul eder. Kullanıcı ile eğitmen arasında
                    English Point dışı iletişim, seans planlama veya ödeme
                    girişimleri yasaktır. Bu tür bir durum tespit edildiğinde
                    hesap askıya alınabilir.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-black text-base mb-2">
                    8. Fikri Mülkiyet Hakları
                  </h3>
                  <p>
                    Platformda yer alan tüm görseller, yazılar, içerikler ve
                    materyaller English Point’e aittir. İzinsiz kopyalanamaz
                    veya ticari amaçla kullanılamaz.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-black text-base mb-2">
                    9. Gizlilik ve Veri Koruma
                  </h3>
                  <p>
                    Kullanıcı bilgileri, 6698 sayılı Kişisel Verilerin Korunması
                    Kanunu (KVKK) ve ilgili mevzuata uygun şekilde işlenir.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-black text-base mb-2">
                    10. Sözleşmenin Feshi
                  </h3>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Yanıltıcı bilgi verilmesi,</li>
                    <li>Platform dışı ödeme veya seans girişimi,</li>
                    <li>
                      Hizmetin kötüye kullanılması veya ahlaka aykırı davranış.
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-black text-base mb-2">
                    11. Uygulanacak Hukuk ve Yetkili Mahkeme
                  </h3>
                  <p>
                    İşbu sözleşme Türkiye Cumhuriyeti kanunlarına tabidir. Her
                    türlü uyuşmazlıkta İstanbul Merkez (Çağlayan) Mahkemeleri ve
                    İcra Daireleri yetkilidir.
                  </p>
                </section>
                <section>
                  <h3 className="font-bold text-black text-base mb-2">
                    12. Uygulanacak Hukuk ve Yetkili Mahkeme
                  </h3>
                  <p>
                    İşbu sözleşme Türkiye Cumhuriyeti kanunlarına tabidir. Her
                    türlü uyuşmazlıkta İstanbul Merkez (Çağlayan) Mahkemeleri ve
                    İcra Daireleri yetkilidir.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-black text-base mb-2">
                    13. Yürürlük
                  </h3>
                  <p>
                    Kullanıcı, platforma kaydolarak işbu sözleşmenin tamamını
                    okuduğunu, anladığını ve kabul ettiğini beyan eder.
                    Sözleşme, kullanıcının elektronik ortamda onay verdiği tarih
                    itibariyle yürürlüğe girer.
                  </p>
                </section>
                <div className="pt-6 border-t border-gray-100">
                  <p className="font-bold text-black">İMZA:</p>
                  <p className="font-semibold text-gray-900">
                    English Point Eğitim ve Teknoloji LTD. ŞTİ.
                  </p>
                  <address className="not-italic text-xs text-gray-600 mt-2">
                    Kaptanpaşa Mah, Piyalepaşa Blv. Famas Plaza No:77 B Blok K:4
                    No:71, 34384 Şişli/İstanbul
                  </address>
                  <p className="text-xs text-gray-400 mt-3 uppercase">
                    KAYIT OLARAK BU METNİ OKUMUŞ VE KABUL ETMİŞ SAYILIRSINIZ.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t bg-gray-50">
              {!hasReadToBottom && (
                <div className="text-xs text-amber-600 mb-3 text-center font-medium animate-pulse">
                  Devam etmek için lütfen metni sonuna kadar kaydırın.
                </div>
              )}
              <button
                onClick={() => {
                  onConfirm();
                  setHasReadToBottom(false);
                }}
                disabled={!hasReadToBottom}
                className={`w-full py-4 px-6 font-bold rounded-lg transition-all duration-300 ${
                  hasReadToBottom
                    ? "bg-black text-white hover:bg-gray-800 shadow-lg active:scale-95"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Okudum, Onaylıyorum
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
