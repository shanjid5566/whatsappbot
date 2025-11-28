export const formatDate = (rawDate) => {
  if (!rawDate) return "-";
  try {
    const d = new Date(rawDate);
    if (isNaN(d)) return "-";
    const pad = (n) => String(n).padStart(2, "0");
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "-";
  }
};

export const formatCurrency = (cents) => {
  if (cents === null || cents === undefined) return "-";
  try {
    const amount = Number(cents);
    return amount.toLocaleString();
  } catch {
    return String(cents);
  }
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "APPROVED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
