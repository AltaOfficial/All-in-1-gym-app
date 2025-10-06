import { View, ScrollView } from "react-native";
import { Row } from "react-native-table-component";
import { WorkoutType, WorkoutLogType } from "../types/ExerciseTypes";
import { useEffect, useState, RefObject, useRef } from "react";
import { getWorkoutHistory } from "../services/getWorkoutHistory";
import { format } from "date-fns";
import { EffortEnum } from "../types/effortEnum";

const WorkoutHistoryTable = ({
  workout,
  scrollViewRef,
}: {
  workout: WorkoutType;
  scrollViewRef: RefObject<ScrollView>;
}) => {
  const [workoutLogData, setWorkoutLogData] = useState<WorkoutLogType[]>([]);
  const dataScrollViewRef = useRef<ScrollView>(null);
  const scrollSource = useRef<"header" | "data" | null>(null);

  useEffect(() => {
    getWorkoutHistory(workout.id).then((data) => {
      setWorkoutLogData(data);
    });
  }, [workout]);

  useEffect(() => {
    if (workoutLogData.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
        dataScrollViewRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [workoutLogData]);

  const handleHeaderScroll = (event: any) => {
    if (scrollSource.current === "data") return;
    const offsetX = event.nativeEvent.contentOffset.x;
    scrollSource.current = "header";
    dataScrollViewRef.current?.scrollTo({ x: offsetX, animated: false });
    requestAnimationFrame(() => {
      scrollSource.current = null;
    });
  };

  const handleDataScroll = (event: any) => {
    if (scrollSource.current === "header") return;
    const offsetX = event.nativeEvent.contentOffset.x;
    scrollSource.current = "data";
    scrollViewRef.current?.scrollTo({ x: offsetX, animated: false });
    requestAnimationFrame(() => {
      scrollSource.current = null;
    });
  };

  return (
    <View className="flex-1">
      {/* Fixed Top Headers */}
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: 100 }}>
          <Row
            textStyle={{ color: "white", textAlign: "right" }}
            data={["Date"]}
            widthArr={[100]}
            style={{ borderWidth: 1, borderColor: "white" }}
          />
          <Row
            textStyle={{ color: "white", textAlign: "center" }}
            data={["Workouts"]}
            widthArr={[100]}
            style={{ borderWidth: 1, borderColor: "white", borderTopWidth: 0 }}
          />
        </View>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          scrollEventThrottle={16}
          onScroll={handleHeaderScroll}
          style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}
        >
          <View>
            <View style={{ flexDirection: "row" }}>
              {workoutLogData.map((workoutLog, index) => (
                <Row
                  key={index}
                  textStyle={{ color: "white", textAlign: "center" }}
                  data={[format(new Date(workoutLog.date), "MM/dd/yyyy")]}
                  widthArr={[310]}
                  style={{
                    borderWidth: 1,
                    borderColor: "white",
                    borderLeftWidth: index === 0 ? 1 : 0,
                  }}
                />
              ))}
            </View>
            <View style={{ flexDirection: "row" }}>
              {workoutLogData.map((_, logIndex) => (
                <Row
                  key={logIndex}
                  textStyle={{ color: "white", textAlign: "center" }}
                  data={["R", "W", "E", "Rest", "Notes"]}
                  widthArr={[37.5, 37.5, 37.5, 75, 122]}
                  style={{
                    borderWidth: 1,
                    borderColor: "white",
                    borderTopWidth: 0,
                    borderLeftWidth: logIndex === 0 ? 1 : 0,
                  }}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Scrollable Content */}
      <ScrollView className="flex-1">
        <View style={{ flexDirection: "row" }}>
          {/* Fixed Left Column */}
          <View style={{ width: 100 }}>
            {workout?.exercises?.map((exercise, index) => (
              <View key={index}>
                <Row
                  textStyle={{
                    color: "white",
                    textAlign: "left",
                    paddingLeft: 5,
                  }}
                  data={[exercise.exerciseName]}
                  widthArr={[100]}
                  style={{
                    height: 60,
                    borderWidth: 1,
                    borderColor: "white",
                    borderTopWidth: 0,
                  }}
                />
                {Array.from(
                  { length: exercise.goalSets ?? 0 },
                  (_, setIndex) => (
                    <Row
                      key={setIndex}
                      textStyle={{
                        color: "white",
                        textAlign: "left",
                        paddingLeft: 5,
                        fontSize: 12,
                      }}
                      data={[
                        `Set ${setIndex + 1}: ${
                          exercise.time
                            ? exercise.time + "s"
                            : exercise.goalReps + " reps"
                        }`,
                      ]}
                      widthArr={[100]}
                      style={{
                        height: 40,
                        borderWidth: 1,
                        borderColor: "white",
                        borderTopWidth: 0,
                      }}
                    />
                  )
                )}
              </View>
            ))}
          </View>

          {/* Scrollable Data */}
          <ScrollView
            ref={dataScrollViewRef}
            horizontal
            scrollEventThrottle={16}
            onScroll={handleDataScroll}
          >
            <View>
              {workout?.exercises?.map((exercise, index) => (
                <View key={index}>
                  <View style={{ flexDirection: "row" }}>
                    {workoutLogData.map((_, logIndex) => (
                      <View
                        key={logIndex}
                        style={{
                          width: 310,
                          height: 60,
                          borderWidth: 1,
                          borderColor: "white",
                          borderLeftWidth: logIndex === 0 ? 1 : 0,
                          borderTopWidth: 0,
                        }}
                      />
                    ))}
                  </View>
                  {Array.from(
                    { length: exercise.goalSets ?? 0 },
                    (_, setIndex) => (
                      <View key={setIndex} style={{ flexDirection: "row" }}>
                        {workoutLogData.map((workoutLog, logIndex) => {
                          const exerciseLog = workoutLog.exerciseLogs.find(
                            (log) => log.exerciseParentId === exercise.id
                          );
                          const set = exerciseLog?.setsList[setIndex];
                          const effortType = set?.effortType;
                          const bgColor = !exercise.isWeightBased
                            ? "black"
                            : effortType === EffortEnum.FAILED
                            ? "#F43A45"
                            : effortType === EffortEnum.MAX_EFFORT
                            ? "#ea580c"
                            : effortType === EffortEnum.HARD
                            ? "#f97316"
                            : effortType === EffortEnum.MEDIUM
                            ? "#eab308"
                            : effortType === EffortEnum.EASY
                            ? "#22c55e"
                            : "#141414";

                          return (
                            <View
                              key={logIndex}
                              style={{ flexDirection: "row" }}
                            >
                              <Row
                                textStyle={{
                                  color: "white",
                                  textAlign: "center",
                                  fontSize: 12,
                                }}
                                data={[
                                  exercise.isWeightBased
                                    ? set?.repsDone?.toString() ?? ""
                                    : "",
                                ]}
                                widthArr={[37.5]}
                                style={{
                                  height: 40,
                                  borderWidth: 1,
                                  borderColor: "white",
                                  borderTopWidth: 0,
                                  borderLeftWidth: logIndex === 0 ? 1 : 0,
                                  backgroundColor: bgColor,
                                }}
                              />
                              <Row
                                textStyle={{
                                  color: "white",
                                  textAlign: "center",
                                  fontSize: 12,
                                }}
                                data={[
                                  !exercise.isWeightBased || set?.weight == 0
                                    ? ""
                                    : set?.weight?.toString() ?? "",
                                ]}
                                widthArr={[37.5]}
                                style={{
                                  height: 40,
                                  borderWidth: 1,
                                  borderColor: "white",
                                  borderTopWidth: 0,
                                  borderLeftWidth: 0,
                                  backgroundColor: bgColor,
                                }}
                              />
                              <Row
                                textStyle={{
                                  color: "white",
                                  textAlign: "center",
                                  fontSize: 12,
                                }}
                                data={[
                                  exercise.isWeightBased
                                    ? set?.effortType?.toString()[0] ?? ""
                                    : "",
                                ]}
                                widthArr={[37.5]}
                                style={{
                                  height: 40,
                                  borderWidth: 1,
                                  borderColor: "white",
                                  borderTopWidth: 0,
                                  borderLeftWidth: 0,
                                  backgroundColor: bgColor,
                                }}
                              />
                              <Row
                                textStyle={{
                                  color: "white",
                                  textAlign: "center",
                                  fontSize: 12,
                                }}
                                data={[
                                  set?.restTimeInSeconds
                                    ? set.restTimeInSeconds + "s"
                                    : "",
                                  "",
                                ]}
                                widthArr={[75, 122]}
                                style={{
                                  height: 40,
                                  borderWidth: 1,
                                  borderColor: "white",
                                  borderTopWidth: 0,
                                  borderLeftWidth: 0,
                                  backgroundColor: "black",
                                }}
                              />
                            </View>
                          );
                        })}
                      </View>
                    )
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

export default WorkoutHistoryTable;
