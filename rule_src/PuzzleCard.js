import React, { useState } from "react";
import styled from "styled-components/native";
import { Text, Alert } from "react-native";


const Card = styled.TouchableOpacity`
  width: ${({ cardWidth }) => cardWidth}px;
  /* Card 내부 여백 + TaskNumber/Title/Desc의 공간 */
  height: 125px; 
  border-radius: 10px; /* 배경 이미지와 동일하게 10px로 조정 */
  padding: 15px;
  margin-bottom: 25px; /* 다음 행 카드와의 간격 및 버튼 높이(25px) 반영 */
  position: relative;
  overflow: visible;
`;

const ModiButton = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px; /* 버튼 터치 영역 확장 */
  height: 28px;
  border-radius: 14px;
  justify-content: center;
  align-items: center;
  z-index: 20;
`;

const PuzzleImage = styled.Image`
  position: absolute;
  top: 0;
  left: 0;
  width: ${({ cardWidth }) => cardWidth}px;
  height: 125px;
  border-radius: 10px;
  z-index: 1;
`;

const TaskNumber = styled.Text`
  font-size: 18px;
  color: #000000;
  margin-bottom: 5px;
  z-index: 10;
  /* font-family: 'Doner Regular Display'; */
`;

const TaskTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 8px;
  z-index: 10;
  text-decoration-line: ${({ completed }) =>
    completed ? "line-through" : "none"};
  opacity: ${({ completed }) => (completed ? 0.6 : 1)};
`;

const TaskDescription = styled.Text`
  font-size: 12px;
  color: #333333;
  opacity: 0.8;
  z-index: 10;
`;


const ModifyImage = styled.Image`
  width: 24px;
  height: 24px;
  border-radius: 12px;
`;

const DropdownMenu = styled.View`
  position: absolute;
  top: 35px;
  right: 10px;
  width: 90px;
  background-color: white;
  border-radius: 8px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
  z-index: 100;
`;

const MenuButton = styled.TouchableOpacity`
  padding: 10px 12px;
  align-items: flex-start;
  border-bottom-width: ${({ isLast }) => (isLast ? 0 : 1)}px;
  border-bottom-color: #f0f0f0;
`;

const MenuText = styled.Text`
  font-size: 14px;
  color: ${({ isDelete }) => (isDelete ? '#FF3B30' : '#333333')};
  font-weight: 500;
`;

const PuzzleCard = ({
  item,
  taskNumber,
  isYellow,
  deleteTask,
  updateTask,
  onEdit,
  cardWidth,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleToggleCompleted = () => {
    const updatedItem = {
      ...item,
      completed: !item.completed,
    };
    // RuleApp의 updateTask를 호출하여 API를 통해 완료 상태를 업데이트
    updateTask(updatedItem);
  };

  const handleCardEditing = () => {
    onEdit(item);
    setShowDropdown(false);
  };

  const handleDelete = () => {
    Alert.alert(
      "규칙 삭제",
      `'${item.text}' 규칙을 정말 삭제하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        { text: "삭제", style: "destructive", onPress: () => deleteTask(item.rulebookId) },
      ]
    );
    setShowDropdown(false);
  };

  const handleMenuPress = (e) => {
    e.stopPropagation(); 
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <Card
        cardWidth={cardWidth}
        onPress={handleToggleCompleted} 
        activeOpacity={0.8}
      >
        <PuzzleImage
          source={isYellow ? require("./rule_y.png") : require("./rule_p.png")}
          cardWidth={cardWidth}
          resizeMode="cover"
        />

        <ModiButton onPress={handleMenuPress}>
          <ModifyImage source={require("./option.png")} resizeMode="contain" />
        </ModiButton>

        {showDropdown && (
          <DropdownMenu>
            <MenuButton
              onPress={(e) => {
                e.stopPropagation();
                handleCardEditing();
              }}
            >
              <MenuText>수정</MenuText>
            </MenuButton>
            <MenuButton onPress={handleDelete} isLast={true}>
              <MenuText isDelete={true}>삭제</MenuText>
            </MenuButton>
          </DropdownMenu>
        )}
        
        {/* 드롭다운이 열려 있을 때 카드 본문의 상호작용을 막기 위해 zIndex 조정 */}
        <Text style={{ zIndex: 10 }}>
          <TaskNumber>{String(taskNumber).padStart(2, "0")}</TaskNumber>
        </Text>
        <TaskTitle completed={item.completed}>{item.text}</TaskTitle>
        <TaskDescription>{item.description}</TaskDescription>
      </Card>
    </>
  );
};

export default PuzzleCard;
