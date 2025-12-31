import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton, // X (Eski Twitter)
  LinkedinShareButton,
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share";
import { FiShare2, FiCopy, FiCheck } from "react-icons/fi"; // Yeni ikonlar
import { useState, useRef } from "react"; // Zaten var ama ShareModal için gerekecek

const ShareComp = ({ isOpen, onClose, shareUrl, title }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Modal içine tıklayınca kapanmasın
      >
        {/* Başlık ve Kapatma */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Share Session</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
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

        {/* Sosyal Medya Butonları */}
        <div className="flex justify-center gap-4 mb-6">
          <WhatsappShareButton url={shareUrl} title={title}>
            <WhatsappIcon
              size={48}
              round
              className="hover:scale-110 transition-transform"
            />
          </WhatsappShareButton>

          <FacebookShareButton url={shareUrl} quote={title}>
            <FacebookIcon
              size={48}
              round
              className="hover:scale-110 transition-transform"
            />
          </FacebookShareButton>

          <TwitterShareButton url={shareUrl} title={title}>
            <TwitterIcon
              size={48}
              round
              className="hover:scale-110 transition-transform"
            />
          </TwitterShareButton>

          <LinkedinShareButton url={shareUrl} title={title}>
            <LinkedinIcon
              size={48}
              round
              className="hover:scale-110 transition-transform"
            />
          </LinkedinShareButton>
        </div>

        {/* Link Kopyalama Alanı */}
        <div className="relative">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            onClick={handleCopy}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-500"
            title="Copy Link"
          >
            {copied ? (
              <FiCheck className="text-green-500" size={18} />
            ) : (
              <FiCopy size={18} />
            )}
          </button>
        </div>

        {copied && (
          <p className="text-green-500 text-xs mt-2 text-center font-medium">
            Link copied to clipboard!
          </p>
        )}
      </div>
    </div>
  );
};

export default ShareComp;
