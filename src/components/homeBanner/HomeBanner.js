import React from "react";
import BannerImage from "../../assets/banner/bannerImage.jpeg";
import Image from "next/image";
const HomeBanner = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16 pt-32">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between gap-12">
          {/* Sol taraf - Metin */}
          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                <span className="text-indigo-600">Eğitmenlerimiz</span> ile
                <br />
                serin bir <span className="text-amber-800">kahve</span> ile
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  İngilizceni geliştir
                </span>
              </h1>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="bg-white border text-gray-700 cursor-pointer px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                <a
                  href="/find-session"
                  className="flex items-center justify-center"
                >
                  ☕ Seviyene uygun eğitimi bul
                </a>
              </button>

              <button className="border-2 cursor-pointer border-indigo-600 text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-200">
                <span className="flex items-center justify-center">
                  📚 Daha Fazla Bilgi
                </span>
              </button>
            </div>

            {/* Stats */}
          </div>

          {/* Sağ taraf - Resim */}
          <div className="flex-1 relative">
            {/* Ana Resim Container */}
            <div className="relative">
              {/* Background Decorations */}
              <div className="absolute -top-6 -right-6 w-72 h-72 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-3xl opacity-50"></div>
              <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl opacity-40"></div>

              {/* Ana Resim */}
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden">
                <Image
                  src={BannerImage}
                  alt="İngilizce eğitmen kahve içerek ders veriyor"
                  className="w-full h- object-cover"
                />

                {/* Overlay Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <Image
                      width={48}
                      height={48}
                      src="https://randomuser.me/api/portraits/women/68.jpg"
                      alt="Eğitmen"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        Sarah Wilson
                      </p>
                      <p className="text-sm text-gray-600">
                        Cambridge Sertifikalı
                      </p>
                    </div>
                    <div className="ml-auto flex items-center space-x-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-sm font-medium text-gray-700">
                        4.9
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-10 -left-4 bg-white rounded-2xl shadow-lg p-3 animate-bounce z-[99999999999]">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">☕</span>
                  <span className="text-sm font-medium text-gray-700">
                    Coffee Time!
                  </span>
                </div>
              </div>

              <div className="absolute -top-2 right-16 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl px-3 py-2 shadow-lg animate-pulse">
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium">🎯 %95 Başarı</span>
                </div>
              </div>

              <div
                className="absolute bottom-20 -right-8 z-[99999] bg-white rounded-2xl shadow-lg p-3 animate-bounce"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center space-x-2 z-50">
                  <span className="text-2xl">💬</span>
                  <span className="text-sm font-medium text-gray-700">
                    Selam!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
