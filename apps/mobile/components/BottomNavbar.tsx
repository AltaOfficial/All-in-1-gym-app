import { Pressable, Text, View } from "react-native";
import MoreIcon from "../assets/icons/MoreIcon";
import ChefHatIcon from "../assets/icons/ChefHatIcon";
import DumbbellIcon from "../assets/icons/DumbbellIcon";
import HomeIcon from "../assets/icons/HomeIcon";
import Seperator from "./Seperator";
import { router } from "expo-router";
import { usePathname } from "expo-router";

const BottomNavbar = () => {
  const pathname = usePathname();
  return (
    (pathname == "/" ||
      pathname == "/training" ||
      pathname == "/nutrition" ||
      pathname == "/more") && (
      <View className={`bg-black`}>
        <Seperator />
        <View className={`flex-row items-center justify-between px-4 mt-4`}>
          <Pressable
            onPress={() => (pathname != "/" ? router.push("/") : null)}
            className="flex-col items-center"
          >
            <HomeIcon width={25} height={25} fill="white" />
            <Text
              className={`${pathname == "/" ? "text-primary font-[HelveticaNeue]" : "text-white font-[HelveticaNeue]"}`}
            >
              Home
            </Text>
          </Pressable>
          <Pressable
            onPress={() =>
              pathname != "/training" ? router.push("/training") : null
            }
            className="flex-col items-center "
          >
            <DumbbellIcon width={25} height={25} fill="white" />
            <Text
              className={`${pathname == "/training" ? "text-primary font-[HelveticaNeue]" : "text-white font-[HelveticaNeue]"}`}
            >
              Training
            </Text>
          </Pressable>
          <Pressable
            onPress={() =>
              pathname != "/nutrition" ? router.push("/nutrition") : null
            }
            className="flex-col items-center"
          >
            <ChefHatIcon width={25} height={25} fill="white" />
            <Text
              className={`${pathname == "/nutrition" ? "text-primary font-[HelveticaNeue]" : "text-white font-[HelveticaNeue]"}`}
            >
              Nutrition
            </Text>
          </Pressable>
          <Pressable
            onPress={() => (pathname != "/more" ? router.push("/more") : null)}
            className="flex-col items-center"
          >
            <MoreIcon width={25} height={25} fill="white" />
            <Text
              className={`${pathname == "/more" ? "text-primary font-[HelveticaNeue]" : "text-white font-[HelveticaNeue]"}`}
            >
              More
            </Text>
          </Pressable>
        </View>
      </View>
    )
  );
};

export default BottomNavbar;
