import { router } from "expo-router";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

export default function Step2() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.titlebar}>
                <Text style={styles.titelbarText}>
                    온보딩2
                </Text>
            </View>
            <TouchableOpacity
                style={styles.nextbutton}
                onPress={() => router.push("/onboarding/onboarding3")}
            >
                <Text style={styles.nextbuttonText}>다음</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAF8F5",
    },
    progressbar: {
        gap: "10",
        flexDirection: "row", // ✅ 가로로 정렬
        justifyContent: "center", // 가운데 정렬 (원하면 space-between도 가능)
        alignItems: "center",
        position: "absolute",
        top: "5%",
        left: "6%",
        right: "6%", // ✅ 양옆 여백
        height: "10%",
    },
    titlebar: {
        position: "absolute",
        top: "25%",
        left: "6%",
        right: "6%",
        height: "30%",
    },
    titelbarText: {
        fontSize: screenWidth * 0.09,
        color: '#222221', // var(--label-normal)
        fontFamily: 'NanumSquareNeo', // var(--typescale-display_l-family)
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 45, // 150% of 30px
        letterSpacing: -0.75,

    },
    nextbutton: {
        position: "absolute",
        bottom: "10%",
        left: "6%",
        right: "6%",
        height: "10%",
        backgroundColor: "#EBE9E6",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
    nextbuttonText: {
        color: "#222221",
        fontSize: 16,
        fontWeight: "bold",
    },
});