import {
  IconBallBasketball,
  IconBook,
  IconBuilding,
  IconCar,
  IconDevices,
  IconDots,
  IconHanger,
  IconHome,
  IconPuzzle,
  IconTool,
} from "@tabler/icons-react";

export const categoryIconMapper: Record<string, React.ElementType> = {
  "Electronice": IconDevices,
  "Auto, Moto și Ambarcațiuni": IconCar,
  "Casă și Gradină": IconHome,
  "Sport și Timp Liber": IconBallBasketball,
  "Modă și Frumusețe": IconHanger,
  "Cărți și Reviste": IconBook,
  "Imobiliare": IconBuilding,
  "Piese auto": IconCar,
  "Jucării": IconPuzzle,
  "Servicii": IconTool,
  "Diverse": IconDots,
};

export const getCategoryIcon = (categoryName: string): React.ElementType =>
  categoryIconMapper[categoryName] ?? IconDots;
