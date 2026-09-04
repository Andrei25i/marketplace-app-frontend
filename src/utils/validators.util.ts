export const isValidPhone = (value: string) => {
  const regex = /^\+?\d*$/;

  return regex.test(value) && value.length <= 15;
};

export const normalizeEmail = (value: string) => {
  return value.trim().toLowerCase();
};

export const normalizeName = (value: string) => {
  return value.trim().replace(/\s+/g, " ");
};

export const normalizePhone = (value: string) => {
  return value.replace(/\s+/g, "").trim();
};

export const normalizeLocation = (value: string) => {
  return value.trim().replace(/\s+/g, " ");
};
