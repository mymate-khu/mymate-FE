// calendar_add.tsx
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, Text,useWindowDimensions,TextInput,Image} from "react-native";
import { StyleSheet } from "react-native";
import {router} from "expo-router"
import CalendarIcon from '../assets/image/Calendar.png';

export default function CalendarAdd() {

    const { width, height } = useWindowDimensions();

    const { date } = useLocalSearchParams<{ date?: string }>();

    const [curdate, setcurdate] = useState(date)

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={{fontSize:width*0.04,fontWeight:500,fontFamily:"PretendardSemiBold"}}>마이 퍼즐</Text>
                <Text style={styles.arrow} onPress={()=>{router.back()}}>{"<"}</Text>
            </View>
            <View 
            style={[styles.bar_small, { marginHorizontal: width * 0.07, marginTop: 30 }]}>
                {curdate}
                <Image source={CalendarIcon} style={styles.calendaricon}></Image>
                </View>
            <TextInput 
            placeholder="퍼즐 제목 입력"
            placeholderTextColor={"lightgray"}
            style={[styles.bar_small, { marginHorizontal: width * 0.07, marginTop: 20 }]}></TextInput>
            <TextInput 
            multiline
            placeholder="내용을 입력하세요"
            placeholderTextColor={"lightgray"}
            style={[styles.bar_large, { marginHorizontal: width * 0.07,marginTop: 10 ,textAlignVertical: 'top',paddingTop:12}]}></TextInput>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height:50
    },
    arrow:{
        position:"absolute",
        fontSize:20,
        fontFamily:"PretendardSemiBold",
        left:10
    },
    calendaricon:{
        position:"absolute",
        right:10

    },
    container: {
        flex: 1,
        backgroundColor: "rgba(255, 230, 0, 1)",
        flexDirection:"column"
    },
    bar_small: {
        backgroundColor: "white",
        height: 50,
        borderRadius: 10,
        padding: 12,
    },
    bar_large: {
        backgroundColor: "white",
        height: 300,
        borderRadius: 10,
        padding: 10
    }
})
