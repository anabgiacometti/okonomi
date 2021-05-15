import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Spinner from 'react-native-loading-spinner-overlay';
import SelectModal from '../../components/SelectModal';
import ConfirmModal from '../../components/ConfirmModal';
import SelectDayModal from '../../components/SelectDayModal';
import CustomTextInput from '../../components/TextInput';
import CheckBox from '@react-native-community/checkbox';
import styles from '../../resources/styles';
import db from '../../api/db';
import colors from '../../resources/colors';

const PaymentGroupCrud = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [paymentGroup, setPaymentGroup] = useState(initialPaymentGroup);
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectDayModal, setSelectDayModal] = useState(0);
  const [selectTypeModal, setSelectTypeModal] = useState('');
  const [errorFields, setErrorFields] = useState([]);

  const collection = 'paymentGroup';
  const {_paymentGroup, _lastId, _backToBill} = route.params;

  useEffect(() => {
    if (_backToBill) {
      setUpBackToBill();
    }
    setPaymentGroup(_paymentGroup ? _paymentGroup : initialPaymentGroup);
    setLoading(false);
  }, []);

  const setUpBackToBill = () => {
    db.list(collection, 'id')
      .then(res => {
        _backToBill.lastId = res.length > 0 ? res[res.length - 1].id : 0;
      })
      .catch(error => console.log(error));
  };

  const save = () => {
    const requiredFields = ['description', 'paymentDay'].filter(
      item => !paymentGroup[item],
    );

    if (requiredFields.length == 0) {
      setLoading(true);

      if (!paymentGroup.id) {
        const id = _backToBill ? _backToBill.lastId + 1 : _lastId + 1;
        add(id);
      } else {
        update();
      }
    } else {
      setErrorFields(requiredFields);
    }
  };

  const add = id => {
    db.add(collection, {...paymentGroup, id})
      .then(res => {
        _backToBill
          ? navigation.replace(_backToBill.url, {
              _lastId: _backToBill.lastId,
              _type: _backToBill.type,
              _bill: _backToBill.bill,
              _shouldUpdate: 'PaymentGroup',
            })
          : navigation.navigate('PaymentGroupList', {
              _shouldUpdate: {
                action: 'add',
                data: res,
                lastId: id,
              },
            });
      })
      .catch(error => console.log(error));
  };

  const update = () => {
    db.update(collection, paymentGroup)
      .then(res => {
        navigation.navigate('PaymentGroupList', {
          _shouldUpdate: {action: 'update', data: res},
        });
      })
      .catch(error => console.log(error));
  };

  const remove = id => {
    setLoading(true);
    setConfirmModal(false);

    db.remove(collection, id)
      .then(res =>
        navigation.navigate('PaymentGroupList', {
          _shouldUpdate: {action: 'delete', data: id},
        }),
      )
      .catch(error => console.log(error));
  };

  const handleChange = (field, value) => {
    setPaymentGroup(current => {
      return {...current, [field]: value};
    });
  };

  const renderTitle = () => {
    return (
      <Text style={[styles.text.title, styles.layout.paddingTop]}>
        {paymentGroup.id
          ? 'Editar Grupo de Pagamentos'
          : 'Novo Grupo de Pagamentos'}
      </Text>
    );
  };

  const renderButtons = () => {
    return (
      <View
        style={[
          styles.layout.row,
          {paddingHorizontal: 15, marginTop: 20},
          _paymentGroup ?? {paddingBottom: 50},
        ]}>
        <TouchableOpacity
          style={[styles.buttons.primaryButton, {marginRight: 10}]}
          onPress={save}>
          <Text style={styles.buttons.primaryButtonText}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttons.secondaryButton]}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttons.secondaryButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderRemoveButton = () => {
    return _paymentGroup ? (
      <View style={{paddingHorizontal: 15, marginTop: 10}}>
        <TouchableOpacity
          style={[styles.buttons.redButton]}
          onPress={() => setConfirmModal(true)}>
          <Text style={styles.buttons.primaryButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    ) : null;
  };

  return (
    <SafeAreaView style={{height: '100%', backgroundColor: colors.bgLight}}>
      <ScrollView>
        <Spinner
          visible={loading}
          textContent={'Carregando...'}
          textStyle={styles.spinnerTextStyle}
        />
        <View style={[styles.layout.container]}>
          {renderTitle()}
          <View style={styles.layout.container}>
            <CustomTextInput
              name={'Descrição'}
              handleChange={value => handleChange('description', value)}
              value={paymentGroup.description}
              withError={errorFields.includes('description')}
            />
            <View style={styles.forms.formGroup}>
              <Text style={styles.forms.formLabel}>Dia de Pagamento</Text>
              <View style={styles.layout.row}>
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    setSelectDayModal(true);
                  }}
                  style={[
                    styles.forms.formInput,
                    styles.layout.row,
                    errorFields.includes('paymentDay')
                      ? styles.forms.error
                      : null,
                    {
                      width: 100,
                      height: 50,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                  ]}>
                  <Text style={[{marginLeft: 25, fontSize: 18}]}>
                    {paymentGroup.paymentDay}
                  </Text>
                  <Icon
                    size={20}
                    name="chevron-down"
                    style={{marginRight: 10}}></Icon>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    setSelectTypeModal(true);
                  }}
                  style={[
                    styles.forms.formInput,
                    styles.layout.row,
                    {
                      marginLeft: 10,
                      flexGrow: 1,
                      height: 50,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                  ]}>
                  <Text style={{marginLeft: 25, fontSize: 18}}>
                    {
                      paymentTypeOptions.filter(
                        t => t.value === paymentGroup.paymentDayType,
                      )[0].label
                    }
                  </Text>
                  <Icon
                    size={20}
                    name="chevron-down"
                    style={{marginRight: 10}}></Icon>
                </TouchableOpacity>
              </View>
            </View>
            {paymentGroup.paymentDayType === 'runningday' ? (
              <View
                style={[
                  styles.forms.formGroup,
                  styles.layout.row,
                  styles.layout.rowAlignCenter,
                ]}>
                <CheckBox
                  value={paymentGroup.useNextWorkDay}
                  tintColors={{true: colors.primary, false: colors.primary}}
                  style={{transform: [{scaleX: 1.3}, {scaleY: 1.3}]}}
                  onValueChange={() =>
                    setPaymentGroup(current => {
                      return {
                        ...current,
                        useNextWorkDay: !paymentGroup.useNextWorkDay,
                      };
                    })
                  }
                />
                <Text style={styles.text.label}>
                  Utilizar o próximo dia útil
                </Text>
              </View>
            ) : null}
          </View>
          {renderButtons()}
          {renderRemoveButton()}
        </View>
      </ScrollView>
      <ConfirmModal
        show={confirmModal}
        action={() => remove(paymentGroup.id)}
        close={() => {
          setConfirmModal(false);
        }}
        message={`Confirma a exclusão do grupo de pagamentos ${paymentGroup.description}?`}
      />
      <SelectDayModal
        show={selectDayModal}
        close={() => setSelectDayModal(false)}
        handleChange={day => {
          setPaymentGroup(current => {
            return {...current, paymentDay: day};
          });
          setTimeout(() => setSelectDayModal(false), 500);
        }}
        active={paymentGroup.paymentDay}
      />
      <SelectModal
        title={'Selecione'}
        show={selectTypeModal}
        close={() => setSelectTypeModal(false)}
        options={paymentTypeOptions}
        handleChange={selected => {
          setPaymentGroup(current => {
            return {...current, paymentDayType: selected};
          });
          setTimeout(() => setSelectTypeModal(false), 500);
        }}
        active={paymentGroup.paymentDayType}
      />
    </SafeAreaView>
  );
};

const initialPaymentGroup = {
  id: null,
  description: null,
  paymentDay: null,
  paymentDayType: 'workday',
  useNextWorkDay: false,
};

const paymentTypeOptions = [
  {label: 'Dia Útil', value: 'workday'},
  {label: 'Dia Corrido', value: 'runningday'},
];

export default PaymentGroupCrud;
