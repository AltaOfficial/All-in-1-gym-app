import { useRef, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";

export default function ValueSlider({
  setValue,
  isHeight = false,
  className,
}: {
  setValue: (value: number) => void;
  isHeight?: boolean;
  className?: string;
}) {
  const [focusedIndex, setFocusedIndex] = useState(3);
  const flatlistRef = useRef<FlatList>(null);
  const initialOffset = 35; // pixels
  const data = isHeight
    ? Array.from({ length: 92 }, (_, i) => i)
    : Array.from({ length: 999 }, (_, i) => i);
  const [itemWidth, setItemWidth] = useState(105); // default width, will be updated

  const SliderItem = ({
    value,
    isFocused,
  }: {
    value: number;
    isFocused: boolean;
  }) => {
    return (
      <View
        className="items-center"
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          if (width > 0 && Math.abs(width - itemWidth) > 1) {
            setItemWidth(width);
          }
        }}
      >
        <View className="justify-center w-[105px]">
          <Text
            className={`font-[HelveticaNeue] text-center ${isFocused ? "text-white text-6xl" : "text-white/20 text-4xl"}`}
          >
            {isHeight ? `${Math.floor(value / 12)}'${value % 12}` : `${value}`}
          </Text>
        </View>
        <View
          className={`w-0.5 h-8 ${isFocused ? "bg-white " : "bg-white/20"}`}
        ></View>
      </View>
    );
  };

  return (
    <View className={`w-full flex items-center ${className}`}>
      <FlatList
        ref={flatlistRef}
        contentContainerStyle={styles.container}
        data={data}
        contentOffset={{ x: initialOffset, y: 0 }}
        snapToOffsets={Array.from(
          { length: data.length },
          (_, i) => initialOffset + i * itemWidth
        )}
        onScroll={(event) => {
          const currentOffset = event.nativeEvent.contentOffset.x;
          // Prevent scrolling below the initial offset
          if (currentOffset < initialOffset) {
            flatlistRef.current?.scrollToOffset({
              offset: initialOffset,
              animated: true,
            });
            return;
          }

          const offsetX = currentOffset - initialOffset;
          const newIndex = Math.round(offsetX / itemWidth);

          if (
            newIndex >= 0 &&
            newIndex < data.length &&
            newIndex !== focusedIndex
          ) {
            setFocusedIndex(newIndex);
            setValue(data[newIndex]);
          }
        }}
        initialNumToRender={5}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        horizontal
        initialScrollIndex={focusedIndex}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <SliderItem value={item} isFocused={index == focusedIndex} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    paddingLeft: 194.9,
    paddingRight: 194.9,
    marginBottom: 30,
  },
});
