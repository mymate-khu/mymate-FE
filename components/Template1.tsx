import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function Template1({
  name = "이름",
  title = "직책/직위",
  company = "회사 이름",
  phone = "전화번호",
  officePhone = "회사 전화번호",
  email = "이메일",
  officeEmail = "회사 이메일",
  officeAddress = "회사 주소",
}: any) {
  return (
      <TouchableOpacity style={styles.templateCard} onPress={() => {}}>
        <View style={styles.box}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.temp1box1sub1}>{title}</Text>
          <View style={{ height: 8 }} />
          <Text style={styles.temp1box1sub2}>{company}</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.temp1box2sub1}>{phone}</Text>
          <Text style={styles.temp1box2sub2}>{officePhone}</Text>
          <Text style={styles.temp1box2sub3}>{email}</Text>
          <Text style={styles.temp1box2sub4}>{officeEmail}</Text>
          <Text style={styles.temp1box2sub5}>{officeAddress}</Text>
        </View>
      </TouchableOpacity>

  );
}



const styles = StyleSheet.create({
    templateCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    width:"100%",
    height: "100%",
    padding: 16,
    elevation:3,
    borderRadius: 12,
    gap: 20,
  },
  box: {
    flex: 1,
   
  },
  name: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  temp1box1sub1: {
    position:"absolute",
    top:"25%",
    fontSize: 14,
    color: '#555',
    marginLeft:"2%"
  },
  temp1box1sub2: {
    position:"absolute",
    top:"90%",
    fontSize: 14,
    color: '#555',
    marginLeft:"2%"
  },
  temp1box2sub1: {
    position:"absolute",
    top:"34%",
    fontSize: 14,
    color: '#555',
    marginLeft:"2%"
  },
  temp1box2sub2: {
    position:"absolute",
    top:"48%",
    fontSize: 14,
    color: '#555',
    marginLeft:"2%"
  },
  temp1box2sub3: {
    position:"absolute",
    top:"62%",
    fontSize: 14,
    color: '#555',
    marginLeft:"2%"
  },
  temp1box2sub4: {
    position:"absolute",
    top:"76%",
    fontSize: 14,
    color: '#555',
    marginLeft:"2%"
  },
  temp1box2sub5: {
    position:"absolute",
    top:"90%",
    fontSize: 14,
    color: '#555',
    marginLeft:"2%"
  },
})