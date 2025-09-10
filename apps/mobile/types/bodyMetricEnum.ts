// Its best that these values probably are chosen in the settings or are not hardcoded, but this will do for now
export enum BodyMetricEnum {
  // Basic body metrics
  WEIGHT = "weight",
  BODY_FAT = "bodyFat",
  MUSCLE_GAIN_LOSS = "muscleGainLoss",
  FAT_GAIN_LOSS = "fatGainLoss",

  // Circumference measurements
  SHOULDERS = "shouldersCircumference",
  CHEST = "chestCircumference",
  WAIST = "waistCircumference",
  HIPS = "hipCircumference",
  NECK = "neckCircumference",

  // Arm measurements
  LEFT_BICEP = "leftBicepCircumference",
  RIGHT_BICEP = "rightBicepCircumference",

  // Leg measurements
  LEFT_THIGH = "leftThighCircumference",
  RIGHT_THIGH = "rightThighCircumference",
  LEFT_CALF = "leftCalfCircumference",
  RIGHT_CALF = "rightCalfCircumference",

  // Additional metrics
  FOOD_EXPENSES = "foodExpenses",
  SLEEP = "sleep",
}
