// ME/MATE 토글
import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";

export type Mode = "me" | "mate";

export default function SegmentedMM({ value, onChange }: {
  value: Mode; onChange: (m: Mode) => void;
}) {
  return (
    <View style={styles.wrap}>
      {(["me","mate"] as Mode[]).map(m => {
        const selected = value === m;
        return (
          <Pressable
            key={m}
            onPress={() => onChange(m)}
            style={[styles.btn, selected && (m==="me" ? styles.meSel : styles.mateSel),
                    !selected && styles.unselected]}
          >
            <Text style={[styles.txt, selected ? styles.txtSel : styles.txtUnsel]}>
              {m.toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}



const styles = StyleSheet.create({
  wrap: { 
    flexDirection: "row", 
    gap: 10, 
    //paddingHorizontal: 16, 
    //paddingVertical: 8,
    //backgroundColor: "pink",
  },
  btn: {
    minWidth: 60, 
    height: 28, 
    borderRadius: 22,
    justifyContent: "center", 
    alignItems: "center",
    borderWidth: 1,
  },
  meSel: { 
    backgroundColor: "#FFE600", 
    borderColor: "#FFE600" 
  },
  mateSel: { 
    backgroundColor: "#D5A8FF", 
    borderColor: "#D5A8FF" 
  },
  unselected: { 
    backgroundColor: "transparent", 
    borderColor: "#999999" 
  },
  txt: { 
    fontSize: 14,  
  },
  txtSel: { 
    color: "#111" 
  },
  txtUnsel: { 
    color: "#999999" 
  },
});