import type { Ref } from "react";
import type { LocalAdImage } from "@/types/ads.type";
import type { CategoryDTO } from "@/types/category.type";
import type { AdFormErrors } from "@/utils/adForm.util";
import {
  Alert,
  Button,
  Group,
  Input,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconCoin,
  IconDeviceFloppy,
  IconFileText,
  IconPhone,
  IconTag,
} from "@tabler/icons-react";
import SectionTitle from "./SectionTitle";
import ImageSelector from "./ImageSelector";
import LocationSelector from "./LocationSelector";
import AdFormHeader from "./AdFormHeader";

type AdFormProps = {
  formRef: Ref<HTMLFormElement>;
  heading: string;
  subheading: string;
  submitLabel: string;
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  images: LocalAdImage[];
  setImages: (images: LocalAdImage[]) => void;
  price: number | string;
  setPrice: (value: number | string) => void;
  currency: string;
  setCurrency: (value: string) => void;
  phone: string;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  county: string;
  setCounty: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  categoryId: string | null;
  setCategoryId: (value: string | null) => void;
  categories: CategoryDTO[];
  categoriesLoading: boolean;
  categoriesError: string;
  fieldErrors: AdFormErrors;
  generalError: string;
  isSubmitting: boolean;
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  handleCancel: () => void;
};

const AdForm = ({
  formRef,
  heading,
  subheading,
  submitLabel,
  title,
  setTitle,
  description,
  setDescription,
  images,
  setImages,
  price,
  setPrice,
  currency,
  setCurrency,
  phone,
  handlePhoneChange,
  county,
  setCounty,
  city,
  setCity,
  categoryId,
  setCategoryId,
  categories,
  categoriesLoading,
  categoriesError,
  fieldErrors,
  generalError,
  isSubmitting,
  handleSubmit,
  handleCancel,
}: AdFormProps) => {
  return (
    <Stack maw={700} mx="auto" gap="lg">
      <Paper
        ref={formRef}
        component="form"
        onSubmit={handleSubmit}
        noValidate
        p={{ base: "md", sm: "xl" }}
        withBorder
        radius="md"
      >
        <AdFormHeader heading={heading} subheading={subheading} />

        <Stack gap="lg">
          <Stack gap="xs">
            <SectionTitle>Detalii anunț</SectionTitle>

            <TextInput
              label="Titlu"
              placeholder="Denumirea produsului"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              leftSection={<IconFileText size={18} />}
              withAsterisk
              error={fieldErrors.title}
            />

            <Select
              label="Categorie"
              placeholder="Selectează categoria"
              data={categories.map((category) => ({
                value: String(category.id),
                label: category.name,
              }))}
              value={categoryId}
              onChange={setCategoryId}
              searchable
              clearable
              disabled={categoriesLoading}
              error={fieldErrors.category_id ?? (categoriesError || undefined)}
              leftSection={<IconTag size={18} />}
              withAsterisk
            />

            <Textarea
              label="Descriere"
              placeholder="Descrie produsul tău..."
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              minRows={3}
              maxRows={10}
              autosize
              withAsterisk
              error={fieldErrors.description}
            />
          </Stack>

          <Stack gap="xs">
            <SectionTitle>
              Imagini {images.length > 0 ? `(${images.length})` : ""}
            </SectionTitle>
            <Text size="xs" c="dimmed">
              Doar fișiere imagine, maximum 10 imagini, fiecare de cel mult 5MB.
            </Text>
            <ImageSelector images={images} onChange={setImages} />
            {fieldErrors.images && (
              <Input.Error data-form-error>{fieldErrors.images}</Input.Error>
            )}
          </Stack>

          <Stack gap="xs">
            <SectionTitle>Preț</SectionTitle>

            <Group grow align="flex-start">
              <NumberInput
                label="Valoare"
                placeholder="0.00"
                min={1}
                decimalScale={2}
                value={price}
                onChange={setPrice}
                leftSection={<IconCoin size={18} />}
                withAsterisk
                error={fieldErrors.price}
              />

              <Select
                label="Monedă"
                data={["RON", "EUR"]}
                value={currency}
                onChange={(value) => setCurrency(value ?? "RON")}
                allowDeselect={false}
                leftSection={<IconCoin size={18} />}
                withAsterisk
                error={fieldErrors.currency}
              />
            </Group>
          </Stack>

          <Stack gap="xs">
            <SectionTitle>Adresă și contact</SectionTitle>

            <TextInput
              label="Telefon"
              type="tel"
              placeholder="07xxxxxxxx"
              value={phone}
              onChange={handlePhoneChange}
              leftSection={<IconPhone size={18} />}
              withAsterisk
              error={fieldErrors.phone_number}
            />

            <LocationSelector
              selectedCounty={county}
              selectedCity={city}
              onCountyChange={setCounty}
              onCityChange={setCity}
              countyError={fieldErrors.county}
              cityError={fieldErrors.city}
            />
          </Stack>

          {generalError && (
            <Alert
              color="red"
              icon={<IconAlertCircle size={18} />}
              data-form-error
            >
              {generalError}
            </Alert>
          )}

          <Group justify="flex-end" mt="sm">
            <Button
              type="button"
              variant="subtle"
              color="gray"
              disabled={isSubmitting}
              onClick={handleCancel}
            >
              Anulează
            </Button>

            <Button
              type="submit"
              leftSection={<IconDeviceFloppy size={18} />}
              loading={isSubmitting}
            >
              {submitLabel}
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default AdForm;
