// calendar_add.tsx
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, useWindowDimensions, TextInput, Image, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { router } from "expo-router"
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';


import CalendarIcon from '../assets/image/Calendar.png';

export default function CalendarAdd() {

    const { width, height } = useWindowDimensions();

    const { date } = useLocalSearchParams<{ date?: string }>();

    const [curdate, setcurdate] = useState(date)

    const [title, settitle] = useState("")
    const [discription, setdiscription] = useState("")

    const [calendaron, setcalendaron] = useState(false)

    const handletitle = (e) => {
        settitle(e.target.value)
        console.log(title)
    }

    const handlediscription = (e) => {
        setdiscription(e.target.value)
        console.log(discription)
    }

    useEffect(()=>{

    },[curdate])


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={{ fontSize: width * 0.04, fontWeight: 500, fontFamily: "PretendardSemiBold" }}>마이 퍼즐</Text>
                <Text style={styles.arrow} onPress={() => { router.back() }}>{"<"}</Text>
            </View>
            <View
                style={[styles.bar_small, { marginHorizontal: width * 0.07, marginTop: 30 }]}>
                {curdate}
                <TouchableOpacity style={styles.calendaricon} onPress={() => { setcalendaron(!calendaron) }}>
                    <Image source={CalendarIcon} ></Image>
                </TouchableOpacity>
            </View>
            {!calendaron && <View>
                <TextInput
                    placeholder="퍼즐 제목 입력"
                    placeholderTextColor={"lightgray"}
                    value={title}
                    onChange={handletitle}
                    style={[styles.bar_small, { marginHorizontal: width * 0.07, marginTop: 20 }]}></TextInput>
                <TextInput
                    multiline
                    value={discription}
                    onChange={handlediscription}
                    placeholder="내용을 입력하세요"
                    placeholderTextColor={"lightgray"}
                    style={[styles.bar_large, { marginHorizontal: width * 0.07, marginTop: 10, textAlignVertical: 'top', paddingTop: 12 }]}></TextInput>
                <TouchableOpacity style={[styles.bar_small, { marginHorizontal: width * 0.07, marginTop: 20, alignItems: "center" }]}>완료</TouchableOpacity>
            </View>

            }
            {calendaron && <View>
                <View
                    style={{ marginHorizontal: width * 0.07, marginTop: 20 }}
                >
                    <Calendar
                        current={curdate}
                        markedDates={{
                            [curdate]: { selected: true, selectedColor: 'black' }, // 원 + selectedDotColor 로 점 보이게
                        }}
                        onDayPress={(day) =>{ 
                            setcurdate(day.dateString)
                        }}
                    ></Calendar>
                </View>


            </View>}
        </View>
    );
}

const styles = StyleSheet.create({
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
    calendaricon: {
        position: "absolute",
        right: 10

    },
    container: {
        flex: 1,
        backgroundColor: "rgba(255, 230, 0, 1)",
        flexDirection: "column"
    },
    bar_small: {
        backgroundColor: "white",
        height: 50,
        borderRadius: 10,
        padding: 12,
    },
    bar_large: {
        backgroundColor: "white",
        height: 200,
        borderRadius: 10,
        padding: 10
    }
})
