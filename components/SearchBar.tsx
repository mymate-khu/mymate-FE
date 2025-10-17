import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  style?: ViewStyle;
  showClearButton?: boolean;
};

export default function SearchBar({
  value,
  placeholder = "검색어를 입력하세요",
  onChangeText,
  onSubmit,
  onClear,
  style,
  showClearButton = false,
}: Props) {
  return (
    <View style={[s.container, style]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#797979"
        style={s.input}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />

      {/* 오른쪽 아이콘 영역 */}
      {showClearButton && value.length > 0 ? (
        <TouchableOpacity onPress={onClear}>
          <Text style={s.clear}>×</Text>
        </TouchableOpacity>
      ) : (
        <Ionicons name="search-outline" size={24} color="#000" style={s.iconRight} />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: 15,
    backgroundColor: "#F0F0F0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: "#111",
  },
  iconRight: {
    marginLeft: 8,
  },
  clear: {
    fontSize: 24,
    color: "#797979",
    marginLeft: 8,
    paddingHorizontal: 4,
  },
});