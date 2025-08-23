export default interface User {
  id: string;
  onBoardingStep: number; // set default (1) when constructing the object
  weight?: number | null;
  weightType?: string | null;
  heightInInches?: number | null;
  sexType?: string | null;
  trainingExperience?: string | null;
  mainGoal?: string | null;
  weightChangeAmount?: number | null;
  name?: string | null;
  email?: string | null;
  password?: string | null;
  goalCalories?: number | null;
  goalProtein?: number | null;
  goalCarbohydrates?: number | null;
  goalFat?: number | null;
  goalFiber?: number | null;
  goalSugar?: number | null;
  goalSaturatedFat?: number | null;
  goalPolyunsaturatedFat?: number | null;
  goalMonounsaturatedFat?: number | null;
  goalTransFat?: number | null;
  goalCholesterol?: number | null;
  goalSodium?: number | null;
  goalPotassium?: number | null;
}
