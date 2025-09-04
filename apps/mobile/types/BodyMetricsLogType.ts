export interface BodyMetricsLogType {
  id: {
    userId: string;
    date: string; // ISO date string
  };
  
  user?: {
    id: string;
    email: string;
    // Add other user fields as needed
  };

  // Photos
  frontPhotoUrl?: string | null;
  sidePhotoUrl?: string | null;

  // Basic body metrics
  weight?: number | null;
  bodyFat?: number | null;
  shouldersCircumference?: number | null;
  neckCircumference?: number | null;
  waistCircumference?: number | null;
  chestCircumference?: number | null;
  hipCircumference?: number | null;
  leftBicepCircumference?: number | null;
  rightBicepCircumference?: number | null;
  rightCalfCircumference?: number | null;
  leftCalfCircumference?: number | null;
  leftThighCircumference?: number | null;
  rightThighCircumference?: number | null;
}