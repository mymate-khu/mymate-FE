import React, {useState} from "react";
import { router } from "expo-router";
import { Dimensions, StyleSheet, StatusBar, Text, TouchableOpacity, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";
import RuleApp from "@/rule_src/RuleApp";

export default function Rules(){
    return <RuleApp/>
}