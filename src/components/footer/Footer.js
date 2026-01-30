import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Linkedin,
  Facebook, // Yeni eklenen
  Youtube, // Yeni eklenen
  MessageCircle,
} from "lucide-react";
// Logoyu svg olarak component içinde tuttuğunuz için importu kaldırdım,
// eğer ayrı dosyadaysa importu geri açabilirsiniz.
// import logovector from "../../assets/logo/logovector.svg";

function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-14 px-6">
      <div className="max-w-7xl mx-auto">
        {/* --- ÜST BÖLÜM (Grid Menüler) --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Logo + Slogan */}
          <div className="col-span-2 md:col-span-1">
            {/* Sizin orijinal SVG logonuz */}
            <svg
              width="90"
              height="111"
              viewBox="0 0 90 111"
              xmlns="http://www.w3.org/2000/svg"
              className="logo mb-4"
            >
              <g clipPath="url(#clip0_151_475)">
                <path
                  d="M88.3061 88.3925C89.986 92.8915 85.2441 97.095 80.991 94.8751L63.9338 85.9728L68.038 78.8543L72.1674 81.0096L77.9037 84.0033L75.6789 78.0525L72.8557 70.4979L76.8306 63.6017C77.2942 62.8055 77.7268 61.9923 78.1257 61.1651C80.5303 56.2132 81.7972 50.7435 81.7972 45.0741C81.7972 35.232 77.9712 25.9752 71.0213 19.0115C64.0686 12.0478 54.818 8.21286 44.986 8.21849C35.2325 8.22411 25.8246 12.135 18.9394 19.0509C12.0148 26.009 8.19995 35.2489 8.19995 45.0712C8.19995 54.8936 12.026 64.1729 18.9787 71.1338C25.9286 78.0975 35.1679 81.9296 45 81.9296C46.0141 81.9296 47.0254 81.8902 48.0255 81.8086L43.2358 90.1144C19.2006 89.1831 0 69.3753 0 45.0712C0 20.7672 20.2091 -0.061987 45.118 -8.74559e-05C69.9678 0.0646257 90.1882 20.5309 89.9972 45.4201C89.927 54.9442 86.9071 63.7621 81.8029 71.01L88.3033 88.3925H88.3061Z"
                  fill="white"
                />
                <path
                  id="drop"
                  d="M45 11.9635C70.3696 11.9635 86.2273 39.4722 73.5411 61.4832L45 111L34.9348 93.5415C38.1822 94.214 41.5503 94.5685 45 94.5685L66.4395 57.3753C68.7487 53.3687 69.8808 49.0723 69.8021 44.6043C69.7291 40.426 68.5661 36.2675 66.4395 32.5789C64.313 28.8874 61.2988 25.8009 57.7227 23.6485C53.8966 21.3469 49.6183 20.1793 45 20.1793C40.3817 20.1793 36.1006 21.3469 32.2745 23.6485C28.6984 25.8009 25.6842 28.8874 23.5577 32.5789C21.4283 36.2675 20.2681 40.426 20.1951 44.6043C20.1164 49.0723 21.2485 53.3687 23.5577 57.3753L34.5836 76.5051C29.7519 74.9069 25.3274 72.1861 21.6278 68.4778C20.8159 67.6675 20.0715 66.8065 19.3748 65.9118C18.3579 64.6063 17.4533 63.2163 16.6246 61.7842L16.4505 61.4803C3.77271 39.4722 19.6304 11.9635 45 11.9635Z"
                  fill="#ffd207"
                />
                <path
                  d="M56.7778 47.8055C58.3131 41.2903 54.2844 34.762 47.7794 33.2243C41.2745 31.6865 34.7565 35.7216 33.2212 42.2369C31.6859 48.7521 35.7146 55.2804 42.2196 56.8181C48.7245 58.3559 55.2424 54.3208 56.7778 47.8055Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_151_475">
                  <rect width="90" height="111" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <p className="text-sm text-gray-400">Become A Native Speaker</p>
          </div>

          {/* Menu Columns */}
          <div>
            <ul className="space-y-2 text-sm">
              <li className="font-semibold text-white mb-2 text-sm">Courses</li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Online Classes
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Business English
              </li>
            </ul>
          </div>

          <div>
            <ul className="space-y-2 text-sm">
              <li className="font-semibold text-white mb-2 text-sm">Support</li>
              <li className="hover:text-white transition-colors cursor-pointer">
                FAQ
              </li>
            </ul>
          </div>

          <div>
            <ul className="space-y-2 text-sm">
              <li className="font-semibold text-white mb-2 text-sm">Company</li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Blog
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Contact
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* --- ORTA BÖLÜM (İletişim & Sosyal Medya) --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Contact */}
          <div className="text-sm text-gray-400 space-y-2">
            <p className="flex items-center gap-2">
              <a
                href="https://wa.me/905454308089"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                0545 430 80 89
              </a>
            </p>
            <p className="flex items-center gap-2">
              <a
                href="tel:+902122810212"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-white" />
                (0212) 281 02 12
              </a>
            </p>
            <p className="flex items-center gap-2">
              <a
                href="mailto:info@englishpoint.com.tr"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-white" />
                info@englishpoint.com.tr
              </a>
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-white mt-1 shrink-0" />
              <span>
                Kaptanpaşa Mah. Piyalepaşa Bulvarı No.77
                <br />
                Famas Plaza B Blok No:71 Şişli / İstanbul
              </span>
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4 md:mt-0">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/englishpointtr/"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-500 rounded-full p-2 hover:border-white hover:text-white transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>

            {/* LinkedIn */}
            <a
              href="https://tr.linkedin.com/company/englishpointtr"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-500 rounded-full p-2 hover:border-white hover:text-white transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            {/* Facebook - YENİ */}
            <a
              href="https://www.facebook.com/profile.php?id=61586792731563"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-500 rounded-full p-2 hover:border-white hover:text-white transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>

            {/* YouTube - YENİ */}
            <a
              href="https://www.youtube.com/@englishpoint-tr"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-500 rounded-full p-2 hover:border-white hover:text-white transition-colors"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Divider (İsteğe bağlı, alt kısmı ayırmak için) */}
        <div className="border-t border-gray-900 my-8"></div>

        {/* --- YENİ EKLENEN YASAL LİNKLER BÖLÜMÜ --- */}
        <div className="flex flex-wrap justify-center items-center text-center gap-y-2 gap-x-4 text-xs text-gray-500 mb-6 px-4">
          {/* NOT: Aşağıdaki 'href' değerlerini projenizdeki gerçek sayfa rotalarıyla değiştirin. */}

          <a
            href="/kullanici-sozlesmesi"
            className="hover:text-gray-300 transition-colors"
          >
            KULLANICI SÖZLEŞMESİ
          </a>
          <span className="hidden md:inline">|</span>
          <a href="/kvkk" className="hover:text-gray-300 transition-colors">
            GİZLİLİK POLİTİKASI ve KVKK AYDINLATMA METNİ (KULLANICI)
          </a>
          <span className="hidden md:inline">|</span>
          <a
            href="/iptal-iade"
            className="hover:text-gray-300 transition-colors"
          >
            İPTAL & İADE ŞARTLARI
          </a>
          <span className="hidden md:inline">|</span>
          {/* Not: Aşağıdaki linkler yukarıdakilerle benzer sayfalar olabilir. Gerekirse aynı adrese yönlendirebilirsiniz. */}
          <a
            href="/sozlesme-seti"
            className="hover:text-gray-300 transition-colors"
          >
            KULLANICI SÖZLEŞMESİ SETİ
          </a>
          <span className="hidden md:inline">|</span>
          <a
            href="/mentor-kvkk"
            className="hover:text-gray-300 transition-colors"
          >
            MENTOR AGREEMENT AND DATA PROTECTION NOTICE (KVKK)
          </a>
        </div>

        {/* --- ALT BÖLÜM (Copyright) --- */}
        <p className="text-center text-xs text-gray-600">
          © {new Date().getFullYear()} English Point. All rights reserved.
          <span className="block mt-1 text-gray-600">
            Design by{" "}
            <a
              href="https://www.socialthinks.com/tr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 underline transition-colors"
            >
              SocialThinks
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
