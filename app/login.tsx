import { router } from "expo-router";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const screenWidth = Dimensions.get("window").width;

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      {/* BIZ 로고 */}
      <Text style={styles.logo}>로그인</Text>

      {/* 버튼들 */}
      <View style={styles.buttonContainer}>
        {/* 1. 다른 방법으로 로그인 */}
        <TouchableOpacity style={[styles.button, styles.blackButton]} onPress={()=>{router.push("/(tabs)/home")}}>
          <Text style={styles.blackButtonText}>다른 방법으로 로그인</Text>
        </TouchableOpacity>

        {/* 2. 카카오 로그인 */}
        <TouchableOpacity style={[styles.button, styles.kakaoButton]}>
          <View style={styles.iconTextWrapper}>
            {/* <Image source={require('../assets/kakao-icon.png')} style={styles.icon} /> */}
            <Text style={styles.kakaoButtonText}>카카오로 로그인</Text>
          </View>
        </TouchableOpacity>

        {/* 3. 구글 로그인 */}
        <TouchableOpacity style={[styles.button, styles.googleButton]}>
          <View style={styles.iconTextWrapper}>
            {/* <Image source={require('../assets/google-icon.png')} style={styles.icon} /> */}
            <Text style={styles.googleButtonText}>구글로 로그인</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: "6%",
  },
  logo: {
    color: '#222221',
    textAlign: 'center',
    fontFamily: 'NanumSquareNeo',
    fontSize: 40,
    fontWeight: '400',         // 350은 애매하니 400 또는 가장 근접한 걸로
    fontStyle: 'normal',
    lineHeight: 60,
    letterSpacing: -1,
    marginBottom:"70%"
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
  },
  blackButton: {
    backgroundColor: 'black',
  },
  blackButtonText: {
    color: 'white',
    fontSize: screenWidth * 0.04,
    textAlign: 'center',
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  kakaoButtonText: {
    color: '#3c1e1e',
    fontSize: screenWidth * 0.04,
    marginLeft: 8,
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  googleButtonText: {
    color: '#333',
    fontSize: screenWidth * 0.04,
    marginLeft: 8,
  },
  iconTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  },
});