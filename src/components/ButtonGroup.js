import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import styles from '../resources/styles';

const ButtonGroup = ({buttons, active, withError, readOnly}) => {
  const makeButtons = (button, index) => {
    const borderStyle =
      index === 0
        ? styles.buttons.buttonGroupFirst
        : index === buttons.length - 1
        ? styles.buttons.buttonGroupLast
        : null;
    const buttonActive =
      active === button.value ? styles.buttons.buttonGroupActive : null;
    const textColor =
      active === button.value
        ? styles.buttons.primaryButtonText
        : styles.buttons.secondaryButtonText;
    return (
      <TouchableOpacity
      disabled={readOnly}
      key={button.value}
        style={[
          withError ? styles.buttons.buttonGroupError : styles.buttons.buttonGroupCommon,
          styles.buttons.buttonGroup,
          borderStyle,
          buttonActive,
          {alignItems: 'center'},
        ]}
        onPress={button.press}>
        <Text style={textColor}>{button.title}</Text>
      </TouchableOpacity>
    );
  };
  const _button = (
    <View style={[styles.layout.row]}>
      {buttons.map((button, index) => makeButtons(button, index))}
    </View>
  );
  return _button;
};

export default ButtonGroup;
