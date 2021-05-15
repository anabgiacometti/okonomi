import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Spinner from 'react-native-loading-spinner-overlay';
import ConfirmModal from '../../components/ConfirmModal';
import ButtonGroup from '../../components/ButtonGroup';
import CustomTextInput from '../../components/TextInput';
import styles from '../../resources/styles';
import db from '../../api/db';
import colors from '../../resources/colors';
import {PAYMENT_TYPE} from '../../resources/enums';

const CategoryCrud = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [category, setCategory] = useState(initialCategory);
  const [errorFields, setErrorFields] = useState([]);

  const collection = 'category';
  const {_category, _lastId, _backToBill} = route.params;

  useEffect(() => {
    if (_backToBill) {
      setUpBackToBill();
    }
    setCategory(_category ? _category : initialCategory);
    setLoading(false);
  }, []);

  const setUpBackToBill = () => {
    initialCategory.type = _backToBill.type;
    db.list(collection, 'id')
      .then(res => {
        _backToBill.lastId = res.length > 0 ? res[res.length - 1].id : 0;
      })
      .catch(error => console.log(error));
  };

  const save = () => {
    const requiredFields = ['description', 'type'].filter(
      item => !category[item],
    );
    if (requiredFields.length == 0) {
      setLoading(true);

      if (!category.id) {
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
    db.add(collection, {...category, id})
      .then(res => {
        _backToBill
          ? navigation.replace(_backToBill.url, {
              _lastId: _backToBill.lastId,
              _type: _backToBill.type,
              _bill: _backToBill.bill,
              _shouldUpdate: 'Category',
            })
          : navigation.navigate('CategoryList', {
              _shouldUpdate: {action: 'add', data: res, lastId: id},
            });
      })
      .catch(error => console.log(error));
  };

  const update = () => {
    db.update(collection, category)
      .then(res => {
        navigation.navigate('CategoryList', {
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
        navigation.navigate('CategoryList', {
          _shouldUpdate: {action: 'delete', data: id},
        }),
      )
      .catch(error => console.log(error));
  };

  const handleChange = (field, value) => {
    setCategory(current => {
      return {...current, [field]: value};
    });
  };

  const renderTitle = () => {
    return (
      <Text style={[styles.text.title, styles.layout.paddingTop]}>
        {category.id ? 'Editar Categoria' : 'Nova Categoria'}
      </Text>
    );
  };

  const renderButtons = () => {
    return (
      <View
        style={[
          styles.layout.row,
          {paddingHorizontal: 15, marginTop: 20},
          _category ?? {paddingBottom: 50},
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
    return _category ? (
      <View style={{paddingHorizontal: 15, marginTop: 10}}>
        <TouchableOpacity
          style={[styles.buttons.redButton]}
          onPress={() => setConfirmModal(true)}>
          <Text style={styles.buttons.primaryButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    ) : null;
  };

  const makeIconRow = icon => {
    return (
      <TouchableOpacity
        onPress={() =>
          setCategory(current => {
            return {...current, icon: icon};
          })
        }
        key={icon}
        style={{
          width: 45,
          height: 45,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Icon
          name={icon}
          color={category.icon === icon ? colors.primary : colors.gray}
          size={category.icon === icon ? 32 : 24}
        />
      </TouchableOpacity>
    );
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
              value={category.description}
              field={'description'}
              withError={errorFields.includes('description')}
            />
            <ButtonGroup
              buttons={[
                {
                  title: 'Receita',
                  value: PAYMENT_TYPE.INCOME,
                  press: () =>
                    setCategory(current => {
                      return {...current, type: PAYMENT_TYPE.INCOME};
                    }),
                },
                {
                  title: 'Despesa',
                  value: PAYMENT_TYPE.OUTCOME,
                  press: () =>
                    setCategory(current => {
                      return {...current, type: PAYMENT_TYPE.OUTCOME};
                    }),
                },
              ]}
              readOnly={_backToBill ? true : false}
              active={_backToBill ? _backToBill.type : category.type}
              withError={errorFields.includes('type')}
            />
            <View
              style={[
                styles.layout.row,
                {
                  justifyContent: 'space-between',
                  marginTop: 20,
                  flexWrap: 'wrap',
                },
              ]}>
              {iconOptions.map(icon => makeIconRow(icon))}
            </View>
          </View>
          {renderButtons()}
          {renderRemoveButton()}
        </View>
      </ScrollView>
      <ConfirmModal
        show={confirmModal}
        action={() => remove(category.id)}
        close={() => {
          setConfirmModal(false);
        }}
        message={`Confirma a exclusão da categoria ${category.description}?`}
      />
    </SafeAreaView>
  );
};

const initialCategory = {
  id: null,
  description: null,
  type: null,
  icon: null,
};

const iconOptions = [
  'home',
  'award',
  'book',
  'camera',
  'credit-card',
  'dollar-sign',
  'film',
  'gift',
  'github',
  'headphones',
  'heart',
  'image',
  'monitor',
  'music',
  'phone',
  'printer',
  'scissors',
  'settings',
  'shield',
  'shopping-cart',
  'smartphone',
  'smile',
  'star',
  'sun',
  'tag',
  'tool',
  'trash',
  'truck',
  'umbrella',
  'video',
];

export default CategoryCrud;
