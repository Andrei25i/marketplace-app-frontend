export const AD_FORM_FIELDS = [
  "title",
  "category_id",
  "description",
  "images",
  "price",
  "currency",
  "phone_number",
  "county",
  "city",
] as const;

export type AdFormField = (typeof AD_FORM_FIELDS)[number];
export type AdFormErrors = Partial<Record<AdFormField, string>>;

const PHONE_REGEX = /^\+?\d{9,14}$/;
const MAX_AD_PRICE = 99_999_999.99;

type AdFormValues = {
  title: string;
  description: string;
  categoryId: string | null;
  price: number | string;
  phone: string;
  county: string;
  city: string;
  imagesCount: number;
};

export const validateAdForm = (values: AdFormValues): AdFormErrors => {
  const errors: AdFormErrors = {};
  const { title, description, price, phone } = values;

  if (!title) errors.title = "Titlul este obligatoriu.";
  else if (title.length < 3) {
    errors.title = "Titlul trebuie să aibă cel puțin 3 caractere.";
  } else if (title.length > 255) {
    errors.title = "Titlul poate avea maxim 255 de caractere.";
  }

  if (!values.categoryId) errors.category_id = "Selectează o categorie.";

  if (!description) errors.description = "Descrierea este obligatorie.";
  else if (description.length < 10) {
    errors.description = "Descrierea trebuie să aibă cel puțin 10 caractere.";
  } else if (description.length > 5000) {
    errors.description = "Descrierea poate avea maxim 5000 de caractere.";
  }

  if (values.imagesCount === 0) {
    errors.images = "Trebuie să existe cel puțin o imagine.";
  }

  const numericPrice = Number(price);
  if (price === "") errors.price = "Prețul este obligatoriu.";
  else if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    errors.price = "Prețul trebuie să fie mai mare decât 0.";
  } else if (numericPrice > MAX_AD_PRICE) {
    errors.price = "Prețul este prea mare.";
  }

  if (!phone) errors.phone_number = "Numărul de telefon este obligatoriu.";
  else if (!PHONE_REGEX.test(phone)) {
    errors.phone_number =
      "Numărul de telefon nu este valid (9–14 cifre, opțional cu +).";
  }

  if (!values.county) errors.county = "Selectează județul.";
  if (!values.city) errors.city = "Localitatea este obligatorie.";

  return errors;
};
