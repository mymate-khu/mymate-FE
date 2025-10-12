import React, { useState, useEffect } from "react";
import { Dimensions, StatusBar, Modal, Alert, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage 추가
import RuleInput from "./RuleInput";
import PuzzleCard from "./PuzzleCard";
import RuleModal from "./RuleModal";

const { width: screenWidth } = Dimensions.get("window");

const BASE_URL = "http://13.209.214.254:8080";

// ⚠️ YOUR_AUTH_TOKEN 상수를 제거하고, 토큰을 비동기적으로 불러와 사용할 것입니다.

// =========================================================================
// 규칙 객체 구조 (JavaScript 주석으로 정의)
// {
//   rulebookId: number, 
//   text: string, 
//   description: string, 
//   completed: boolean, 
// }
// =========================================================================

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
  align-items: center;
  justify-content: flex-start;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: 600;
  color: #333333;
  text-align: left;
  /* width: ${screenWidth - 40}px; */
  /* margin-left를 조정하여 정렬 */
  margin: 50px 0px 30px 20px; 

  font-family: "Pretendard Bold";
`;

const PuzzleContainer = styled.ScrollView`
  flex: 1;
  width: ${screenWidth - 40}px; /* 좌우 20px 마진을 위해 40px 제외 */
  padding: 10px 0px; 
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px; /* 카드 간격 */
`;

const AddButton = styled.TouchableOpacity`
  width: ${(screenWidth - 70) / 2}px; /* RuleApp.js의 PuzzleCard와 동일한 width를 사용 */
  height: 125px; /* PuzzleImage와 동일한 높이 */
  border-radius: 10px; /* PuzzleImage와 동일한 radius */
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 25px; /* PuzzleCard의 높이 차이만큼 추가 마진 */
`;

const AddButtonBg = styled.Image`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
`;

const AddButtonIcon = styled.Image`
  width: 40px;
  height: 30px;
  margin-bottom: 10px;
  z-index: 10;
`;

const AddButtonLabel = styled.Text`
  font-size: 14px;
  color: #999999;
  text-align: center;
  z-index: 10;
`;

const LoadingView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;


const RuleApp = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [authToken, setAuthToken] = useState(null); // JWT 토큰 상태 추가

  // =========================================================================
  // 토큰 불러오기 및 설정
  // =========================================================================
  const loadAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        setAuthToken(`Bearer ${token}`);
      } else {
        // 토큰이 없으면 로그인 페이지로 리다이렉트하거나 오류 처리
        Alert.alert("인증 오류", "로그인이 필요합니다.", [{ text: "확인" }]);
        // router.replace("../login"); // 실제 앱에서는 로그인 화면으로 이동하는 로직 필요
      }
    } catch (e) {
      console.error("토큰 로드 실패", e);
      Alert.alert("오류", "인증 정보를 가져오는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    // 1. 토큰 로드
    loadAuthToken();
  }, []);

  useEffect(() => {
    // 2. 토큰이 로드된 후 규칙 조회 시작
    if (authToken) {
        fetchRules();
    }
    // 토큰이 로드되기 전까지는 로딩 상태 유지
    if (authToken === null) {
        setIsLoading(true);
    }
  }, [authToken]);


  // =========================================================================
  // API 요청 유틸리티 함수 (중복 제거 및 토큰 헤더 적용)
  // =========================================================================
  const makeApiCall = async (endpoint, method, body = null) => {
    if (!authToken) {
      Alert.alert("인증 필요", "로그인 상태가 아닙니다.");
      return null;
    }

    const headers = {
        'Authorization': authToken,
        'Content-Type': 'application/json',
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: method,
            headers: headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        const jsonResponse = await response.json();

        if (response.ok && jsonResponse.isSuccess) {
            return jsonResponse;
        } else {
            // API에서 isSuccess=false 또는 HTTP 오류(4xx, 5xx)가 발생한 경우
            throw new Error(jsonResponse.message || `API 호출 실패: ${endpoint}`);
        }
    } catch (error) {
        console.error(`${method} ${endpoint} 실패:`, error);
        throw error; // 호출한 쪽에서 처리할 수 있도록 에러를 다시 throw
    }
  };


  // =========================================================================
  // 1. READ (규칙 조회)
  // =========================================================================
  const fetchRules = async () => {
    setIsLoading(true);
    try {
      const jsonResponse = await makeApiCall("/rulebook", "GET");
      
      if (jsonResponse) {
        const fetchedTasks = jsonResponse.data.map(item => ({
          rulebookId: item.rulebookId,
          text: item.title,
          description: item.content,
          completed: item.completed, 
        }));
        setTasks(fetchedTasks);
      }
    } catch (error) {
      Alert.alert("오류", "규칙 목록을 가져오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================================
  // 2. CREATE (규칙 생성)
  // =========================================================================
  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      await makeApiCall("/rulebook", "POST", {
          title: newTask,
          content: newDescription,
      });

      fetchRules(); 
      closeModal();
      
    } catch (error) {
      Alert.alert("오류", "규칙을 추가하는 데 실패했습니다.");
    }
  };

  // =========================================================================
  // 3. DELETE (규칙 삭제)
  // =========================================================================
  const deleteTask = async (id) => {
    try {
      await makeApiCall(`/rulebook/${id}`, "DELETE");
      setTasks(prevTasks => prevTasks.filter(task => task.rulebookId !== id));
      
    } catch (error) {
      Alert.alert("오류", "규칙을 삭제하는 데 실패했습니다.");
    }
  };

  // =========================================================================
  // 4. UPDATE (규칙 수정 및 완료 상태 토글)
  // =========================================================================
  const updateTask = async (item) => {
    try {
      await makeApiCall(`/rulebook/${item.rulebookId}`, "PATCH", {
        title: item.text,
        content: item.description,
        completed: item.completed,
      });

      setTasks(prevTasks => prevTasks.map(task => 
        task.rulebookId === item.rulebookId ? item : task
      ));
      
      if (showModal) {
          closeModal();
      }
    } catch (error) {
      Alert.alert("오류", "규칙을 수정하는 데 실패했습니다.");
    }
  };
  
  // =========================================================================
  // Helper Functions
  // =========================================================================
  const handleCardEdit = (task) => {
    setEditingTask(task);
    setNewTask(task.text);
    setNewDescription(task.description || "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setNewTask("");
    setNewDescription("");
  };

  const handleModalSave = () => {
    if (!newTask.trim()) {
      Alert.alert("알림", "제목을 입력해주세요.");
      return;
    }

    if (editingTask) {
      // 기존 규칙 수정
      const updatedTask = {
        ...editingTask,
        text: newTask,
        description: newDescription,
      };
      updateTask(updatedTask);
    } else {
      // 새 규칙 추가
      addTask();
    }
  };

  // =========================================================================
  // 렌더링 로직
  // =========================================================================
  const rows = [];
  for (let i = 0; i < tasks.length; i += 2) {
    rows.push(tasks.slice(i, i + 2));
  }
  
  // 로딩 중 표시 (토큰 로드 중이거나 규칙 조회 중인 경우)
  if (isLoading || authToken === null) {
    return (
      <Container>
        <LoadingView>
          <ActivityIndicator size="large" color="#FFD700" />
          <Title style={{ marginTop: 20 }}>규칙을 불러오는 중...</Title>
        </LoadingView>
      </Container>
    );
  }

  const cardWidth = (screenWidth - 70) / 2;
  
  return (
    <Container>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Title>규칙은 딱 필요한 만큼만,{"\n"}서로 편하게</Title>

      <PuzzleContainer showsVerticalScrollIndicator={false}>
        {tasks.length === 0 && (
          <Row>
            <AddButton onPress={() => setShowModal(true)}>
                <AddButtonBg source={require("./rule_g.png")} />
                <AddButtonIcon source={require("./plus.png")} />
                <AddButtonLabel>첫 규칙 추가하기</AddButtonLabel>
            </AddButton>
            <AddButton style={{ backgroundColor: 'transparent' }} disabled={true} />
          </Row>
        )}

        {rows.map((row, rowIndex) => (
          <Row key={rowIndex}>
            {row.map((item, colIndex) => {
              const taskIndex = rowIndex * 2 + colIndex + 1;
              return (
                <PuzzleCard
                  key={item.rulebookId}
                  item={item}
                  taskNumber={taskIndex}
                  isYellow={(rowIndex * 2 + colIndex) % 2 === 0} 
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  onEdit={handleCardEdit}
                  cardWidth={cardWidth}
                />
              );
            })}
            {/* 홀수 개의 아이템이 있을 때 추가 버튼 표시 */}
            {tasks.length > 0 && row.length === 1 && (
              <AddButton onPress={() => setShowModal(true)}>
                <AddButtonBg source={require("./rule_g.png")} />
                <AddButtonIcon source={require("./plus.png")} />
                <AddButtonLabel>규칙 추가하기</AddButtonLabel>
              </AddButton>
            )}
          </Row>
        ))}

        {/* 새 행에 추가 버튼 표시 (짝수 개의 아이템일 때) */}
        {tasks.length > 0 && tasks.length % 2 === 0 && (
          <Row>
            <AddButton onPress={() => setShowModal(true)}>
              <AddButtonBg source={require("./rule_g.png")} />
              <AddButtonIcon source={require("./plus.png")} />
              <AddButtonLabel>규칙 추가하기</AddButtonLabel>
            </AddButton>
            <AddButton style={{ backgroundColor: 'transparent' }} disabled={true} />
          </Row>
        )}
      </PuzzleContainer>

      <RuleModal
        visible={showModal}
        onClose={closeModal}
        onSave={handleModalSave}
        value={newTask}
        onChangeText={setNewTask}
        description={newDescription} 
        onDescriptionChange={setNewDescription}
        isEdit={!!editingTask}
      />
    </Container>
  );
};

export default RuleApp;
