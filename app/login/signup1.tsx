import { View, StyleSheet, Text, useWindowDimensions, TouchableOpacity, Image } from "react-native"
import { router } from "expo-router"
import { useEffect, useState } from "react";
import Check from "@/assets/image/signupcheckimg/Check.png"
import Check2 from "@/assets/image/signupcheckimg/Check2.png"

export default function Signup1() {

    const items = [
        "서비스이용약관 (필수)",
        "개인정보 수집/이용 동의 (필수)",
        "개인정보 제3자 정보제공 동의",
        "만 14세 이상 확인 (필수)",
        "마케팅 활용 동의 (선택)"
    ]

    const { width, height } = useWindowDimensions();

    const [selected, setselected] = useState([])

    const [allselected, setallselected] = useState(false)

    useEffect(() => {
        setselected(Array(items.length).fill(false));
    }, [])

    const btnClick = (i: any) => {
        const arr = [...selected]
        if(arr[i] === true){
            setallselected(false)
        }
        arr[i] = !arr[i]
        setselected(arr)
    }

    const allbtnClick = () => {
        if (allselected) {
            setselected(Array(items.length).fill(false));
        }
        else {
            setselected(Array(items.length).fill(true));
        }
        setallselected(!allselected)

    }


    return <View style={styles.container}>
        <View style={styles.header}>
            <Text style={{ fontSize: 16, fontWeight: 500, }}>회원가입</Text>
            <Text style={styles.arrow} onPress={() => { router.back() }}>{"<"}</Text>
        </View>

        <View style={[styles.discript, { marginHorizontal: width * 0.07 }]}>
            <Text style={{ fontSize: 30, fontWeight: 700 }}>서비스 이용을 위해</Text>
            <Text style={{ fontSize: 30, fontWeight: 700 }}>이용약관 동의가 필요합니다</Text>
        </View>
        <View style={[styles.firstbar, { marginHorizontal: width * 0.07, marginTop: 50 }]}>
            <Text style={{ fontWeight: 600, fontSize: 20 }}>전체 동의</Text>
            <TouchableOpacity
                onPress={() => { allbtnClick() }}
                style={{ right: 10, position: "absolute" }}>
                {!allselected ? <Image source={Check} /> : <Image source={Check2} />}
            </TouchableOpacity>
        </View>
        <View style={{ marginHorizontal: width * 0.07 }}>
            {items.map((item, index) => (
                <View key={index} style={styles.bar}>
                    <Text style={{ color: "#797979" }}>{item}</Text>
                    <TouchableOpacity
                        onPress={() => { btnClick(index) }}
                        style={{ right: 10, position: "absolute" }}>
                        {!selected[index] ? <Image source={Check} /> : <Image source={Check2} />}
                    </TouchableOpacity>
                </View>
            ))}
        </View>

        <TouchableOpacity 
        onPress={()=>{router.push("/login/signup2")}}
        style={[{ marginHorizontal: width * 0.07},styles.btn]}>
            <Text style={{fontFamily:"PretendardSemiBold",fontWeight:500,fontSize:17}}>다음</Text>
        </TouchableOpacity>
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
    discript: {
        height: 100,
        marginTop: 50
    },
    bar: {
        height: 50,
        justifyContent: "center",
    },
    firstbar: {
        height: 80,
        justifyContent: "center",
        borderBottomColor: "lightgray",
        borderBottomWidth: 1,
    },
    btn:{
        height:50,
        backgroundColor:"rgba(255, 230, 0, 1)",
        marginTop:50,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:10,
    }
})