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
import ConfirmModal from '../../components/ConfirmModal';
import SelectDayModal from '../../components/SelectDayModal';
import SelectModal from '../../components/SelectModal';
import ButtonGroup from '../../components/ButtonGroup';
import CheckBox from '@react-native-community/checkbox';
import SelectInput from '../../components/SelectInput';
import CustomTextInput from '../../components/TextInput';
import CurrencyInput from 'react-native-currency-input';
import styles from '../../resources/styles';
import db from '../../api/db';
import colors from '../../resources/colors';
import {PAYMENT_TYPE} from '../../resources/enums';

const BillCrud = ({navigation, route}) => {
  const collection = 'bill';
  const {_bill, _lastId, _type, _shouldUpdate} = route.params;
  const url = _type == PAYMENT_TYPE.INCOME ? 'IncomeList' : 'OutcomeList';

  const [paymentGroupOptions, setPaymentGroupOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [timeOptions, setTimeOptions] = useState(timeOptionsSingular);
  const [selectPaymentGroupsModal, setSelectPaymentGroupsModal] = useState(
    _shouldUpdate === 'PaymentGroup',
  );
  const [selectCategoryModal, setSelectCategoryModal] = useState(
    _shouldUpdate === 'Category',
  );
  const [selectFrequencyModal, setSelectFrequencyModal] = useState(false);
  const [selectTypeModal, setSelectTypeModal] = useState('');
  const [selectDurationModal, setSelectDurationModal] = useState(false);
  const [selectDayModal, setSelectDayModal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState(false);
  const [bill, setBill] = useState(initialBill);
  const [errorFields, setErrorFields] = useState([]);

  useEffect(() => {
    setBill(_bill ? _bill : initialBill);
    getCategoryList();
    getPaymentGroupList();
    setLoading(false);
  }, [_type]);

  const getCategoryList = () => {
    db.listWithEqualsQuery('category', 'description', {
      column: 'type',
      data: _type,
      operator: '==',
    }).then(res => {
      setCategoryOptions(
        res.map(item => {
          return {label: item.description, value: item.id};
        }),
      );
    });
  };

  const getPaymentGroupList = () => {
    db.list('paymentGroup', 'description').then(res => {
      const paymentGroups = res.map(item => {
        return {
          label: item.description,
          value: item.id,
        };
      });
      paymentGroups.unshift({label: 'Nenhum', value: 0});
      setPaymentGroupOptions(paymentGroups);
    });
  };

  const getErrorFields = () => {
    const requiredFields = ['description', 'category', 'value'].filter(
      item => !bill[item],
    );

    let frequencyRequiredFields = ['frequency_time'];
    let durationRequiredFields = [];

    if (bill.frequency.type === 'month')
      frequencyRequiredFields.push('monthDay');
    else if (bill.frequency.type === 'week')
      frequencyRequiredFields.push('weekDay');

    if (bill.duration.type != 'undefined')
      durationRequiredFields.push('duration_time');

    frequencyRequiredFields = frequencyRequiredFields.filter(item => {
      const search = item.split('_').length > 1 ? item.split('_')[1] : item;
      if (!bill.frequency[search]) return item;
    });

    durationRequiredFields = durationRequiredFields.filter(item => {
      const search = item.split('_').length > 1 ? item.split('_')[1] : item;
      if (!bill.duration[search]) return item;
    });

    const errorFields = requiredFields
      .concat(durationRequiredFields)
      .concat(frequencyRequiredFields);

    return errorFields;
  };

  const save = () => {
    const errorFields = getErrorFields();

    if (errorFields.length == 0) {
      setLoading(true);

      if (!bill.id) {
        const id = _lastId + 1;
        add(id);
      } else {
        update();
      }
    } else {
      setErrorFields(errorFields);
    }
  };

  const add = id => {
    console.log(id);
    db.add(collection, {...bill, id, type: _type})
      .then(res => {
        navigation.navigate(url, {
          _shouldUpdate: {type: _type, action: 'add', data: res, lastId: id},
        });
      })
      .catch(error => console.log(error));
  };

  const update = () => {
    db.update(collection, {...bill, type: _type})
      .then(res => {
        navigation.navigate(url, {
          _shouldUpdate: {type: _type, action: 'update', data: res},
        });
      })
      .catch(error => console.log(error));
  };

  const remove = id => {
    setLoading(true);
    setConfirmModal(false);

    db.remove(collection, id)
      .then(res =>
        navigation.navigate(url, {
          _shouldUpdate: {
            type: _type,
            action: 'delete',
            data: id,
          },
        }),
      )
      .catch(error => console.log(error));
  };

  const handleChange = (field, value) => {
    setBill(current => {
      return {...current, [field]: value};
    });
  };

  const renderTitle = () => {
    return (
      <Text style={[styles.text.title, styles.layout.paddingTop]}>
        {bill.id ? 'Editar ' : 'Nova '}
        {_type == PAYMENT_TYPE.INCOME ? 'Receita' : 'Despesa'}
      </Text>
    );
  };

  const renderButtons = () => {
    return (
      <View
        style={[
          styles.layout.row,
          {paddingHorizontal: 15, marginTop: 20},
          _bill ?? {paddingBottom: 50},
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
    return _bill && _bill.id ? (
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
              value={bill.description}
              withError={errorFields.includes('description')}
            />
            <SelectInput
              name={'Categoria'}
              handleChange={() => {
                Keyboard.dismiss();
                setSelectCategoryModal(current => !current);
              }}
              value={bill.category ? bill.category.description : null}
              withError={errorFields.includes('category')}
            />
            <SelectInput
              name={'Grupo de Pagamentos'}
              handleChange={() => {
                Keyboard.dismiss();
                setSelectPaymentGroupsModal(current => !current);
              }}
              value={bill.paymentGroup ? bill.paymentGroup.description : null}
              withError={errorFields.includes('paymentGroup')}
            />
            <View style={{marginTop: 20}}>
              <Text style={[styles.forms.formLabel]}>Repetir a cada</Text>
              <View
                style={[
                  styles.layout.row,
                  styles.layout.rowAlignCenter,
                  {justifyContent: 'space-between'},
                ]}>
                <CustomTextInput
                  customStyle={{marginRight: 10, marginTop: -15}}
                  hideLabel={true}
                  type="numeric"
                  handleChange={value => {
                    setTimeOptions(
                      value > 1 ? timeOptionsPlural : timeOptionsSingular,
                    );
                    setBill(current => {
                      return {
                        ...current,
                        frequency: {...current.frequency, time: value},
                      };
                    });
                  }}
                  value={bill.frequency.time ? String(bill.frequency.time) : ''}
                  withError={errorFields.includes('frequency_time')}
                />
                <SelectInput
                  customStyle={{marginTop: -15}}
                  hideLabel={true}
                  handleChange={() => {
                    Keyboard.dismiss();
                    setSelectFrequencyModal(current => !current);
                  }}
                  value={
                    timeOptions.filter(
                      op => op.value === bill.frequency.type,
                    )[0].label
                  }
                  withError={errorFields.includes('frequency_type')}
                />
              </View>
            </View>
            {bill.frequency.type === 'week' ? (
              <ButtonGroup
                buttons={[
                  {
                    value: 1,
                    title: 'D',
                    press: () =>
                      setBill(current => {
                        return {
                          ...current,
                          frequency: {...current.frequency, weekDay: 1},
                        };
                      }),
                  },
                  {
                    value: 2,
                    title: 'S',
                    press: () =>
                      setBill(current => {
                        return {
                          ...current,
                          frequency: {...current.frequency, weekDay: 2},
                        };
                      }),
                  },
                  {
                    value: 3,
                    title: 'T',
                    press: () =>
                      setBill(current => {
                        return {
                          ...current,
                          frequency: {...current.frequency, weekDay: 3},
                        };
                      }),
                  },
                  {
                    value: 4,
                    title: 'Q',
                    press: () =>
                      setBill(current => {
                        return {
                          ...current,
                          frequency: {...current.frequency, weekDay: 4},
                        };
                      }),
                  },
                  {
                    value: 5,
                    title: 'Q',
                    press: () =>
                      setBill(current => {
                        return {
                          ...current,
                          frequency: {...current.frequency, weekDay: 5},
                        };
                      }),
                  },
                  {
                    value: 6,
                    title: 'S',
                    press: () =>
                      setBill(current => {
                        return {
                          ...current,
                          frequency: {...current.frequency, weekDay: 6},
                        };
                      }),
                  },
                  {
                    value: 7,
                    title: 'S',
                    press: () =>
                      setBill(current => {
                        return {
                          ...current,
                          frequency: {...current.frequency, weekDay: 7},
                        };
                      }),
                  },
                ]}
                active={bill.frequency.weekDay}
                withError={errorFields.includes('weekDay')}
              />
            ) : null}
            {bill.frequency.type === 'month' ? (
              <View style={styles.forms.formGroup}>
                <Text style={styles.forms.formLabel}>Repetir no dia</Text>
                <View style={styles.layout.row}>
                  <TouchableOpacity
                    onPress={() => {
                      Keyboard.dismiss();
                      setSelectDayModal(true);
                    }}
                    style={[
                      styles.forms.formInput,
                      styles.layout.row,
                      errorFields.includes('monthDay')
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
                      {bill.frequency.monthDay}
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
                        dayTypeOptions.filter(
                          t => t.value === bill.frequency.dayType,
                        )[0].label
                      }
                    </Text>
                    <Icon
                      size={20}
                      name="chevron-down"
                      style={{marginRight: 10}}></Icon>
                  </TouchableOpacity>
                </View>
                {bill.frequency.dayType === 'runningday' ? (
                  <View
                    style={[
                      styles.forms.formGroup,
                      styles.layout.row,
                      styles.layout.rowAlignCenter,
                    ]}>
                    <CheckBox
                      value={bill.frequency.useNextWorkDay}
                      tintColors={{true: colors.primary, false: colors.primary}}
                      style={{transform: [{scaleX: 1.3}, {scaleY: 1.3}]}}
                      onValueChange={() =>
                        setBill(current => {
                          return {
                            ...current,
                            frequency: {
                              ...current.frequency,
                              useNextWorkDay: !current.useNextWorkDay,
                            },
                          };
                        })
                      }
                    />
                    <Text
                      style={[
                        styles.forms.formLabel,
                        {marginTop: 5, marginLeft: 10},
                      ]}>
                      Utilizar o próximo dia útil
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : null}
            <View style={{marginTop: 20}}>
              <Text style={[styles.forms.formLabel]}>Termina em</Text>
              <View
                style={[
                  styles.forms.formGroup,
                  styles.layout.row,
                  styles.layout.rowAlignCenter,
                ]}>
                <CheckBox
                  value={bill.duration.type === 'undefined'}
                  tintColors={{true: colors.primary, false: colors.primary}}
                  style={{transform: [{scaleX: 1.3}, {scaleY: 1.3}]}}
                  onValueChange={value =>
                    setBill(current => {
                      if (value) {
                        return {
                          ...current,
                          duration: {
                            ...current.duration,
                            type: 'undefined',
                          },
                        };
                      } else {
                        return {
                          ...current,
                          duration: {
                            ...current.duration,
                            type: 'month',
                          },
                        };
                      }
                    })
                  }
                />
                <Text
                  style={[
                    styles.forms.formLabel,
                    {marginTop: 5, marginLeft: 10},
                  ]}>
                  Nunca
                </Text>
              </View>
              {bill.duration.type === 'undefined' ? null : (
                <View
                  style={[
                    styles.layout.row,
                    styles.layout.rowAlignCenter,
                    {justifyContent: 'space-between'},
                  ]}>
                  <CustomTextInput
                    customStyle={{marginRight: 10, marginTop: -20}}
                    hideLabel={true}
                    type="numeric"
                    handleChange={value => {
                      setTimeOptions(
                        value > 1 ? timeOptionsPlural : timeOptionsSingular,
                      );
                      setBill(current => {
                        return {
                          ...current,
                          duration: {...current.duration, time: value},
                        };
                      });
                    }}
                    value={bill.duration.time ? String(bill.duration.time) : ''}
                    withError={errorFields.includes('duration_time')}
                  />
                  <SelectInput
                    customStyle={{marginTop: -15}}
                    hideLabel={true}
                    handleChange={() => {
                      Keyboard.dismiss();
                      setSelectFrequencyModal(current => !current);
                    }}
                    value={
                      timeOptions.filter(
                        op => op.value === bill.duration.type,
                      )[0].label
                    }
                  />
                </View>
              )}
            </View>
            <View style={[styles.forms.formGroup, {flexGrow: 1}]}>
              <Text style={styles.forms.formLabel}>Valor Esperado</Text>
              <CurrencyInput
                value={bill.value}
                onChangeValue={formattedValue =>
                  handleChange('value', formattedValue)
                }
                unit="R$"
                delimiter="."
                separator=","
                precision={2}
                style={[
                  {fontSize: 18},
                  styles.forms.formInput,
                  styles.forms.inputText,
                  errorFields.includes('value') ? styles.forms.error : null,
                ]}
              />
            </View>
          </View>
          {renderButtons()}
          {renderRemoveButton()}
        </View>
      </ScrollView>
      <ConfirmModal
        show={confirmModal}
        action={() => remove(bill.id)}
        close={() => {
          setConfirmModal(false);
        }}
        message={`Confirma a exclusão da ${
          _type == PAYMENT_TYPE.INCOME ? 'receita ' : 'despesa '
        } ${bill.description}?`}
      />
      <SelectModal
        title={'Categoria'}
        show={selectCategoryModal}
        close={() => setSelectCategoryModal(false)}
        options={categoryOptions}
        addItem={() => {
          const backUrl =
            _type == PAYMENT_TYPE.INCOME ? 'IncomeCrud' : 'OutcomeCrud';
          navigation.replace('CategoryCrud', {
            _backToBill: {url: backUrl, bill, type: _type, lastId: _lastId},
          });
        }}
        handleChange={selected => {
          setBill(current => {
            const category = categoryOptions.filter(
              cat => cat.value === selected,
            )[0];
            return {
              ...current,
              category: {id: selected, description: category.label},
            };
          });
          setTimeout(() => setSelectCategoryModal(false), 500);
        }}
        active={bill.category ? bill.category.id : null}
      />
      <SelectModal
        title={'Grupo de Pagamentos'}
        show={selectPaymentGroupsModal}
        close={() => setSelectPaymentGroupsModal(false)}
        options={paymentGroupOptions}
        addItem={() => {
          const backUrl =
            _type == PAYMENT_TYPE.INCOME ? 'IncomeCrud' : 'OutcomeCrud';
          navigation.replace('PaymentGroupCrud', {
            _backToBill: {url: backUrl, bill, type: _type, lastId: _lastId},
          });
        }}
        handleChange={selected => {
          setBill(current => {
            const paymentGroup = paymentGroupOptions.filter(
              pg => pg.value === selected,
            )[0];
            return {
              ...current,
              paymentGroup: {id: selected, description: paymentGroup.label},
            };
          });
          setTimeout(() => setSelectPaymentGroupsModal(false), 500);
        }}
        active={bill.paymentGroup ? bill.paymentGroup.id : null}
      />
      <SelectModal
        show={selectFrequencyModal}
        title={'Repetir a cada'}
        close={() => setSelectFrequencyModal(false)}
        options={timeOptions}
        handleChange={selected => {
          setBill(current => {
            return {
              ...current,
              frequency: {...current.frequency, type: selected},
            };
          });
          setTimeout(() => setSelectFrequencyModal(false), 500);
        }}
        active={bill.frequency.type}
      />
      <SelectDayModal
        show={selectDayModal}
        close={() => setSelectDayModal(false)}
        handleChange={day => {
          setBill(current => {
            return {
              ...current,
              frequency: {...current.frequency, monthDay: day},
            };
          });
          setTimeout(() => setSelectDayModal(false), 500);
        }}
        active={bill.frequency.monthDay}
      />
      <SelectModal
        title={'Selecione'}
        show={selectTypeModal}
        close={() => setSelectTypeModal(false)}
        options={dayTypeOptions}
        handleChange={selected => {
          setBill(current => {
            return {
              ...current,
              frequency: {...current.frequency, dayType: selected},
            };
          });
          setTimeout(() => setSelectTypeModal(false), 500);
        }}
        active={bill.frequency.dayType}
      />
      <SelectModal
        title={'Selecione a Duração'}
        show={selectDurationModal}
        close={() => setSelectDurationModal(false)}
        options={durationOptions}
        handleChange={selected => {
          setBill(current => {
            return {
              ...current,
              duration: selected,
            };
          });
          setTimeout(() => setSelectDurationModal(false), 500);
        }}
        active={bill.duration}
      />
    </SafeAreaView>
  );
};

const initialBill = {
  id: null,
  description: null,
  category: null,
  frequency: {
    time: null,
    type: 'month',
    dayType: 'workday',
  },
  duration: {
    time: null,
    type: 'undefined',
  },
  value: 0,
  paymentGroup: 0,
};

const timeOptionsSingular = [
  {label: 'dia', value: 'day'},
  {label: 'semana', value: 'week'},
  {label: 'mês', value: 'month'},
];

const timeOptionsPlural = [
  {label: 'dias', value: 'day'},
  {label: 'semanas', value: 'week'},
  {label: 'meses', value: 'month'},
];

const durationOptions = [
  {label: 'Nunca', value: 'never'},
  {label: 'Após', value: 'after'},
];

const dayTypeOptions = [
  {label: 'Dia Útil', value: 'workday'},
  {label: 'Dia Corrido', value: 'runningday'},
];

export default BillCrud;
