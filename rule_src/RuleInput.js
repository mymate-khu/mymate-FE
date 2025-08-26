import React from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

const { width: screenWidth } = Dimensions.get("window");

const InputContainer = styled.View`
  width: ${({ width }) => width}px;
  margin: 10px 0;
`;

const StyledInput = styled.TextInput`
  width: ${({ width }) => width}px;
  height: ${({ isEditMode }) => isEditMode ? 150 : 60}px;
  padding: 15px 20px;
  border-radius: 15px;
  background-color: ${({ isEditMode }) => isEditMode ? '#f8f8f8' : '#f8f8f8'};
  font-size: 16px;
  color: #333333;
  border: ${({ isEditMode }) => isEditMode ? '2px solid #007AFF' : '1px solid #e0e0e0'};
  text-align-vertical: ${({ isEditMode }) => isEditMode ? 'top' : 'center'};
`;

const RuleInput = ({
  placeholder,
  value,
  onChangeText,
  onSubmitEditing,
  onBlur,
  autoFocus = false,
  isEditMode = false,
  cardWidth
}) => {
  const inputWidth = isEditMode && cardWidth ? cardWidth : screenWidth - 40;

  return (
    <InputContainer width={inputWidth}>
      <StyledInput
        width={inputWidth}
        isEditMode={isEditMode}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        onBlur={onBlur}
        autoFocus={autoFocus}
        maxLength={50}
        multiline={isEditMode}
        placeholderTextColor="#999999"
      />
    </InputContainer>
  );
};

export default RuleInput;
