// categories.ts
export interface Category {
  name: string;
  icon: string; // you can change this later if you switch to vector icons
}

export const categories: Category[] = [
  { name: "Health", icon: "💚" },
  { name: "Sports", icon: "🏃" },
  { name: "Nutrition", icon: "🥗" },
  { name: "Studying", icon: "📚" },
  { name: "Work", icon: "💼" },
  { name: "Social", icon: "🫂" },
  { name: "Finance", icon: "💰" },
  { name: "Development", icon: "🌟" },
  { name: "Environment", icon: "🏠" },
  { name: "Quit Bad Habits", icon: "🚫" },
];
