export const generateInvoiceId = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetters = Array(2)
    .fill(null)
    .map(() => letters.charAt(Math.floor(Math.random() * letters.length)))
    .join('');
  const number = Math.floor(Math.random() * 9999) + 1;
  const paddedNumber = number.toString().padStart(4, '0');
  return `${randomLetters}${paddedNumber}`;
};
