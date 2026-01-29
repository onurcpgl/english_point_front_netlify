import {
  FiFileText,
  FiX,
  FiExternalLink,
  FiMusic,
  FiInfo,
} from "react-icons/fi";

const DocumentPopup = ({ isOpen, onClose, content }) => {
  if (!isOpen || !content) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <FiFileText className="text-green-600 text-xl" />
            </div>
            <div>
              <h3
                lang="en"
                className="text-lg font-bold text-gray-900 leading-none"
              >
                {content.title}
              </h3>
              <p
                lang="en"
                className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold"
              >
                Program Materials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full transition-all hover:rotate-90"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* 1. Açıklama Bölümü */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3">
            <FiInfo className="text-blue-500 mt-1 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-blue-900 mb-1">
                About this content
              </h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                {content.description}
              </p>
            </div>
          </div>

          {/* 2. Ses Dosyası (Voice Path) */}
          {content.voice_path && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <FiMusic className="text-purple-500" /> Audio Lesson
              </h4>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <audio controls className="w-full h-10">
                  <source src={content.voice_path} type="audio/mpeg" />
                  Tarayıcınız ses dosyasını desteklemiyor.
                </audio>
              </div>
            </div>
          )}

          {/* 3. Döküman Önizleme (PDF) */}
          {content.document_path && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <FiFileText className="text-red-500" /> Study Document (PDF)
                </h4>
                <a
                  href={content.document_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
                >
                  <FiExternalLink /> Open in Fullscreen
                </a>
              </div>

              {/* PDF Iframe Preview */}
              <div className="border border-gray-200 rounded-xl overflow-hidden h-[400px] bg-gray-100 shadow-inner">
                <iframe
                  src={`${content.document_path}#toolbar=0`}
                  className="w-full h-full"
                  title="PDF Preview"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-all text-sm font-bold shadow-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentPopup;
