import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import FCMService from './FCMService';

const FCMExample: React.FC = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 FCM 토큰 가져오기
    getFCMToken();
  }, []);

  const getFCMToken = async () => {
    try {
      const fcmService = FCMService.getInstance();
      const token = await fcmService.getFCMToken();
      
      if (token) {
        setFcmToken(token);
        setIsInitialized(true);
      } else {
        Alert.alert('오류', 'FCM 토큰을 가져올 수 없습니다');
      }
    } catch (error) {
      console.error('FCM 토큰 가져오기 오류:', error);
      Alert.alert('오류', 'FCM 토큰을 가져오는 중 오류가 발생했습니다');
    }
  };

  const refreshToken = async () => {
    try {
      const fcmService = FCMService.getInstance();
      const newToken = await fcmService.getFCMToken();
      
      if (newToken) {
        setFcmToken(newToken);
        Alert.alert('성공', 'FCM 토큰이 새로고침되었습니다');
      }
    } catch (error) {
      console.error('FCM 토큰 새로고침 오류:', error);
      Alert.alert('오류', 'FCM 토큰 새로고침 중 오류가 발생했습니다');
    }
  };

  const sendTokenToServer = async () => {
    if (!fcmToken) {
      Alert.alert('오류', 'FCM 토큰이 없습니다');
      return;
    }

    try {
      const fcmService = FCMService.getInstance();
      const success = await fcmService.sendTokenToServer(fcmToken);
      
      if (success) {
        Alert.alert('성공', 'FCM 토큰이 서버에 전송되었습니다');
      } else {
        Alert.alert('오류', 'FCM 토큰 서버 전송에 실패했습니다');
      }
    } catch (error) {
      console.error('FCM 토큰 서버 전송 오류:', error);
      Alert.alert('오류', 'FCM 토큰 서버 전송 중 오류가 발생했습니다');
    }
  };

  const showLocalNotification = async () => {
    try {
      const fcmService = FCMService.getInstance();
      await fcmService.displayNotification(
        '테스트 알림',
        '이것은 로컬 알림 테스트입니다!'
      );
    } catch (error) {
      console.error('로컬 알림 표시 오류:', error);
      Alert.alert('오류', '로컬 알림 표시 중 오류가 발생했습니다');
    }
  };

  const copyTokenToClipboard = () => {
    if (fcmToken) {
      // 클립보드에 복사하는 로직 (expo-clipboard 사용)
      Alert.alert('복사됨', 'FCM 토큰이 클립보드에 복사되었습니다');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FCM 토큰 테스트</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>초기화 상태:</Text>
        <Text style={[styles.statusValue, { color: isInitialized ? 'green' : 'red' }]}>
          {isInitialized ? '완료' : '미완료'}
        </Text>
      </View>

      {fcmToken && (
        <View style={styles.tokenContainer}>
          <Text style={styles.tokenLabel}>FCM 토큰:</Text>
          <Text style={styles.tokenValue} numberOfLines={3}>
            {fcmToken}
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={getFCMToken}>
          <Text style={styles.buttonText}>토큰 가져오기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={refreshToken}>
          <Text style={styles.buttonText}>토큰 새로고침</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={sendTokenToServer}
          disabled={!fcmToken}
        >
          <Text style={[styles.buttonText, !fcmToken && styles.disabledText]}>
            서버에 토큰 전송
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={showLocalNotification}>
          <Text style={styles.buttonText}>로컬 알림 테스트</Text>
        </TouchableOpacity>

        {fcmToken && (
          <TouchableOpacity style={styles.button} onPress={copyTokenToClipboard}>
            <Text style={styles.buttonText}>토큰 복사</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tokenContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tokenLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  tokenValue: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    opacity: 0.5,
  },
});

export default FCMExample;
