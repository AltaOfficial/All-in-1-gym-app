# Meal Planner Feature Implementation

## Overview

Build a meal planning system following the existing patterns for grocery lists and recipes. Users can plan meals for specific dates and add them to their food log via checkboxes.

## Backend Changes

### 1. Create MealPlan Entities (Java)

Create new entities similar to `GroceryListEntity`:

- **`MealPlanId`** (Embeddable): `userId`, `date` (single date, not range)
- **`MealPlanEntity`**: Contains list of `MealPlanItemEntity`
- **`MealPlanItemEntity`**: Can reference foods, meals, or recipes with fields:
  - `itemType` enum (FOOD, MEAL, RECIPE)
  - `itemId` (UUID of the referenced item)
  - `itemName`, `calories`, `protein`, `carbs`, `fat`
  - `mealType` enum (BREAKFAST, LUNCH, DINNER, SNACK)
  - `isLogged` boolean (tracks if added to food log)
  - `servingSize`, `servings`

**Files**: `services/backend/src/main/java/com/strive/app/domain/entities/`

### 2. Create MealPlan DTOs

- `MealPlanDto`
- `MealPlanItemDto`
- `MealPlanRequestDto`

**Files**: `services/backend/src/main/java/com/strive/app/domain/dto/`

### 3. Create MealPlan Repository

Interface extending JpaRepository for `MealPlanEntity`

**Files**: `services/backend/src/main/java/com/strive/app/repositories/`

### 4. Create MealPlan Service

Similar to `GroceryListService`:

- `findById(MealPlanId)`
- `save(MealPlanEntity)`
- `addItemToMealPlan()`
- `removeItemFromMealPlan()`
- `toggleItemLogged()` - handles adding/removing from food log

**Files**: `services/backend/src/main/java/com/strive/app/services/`

### 5. Create MealPlan Controller

Endpoints:

- `POST /mealplan` - get meal plan for date
- `POST /mealplan/add` - add item to meal plan
- `POST /mealplan/remove` - remove item from meal plan
- `POST /mealplan/toggle` - toggle item logged status (adds/removes from food log)

**Files**: `services/backend/src/main/java/com/strive/app/controllers/MealPlanController.java`

### 6. Create Mapper

`MealPlanItemMapperImpl` for entity <-> DTO conversion

**Files**: `services/backend/src/main/java/com/strive/app/mappers/impl/`

## Frontend Changes

### 1. Create TypeScript Types

- `MealPlanItemType` interface
- `MealPlanType` interface

**Files**: `apps/mobile/types/`

### 2. Create Services

- `getMealPlan.ts` - fetch meal plan for a date
- `addToMealPlan.ts` - add food/meal/recipe to plan
- `removeFromMealPlan.ts` - remove item
- `toggleMealPlanItem.ts` - toggle logged status

**Files**: `apps/mobile/services/`

### 3. Update `mealPlanner.tsx`

**Current Issue**: Using `format(date, "yyyy-MM-dd")` on already formatted string

**Fix**:

- Change state to `useState<Date>(new Date())`
- Only format when sending to backend: `format(date, "yyyy-MM-dd")`
- This matches how `foodLog.tsx` handles dates

**New Features**:

- Fetch meal plan items from backend instead of food log
- Add navigation to different meal type search pages
- Support adding foods, meals, and recipes
- Update "Add Food" buttons to navigate to selection page

**Files**: `apps/mobile/app/(app)/(nutrition)/mealPlanner.tsx`

### 4. Update `TodaysMealBreakdown.tsx`

**Changes**:

- Fetch today's meal plan from backend
- Display actual meal plan items (currently hardcoded)
- Implement checkbox `onPress` handler:
  - Call `toggleMealPlanItem` service
  - If checking: adds item to food log + updates metrics
  - If unchecking: removes from food log + subtracts metrics
- Track checked state from `isLogged` field
- Show proper macros (P/C/F) from actual items
- Filter by selected meal type

**Files**: `apps/mobile/components/TodaysMealBreakdown.tsx`

### 5. Update `MealBreakdownCard.tsx`

**Changes**:

- Accept `checked` prop and `onCheck` callback
- Pass through to Checkbox component
- Display actual nutrition data passed as props

**Files**: `apps/mobile/components/MealBreakdownCard.tsx`

### 6. Create Meal Plan Selection Flow

Create new pages for adding items to meal plan:

- `mealPlanSelect.tsx` - Choose between Foods/Meals/Recipes
- `mealPlanFoodSearch.tsx` - Search and add foods (reuse food search logic)
- `mealPlanMealSelect.tsx` - Browse user meals
- `mealPlanRecipeSelect.tsx` - Browse user recipes

Store selected meal type in context/route params to add items to correct meal.

**Files**: `apps/mobile/app/(app)/(nutrition)/`

### 7. Context/State Management

Use `MealContext` or create `MealPlanContext` to:

- Track current date for meal planning
- Track selected meal type (Breakfast/Lunch/Dinner/Snack)
- Refresh meal plan after changes

**Files**: `apps/mobile/context/`

## Key Implementation Details

### Date Format Fix

**Problem**: `mealPlanner.tsx` line 13 calls `format()` on string, line 24 calls it again

**Solution**:

```typescript
const [date, setDate] = useState<Date>(new Date());
// Pass to backend:
body: JSON.stringify({ date: format(date, "yyyy-MM-dd") });
```

### Toggle Logic (Backend)

When `toggleItemLogged` is called:

1. Find `MealPlanItemEntity` by ID
2. Toggle `isLogged` field
3. If `true`: create `FoodLogItemEntity` and add to today's `FoodLogEntity`
4. If `false`: find and remove matching item from `FoodLogEntity`
5. Update daily metrics accordingly (use existing `DailyMetricsEntity` logic)
6. Return updated meal plan

### Checkbox State

- Fetch from backend: `mealPlanItem.isLogged`
- Update optimistically on frontend
- Sync with backend response

## Testing Checklist

- [ ] Create meal plan with foods, meals, recipes
- [ ] View meal plan on meal planner page
- [ ] Check item on nutrition page → appears in food log
- [ ] Uncheck item → removed from food log
- [ ] Macros update correctly on check/uncheck
- [ ] Date navigation works correctly
- [ ] Different meal types (Breakfast/Lunch/Dinner/Snack) work
