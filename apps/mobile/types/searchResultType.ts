export interface FoodSearchResult {
  id: string;
  userId: string;
  foodName: string;
  foodBrandName?: string;
  foodBrandOwner?: string;

  // Nutritional values
  calories: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  saturatedFat?: number;
  polyunsaturatedFat?: number;
  monounsaturatedFat?: number;
  transFat?: number;
  cholesterol?: number;
  sodium?: number;
  potassium?: number;

  // Portion information
  portions?: PortionDto[];

  // Serving information
  servingSize?: number;
  servingUnit?: string;
  householdServingText?: string;
}

export interface PortionDto {
  id: string;
  foodId: string;
  name: string;
  weight: number;
  unit: string;
}