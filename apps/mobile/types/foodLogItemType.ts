export interface FoodLogItemType {
    id: string;             // Java UUID → string
    mealType: MealType;     // enum mapping
  
    foodLogEntity: any;     // reference to another entity; use proper DTO if needed
  
    foodName: string;
    brandName: string;
  
    calories: number | null;
    protein: number | null;
    carbs: number | null;
    fat: number | null;
  
    time: string;           // LocalTime → ISO string like "12:30:00" or use Date if needed
  
    servingSize: string;
    servings: number | null;
}

export enum MealType {
    BREAKFAST = "BREAKFAST",
    LUNCH = "LUNCH",
    DINNER = "DINNER",
    SNACK = "SNACK",
  }