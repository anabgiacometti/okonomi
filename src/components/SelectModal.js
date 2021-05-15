import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import Icon from 'react-native-vector-icons/Feather';
import colors from '../resources/colors';
import styles from '../resources/styles';

const {height} = Dimensions.get('window');

const SelectModal = ({show, handleChange, close, active, options, title, addItem}) => {
  const [state, setState] = useState({
    opacity: new Animated.Value(0),
    container: new Animated.Value(height),
    modal: new Animated.Value(height),
  });

  const openModal = () => {
    Animated.sequence([
      Animated.timing(state.container, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(state.opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(state.modal, {
        toValue: 0,
        bounciness: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.sequence([
      Animated.timing(state.modal, {
        toValue: height,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(state.opacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(state.container, {
        toValue: height,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleClose = async () => {
    await closeModal();
    close();
  };

  useEffect(() => {
    if (show) {
      openModal();
    } else {
      handleClose();
    }
  }, [show]);

  return (
    <Animated.View
      style={[
        modalStyles.container,
        {
          opacity: state.opacity,
          transform: [{translateY: state.container}],
        },
      ]}>
      <TouchableWithoutFeedback
        accessibilityRole="button"
        onPress={() => handleClose()}>
        <Animated.View
          style={[
            styles.modal.overlay,
            {
              opacity: state.opacity,
              transform: [{translateY: state.container}],
            },
          ]}
        />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          modalStyles.modal,
          {
            transform: [{translateY: state.modal}],
          },
        ]}>
        <View
          style={[
            styles.layout.row,
            styles.layout.rowAlignCenter,
            {marginBottom: 25},
          ]}>
          <Text style={[styles.text.title]}>{title}</Text>
          {addItem ? (
            <TouchableOpacity
              onPress={() => addItem()}
              style={{
                padding: 5,
                backgroundColor: colors.primary,
                borderRadius: 5,
                marginRight: 10,
              }}>
              <Icon name="plus" size={28} color={colors.primaryContrast}></Icon>
            </TouchableOpacity>
          ) : null}
        </View>
        <View>
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
      </Animated.View>
    </Animated.View>
  );
};

const modalStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  modal: {
    bottom: 0,
    position: 'absolute',
    backgroundColor: colors.bgLight,
    height: '50%',
    width: '100%',
    paddingVertical: 25,
    alignContent: 'center',
    paddingHorizontal: 15,
  },
});

export default SelectModal;
