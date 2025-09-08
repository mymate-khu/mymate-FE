import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar, Image } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';


import ArrowLeftIcon from "@/assets/image/adjustmenticon/arrow_left_Icon.svg";
import SearchBlackIcon from "@/assets/image/adjustmenticon/searchblack_Icon.svg";
import DropDownIcon from "@/assets/image/adjustmenticon/dropdown_Icon.svg";
import DetailIcon from "@/assets/image/adjustmenticon/detail_Icon.svg";
import ShopbagIcon from "@/assets/image/adjustmenticon/shopbag_Icon.svg";
import CutleryIcon from "@/assets/image/adjustmenticon/cutlery_Icon.svg";
import TagIcon from "@/assets/image/adjustmenticon/tag_Icon.svg";
import CarIcon from "@/assets/image/adjustmenticon/car_Icon.svg";
import HouseIcon from "@/assets/image/adjustmenticon/house_Icon.svg";
import TicketIcon from "@/assets/image/adjustmenticon/ticket_Icon.svg";


export function GradientAvatar({ uri }: { uri: string }) {
  return (
    <LinearGradient
      colors={['#FFE81C', '#EBD29C', '#DDC2FA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={ga.ring}
    >
      <View style={ga.hole}>
        <Image source={{ uri }} style={ga.img} />
      </View>
    </LinearGradient>
  );
}

const AVATAR = 40;
const ga = StyleSheet.create({
  ring: {
    width: AVATAR + 2,
    height: AVATAR + 2,
    borderRadius: (AVATAR + 2) / 2,
    padding: 1,
  },
  hole: {
    flex: 1,
    borderRadius: AVATAR / 2,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
    borderRadius: AVATAR / 2,
  },
});


function AdjustmentCard() {
	const [menuOpen, setMenuOpen] = useState(false);       // 메뉴 열림 여부
  const [status, setStatus] = useState<'done' | 'todo'>('todo'); // 배지용 예시 상태

  const closeMenu = () => setMenuOpen(false);
  const onPressDone = () => { setStatus('done'); closeMenu(); };
  const onPressTodo = () => { setStatus('todo'); closeMenu(); };
  const onPressEdit = () => { /* TODO: 수정 화면 */ closeMenu(); };
  const onPressDelete = () => { /* TODO: 삭제 */ closeMenu(); };

  return (
    <View style={s.card}>
      {/* 1) 상단 */}
      <View style={s.topRow}>
        <View style={s.iconBoxYellow}>
					<ShopbagIcon width={28} height={28} />
			  </View>

				{/* 아바타들 */}
				<View style={s.avatars}>
					<GradientAvatar uri="https://picsum.photos/200" />
					<View style={{ marginLeft: -5 }}>
						<GradientAvatar uri="https://picsum.photos/201" />
					</View>
					<View style={{ marginLeft: -5 }}>
						<GradientAvatar uri="https://picsum.photos/202" />
					</View>
				</View>

        {/* 상태 배지 + 더보기 */}
        <View style={s.topRight}>
					{/* 상태 배지 */}
					<View
						style={[
							s.badge,
							status === 'done'
								? { backgroundColor: '#FFD51C', borderWidth: 1, borderColor: '#FFD51C' }
								: { backgroundColor: '#FFD51C', borderWidth: 1, borderColor: '#FFD51C' },
						]}
					>
						<Text style={s.badgeText}>
							{status === 'done' ? '정산 완료' : '정산 미완료'}
						</Text>
					</View>

					<TouchableOpacity 
					  style={s.detailDot} 
						activeOpacity={0.7}
						hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
						onPress={() => setMenuOpen(v => !v)}>
						<DetailIcon width={20} height={20} />
					</TouchableOpacity>
        </View>
      </View>





      {/* 2) 중앙 텍스트 */}
      <View style={s.middle}>
        {/* 왼쪽: 제목 + 날짜 */}
        <View>
          <Text style={s.title}>휴지</Text>
          <Text style={s.date}>25.07.24</Text>
        </View>

        {/* 오른쪽: 금액들 */}
        <View style={s.amounts}>
          <Text style={s.prevAmount}>-₩21,000</Text>
          <Text style={s.finalAmount}>₩10,500</Text>
        </View>
      </View>

      {/* 3) 하단 이미지 */}
      <View style={s.bottomImageBox}>
        {/* 나중에 실제 사진으로 교체하면 됨 */}
        <Image
          source={{ uri: 'https://picsum.photos/800/500' }}
          style={s.bottomImage}
        />
      </View>


			{/* 메뉴 오버레이 */}
			{menuOpen && (
				<>
					{/* 배경 터치 시 닫힘 */}
					<TouchableOpacity style={s.menuBackdrop} activeOpacity={1} onPress={closeMenu} />

					{/* BlurView를 감싸는 그림자 래퍼 */}
					<View style={s.menuWrap}>
						<BlurView
							intensity={30}
							tint="light"
							style={[s.menu, { backgroundColor: 'rgba(255, 255, 255, 0.54)' }]}
						>
							<TouchableOpacity style={s.menuItem} onPress={onPressDone}>
								<Text style={s.menuItemText}>정산 완료</Text>
							</TouchableOpacity>
							<View style={s.menuDivider} />
							<TouchableOpacity
								style={[s.menuItem, status === 'todo' && s.menuItemActive]}
								onPress={onPressTodo}
							>
								<Text style={s.menuItemText}>정산 미완료</Text>
							</TouchableOpacity>
							<View style={s.menuDivider} />
							<TouchableOpacity style={s.menuItem} onPress={onPressEdit}>
								<Text style={s.menuItemText}>수정</Text>
							</TouchableOpacity>
							<View style={s.menuDivider} />
							<TouchableOpacity style={s.menuItem} onPress={onPressDelete}>
								<Text style={s.menuItemText}>삭제</Text>
							</TouchableOpacity>
						</BlurView>
					</View>
				</>
			)}

    </View>
  );
}


export default function AdjustmentList() {
  const monthLabel = '2025년 07월'; // 임시

  const onPressBack = () => router.back();
  const onPressMonth = () => {
    // TODO: 월 선택 드롭다운/모달 열기
    console.log('open month picker'); // 버튼 누르면 함수가 실행되는지 확인하기 위한 임시 로그
  };
  const onPressSearch = () => {
    // TODO: 검색 페이지/모달로 이동
    console.log('go search'); // 버튼 누르면 함수가 실행되는지 확인하기 위한 임시 로그
  };
  const formatKRW = (n: number) =>
    new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(n);


  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* 헤더 */}
      <View style={s.header}>
        {/* 뒤로가기 */}
        <TouchableOpacity
          onPress={onPressBack}
          style={s.iconLeft}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <ArrowLeftIcon width={20} height={20} />
        </TouchableOpacity>

        {/* 가운데 날짜(드롭다운 예정) */}
        <TouchableOpacity 
          style={s.monthButton} 
          onPress={onPressMonth} 
          activeOpacity={0.7}
        >
          <Text style={s.monthText}>{monthLabel}</Text>
          <DropDownIcon width={16} height={16} />
        </TouchableOpacity>

        {/* 검색 아이콘 */}
        <TouchableOpacity
          onPress={onPressSearch}
          style={s.iconRight}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <SearchBlackIcon width={20} height={20} />
        </TouchableOpacity>
      </View>

      {/* Total Revenue */}
      <View style={s.revenueBox}>
        <Text style={s.revenueLabel}>Total Revenue</Text>   {/* 위: 라벨 */}
        <Text style={s.revenueAmount}>{formatKRW(230000)}</Text> {/* 아래: 금액 */}
      </View>

      {/* ▶ 카드 한 장 */}
      <View style={s.listWrap}>
        <AdjustmentCard />
      </View>

    </SafeAreaView>
  );
}


const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8', // 배경은 화면색으로 조절
  },
  header: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#5b2f2fff',
    paddingHorizontal: 16,
		
  },

  // 좌우 아이콘은 절대배치로 중앙 타이틀과 독립
  iconLeft: {
    position: 'absolute',
    left: 16,
    height: 56,
    justifyContent: 'center',
		//backgroundColor: '#fff',
  },
  iconRight: {
    position: 'absolute',
    right: 16,
    height: 56,
    justifyContent: 'center',
		//backgroundColor: '#fff',
  },

  // 가운데 월 선택 버튼
  monthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
		//backgroundColor: '#fff',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },

  // Total Revenue 박스
  revenueBox: {
    paddingHorizontal: 24,
    //paddingTop: 8,
    //paddingBottom: 0,
		marginBottom: 25,
		marginTop: 15,
		//backgroundColor: 'red',
  },
  revenueLabel: {
    fontSize: 18,
    color: '#707070',
    fontWeight: '600',
    marginBottom: 8,
  },
  revenueAmount: {
    fontSize: 32,
    fontWeight: '500',
    color: '#111',
    letterSpacing: 0.5,
  },

  // 카드 리스트
  listWrap: {
    paddingHorizontal: 10,
    paddingBottom: 24,
  },

  /* 카드 */
  card: {
    backgroundColor: '#FFE300',
    borderRadius: 24,
    padding: 8,
		position: 'relative',
    overflow: 'visible',      // 메뉴가 카드 바깥으로 살짝 나와도 보이게
  },

  /* 상단 */
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
	iconBoxYellow: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FFD51C",
    alignItems: "center",
    justifyContent: "center",
    //marginRight: 12,
  },
  avatars: {
    flexDirection: 'row',
    marginLeft: 12,
    flex: 1,
  },
  avatarPlaceholder: {
    width: 44, 
		height: 44, 
		borderRadius: 22,
    backgroundColor: '#E9E9E9',
    borderWidth: 1, 
		borderColor: '#FFD51C',
  },
  topRight: {
		marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 20,
    backgroundColor: '#FFD51C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { 
    fontSize: 12, 
    color: '#111' 
  },
  detailDot: { 
    //marginLeft: 8,
		//padding: 4
    //paddingHorizontal: 4 
  },

	/* 메뉴 오버레이 */
  menuBackdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    // 투명(시각적으로는 안 보이지만 터치 받아서 닫기용)
		backgroundColor: 'transparent',
		zIndex: 998,          // iOS
		elevation: 8,         // Android
  },
  menu: {
    position: 'absolute',
    top: 52,     // 점3개 아이콘 바로 아래쯤 떨어뜨리기
    right: 8,
    width: 142,
    borderRadius: 14,
    shadowColor: '#000', 
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    overflow: 'hidden',
  },
  menuItem: {
    height: 44,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  menuItemActive: {
    backgroundColor: '#FFE96A33', // 선택 항목 강조(연한 노랑)
  },
  menuItemText: {
    fontSize: 16,
    color: '#111',
		textAlign: 'right',
    //fontWeight: '600',
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#a8a8a8ff',
  },
	menuWrap: {
		position: 'absolute',
		//top: 5,   // detailDot 아이콘 아래 위치
		right: 0,
		borderRadius: 16,
		// iOS 그림자
		shadowColor: '#000',
		shadowOpacity: 0.25,
		shadowRadius: 18,
		shadowOffset: { width: 0, height: 10 },
		// Android 그림자
		elevation: 12,
  },

  /* 중앙 */
  middle: { 
    flexDirection: 'row',  // 가로 배치
    justifyContent: 'space-between', // 양쪽 끝으로 벌리기
    alignItems: 'flex-end', // 날짜/금액 baseline 맞추기
    padding: 8,
    //marginTop: 8,
		//backgroundColor: '#FFF',
  },
  title: { 
    fontSize: 16, 
    fontWeight: '500', 
    color: '#111' 
  },
  date: { 
    marginTop: 4, 
    fontSize: 12, 
    color: '#707070' 
  },
  amounts: { 
    marginTop: 5, 
    alignItems: 'flex-end', 
		//backgroundColor: 'red', 
  },
  prevAmount: { 
    fontSize: 12, 
    color: '#707070', 
    //textDecorationLine: 'line-through' 
  },
  finalAmount: { 
    //marginTop: 2, 
    fontSize: 20, 
    fontWeight: '400', 
    color: '#111' 
  },

  /* 하단 이미지 */
  bottomImageBox: {
    marginTop: 5,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bottomImage: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
});