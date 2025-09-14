// 웹용 더미: 그냥 <View>로 감싸서 자식만 렌더
const React = require("react");
const { View } = require("react-native");

function PagerView(props) {
  return React.createElement(View, props, props.children);
}

module.exports = PagerView;
module.exports.default = PagerView;
