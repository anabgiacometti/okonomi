import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import styles from '../resources/styles';
import colors from '../resources/colors';

const {height} = Dimensions.get('window');

const Modal = ({show, close, action, message}) => {
  const [state, setState] = useState({
    opacity: new Animated.Value(0),
    container: new Animated.Value(height),
    modal: new Animated.Value(height),
  });

  const openModal = () => {
    Animated.sequence([
      Animated.timing(state.container, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(state.opacity, {
        toValue: 1,
        duration: 300,
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
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(state.opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(state.container, {
        toValue: height,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (show) {
      openModal();
    } else {
      closeModal();
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
      <Animated.View
        style={[
          modalStyles.modal,
          {
            transform: [{translateY: state.modal}],
          },
        ]}>
        <View>
          <Text style={styles.text.title}>{message}</Text>
        </View>

        <View style={[styles.layout.row, {paddingHorizontal: 15, marginTop: 15}]}>
          <TouchableOpacity
            style={[styles.buttons.primaryButton, {marginRight: 10}]}
            onPress={action}>
            <Text style={styles.buttons.primaryButtonText}>Sim</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttons.secondaryButton]}
            onPress={close}>
            <Text style={styles.buttons.secondaryButtonText}>Não</Text>
          </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    backgroundColor: colors.bgLight,
    width: '80%',
    paddingHorizontal: 25,
    paddingVertical: 40,
  },
});

export default Modal;
