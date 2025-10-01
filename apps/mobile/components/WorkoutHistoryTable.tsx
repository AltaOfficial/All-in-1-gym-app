import { View } from "react-native";
import {
  Table,
  Row,
  Rows,
  Col,
  Cols,
  TableWrapper,
} from "react-native-table-component";

const WorkoutHistoryTable = () => {
  return (
    <View>
      <View>
        <Table
          borderStyle={{
            borderWidth: 1,
            borderColor: "white",
            flexDirection: "row",
          }}
        >
          <Row
            textStyle={{ color: "white" }}
            data={["Date", "Date", "Duration", "Calories"]}
          ></Row>
          <Row
            textStyle={{ color: "white" }}
            data={["Workouts", "Date", "Duration", "Calories"]}
          ></Row>
          <TableWrapper style={{ flexDirection: "row" }}>
            <Col
              textStyle={{ color: "white" }}
              data={["Barbell Deadlift", "Date", "Duration", "Calories"]}
              heightArr={[60, 60]}
            />
            <Rows
              textStyle={{ color: "white" }}
              flexArr={[1, 1, 1]}
              data={[
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9],
              ]}
            />
          </TableWrapper>
        </Table>
      </View>

      {/* <View>
            <Table borderStyle={{ borderWidth: 1, borderColor: "white" }}>
                <Row
                textStyle={{ color: "white" }}
                data={["Workout", "Date", "Duration", "Calories"]}
                />
                <Rows data={[[1, 2, 3, 4]]} />
            </Table>
        </View> */}
    </View>
  );
};

export default WorkoutHistoryTable;
