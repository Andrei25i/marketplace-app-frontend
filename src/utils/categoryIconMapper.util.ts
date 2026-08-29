import {
  IconBallBasketball,
  IconBook,
  IconBuilding,
  IconCar,
  IconCarDoor,
  IconDevices,
  IconDots,
  IconHanger,
  IconHome2,
  IconHorseToy,
  IconTool,
} from "@tabler/icons-react";

export const categoryIconMapper: Record<string, React.ElementType> = {
  "Electronice": IconDevices,
  "Auto, Moto și Ambarcațiuni": IconCar,
  "Casă și Gradină": IconHome2,
  "Sport și Timp Liber": IconBallBasketball,
  "Modă și Frumusețe": IconHanger,
  "Cărți și Reviste": IconBook,
  "Imobiliare": IconBuilding,
  "Piese auto": IconCarDoor,
  "Jucării": IconHorseToy,
  "Servicii": IconTool,
  "Diverse": IconDots,
};

export const getCategoryIcon = (categoryName: string): React.ElementType =>
  categoryIconMapper[categoryName] ?? IconDots;
