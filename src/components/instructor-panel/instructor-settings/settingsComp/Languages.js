import { Formik, Form, Field, FieldArray } from "formik";
import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import instructorPanelService from "../../../../utils/axios/instructorPanelService";
import { useQuery } from "@tanstack/react-query";
async function fetchCountries() {
  const res = await fetch("/countries.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Countries fetch failed");
  return res.json();
}
function Languages() {
  const [initialValues, setInitialValues] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [languages, setLanguages] = useState([]);
  const {
    data: countries,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await instructorPanelService.getLanguageInfo();

        const languagesArray = res?.languages ?? [];
        setLanguages(languagesArray);

        setInitialValues({
          languages: languagesArray.map((lang) => ({
            id: lang.id,
            language: lang.language ?? "",
            level: lang.level ?? "",
          })),
        });
      } catch (err) {
        console.error("Error fetching languages info", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    try {
      // Tüm dilleri kaydetmek için
      for (const lang of values.languages) {
        if (lang.id) {
          // Mevcut dili güncelle - ID'yi endpoint'e ekliyoruz
          const updateData = { ...lang };
          await instructorPanelService.getLanguageUpdate(updateData);
        } else {
          // Yeni dil oluştur
          await instructorPanelService.postLanguageInfo(lang);
        }
      }

      alert("Language Information saved successfully!");

      // Verileri tekrar çek
      const res = await instructorPanelService.getLanguageInfo();
      const languagesArray = res?.languages ?? [];
      setLanguages(languagesArray);
    } catch (err) {
      console.error("Error saving languages info", err);
      alert("Failed to save language information.");
    }
  };

  const handleAddLanguage = (push) => {
    const newIndex = languages.length;
    push({
      language: "",
      level: "",
    });
    setEditingIndex(newIndex);
    setExpandedIndex(newIndex);
  };

  const handleDeleteLanguage = async (remove, index, languageId) => {
    if (!window.confirm("Bu dili silmek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      // NOT: Silme API'niz yok, bu yüzden sadece frontend'den kaldırıyoruz
      remove(index);
      if (editingIndex === index) setEditingIndex(null);
      if (expandedIndex === index) setExpandedIndex(null);

      alert("Language deleted successfully!");
    } catch (err) {
      console.error("Error deleting language:", err);
      alert("Failed to delete language.");
    }
  };

  const toggleExpand = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
      setEditingIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setExpandedIndex(index);
  };

  const handleSingleSave = async (values, index) => {
    try {
      const lang = values.languages[index];

      if (lang.id) {
        // Mevcut dili güncelle
        await instructorPanelService.getLanguageUpdate(lang);
      } else {
        // Yeni dil oluştur
        await instructorPanelService.postLanguageInfo(lang);
      }

      alert("Language saved successfully!");
      setEditingIndex(null);

      // Verileri tekrar çek
      const res = await instructorPanelService.getLanguageInfo();
      const languagesArray = res?.languages ?? [];
      setLanguages(languagesArray);
    } catch (err) {
      console.error("Error saving language:", err);
      alert("Failed to save language.");
    }
  };

  const levelOptions = [
    { value: "Beginner", label: "Beginner" },
    { value: "Elementary", label: "Elementary" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Upper Intermediate", label: "Upper Intermediate" },
    { value: "Advanced", label: "Advanced" },
    { value: "Proficient", label: "Proficient" },
    { value: "Native", label: "Native" },
  ];

  if (!initialValues)
    return <p className="p-10 text-black">Loading languages info...</p>;

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form className="flex flex-col gap-6 p-6">
          <h2 className="text-black font-semibold text-xl">Languages</h2>
          <p className="text-gray-600 text-sm">
            Add the languages you speak and your proficiency level to attract
            more students.
          </p>

          <FieldArray name="languages">
            {({ push, remove }) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {values.languages.map((lang, index) => (
                  <div
                    key={index}
                    className="border rounded-lg shadow bg-white overflow-hidden"
                  >
                    <div
                      className={`p-4 cursor-pointer transition-all duration-300 ${
                        expandedIndex === index
                          ? "bg-gray-50"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => toggleExpand(index)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="font-semibold text-black truncate">
                            {lang.language || "Language"}
                          </h3>
                          <p className="text-sm text-black truncate">
                            {lang.level || "Level"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(index);
                            }}
                            className="text-gray-400 hover:text-black p-1"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLanguage(remove, index, lang.id);
                            }}
                            className="text-gray-400 hover:text-red-600 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                          {expandedIndex === index ? (
                            <ChevronUp
                              size={16}
                              className="text-gray-400 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(index);
                              }}
                            />
                          ) : (
                            <ChevronDown
                              size={16}
                              className="text-gray-400 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(index);
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {expandedIndex === index && (
                      <div className="p-4 border-t">
                        <div className="space-y-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-black text-sm font-medium">
                              Language
                            </label>
                            <Field
                              name={`languages[${index}].language`}
                              placeholder="e.g., English, Spanish, French"
                              disabled={editingIndex !== index}
                              className={`w-full h-14 px-4 placeholder:text-[#8e8e8e] bg-white font-light text-black shadow outline-0 rounded ${
                                editingIndex !== index
                                  ? "cursor-default opacity-70"
                                  : ""
                              }`}
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-black text-sm font-medium">
                              Proficiency Level
                            </label>
                            <Field
                              as="select"
                              name={`languages[${index}].level`}
                              disabled={editingIndex !== index}
                              className={`w-full h-14 px-4 bg-white font-light text-black shadow outline-0 rounded ${
                                editingIndex !== index
                                  ? "cursor-default opacity-70"
                                  : "cursor-pointer"
                              }`}
                            >
                              <option value="">Select level</option>
                              {levelOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Field>
                          </div>

                          {/* Save Butonu */}
                          {editingIndex === index && (
                            <div className="flex justify-end gap-3 pt-3 border-t">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingIndex(null);
                                  setExpandedIndex(null);
                                }}
                                className="px-6 py-3 text-black hover:text-gray-800 border border-gray-300 rounded-full hover:bg-gray-50 text-sm"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSingleSave(values, index)}
                                className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 text-sm"
                              >
                                Save
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Yeni Dil Ekle Butonu */}
                <button
                  type="button"
                  onClick={() => handleAddLanguage(push)}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <Plus size={24} className="text-gray-400" />
                  <span className="text-blue-600 font-medium">
                    Add New Language
                  </span>
                </button>
              </div>
            )}
          </FieldArray>

          {/* Ana Save Butonu - Gerekirse açabilirsiniz */}
          {/* <div className="flex justify-end mt-6">
            <button type="submit" className="bg-black text-white px-8 py-3 rounded-full text-sm hover:bg-gray-800">
              Save All Languages
            </button>
          </div> */}
        </Form>
      )}
    </Formik>
  );
}
export default Languages;
