export function formatPhone(value) {
  // Sadece rakamları al
  const digits = value.replace(/\D/g, "");

  // Maksimum 11 rakam al (Türkiye formatı)
  const sliced = digits.slice(0, 11);

  // Boşluk ekleyerek formatla
  let formatted = "";
  if (sliced.length > 0) formatted += sliced.slice(0, 1); // 0
  if (sliced.length > 1) formatted += " " + sliced.slice(1, 4); // 536
  if (sliced.length > 4) formatted += " " + sliced.slice(4, 7); // 716
  if (sliced.length > 7) formatted += " " + sliced.slice(7, 9); // 15
  if (sliced.length > 9) formatted += " " + sliced.slice(9, 11); // 58

  return formatted;
}

export function formatDate(dateString, type = "long") {
  const dateObj = new Date(dateString);
  if (type === "short") return dateObj.toLocaleDateString("tr-TR");
  return dateObj.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(dateString) {
  const dateObj = new Date(dateString);
  return dateObj.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
export function enFormatDate(dateString, type = "long") {
  const dateObj = new Date(dateString);
  // short örneği: 11/27/2025
  if (type === "short") return dateObj.toLocaleDateString("en-US");

  // long örneği: November 27, 2025
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function enFormatTime(dateString) {
  const dateObj = new Date(dateString);
  // İngilizcede saat genellikle AM/PM (ÖS/ÖÖ) olarak gösterilir.
  // Örnek: 02:30 PM
  return dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    // Eğer 24 saat formatı (14:30 gibi) istersen alt satırı açabilirsin:
    // hour12: false,
  });
}

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncateText(text, maxLength = 50) {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}
