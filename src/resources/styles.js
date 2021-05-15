import {StyleSheet} from 'react-native';
import colors from './colors';

const layout = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 20,
    paddingBottom: 25
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  rowAlignCenter: {
    alignItems: 'center',
  },
  card: {
    marginBottom: 10,
    paddingVertical: 15,
    paddingRight: 15,
  },
  divisor: {
    backgroundColor: colors.secondary,
    height: 5,
    marginHorizontal: 45,
    borderRadius: 5,
    marginBottom: 30,
  },
  paddingTop: {
    paddingTop: 30
  }
});

const text = StyleSheet.create({
  title: {
    fontSize: 22,
    color: colors.primary,
    marginLeft: 20,
    flexGrow: 1,
  },
  bigText: {
    fontSize: 18,
    color: colors.primary,
    marginRight: 15,
  },
  label: {
    fontSize: 20,
    color: colors.primary,
    marginLeft: 5,
    flexGrow: 1,
  },
  badge: {
    fontSize: 14,
    backgroundColor: colors.primary,
    color: colors.white,
    paddingVertical: 3,
    paddingHorizontal: 15,
    textAlign: 'center',
    borderRadius: 10,
  },
});

const forms = StyleSheet.create({
  formGroup: {
    marginVertical: 20,
  },
  formLabel: {
    fontSize: 18,
    color: colors.primary,
    marginBottom: 5,
  },
  formInput: {
    borderWidth: 1,
    backgroundColor: colors.bgLight,
    borderColor: colors.secondary,
  },
  inputText: {
    paddingHorizontal: 15,
  },
  error: {
    borderColor: 'red',
    backgroundColor: 'rgba(255, 0, 0, 0.04)',
  },
});

const buttons = StyleSheet.create({
  primaryButton: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  secondaryButton: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  redButton: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  primaryButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
  },
  secondaryButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.primary,
    textAlign: 'center',
  },
  buttonGroup: {
    flex: 1,
    padding: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
  },
  buttonGroupCommon: {
    borderColor: colors.secondary,
    backgroundColor: colors.lightGray1,
  },
  buttonGroupError: {
    borderColor: colors.red,
    backgroundColor: 'rgba(255, 0, 0, 0.04)',
  },
  buttonGroupActive: {
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
  },
  buttonGroupFirst: {
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
  },
  buttonGroupLast: {
    borderWidth: 1,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
  },
});

const modal = {
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    height: '100%',
    width: '100%'
  },
}

export default {layout, text, forms, buttons, modal};
