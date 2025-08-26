import React, { useState } from "react";
import styled from "styled-components/native";
import RuleInput from "./RuleInput";
import { Text } from "react-native";

const Card = styled.TouchableOpacity`
  width: ${({ cardWidth }) => cardWidth}px;
  height: 150px;
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 5px;
  position: relative;
  overflow: visible;
`;

const ModiButton = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  border-radius: 12px;
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
  font-family: 'Doner Regular Display';
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

  font-family: 'Pretendard SemiBold';
`;

const TaskDescription = styled.Text`
  font-size: 12px;
  color: #333333;
  opacity: 0.8;
  z-index: 10;

  font-family: 'Pretendard';
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
  width: 80px;
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
  padding: 12px;
  align-items: center;
  border-bottom-width: ${({ isLast }) => (isLast ? 0 : 1)}px;
  border-bottom-color: #f0f0f0;
`;


const MenuText = styled.Text`
  font-size: 14px;
  color: #333333;
  font-weight: 500;
`;

// 전체화면 오버레이 (드롭다운 외부 클릭 감지용)
/*
const Overlay = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
`;
*/
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

  const handleCardEditing = () => {
    console.log("Editing card:", item);
    onEdit(item);
    setShowDropdown(false);
  };

  const handleDelete = () => {
    deleteTask(item.id);
    setShowDropdown(false);
  };

  const handleMenuPress = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };
/*
  const handleOverlayPress = () => {
    setShowDropdown(false);
  };
*/
  return (
    <>
      {/*showDropdown && <Overlay onPress={handleOverlayPress} />*/}
      <Card
        cardWidth={cardWidth}
        /*onPress={handleCardEditing}
        onLongPress={handleToggle}*/
      >
        <PuzzleImage
          source={isYellow ? require("./rule_y.png") : require("./rule_p.png")}
          cardWidth={cardWidth}
          resizeMode="cover"
        />

        <ModiButton onPress={handleMenuPress}>
          <ModifyImage source={require("./option.png")} resizeMode="cover" />
        </ModiButton>

        {showDropdown && (
          <DropdownMenu>
            <MenuButton
              onPress={(e) => {
                e.stopPropagation(); // <-- 이 줄을 추가합니다.
                handleCardEditing();
              }}
            >
              <MenuText>수정</MenuText>
            </MenuButton>
            <MenuButton onPress={handleDelete}>
              <MenuText>삭제</MenuText>
            </MenuButton>
          </DropdownMenu>
        )}

        <TaskNumber>{String(taskNumber).padStart(2, "0")}</TaskNumber>
        <TaskTitle completed={item.completed}>{item.text}</TaskTitle>
        <TaskDescription>{item.description}</TaskDescription>
      </Card>
    </>
  );
};

export default PuzzleCard;
