export const isValidPhone = (value: string) => {
  const regex = /^\+?\d*$/;

  if (regex.test(value) && value.length <= 15) {
    return true;
  }

  return false;
};
