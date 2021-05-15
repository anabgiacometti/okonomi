import React from 'react';
import {Text, TextInput, View} from 'react-native';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import styles from '../resources/styles';
import colors from '../resources/colors';

const Input = ({
  name,
  handleChange,
  active,
  hideLabel,
  options
}) => {
  return (
    <View style={[styles.forms.formGroup, {flexGrow: 1}]}>
      {hideLabel === true ? null : (
        <Text style={[styles.forms.formLabel, {marginBottom: 20}]}>{name}</Text>
      )}
      <RadioForm animation={true}>
        {options.map((obj, i) => (
          <RadioButton
            style={{marginBottom: 25}}
            labelHorizontal={true}
            key={i}>
            <RadioButtonInput
              obj={obj}
              isSelected={active === obj.value}
              onPress={() => handleChange(obj.value)}
              borderWidth={1}
              buttonInnerColor={colors.primary}
              buttonOuterColor={colors.primary}
              buttonStyle={{}}
              buttonWrapStyle={{marginLeft: 10}}
            />
            <RadioButtonLabel
              obj={obj}
              labelHorizontal={true}
              onPress={() => handleChange(obj.value)}
              labelStyle={{
                fontSize: 20,
                color: colors.primary,
                marginTop: 5,
              }}
            />
          </RadioButton>
        ))}
      </RadioForm>
    </View>
  );
};

export default Input;
