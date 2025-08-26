import React, { useState } from "react";
import { Dimensions, StatusBar, Modal } from "react-native";
import styled from "styled-components/native";
import RuleInput from "./RuleInput";
import PuzzleCard from "./PuzzleCard";
import RuleModal from "./RuleModal";

const { width: screenWidth } = Dimensions.get("window");

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

const RuleApp = () => {
  const [newTask, setNewTask] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [tasks, setTasks] = useState({});
  const [newDescription, setNewDescription] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      const ID = Date.now().toString();
      const newTaskObject = {
        [ID]: {
          id: ID,
          text: newTask,
          description: newDescription,
          completed: false,
        },
      };
      setNewTask("");
      setNewDescription("");
      setTasks({ ...tasks, ...newTaskObject });
      setShowInput(false);
      setShowModal(false);
    }
  };

  const deleteTask = (id) => {
    const currentTask = { ...tasks };
    delete currentTask[id];
    setTasks(currentTask);
  };

  const updateTask = (item) => {
    const currentTask = { ...tasks };
    currentTask[item.id] = item;
    setTasks(currentTask);
    setShowModal(false);
    setEditingTask(null);
  };

  const handleTextChange = (text) => {
    setNewTask(text);
  };

  const onBlur = () => {
    setNewTask("");
    setShowInput(false);
  };

  const showAddInput = () => {
    setEditingTask(null);
    setNewTask("");
    setNewDescription("");
    setShowModal(true);
  };

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

  // 태스크를 행으로 그룹화
  const taskArray = Object.values(tasks);
  const rows = [];
  for (let i = 0; i < taskArray.length; i += 2) {
    rows.push(taskArray.slice(i, i + 2));
  }

  return (
    <Container>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Title>규칙은 딱 필요한 만큼만,{"\n"}서로 편하게</Title>

      {showInput && (
        <RuleInput
          placeholder="새 태스크 추가"
          value={newTask}
          onChangeText={handleTextChange}
          onSubmitEditing={addTask}
          onBlur={onBlur}
        />
      )}

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
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  onEdit={handleCardEdit}
                  cardWidth={(screenWidth - 70) / 2}
                />
              );
            })}
            {/* 홀수 개의 아이템이 있을 때 빈 공간 채우기 */}
            {row.length === 1 && (
              <AddButton onPress={showAddInput}>
                <AddButtonBg source={require("./rule_g.png")} />
                <AddButtonIcon source={require("./plus.png")} />
                <AddButtonLabel>규칙 추가하기</AddButtonLabel>
              </AddButton>
            )}
          </Row>
        ))}

        {/* 새 행에 추가 버튼 표시 (짝수 개의 아이템일 때) */}
        {taskArray.length % 2 === 0 && (
          <Row>
            <AddButton onPress={showAddInput}>
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
        value={newTask}
        onChangeText={setNewTask}
        description={newDescription} // 추가
        onDescriptionChange={setNewDescription} // 추가
        isEdit={!!editingTask}
      />
    </Container>
  );
};

export default RuleApp;
