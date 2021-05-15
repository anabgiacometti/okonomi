import React from 'react'
import { Text, TextInput, View } from "react-native";
import styles from '../resources/styles';

const Input = ({name, handleChange, value, withError, hideLabel, type, customStyle}) => {
    return (
        <View style={[styles.forms.formGroup, {flexGrow: 1}]}>
        {hideLabel === true ? null : <Text style={styles.forms.formLabel}>{name}</Text>}
        <TextInput
          onChangeText={val => handleChange(val)}
          value={value}
          keyboardType={type ? type : 'default'}
          style={[
            {fontSize: 18},
            styles.forms.formInput,
            styles.forms.inputText,
            withError ? styles.forms.error : null,
            customStyle
          ]}></TextInput>
      </View>
    )
}

export default Input