-- Rewrites stored Azure Blob image URLs to the backend /images endpoint.
-- Target host: the backend public domain on Railway.
-- Run once, after the database is restored and the blobs are copied into the bucket.

BEGIN;

UPDATE bodymetricslogs
SET front_photo_url = replace(front_photo_url, 'https://striveapp.blob.core.windows.net/strive-image-container/', 'https://all-in-1-gym-app-production.up.railway.app/images/'),
    side_photo_url  = replace(side_photo_url,  'https://striveapp.blob.core.windows.net/strive-image-container/', 'https://all-in-1-gym-app-production.up.railway.app/images/');

UPDATE meals
SET meal_image_url = replace(meal_image_url, 'https://striveapp.blob.core.windows.net/strive-image-container/', 'https://all-in-1-gym-app-production.up.railway.app/images/');

UPDATE exercises
SET exercise_image_url = replace(exercise_image_url, 'https://striveapp.blob.core.windows.net/strive-image-container/', 'https://all-in-1-gym-app-production.up.railway.app/images/');

UPDATE foods
SET food_image_url = replace(food_image_url, 'https://striveapp.blob.core.windows.net/strive-image-container/', 'https://all-in-1-gym-app-production.up.railway.app/images/');

COMMIT;
