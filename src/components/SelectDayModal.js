import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import styles from '../resources/styles';
import colors from '../resources/colors';

const {height} = Dimensions.get('window');

const SelectModal = ({show, close, handleChange, active}) => {
  const [state, setState] = useState({
    opacity: new Animated.Value(0),
    container: new Animated.Value(height),
    modal: new Animated.Value(height),
  });

  const makedays = () => {
    const days = Array.from(Array(31).keys());
    return days.map(day => {
      const actualDay = day + 1;
      return (
        <TouchableOpacity
          key={day}
          onPress={() => handleChange(actualDay)}
          style={[
            modalStyles.dayButton,
            active == actualDay ? modalStyles.active : null,
          ]}>
          <Text style={[modalStyles.dayButtonText]}>{actualDay}</Text>
        </TouchableOpacity>
      );
    });
  };
  
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
    await closeModal()
    close()
  }

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
        <View>
          <Text style={[styles.text.title, {marginBottom: 25}]}>
            Selecione o Dia
          </Text>
        </View>

        <View
          style={[
            styles.layout.row,
            {flexWrap: 'wrap', width: 280, alignSelf: 'center'},
          ]}>
          {makedays()}
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
    backgroundColor: 'rgba(0,0,0,0.3)',
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
  dayButton: {
    backgroundColor: colors.bgLight,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonText: {
    fontSize: 18,
  },
  active: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 50,
  },
  activeButtonText: {
    color: colors.primaryContrast,
  },
});

export default SelectModal;
