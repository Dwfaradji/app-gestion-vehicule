const formatDateForInput = (date?: string | Date) => {
  let d: Date;
  if (date) {
    d = new Date(date);
    if (isNaN(d.getTime())) d = new Date(); // date invalide → date du jour
  } else {
    d = new Date(); // par défaut date du jour
  }
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default formatDateForInput;
