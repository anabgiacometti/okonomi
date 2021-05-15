import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import styles from '../resources/styles';
import colors from '../resources/colors';

const {height} = Dimensions.get('window');

const Modal = ({show, save, close, remove, content, title}) => {
  const scrollRef = useRef();

  const [state, setState] = useState({
    opacity: new Animated.Value(0),
    container: new Animated.Value(height),
    modal: new Animated.Value(height),
  });

  const scrollTop = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const openModal = () => {
    scrollTop();

    Animated.sequence([
      Animated.timing(state.container, {
        toValue: 0,
        duration: 10,
        useNativeDriver: true,
      }),
      Animated.timing(state.opacity, {
        toValue: 1,
        duration: 10,
        useNativeDriver: true,
      }),
      Animated.spring(state.modal, {
        toValue: 0,
        bounciness: 5,
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
        <ScrollView showsVerticalScrollIndicator={false} ref={scrollRef}>
          <View>
            <Text style={styles.text.title}>{title}</Text>
            <View style={{marginTop: 20, paddingHorizontal: 15}}>
              {content}
            </View>
          </View>

          <View
            style={[
              styles.layout.row,
              {paddingHorizontal: 15, marginTop: 20},
              remove ?? {paddingBottom: 50},
            ]}>
            <TouchableOpacity
              style={[styles.buttons.primaryButton, {marginRight: 10}]}
              onPress={save}>
              <Text style={styles.buttons.primaryButtonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttons.secondaryButton]}
              onPress={close}>
              <Text style={styles.buttons.secondaryButtonText}>Sair</Text>
            </TouchableOpacity>
          </View>
          {remove ? (
            <View
              style={[
                styles.layout.row,
                {paddingHorizontal: 15, paddingBottom: 35},
              ]}>
              <TouchableOpacity
                style={[styles.buttons.redButton]}
                onPress={remove}>
                <Text style={styles.buttons.primaryButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </ScrollView>
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
    paddingTop: 45,
    position: 'absolute',
    backgroundColor: colors.bgLight,
    width: '100%',
    height: '100%',
    paddingHorizontal: 10,
  },
});

export default Modal;
