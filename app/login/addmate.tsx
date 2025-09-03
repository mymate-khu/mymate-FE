import { Text, TextInput, View, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions, Image } from "react-native"
import { router } from "expo-router"
import { useState } from "react";

import searchicon from "@/assets/image/signupcheckimg/search.png"


export default function addmate() {


    const { width, height } = useWindowDimensions();

    return <View style={styles.container}>
        <View style={styles.header}>
            <Text style={{ fontSize: 16, fontWeight: 500, }}>나의 메이트 추가하기</Text>
            <Text style={styles.arrow} onPress={() => { router.back() }}>{"<"}</Text>
        </View>
        <ScrollView style={{ marginHorizontal: width * 0.07, marginBottom: 150, }}>
            <View style={{ marginTop: 30, justifyContent: "center", }}>
                <TextInput style={styles.searchbar} placeholder="아이디 찾기" placeholderTextColor={"#797979"}></TextInput>
                <TouchableOpacity
                    onPress={() => { }}
                    style={styles.icon}>
                    <Image source={searchicon}></Image>
                </TouchableOpacity>
            </View>
        </ScrollView>
        <View style={{ marginHorizontal: width * 0.07 }}>
            <TouchableOpacity
                onPress={() => { }}
                style={[{ width: "100%", position: "absolute", bottom: 50 }, styles.btn]}>
                <Text style={{ fontFamily: "PretendardSemiBold", fontWeight: 500, fontSize: 17 }}>추가하기</Text>
            </TouchableOpacity>
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9F9F9"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 50
    },
    arrow: {
        position: "absolute",
        fontSize: 20,
        fontFamily: "PretendardSemiBold",
        left: 10
    },
    btn: {
        height: 50,
        backgroundColor: "rgba(255, 230, 0, 1)",
        marginTop: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    searchbar: {
        height: 50,
        backgroundColor: "rgba(153, 153, 153, 0.1)",
        borderRadius: 10,
        padding: 12,


    },
    icon: {
        position: "absolute",
        right: 10
    }
})