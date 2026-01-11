export const FARM_TYPES = [
  "Livestock",
  "Crops",
  "Poultry",
  "Fishery",
  "Dairy",
  "Organic",
  "Apiculture",
];

export const NIGERIAN_STATES = [
  "Lagos",
  "Kano",
  "Oyo",
  "Rivers",
  "Kaduna",
  "Ogun",
  "Enugu",
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Gombe",
  "Imo",
  "Jigawa",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Nasarawa",
  "Niger",
  "Ondo",
  "Osun",
  "Plateau",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "FCT",
];

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// lib/constants.ts

export const PRODUCE_CATEGORIES = [
  "Livestock",
  "Crops",
  "Poultry",
  "Dairy",
  "Organic",
  "Apiculture",
] as const;

export const UNITS_BY_CATEGORY: Record<string, string[]> = {
  Livestock: ["heads", "kg"],
  Crops: ["kg", "bags", "baskets", "tons", "tubers"],
  Poultry: ["heads", "kg", "crates"],
  Dairy: ["liters", "bottles", "gallons"],
  Organic: ["kg", "bags", "bundles"],
  Apiculture: ["kg", "jars", "liters"],
};
