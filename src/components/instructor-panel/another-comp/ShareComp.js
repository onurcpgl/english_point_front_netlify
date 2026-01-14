import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share";
import { FiShare2, FiCopy, FiCheck } from "react-icons/fi";
import { useState } from "react";
// X (Twitter) Logosu için Custom SVG Bileşeni - DÜZELTİLMİŞ VERSİYON
const XLogoIcon = ({ size = 48, className }) => (
  <div
    style={{ width: size, height: size }}
    // p-2.5 ekleyerek logonun daire kenarlarına yapışmasını engelledik ama yeterince büyük tuttuk.
    className={`bg-black rounded-full flex items-center justify-center text-white p-2.5 ${className}`}
  >
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      // w-full h-full diyerek padding'in izin verdiği alanı tamamen kaplamasını sağladık.
      className="w-full h-full fill-current"
    >
      {/* BU PATH ORİJİNAL, NET X LOGOSUDUR */}
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  </div>
);

const ShareComp = ({
  isOpen,
  onClose,
  shareUrl,
  title,
  imageUrl,
  description,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FiShare2 className="text-[#fdd207]" /> Share Session
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 p-1 rounded-full hover:bg-gray-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Görsel Önizleme Alanı */}
          {imageUrl && (
            <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative group">
              <img
                src={imageUrl}
                alt="Share Preview"
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white text-sm font-bold line-clamp-1">
                  {title}
                </p>
                {description && (
                  <p className="text-gray-200 text-xs line-clamp-1">
                    {description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Sosyal Medya Butonları */}
          <div className="flex justify-center gap-4 mb-6">
            <WhatsappShareButton
              url={shareUrl}
              title={`${title} - ${description || ""}`}
            >
              <div className="flex flex-col items-center gap-1 group">
                <WhatsappIcon
                  size={50}
                  round
                  className="group-hover:scale-110 transition-transform shadow-lg rounded-full"
                />
                <span className="text-xs text-gray-500 font-medium">
                  WhatsApp
                </span>
              </div>
            </WhatsappShareButton>

            <FacebookShareButton url={shareUrl} quote={title}>
              <div className="flex flex-col items-center gap-1 group">
                <FacebookIcon
                  size={50}
                  round
                  className="group-hover:scale-110 transition-transform shadow-lg rounded-full"
                />
                <span className="text-xs text-gray-500 font-medium">
                  Facebook
                </span>
              </div>
            </FacebookShareButton>

            <TwitterShareButton
              url={shareUrl}
              title={title}
              hashtags={["EnglishPoint", "Speaking"]}
            >
              <div className="flex flex-col items-center gap-1 group">
                {/* Özel X Logosu */}
                <XLogoIcon
                  size={48}
                  className="group-hover:scale-110 transition-transform shadow-lg"
                />
                <span className="text-xs text-gray-500 font-medium group-hover:text-black transition-colors">
                  X
                </span>
              </div>
            </TwitterShareButton>

            <LinkedinShareButton
              url={shareUrl}
              title={title}
              summary={description}
              source="English Point"
            >
              <div className="flex flex-col items-center gap-1 group">
                <LinkedinIcon
                  size={50}
                  round
                  className="group-hover:scale-110 transition-transform shadow-lg rounded-full"
                />
                <span className="text-xs text-gray-500 font-medium">
                  LinkedIn
                </span>
              </div>
            </LinkedinShareButton>
          </div>

          {/* Link Kopyalama */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-xs">URL:</span>
            </div>
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 pr-12 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fdd207]/50 transition-all truncate"
            />
            <button
              onClick={handleCopy}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md transition-all duration-200 ${
                copied
                  ? "bg-green-500 text-white shadow-green-200"
                  : "bg-[#fdd207] text-black hover:bg-[#eec506] shadow-md"
              }`}
              title="Copy Link"
            >
              {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
            </button>
          </div>

          {copied && (
            <p className="text-green-600 text-xs mt-2 text-center font-bold animate-pulse">
              Link panoya kopyalandı!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareComp;
