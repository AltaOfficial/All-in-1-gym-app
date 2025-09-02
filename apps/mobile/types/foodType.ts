export interface FoodType {
  id?: string;
  userCreatedById?: string;
  foodName: string;
  foodBrandName?: string;
  foodBrandOwner?: string;

  // Nutritional values
  calories?: number;
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

  // Serving information
  servingSize?: number;
  servingUnit?: string;
  householdServingText?: string;
}
