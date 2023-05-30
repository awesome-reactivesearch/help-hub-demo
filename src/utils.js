const getOrdinalSuffix = (number) => {
  const suffixes = ["th", "st", "nd", "rd"];
  const relevantDigits = number % 100;
  const suffix =
    suffixes[(relevantDigits - 20) % 10] ||
    suffixes[relevantDigits] ||
    suffixes[0];
  return suffix;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
};
