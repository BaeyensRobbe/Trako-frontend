// categories.ts
export interface Category {
  name: string;
  icon: string; // you can change this later if you switch to vector icons
  color: string; // background color for the category
}

export const categories: Category[] = [
  { name: "Quit Bad Habits", icon: require("../assets/categoryIcons/quit.png"), color: "#EF4444" },      // red
  { name: "Power & Mobility", icon: require("../assets/categoryIcons/strength.png"), color: "#F97316" }, // orange
  { name: "Work", icon: require("../assets/categoryIcons/work.png"), color: "#F59E0B" },                 // amber
  { name: "Parkour", icon: require("../assets/categoryIcons/parkour.png"), color: "#EAB308" },           // yellow
  { name: "Health", icon: require("../assets/categoryIcons/health.png"), color: "#84CC16" },             // lime green
  { name: "Food", icon: require("../assets/categoryIcons/food.png"), color: "#22C55E" },                 // green
  { name: "Finance", icon: require("../assets/categoryIcons/finance.png"), color: "#10B981" },           // emerald/teal
  { name: "Social", icon: require("../assets/categoryIcons/social.png"), color: "#06B6D4" },             // cyan
  { name: "Sports", icon: require("../assets/categoryIcons/sports.png"), color: "#3B82F6" },             // blue
  { name: "Studying", icon: require("../assets/categoryIcons/studying.png"), color: "#8B5CF6" },         // violet
];

export function getCategoryIcon(categoryName: string): string {
  const category = categories.find(cat => cat.name === categoryName);
  return category ? category.icon : "❓";
}

export function getCategory(categoryName: string): Category | undefined {
  return categories.find(cat => cat.name === categoryName);
}
