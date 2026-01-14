import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function EducationCard({ education, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    school_name: education?.school_name || "",
    degree: education?.degree || "",
    years_of_study: education?.years_of_study || "",
    diploma_file: null,
  });
  const [preview, setPreview] = useState(education?.diploma_file_path || "");
  const [showFullImage, setShowFullImage] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, diploma_file: file });
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    onSave(form);
    setIsEditing(false);
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 mt-4 border border-gray-200">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg text-black">
          {education?.school_name || "Yeni Eğitim"}
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-blue-600 text-sm font-medium"
        >
          {isEditing ? "İptal" : education ? "Düzenle" : "Yeni Eğitim Ekle"}
        </button>
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden mt-4"
          >
            <div className="flex flex-col gap-3 text-black">
              <input
                type="text"
                placeholder="School Name"
                className="border rounded-lg px-3 py-2"
                value={form.school_name}
                onChange={(e) =>
                  setForm({ ...form, school_name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Degree"
                className="border rounded-lg px-3 py-2"
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
              />
              <input
                type="text"
                placeholder="Years of Study"
                className="border rounded-lg px-3 py-2"
                value={form.years_of_study}
                onChange={(e) =>
                  setForm({ ...form, years_of_study: e.target.value })
                }
              />

              {/* Diploma Preview */}
              {preview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-700 mb-1 font-medium">
                    Diploma:
                  </p>
                  <Image
                    src={preview}
                    alt="Diploma Preview"
                    className="w-40 h-28 object-cover rounded-lg border cursor-pointer hover:opacity-80"
                    onClick={() => setShowFullImage(true)}
                  />
                  <label className="block text-blue-600 mt-2 text-sm font-medium cursor-pointer">
                    Görseli Değiştir
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}

              {!preview && (
                <label className="block text-blue-600 mt-2 text-sm font-medium cursor-pointer">
                  Diploma Yükle
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}

              <button
                onClick={handleSubmit}
                className="mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Kaydet
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Image Modal */}
      {showFullImage && (
        <div
          onClick={() => setShowFullImage(false)}
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 cursor-pointer"
        >
          <Image
            src={preview}
            alt="Full Diploma"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
