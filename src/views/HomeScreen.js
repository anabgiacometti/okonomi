import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StatusBar,
  Button,
  Text,
} from 'react-native';
import colors from '../resources/colors';

const HomeScreen = ({navigation}) => {
 

  return (
    <SafeAreaView style={{height: '100%', backgroundColor: colors.bgLight}}>
      <StatusBar hidden={true} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          <View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
