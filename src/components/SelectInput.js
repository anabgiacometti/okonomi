import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styles from '../resources/styles';

const Input = ({name, handleChange, value, hideLabel, withError, customStyle}) => {
  return (
    <View style={[styles.forms.formGroup, {flexGrow: 1}]}>
      {hideLabel === true ? null : (
        <Text style={styles.forms.formLabel}>{name}</Text>
      )}
      <TouchableOpacity
        onPress={() => {
          handleChange();
        }}
        style={[
          styles.forms.formInput,
          styles.layout.row,
          {
            flexGrow: 1,
            height: 50,
            justifyContent: 'space-between',
            alignItems: 'center',
          },
          customStyle,
          withError ? styles.forms.error : null
        ]}>
        <Text style={{marginLeft: 25, fontSize: 18}}>
          {value ?? 'Selecione'}
        </Text>
        <Icon size={20} name="chevron-down" style={{marginRight: 10}}></Icon>
      </TouchableOpacity>
    </View>
  );
};

export default Input;
