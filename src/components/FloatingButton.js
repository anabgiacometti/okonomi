import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import colors from '../resources/colors';

const FloatingButton = ({icon, handler}) => {
  const _button = (
    <View style={[styles.iconButtonContainer]}>
      <TouchableOpacity style={styles.iconButton} onPress={handler}>
        <Icon name={icon} size={26} color={colors.primaryContrast}></Icon>
      </TouchableOpacity>
    </View>
  );
  return _button;
};

const styles = StyleSheet.create({
  iconButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    zIndex: 0,
  },
  iconButton: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default FloatingButton;
