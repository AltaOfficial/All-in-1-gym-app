import { Text, View, Image, Pressable, TextInput } from "react-native";
import { useContext, useState, useEffect, useRef } from "react";
import { ExerciseType } from "../../../types/ExerciseTypes";
import { WorkoutContext } from "../../../context/WorkoutContext";
import { EffortEnum } from "../../../types/effortEnum";
import ChevronLeftIcon from "../../../assets/icons/ChevronLeftIcon";
import ChevronRightIcon from "../../../assets/icons/ChevronRightIcon";
import GenericButton from "../../../components/GenericButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { addSeconds, differenceInSeconds } from "date-fns";
import { AppState } from "react-native";

const Workout = () => {
  const {
    workout,
    nextExercise,
    endWorkout,
    currentExerciseIndex,
    currentExerciseData,
    setCurrentExerciseData,
  } = useContext(WorkoutContext);
  const [effortScore, setEffortScore] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [timerDateIntoTheFuture, setTimerDateIntoTheFuture] =
    useState<Date | null>(null);
  const [currentExercise, setCurrentExercise] = useState<
    ExerciseType | undefined
  >(workout?.exercises?.[currentExerciseIndex] || undefined);
  const [TimeSecondsLeft, setTimeSecondsLeft] = useState<string>(
    Math.floor((currentExercise?.time ?? 0) % 60)
      ?.toString()
      .padStart(2, "0") || "00"
  );
  const [TimeMinutesLeft, setTimeMinutesLeft] = useState<string>(
    Math.floor((currentExercise?.time ?? 0) / 60)
      ?.toString()
      .padStart(2, "0") || "00"
  );
  const timerIntervalRef = useRef<number | null>(null);
  const timerDateIntoTheFutureRef = useRef<Date | null>(null);
  const isRestingRef = useRef(false);
  const [isResting, setIsResting] = useState(false);
  const currentExerciseRef = useRef(currentExercise);
  const currentSetRef = useRef(currentSet);

  const tick = async () => {
    if (
      differenceInSeconds(
        timerDateIntoTheFutureRef.current ?? new Date(),
        new Date()
      ) <= 0 ||
      !timerDateIntoTheFutureRef.current
    ) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      setTimeSecondsLeft("00");
      setTimeMinutesLeft("00");
      timerDateIntoTheFutureRef.current = null;
      setTimerDateIntoTheFuture(null);

      if (isRestingRef.current) {
        // Rest period finished - advance to next set/exercise
        if (currentSetRef.current == currentExerciseRef.current?.goalSets) {
          const next = await nextExercise(currentExerciseData);
          if (next) {
            setCurrentExercise(next);
            currentExerciseRef.current = next;
            setCurrentSet(1);
            currentSetRef.current = 1;
            if (next.time) {
              setTimeSecondsLeft(
                Math.floor((next.time ?? 0) % 60)
                  ?.toString()
                  .padStart(2, "0") || "00"
              );
              setTimeMinutesLeft(
                Math.floor((next.time ?? 0) / 60)
                  ?.toString()
                  .padStart(2, "0") || "00"
              );
            }
          } else {
            console.log("No next exercise");
            endWorkout();
            return;
          }
        } else {
          setCurrentSet(currentSetRef.current + 1);
          currentSetRef.current = currentSetRef.current + 1;
          if (currentExerciseRef.current?.time) {
            setTimeSecondsLeft(
              Math.floor((currentExerciseRef.current.time ?? 0) % 60)
                ?.toString()
                .padStart(2, "0") || "00"
            );
            setTimeMinutesLeft(
              Math.floor((currentExerciseRef.current.time ?? 0) / 60)
                ?.toString()
                .padStart(2, "0") || "00"
            );
          }
        }
        isRestingRef.current = false;
        setIsResting(false);
      } else {
        // Exercise timer finished
        // Check if this is the last set of the last exercise
        if (
          currentSetRef.current == currentExerciseRef.current?.goalSets &&
          currentExerciseIndex + 1 == (workout?.exercises?.length ?? 0)
        ) {
          // Last set of last exercise - end workout
          endWorkout();
          return;
        }

        // Not the last set - start rest period
        const restTime = currentExerciseRef.current?.restTimeInSeconds ?? 0;
        isRestingRef.current = true;
        setIsResting(true);

        // Set the initial display for rest timer
        setTimeSecondsLeft(
          Math.floor(restTime % 60)
            ?.toString()
            .padStart(2, "0") || "00"
        );
        setTimeMinutesLeft(
          Math.floor(restTime / 60)
            ?.toString()
            .padStart(2, "0") || "00"
        );

        // Start the rest timer
        const restEndTime = addSeconds(new Date(), restTime + 1);
        timerDateIntoTheFutureRef.current = restEndTime;
        setTimerDateIntoTheFuture(restEndTime);
      }
      return;
    }

    setTimeSecondsLeft(
      (
        differenceInSeconds(
          timerDateIntoTheFutureRef.current ?? new Date(),
          new Date()
        ) % 60
      )
        .toString()
        .padStart(2, "0")
    );

    setTimeMinutesLeft(
      Math.floor(
        differenceInSeconds(
          timerDateIntoTheFutureRef.current ?? new Date(),
          new Date()
        ) / 60
      )
        .toString()
        .padStart(2, "0")
    );
  };

  const startTimer = () => {
    if (timerIntervalRef.current) {
      // if timer somehow still exists, clear it
      clearInterval(timerIntervalRef.current);
    }

    tick();
    timerIntervalRef.current = setInterval(() => {
      tick();
    }, 1000);
  };

  useEffect(() => {
    currentExerciseRef.current = currentExercise;
  }, [currentExercise]);

  useEffect(() => {
    currentSetRef.current = currentSet;
  }, [currentSet]);

  useEffect(() => {
    timerDateIntoTheFutureRef.current = timerDateIntoTheFuture;
    if (timerDateIntoTheFuture && !timerIntervalRef.current) {
      startTimer();
    }
  }, [timerDateIntoTheFuture]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        // When app goes to background, clear the timer
        if (nextAppState === "background" || nextAppState === "inactive") {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
        }

        // When app comes back to foreground, handle timer state
        if (nextAppState === "active" && timerDateIntoTheFutureRef.current) {
          const secondsLeft = differenceInSeconds(
            timerDateIntoTheFutureRef.current,
            new Date()
          );

          if (secondsLeft > 0) {
            // Timer still has time left, restart it
            startTimer();
          } else {
            // Timer finished while app was in background
            if (isRestingRef.current) {
              // Rest period finished - advance to next set/exercise
              setTimeSecondsLeft("00");
              setTimeMinutesLeft("00");
              timerDateIntoTheFutureRef.current = null;
              setTimerDateIntoTheFuture(null);

              // Move to next set or exercise
              if (
                currentSetRef.current == currentExerciseRef.current?.goalSets
              ) {
                const next = await nextExercise(currentExerciseData);
                if (next) {
                  setCurrentExercise(next);
                  currentExerciseRef.current = next;
                  setCurrentSet(1);
                  currentSetRef.current = 1;
                  if (next.time) {
                    setTimeSecondsLeft(
                      Math.floor((next.time ?? 0) % 60)
                        ?.toString()
                        .padStart(2, "0") || "00"
                    );
                    setTimeMinutesLeft(
                      Math.floor((next.time ?? 0) / 60)
                        ?.toString()
                        .padStart(2, "0") || "00"
                    );
                  }
                } else {
                  endWorkout();
                  return;
                }
              } else {
                setCurrentSet(currentSetRef.current + 1);
                currentSetRef.current = currentSetRef.current + 1;
                if (currentExerciseRef.current?.time) {
                  setTimeSecondsLeft(
                    Math.floor((currentExerciseRef.current.time ?? 0) % 60)
                      ?.toString()
                      .padStart(2, "0") || "00"
                  );
                  setTimeMinutesLeft(
                    Math.floor((currentExerciseRef.current.time ?? 0) / 60)
                      ?.toString()
                      .padStart(2, "0") || "00"
                  );
                }
              }
              isRestingRef.current = false;
              setIsResting(false);
            } else {
              // Exercise finished
              // Check if this is the last set of the last exercise
              if (
                currentSetRef.current == currentExerciseRef.current?.goalSets &&
                currentExerciseIndex + 1 == (workout?.exercises?.length ?? 0)
              ) {
                // Last set of last exercise - end workout
                endWorkout();
                return;
              }

              // Not the last set - calculate if rest period also finished
              const restTime =
                currentExerciseRef.current?.restTimeInSeconds ?? 0;
              const restEndTime = addSeconds(new Date(), restTime);
              const restSecondsLeft = differenceInSeconds(
                restEndTime,
                new Date()
              );

              isRestingRef.current = true;
              setIsResting(true);

              if (restSecondsLeft > 0) {
                // Start rest timer
                setTimerDateIntoTheFuture(restEndTime);
              } else {
                // Rest period also finished - advance to next
                setTimeSecondsLeft("00");
                setTimeMinutesLeft("00");

                if (
                  currentSetRef.current == currentExerciseRef.current?.goalSets
                ) {
                  const next = await nextExercise(currentExerciseData);
                  if (next) {
                    setCurrentExercise(next);
                    currentExerciseRef.current = next;
                    setCurrentSet(1);
                    currentSetRef.current = 1;
                    if (next.time) {
                      setTimeSecondsLeft(
                        Math.floor((next.time ?? 0) % 60)
                          ?.toString()
                          .padStart(2, "0") || "00"
                      );
                      setTimeMinutesLeft(
                        Math.floor((next.time ?? 0) / 60)
                          ?.toString()
                          .padStart(2, "0") || "00"
                      );
                    }
                  } else {
                    endWorkout();
                    return;
                  }
                } else {
                  setCurrentSet(currentSetRef.current + 1);
                  currentSetRef.current = currentSetRef.current + 1;
                  if (currentExerciseRef.current?.time) {
                    setTimeSecondsLeft(
                      Math.floor((currentExerciseRef.current.time ?? 0) % 60)
                        ?.toString()
                        .padStart(2, "0") || "00"
                    );
                    setTimeMinutesLeft(
                      Math.floor((currentExerciseRef.current.time ?? 0) / 60)
                        ?.toString()
                        .padStart(2, "0") || "00"
                    );
                  }
                }
                isRestingRef.current = false;
                setIsResting(false);
              }
            }
          }
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1">
      {currentExercise &&
        currentExercise.isWeightBased == true &&
        !isResting && (
          <View className="flex-1">
            <View className="items-center">
              <Image
                source={
                  currentExercise?.exerciseImageUrl
                    ? { uri: currentExercise?.exerciseImageUrl }
                    : require("../../../assets/images/exercise example.png")
                }
                className="w-full h-32"
              />
            </View>
            <Text className="text-white text-2xl font-[HelveticaNeue] text-center mt-6">
              {currentExercise?.exerciseName}
            </Text>
            <Text className="text-gray3 text-xl font-[HelveticaNeue] text-center mt-6">
              Set {currentSet} of {currentExercise?.goalSets}
            </Text>

            <View className="justify-center items-center text-center mt-10">
              <Text className="text-white text-xl font-[HelveticaNeue] text-center mt-6">
                How many reps did you do?
              </Text>
              <TextInput
                className="text-white text-6xl font-[HelveticaNeue] text-center mt-6 h-48 w-48 border-gray2 border rounded-2xl py-3"
                placeholder="0"
                placeholderTextColor="#828282"
                keyboardType="numeric"
                onChangeText={(text) => {
                  setCurrentExerciseData((prev) => {
                    const newData = [...prev];
                    newData[currentSet - 1].repsDone = Number(text);
                    return newData;
                  });
                }}
              />
            </View>

            <Text className="text-white text-xl font-[HelveticaNeue] text-center mt-20">
              Effort Score
            </Text>
            <View className="flex-row justify-center text-center mt-4 gap-2">
              <Pressable
                className="w-10 h-10 bg-gray1 rounded-full items-center justify-center"
                onPress={() => {
                  if (effortScore === 0) return;
                  setEffortScore(effortScore - 1);
                  setCurrentExerciseData((prev) => {
                    const newData = [...prev];
                    newData[currentSet - 1].effortType = Object.keys(
                      EffortEnum
                    )[effortScore - 1] as EffortEnum;
                    return newData;
                  });
                }}
              >
                <ChevronLeftIcon height={20} width={20} fill="white" />
              </Pressable>
              {/* The disrespect of the DRY principle here urks me, but ive already spent more time than I'd hoped to on this project */}
              <Text
                className={`text-white text-xl align-middle text-center font-[HelveticaNeue] h-10 ${
                  Object.keys(EffortEnum)[effortScore] == EffortEnum.FAILED
                    ? "bg-primary"
                    : Object.keys(EffortEnum)[effortScore] ==
                      EffortEnum.MAX_EFFORT
                    ? "bg-orange-700"
                    : Object.keys(EffortEnum)[effortScore] == EffortEnum.HARD
                    ? "bg-orange-500"
                    : Object.keys(EffortEnum)[effortScore] == EffortEnum.MEDIUM
                    ? "bg-yellow-500"
                    : Object.keys(EffortEnum)[effortScore] == EffortEnum.EASY
                    ? "bg-green-500"
                    : "bg-gray1"
                } rounded-full w-44`}
              >
                {Object.keys(EffortEnum)[effortScore] == EffortEnum.FAILED
                  ? "Reached Failure"
                  : Object.keys(EffortEnum)[effortScore] ==
                    EffortEnum.MAX_EFFORT
                  ? "Max Effort"
                  : Object.keys(EffortEnum)[effortScore] == EffortEnum.HARD
                  ? "Hard"
                  : Object.keys(EffortEnum)[effortScore] == EffortEnum.MEDIUM
                  ? "Medium"
                  : Object.keys(EffortEnum)[effortScore] == EffortEnum.EASY
                  ? "Easy"
                  : "Reached Failure"}
              </Text>
              <Pressable
                className="w-10 h-10 bg-gray1 rounded-full items-center justify-center"
                onPress={() => {
                  if (effortScore === Object.keys(EffortEnum).length - 1)
                    return;
                  setEffortScore(effortScore + 1);
                  setCurrentExerciseData((prev) => {
                    const newData = [...prev];
                    newData[currentSet - 1].effortType = Object.keys(
                      EffortEnum
                    )[effortScore + 1] as EffortEnum;
                    return newData;
                  });
                }}
              >
                <ChevronRightIcon height={20} width={20} fill="white" />
              </Pressable>
            </View>

            <View className="items-center">
              <GenericButton
                className=" bg-primary rounded-full mt-20"
                textClassName="text-lg"
                onPress={async () => {
                  if (
                    currentExerciseIndex + 1 ==
                      (workout?.exercises?.length ?? 0) &&
                    currentSet == currentExercise?.goalSets
                  ) {
                    await endWorkout(currentExerciseData);
                    return;
                  }
                  setEffortScore(0);
                  isRestingRef.current = true;
                  setIsResting(true);
                  setTimeSecondsLeft(
                    Math.floor(currentExercise.restTimeInSeconds % 60)
                      ?.toString()
                      .padStart(2, "0") || "00"
                  );
                  setTimeMinutesLeft(
                    Math.floor(currentExercise.restTimeInSeconds / 60)
                      ?.toString()
                      .padStart(2, "0") || "00"
                  );
                  setTimerDateIntoTheFuture(
                    addSeconds(
                      new Date(),
                      currentExercise.restTimeInSeconds + 1
                    )
                  );
                }}
                text={
                  currentExerciseIndex + 1 ==
                    (workout?.exercises?.length ?? 0) &&
                  currentSet == currentExercise?.goalSets
                    ? "Complete Workout"
                    : "Start Rest"
                }
              ></GenericButton>
            </View>
          </View>
        )}
      {!isResting && currentExercise && !currentExercise.isWeightBased && (
        <View className="flex-1">
          <View className="items-center">
            <Image
              source={
                currentExercise?.exerciseImageUrl
                  ? { uri: currentExercise?.exerciseImageUrl }
                  : require("../../../assets/images/exercise example.png")
              }
              className="w-full h-32"
            />
          </View>
          <Text className="text-white text-2xl font-[HelveticaNeue] text-center mt-6">
            {currentExercise?.exerciseName}
          </Text>
          <Text className="text-gray3 text-xl font-[HelveticaNeue] text-center mt-6">
            Set {currentSet} of {currentExercise?.goalSets}
          </Text>

          <View className="items-center mt-16">
            <View className="w-72 h-72 rounded-full border-8 border-primary justify-center">
              <Text className="text-white text-5xl font-[HelveticaNeue] text-center">
                -{TimeMinutesLeft}:{TimeSecondsLeft}
              </Text>
            </View>
          </View>
          <View className="items-center mt-16">
            <View className="items-center flex-row gap-2">
              <GenericButton
                className=" bg-primary rounded-full mt-20"
                textClassName="text-lg"
                onPress={async () => {
                  if (timerDateIntoTheFuture || timerIntervalRef.current) {
                    if (
                      currentExerciseIndex + 1 ==
                        (workout?.exercises?.length ?? 0) &&
                      currentSet == currentExercise?.goalSets
                    ) {
                      await endWorkout(currentExerciseData);
                      return;
                    }
                    clearInterval(timerIntervalRef.current ?? 0);
                    timerIntervalRef.current = null;
                    isRestingRef.current = true;
                    setIsResting(true);
                    setTimeSecondsLeft(
                      Math.floor((currentExercise.restTimeInSeconds ?? 0) % 60)
                        ?.toString()
                        .padStart(2, "0") || "00"
                    );
                    setTimeMinutesLeft(
                      Math.floor((currentExercise.restTimeInSeconds ?? 0) / 60)
                        ?.toString()
                        .padStart(2, "0") || "00"
                    );
                    setTimerDateIntoTheFuture(
                      addSeconds(
                        new Date(),
                        currentExercise.restTimeInSeconds ?? 0
                      )
                    );
                  } else {
                    if (!currentExercise?.time) return;
                    setTimerDateIntoTheFuture(
                      addSeconds(new Date(), currentExercise?.time)
                    );
                  }
                }}
                text={timerDateIntoTheFuture ? "Stop" : "Start"}
              ></GenericButton>
              {timerDateIntoTheFuture && (
                <GenericButton
                  className=" bg-primary rounded-full mt-20"
                  textClassName="text-lg"
                  onPress={() => {
                    if (timerIntervalRef.current) {
                      clearInterval(timerIntervalRef.current);
                      timerIntervalRef.current = null;
                    }
                    setTimerDateIntoTheFuture(null);
                    setTimeSecondsLeft(
                      Math.floor((currentExercise?.time ?? 0) % 60)
                        ?.toString()
                        .padStart(2, "0") || "00"
                    );
                    setTimeMinutesLeft(
                      Math.floor((currentExercise?.time ?? 0) / 60)
                        ?.toString()
                        .padStart(2, "0") || "00"
                    );
                  }}
                  text={"Reset"}
                ></GenericButton>
              )}
            </View>
          </View>
        </View>
      )}

      {isResting && (
        <View className="flex-1">
          <Text className="text-white text-3xl font-[HelveticaNeue] text-center mt-6">
            Rest Period
          </Text>

          <View className="items-center mt-16">
            <View className="w-72 h-72 rounded-full border-8 border-primary justify-center">
              <Text className="text-white text-5xl font-[HelveticaNeue] text-center">
                -{TimeMinutesLeft}:{TimeSecondsLeft}
              </Text>
            </View>
          </View>
          <View className="items-center mt-48">
            {workout?.exercises?.[currentExerciseIndex + 1] &&
              currentSet == currentExercise?.goalSets && (
                <Pressable className="bg-gray1 rounded-lg p-4 w-11/12 h-24 justify-between items-center flex-row">
                  <View className="flex-row gap-4 items-center">
                    <View>
                      <Image
                        source={
                          workout?.exercises?.[currentExerciseIndex + 1]
                            ?.exerciseImageUrl
                            ? {
                                uri: workout?.exercises?.[
                                  currentExerciseIndex + 1
                                ]?.exerciseImageUrl,
                              }
                            : require("../../../assets/images/exercise example.png")
                        }
                        className="w-16 h-16 aspect-[4/3]"
                      />
                    </View>
                    <View className="flex-col items-start">
                      <Text className="text-white text-xl font-[HelveticaNeue]">
                        Next Exercise
                      </Text>
                      <Text className="text-white text-sm font-[HelveticaNeue] w-40">
                        {
                          workout?.exercises?.[currentExerciseIndex + 1]
                            ?.exerciseName
                        }
                      </Text>
                    </View>
                  </View>
                  {workout?.exercises?.[currentExerciseIndex + 1]
                    ?.tutorialUrl && (
                    <Text className="text-link text-lg font-[HelveticaNeue]">
                      Watch Video
                    </Text>
                  )}
                </Pressable>
              )}
            <View className="items-center flex-row mt-16">
              <Pressable
                className="flex-row items-center gap-4"
                onPress={async () => {
                  if (timerIntervalRef.current) {
                    clearInterval(timerIntervalRef.current);
                    timerIntervalRef.current = null;
                  }

                  setTimerDateIntoTheFuture(null);
                  timerDateIntoTheFutureRef.current = null;

                  if (currentSet == currentExercise?.goalSets) {
                    const newExercise = await nextExercise(currentExerciseData);
                    if (newExercise) {
                      setCurrentExercise(newExercise);
                      currentExerciseRef.current = newExercise;
                      setCurrentSet(1);
                      currentSetRef.current = 1;
                      if (newExercise?.time) {
                        setTimeSecondsLeft(
                          Math.floor((newExercise?.time ?? 0) % 60)
                            ?.toString()
                            .padStart(2, "0") || "00"
                        );
                        setTimeMinutesLeft(
                          Math.floor((newExercise?.time ?? 0) / 60)
                            ?.toString()
                            .padStart(2, "0") || "00"
                        );
                      }
                    } else {
                      endWorkout();
                      return;
                    }
                  } else {
                    setCurrentSet(currentSet + 1);
                    currentSetRef.current = currentSet + 1;
                    if (currentExercise?.time) {
                      setTimeSecondsLeft(
                        Math.floor((currentExercise?.time ?? 0) % 60)
                          ?.toString()
                          .padStart(2, "0") || "00"
                      );
                      setTimeMinutesLeft(
                        Math.floor((currentExercise?.time ?? 0) / 60)
                          ?.toString()
                          .padStart(2, "0") || "00"
                      );
                    }
                  }
                  isRestingRef.current = false;
                  setIsResting(false);
                }}
              >
                <Text className="text-white text-xl font-[HelveticaNeue]">
                  Skip Rest
                </Text>
                <ChevronRightIcon height={20} width={20} fill="white" />
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Workout;
