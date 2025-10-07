import { Image, Switch, Text, TextInput, View } from "react-native";
import EditIcon from "../../../assets/icons/EditIcon";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../../services/getCurrentUser";
import GenericButton from "../../../components/GenericButton";
import { CreateWorkoutContext } from "../../../context/CreateWorkoutContext";
import { useContext } from "react";
import { ExerciseType } from "../../../types/ExerciseTypes";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { ImagePickerPressable } from "../../../components/ImagePickerPressable";

const newExcercise = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const { exerciseIndex } = useLocalSearchParams();
  const { exercises, setExercises } = useContext(CreateWorkoutContext);
  const [isLbs, setIsLbs] = useState(true);
  const [weightBased, setWeightBased] = useState(true);
  const [exerciseName, setExerciseName] = useState("");
  const [restTimeInSeconds, setRestTimeInSeconds] = useState("");
  const [goalSets, setGoalSets] = useState("");
  const [goalReps, setGoalReps] = useState("");
  const [weight, setWeight] = useState("");
  const [time, setTime] = useState("");
  const [tutorialUrl, setTutorialUrl] = useState("");

  useEffect(() => {
    (async () => {
      const currentUser = await getCurrentUser();
      setIsLbs(currentUser?.weightType === "LBS");
    })();
  }, []);

  useEffect(() => {
    if (exerciseIndex) {
      const exercise = exercises[Number(exerciseIndex)];
      setExerciseName(exercise.exerciseName);
      setImageUri(exercise.exerciseImageUrl ?? null);
      setRestTimeInSeconds(exercise.restTimeInSeconds?.toString() ?? "");
      setGoalSets(exercise.goalSets?.toString() ?? "");
      setGoalReps(exercise.goalReps?.toString() ?? "");
      setWeightBased(exercise.isWeightBased ?? true);
      setWeight(exercise.weight?.toString() ?? "");
      setTime(exercise.time?.toString() ?? "");
      setTutorialUrl(exercise.tutorialUrl ?? "");
    }
  }, [exerciseIndex]);

  return (
    <View className="flex-1">
      <View>
        <ImagePickerPressable
          setImage={setUploadedImage}
          setImageUri={setImageUri}
        >
          <Image
            source={
              imageUri
                ? { uri: imageUri }
                : require("../../../assets/images/exercise example.png")
            }
            className="w-full h-40 opacity-50"
          />
          <View className="flex-row items-center justify-between absolute bottom-4 right-4">
            <EditIcon height={25} width={25} fill="white" />
          </View>
        </ImagePickerPressable>
      </View>
      <View className="px-4">
        <View className="flex-col gap-2 mt-4">
          <Text className="text-white text-lg font-[HelveticaNeue]">
            Exercise Name
          </Text>
          <TextInput
            value={exerciseName}
            placeholder="ex. Lat pull down"
            placeholderTextColor="#828282"
            className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3"
            onChangeText={setExerciseName}
          />
        </View>
      </View>
      <View className="px-4">
        <View className="flex-col gap-2 mt-4">
          <Text className="text-white text-lg font-[HelveticaNeue]">
            Rest Time
          </Text>
          <View className="flex-row gap-2 items-center">
            <TextInput
              value={restTimeInSeconds}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor="#828282"
              className="text-white text-lg h-[3.7rem] w-40 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3"
              onChangeText={(text) => {
                if (Number(text) > 3600) {
                  setRestTimeInSeconds("");
                } else {
                  setRestTimeInSeconds(text);
                }
              }}
            />
            <Text className="text-white text-lg font-[HelveticaNeue]">
              secs
            </Text>
          </View>
        </View>
      </View>
      <View className="px-4">
        <View className="flex-row gap-6 mt-4">
          <View className="flex-col gap-2">
            <Text className="text-white text-lg font-[HelveticaNeue]">
              Sets
            </Text>
            <TextInput
              value={goalSets}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor="#828282"
              className="text-white text-lg h-[3.7rem] w-40 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3"
              onChangeText={setGoalSets}
            />
          </View>
          <View className="flex-col gap-2">
            <Text className="text-white text-lg font-[HelveticaNeue]">
              Reps
            </Text>
            <TextInput
              value={goalReps}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor="#828282"
              className="text-white text-lg h-[3.7rem] w-40 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3"
              onChangeText={setGoalReps}
            />
          </View>
        </View>
      </View>
      <View className="flex-row items-center justify-between px-4 mt-6 mb-4">
        <Text className="text-white text-lg font-[HelveticaNeue]">
          Weight Based
        </Text>
        <Switch
          thumbColor="white"
          trackColor={{ true: "#F43A45", false: "#27272A" }}
          value={weightBased}
          onValueChange={() => {
            setWeightBased(!weightBased);
          }}
        />
      </View>
      {weightBased && (
        <View className="px-4">
          <View className="flex-col gap-2 mt-4">
            <Text className="text-white text-lg font-[HelveticaNeue]">
              Weight
            </Text>
            <View className="flex-row gap-2 items-center">
              <TextInput
                value={weight}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#828282"
                className="text-white text-lg h-[3.7rem] w-40 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3"
                onChangeText={setWeight}
              />
              <Text className="text-white text-lg font-[HelveticaNeue]">
                {isLbs ? "lbs" : "kgs"}
              </Text>
            </View>
          </View>
        </View>
      )}

      {!weightBased && (
        <View className="px-4">
          <View className="flex-col gap-2 mt-4">
            <Text className="text-white text-lg font-[HelveticaNeue]">
              Time
            </Text>
            <View className="flex-row gap-2 items-center">
              <TextInput
                value={time}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#828282"
                className="text-white text-lg h-[3.7rem] w-40 font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3"
                onChangeText={setTime}
              />
              <Text className="text-white text-lg font-[HelveticaNeue]">
                secs
              </Text>
            </View>
          </View>
        </View>
      )}

      <View className="px-4">
        <View className="flex-col gap-2 mt-4">
          <Text className="text-white text-lg font-[HelveticaNeue]">
            Tutorial URL
          </Text>
          <TextInput
            value={tutorialUrl}
            placeholder="youtube url"
            keyboardType="url"
            placeholderTextColor="#828282"
            className="text-white text-lg h-[3.7rem] w-full font-[HelveticaNeue] justify-center pl-4 border-gray2 border rounded-2xl py-3"
            onChangeText={setTutorialUrl}
          />
        </View>
      </View>

      <GenericButton
        text="Save Exercise"
        onPress={() => {
          if (
            exerciseName === "" ||
            restTimeInSeconds === "" ||
            goalSets === "" ||
            goalReps === "" ||
            (weightBased && weight === "") ||
            (!weightBased && time === "")
          ) {
            console.log("Please fill in all fields");
            return;
          }

          const exercise: ExerciseType = {
            id: exerciseIndex ? exercises[Number(exerciseIndex)].id : undefined,
            exerciseName: exerciseName,
            exerciseImageUrl: imageUri,
            exerciseImageFileName: uploadedImage?.fileName || null,
            exerciseImageBase64: uploadedImage?.base64 || null,
            exerciseImageMimeType: uploadedImage?.mimeType || null,
            restTimeInSeconds: Number(restTimeInSeconds),
            goalSets: Number(goalSets),
            goalReps: Number(goalReps),
            isWeightBased: weightBased,
            weight: Number(weight),
            time: Number(time),
            tutorialUrl: tutorialUrl,
          };

          if (exerciseIndex) {
            setExercises(
              exercises.map((exercisePrev, index) =>
                index === Number(exerciseIndex) ? exercise : exercisePrev
              )
            );
          } else {
            setExercises([...exercises, exercise]);
          }
          router.back();
        }}
        className="self-center absolute bottom-14"
        textClassName="text-lg"
      />
    </View>
  );
};
export default newExcercise;
