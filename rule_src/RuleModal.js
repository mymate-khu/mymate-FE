import React from 'react';
import { Modal, Dimensions } from 'react-native';
import styled from 'styled-components/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.View`
  width: ${screenWidth - 60}px;
  background-color: white;
  border-radius: 20px;
  padding: 30px 20px;
  align-items: center;
`;

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 30px;

  font-family: 'Pretendard';
`;

const InputContainer = styled.View`
  width: 100%;
  margin-bottom: 20px;
`;

const InputLabel = styled.Text`
  font-size: 16px;
  color: #333333;
  margin-bottom: 10px;
  font-weight: 600;

  font-family: 'Pretendard';
`;

const StyledInput = styled.TextInput`
  width: 100%;
  height: 100px;
  padding: 15px;
  border-radius: 10px;
  background-color: #f8f8f8;
  font-size: 16px;
  color: #333333;
  border: 1px solid #e0e0e0;
  text-align-vertical: top;

  font-family: 'Pretendard';
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
`;

const Button = styled.TouchableOpacity`
  flex: 1;
  height: 50px;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
`;

const CancelButton = styled(Button)`
  background-color: #f0f0f0;
`;

const SaveButton = styled(Button)`
  background-color: #FFD700;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ isCancel }) => isCancel ? '#666666' : '#000000'};
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
`;

const CloseText = styled.Text`
  font-size: 24px;
  color: #999999;
`;



const RuleModal = ({ visible, onClose, onSave, value, onChangeText: onChangeTitle, isEdit, description, onDescriptionChange }) => {
  const handleSave = () => {
    if (value.trim()) {
      onSave();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <ModalOverlay>
        <ModalContainer>
          <CloseButton onPress={onClose}>
            <CloseText>×</CloseText>
          </CloseButton>
          
          <ModalTitle>
            {isEdit ? '규칙 수정하기' : '규칙 등록하기'}
          </ModalTitle>
          
          <InputContainer>
            <InputLabel>제목</InputLabel>
            <StyledInput
              placeholder=""
              value={value}
              onChangeText={onChangeTitle}
              maxLength={50}
              multiline={true}
              placeholderTextColor="#999999"

            />
          </InputContainer>
          
          <InputContainer>
            <InputLabel>내용</InputLabel>
            <StyledInput
              placeholder=""
              value={description}
              onChangeText={onDescriptionChange}
              multiline={true}
              placeholderTextColor="#999999"
            />
          </InputContainer>
          
          <ButtonContainer>
            <CancelButton onPress={onClose}>
              <ButtonText isCancel={true}>취소</ButtonText>
            </CancelButton>
            <SaveButton onPress={handleSave}>
              <ButtonText>완료</ButtonText>
            </SaveButton>
          </ButtonContainer>
        </ModalContainer>
      </ModalOverlay>
    </Modal>
  );
};

export default RuleModal;