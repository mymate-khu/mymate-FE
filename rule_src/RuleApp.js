import React, { useState, useEffect } from "react";
import { Dimensions, StatusBar, Modal, ActivityIndicator, Alert } from "react-native";
import styled from "styled-components/native";
import PuzzleCard from "./PuzzleCard";
import RuleModal from "./RuleModal";

const { width: screenWidth } = Dimensions.get("window");

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
  align-items: center;
  justify-content: flex-start;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: 600;
  color: #333333;
  text-align: left;
  margin: 50px 100px 30px 20px;
  font-family: "Pretendard Bold";
`;

const PuzzleContainer = styled.ScrollView`
  flex: 1;
  width: ${screenWidth - 44}px;
  padding: 10px 10px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: -40px;
`;

const AddButton = styled.TouchableOpacity`
  width: ${(screenWidth - 80) / 2}px;
  height: 150px;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const AddButtonBg = styled.Image`
  position: absolute;
  top: 0;
  left: 0;
  width: ${(screenWidth - 80) / 2}px;
  height: 125px;
  border-radius: 15px;
`;

const AddButtonIcon = styled.Image`
  width: 40px;
  height: 30px;
  margin-top: -20px;
  margin-bottom: 10px;
  z-index: 10;
`;

const AddButtonLabel = styled.Text`
  font-size: 14px;
  color: #999999;
  text-align: center;
  z-index: 10;
`;

// API 호출을 위한 기본 URL (실제 서버 URL로 변경해주세요!)
const BASE_URL = "https://your-api-server.com/api";

const RuleApp = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 규칙 목록을 서버에서 가져오는 함수
  const fetchRules = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/RuleBook`, {
        method: 'GET'
      });
      if (!response.ok) {
        throw new Error("규칙 목록을 가져오는 데 실패했습니다.");
      }
      const data = await response.json();
      setTasks(data); // API 응답이 규칙 목록 배열이라고 가정
    } catch (error) {
      console.error("규칙 불러오기 실패:", error);
      Alert.alert("오류", "규칙 목록을 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const addRule = async () => {
    if (newTaskTitle.trim()) {
      try {
        const response = await fetch(`${BASE_URL}/RuleBook`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newTaskTitle,
            content: newDescription,
            // 기타 필요한 필드 추가
          }),
        });
        if (!response.ok) {
          throw new Error("규칙 추가에 실패했습니다.");
        }
        await fetchRules(); // 성공 시 목록을 다시 불러와 화면 업데이트
        closeModal();
      } catch (error) {
        console.error("규칙 추가 실패:", error);
        Alert.alert("오류", "규칙을 추가하는 데 실패했습니다.");
      }
    }
  };

  const updateRule = async (id) => {
    if (newTaskTitle.trim()) {
      try {
        const response = await fetch(`${BASE_URL}/RuleBook`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newTaskTitle,
            content: newDescription,
            // 기타 필요한 필드 추가
          }),
        });
        if (!response.ok) {
          throw new Error("규칙 수정에 실패했습니다.");
        }
        await fetchRules();
        closeModal();
      } catch (error) {
        console.error("규칙 수정 실패:", error);
        Alert.alert("오류", "규칙을 수정하는 데 실패했습니다.");
      }
    }
  };

  const deleteRule = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/RuleBook`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ruleId: id
        }),
      });
      if (!response.ok) {
        throw new Error("규칙 삭제에 실패했습니다.");
      }
      await fetchRules();
    } catch (error) {
      console.error("규칙 삭제 실패:", error);
      Alert.alert("오류", "규칙을 삭제하는 데 실패했습니다.");
    }
  };

  const handleCardEdit = (task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewDescription(task.content || "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setNewTaskTitle("");
    setNewDescription("");
  };

  const handleModalSave = () => {
    if (editingTask) {
      updateRule(editingTask.id);
    } else {
      addRule();
    }
  };

  const taskArray = Object.values(tasks);
  const rows = [];
  for (let i = 0; i < taskArray.length; i += 2) {
    rows.push(taskArray.slice(i, i + 2));
  }
  
  if (isLoading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#FFD700" />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Title>규칙은 딱 필요한 만큼만,{"\n"}서로 편하게</Title>
      
      <PuzzleContainer showsVerticalScrollIndicator={false}>
        {rows.map((row, rowIndex) => (
          <Row key={rowIndex}>
            {row.map((item, colIndex) => {
              const taskIndex = rowIndex * 2 + colIndex + 1;
              return (
                <PuzzleCard
                  key={item.id}
                  item={item}
                  taskNumber={taskIndex}
                  isYellow={(rowIndex + colIndex) % 2 === 0}
                  deleteTask={deleteRule}
                  updateTask={() => {}} // API 연동으로 이 함수는 사용하지 않게 됨
                  onEdit={handleCardEdit}
                  cardWidth={(screenWidth - 70) / 2}
                />
              );
            })}
            {row.length === 1 && (
              <AddButton onPress={() => setShowModal(true)}>
                <AddButtonBg source={require("./rule_g.png")} />
                <AddButtonIcon source={require("./plus.png")} />
                <AddButtonLabel>규칙 추가하기</AddButtonLabel>
              </AddButton>
            )}
          </Row>
        ))}
        {taskArray.length % 2 === 0 && (
          <Row>
            <AddButton onPress={() => setShowModal(true)}>
              <AddButtonBg source={require("./rule_g.png")} />
              <AddButtonIcon source={require("./plus.png")} />
              <AddButtonLabel>규칙 추가하기</AddButtonLabel>
            </AddButton>
          </Row>
        )}
      </PuzzleContainer>

      <RuleModal
        visible={showModal}
        onClose={closeModal}
        onSave={handleModalSave}
        value={newTaskTitle}
        onChangeText={setNewTaskTitle}
        description={newDescription}
        onDescriptionChange={setNewDescription}
        isEdit={!!editingTask}
      />
    </Container>
  );
};

export default RuleApp;
