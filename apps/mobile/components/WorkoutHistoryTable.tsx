import { View, ScrollView } from "react-native";
import { Table, Row, TableWrapper } from "react-native-table-component";
import { WorkoutType, WorkoutLogType } from "../types/ExerciseTypes";
import { useEffect, useState, RefObject } from "react";
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

  useEffect(() => {
    getWorkoutHistory(workout.id).then((data) => {
      setWorkoutLogData(data);
    });
  }, [workout]);

  useEffect(() => {
    if (workoutLogData.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [workoutLogData]);

  return (
    <ScrollView ref={scrollViewRef} className="flex-1" horizontal>
      <ScrollView className="flex-1">
        <Table
          borderStyle={{
            borderWidth: 1,
            borderColor: "white",
          }}
        >
          <TableWrapper style={{ flexDirection: "row" }}>
            <Row
              textStyle={{ color: "white", textAlign: "right" }}
              data={["Date"]}
              widthArr={[100]}
            ></Row>
            {workoutLogData.map((workoutLog, index) => (
              <Row
                key={index}
                textStyle={{ color: "white", textAlign: "center" }}
                data={[format(new Date(workoutLog.date), "MM/dd/yyyy")]}
                widthArr={[300]}
              ></Row>
            ))}
          </TableWrapper>
          <TableWrapper style={{ flexDirection: "row" }}>
            <Row
              textStyle={{ color: "white", textAlign: "center" }}
              data={["Workouts"]}
              widthArr={[100]}
            ></Row>
            {workoutLogData.map((_, logIndex) => (
              <Row
                key={logIndex}
                textStyle={{ color: "white", textAlign: "center" }}
                data={["R", "W", "E", "Rest", "Notes"]}
                widthArr={[37.5, 37.5, 37.5, 75, 112.5]}
              ></Row>
            ))}
          </TableWrapper>
          {workout?.exercises?.map((exercise, index) => (
            <View key={index}>
              <TableWrapper style={{ flexDirection: "row" }}>
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
                  }}
                />
                {workoutLogData.map((_, logIndex) => (
                  <View
                    key={logIndex}
                    style={{
                      width: 300,
                      height: 60,
                      borderWidth: 1,
                      borderColor: "white",
                      borderLeftWidth: 0,
                    }}
                  />
                ))}
              </TableWrapper>
              {Array.from({ length: exercise.goalSets ?? 0 }, (_, setIndex) => (
                <TableWrapper key={setIndex} style={{ flexDirection: "row" }}>
                  <Row
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
                      <View key={logIndex} style={{ flexDirection: "row" }}>
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
                            !exercise.isWeightBased || exercise.weight == 0
                              ? ""
                              : exercise.weight?.toString() ?? "",
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
                          data={[exercise.restTimeInSeconds + "s", ""]}
                          widthArr={[75, 112.5]}
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
                </TableWrapper>
              ))}
            </View>
          ))}
        </Table>
      </ScrollView>
    </ScrollView>
  );
};

export default WorkoutHistoryTable;
