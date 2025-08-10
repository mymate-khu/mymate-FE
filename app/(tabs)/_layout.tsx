import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, Text } from 'react-native';

import HomeIcon from '@/assets/image/tabsicon/home_Icon.svg';
import CalendarIcon from '@/assets/image/tabsicon/calendar_Icon.svg';
import AdjustmentIcon from '@/assets/image/tabsicon/adjustment_Icon.svg';
import RulesIcon from '@/assets/image/tabsicon/rules_Icon.svg';

import { HapticTab } from '@/components/HapticTab';

const FixedLabel = ({ title }: { title: string }) => (
  <Text style={{ fontSize: 10, color: 'black' }}>{title}</Text>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: (p) => <HapticTab {...p} />,
        tabBarActiveTintColor: 'rgba(255, 230, 0, 1)',
        tabBarInactiveTintColor: 'white',


        // 2) 탭바 배경 완전 투명 + 그림자 제거
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: 'white',
            borderTopWidth: 0,
            shadowOpacity: 0,
          },
          default: {
            backgroundColor: 'white',
            borderTopWidth: 0,
            elevation: 0,
          },
        }),

        // 3) iOS 기본 블러/배경을 완전히 덮어쓰기
        tabBarBackground: () => (
          <View style={{ flex: 1, backgroundColor: 'transparent' }} />
        ),

        // (선택) 눌렀을 때도 배경색 고정/투명 유지
        tabBarActiveBackgroundColor: 'transparent',
        tabBarInactiveBackgroundColor: 'transparent',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: () => <FixedLabel title="홈" />,
          tabBarIcon: ({ color, size }) => (
            <HomeIcon width={size ?? 28} height={size ?? 28} fill={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          tabBarLabel: () => <FixedLabel title="캘린더" />,
          tabBarIcon: ({ color, size }) => (
            <CalendarIcon width={size ?? 28} height={size ?? 28} fill={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="adjustment"
        options={{
          tabBarLabel: () => <FixedLabel title="정산" />,
          tabBarIcon: ({ color, size }) => (
            <AdjustmentIcon width={size ?? 28} height={size ?? 28} fill={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rules"
        options={{
          tabBarLabel: () => <FixedLabel title="규칙" />,
          tabBarIcon: ({ color, size }) => (
            <RulesIcon width={size ?? 28} height={size ?? 28} fill={color} />
          ),
        }}
      />
    </Tabs>
  );
}
