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
import FloatingButton from '../../components/FloatingButton';
import styles from '../../resources/styles';
import db from '../../api/db';
import colors from '../../resources/colors';
import {PAYMENT_TYPE} from '../../resources/enums';

const CategoryList = ({navigation, route}) => {
  const [loading, setLoading] = useState(true);
  const [categoryList, setCategoryList] = useState([]);
  const [lastId, setLastId] = useState(0);

  const collection = 'category';

  const {_shouldUpdate, _refreshList} = route.params;

  useEffect(() => {
    db.list(collection, 'description')
      .then(res => {
        setCategoryList(res);
        setLastId(res.length > 0 ? getLastId(res) : 0);
        setLoading(false);
      })
      .catch(error => console.log(error));
  }, [_refreshList]);

  const getLastId = list => {
    const orderedList = list.sort((a, b) =>
      a.id > b.id ? 1 : b.id > a.id ? -1 : 0,
    );
    return orderedList[orderedList.length - 1].id
  };

  useEffect(() => {
    if (_shouldUpdate) {
      const item = _shouldUpdate.data
      let newList = [];
      switch (_shouldUpdate.action) {
        case 'add':
          newList = categoryList;
          newList.push({...item});
          break;
        case 'update':
          newList = categoryList.map(i => (item.id == i.id ? item : i));
          break;
        case 'delete':
          newList = categoryList.filter(i => i.id != item);
          break;

        default:
          break;
      }
      setCategoryList(
        newList.sort((a, b) =>
          a.description > b.description
            ? 1
            : b.description > a.description
            ? -1
            : 0,
        ),
      );
      if (_shouldUpdate.lastId) setLastId(_shouldUpdate.lastId);
      setLoading(false);
    }
  }, [_shouldUpdate]);

  const makeRow = item => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('CategoryCrud', {
            _category: item,
            _lastId: lastId,
          })
        }
        style={[
          styles.layout.card,
          styles.layout.row,
          styles.layout.rowAlignCenter,
        ]}
        key={item.id}>
        <Icon name={item.type === PAYMENT_TYPE.INCOME ? "plus" : "minus"} size={20}></Icon>
        <Text style={styles.text.title}>{item.description}</Text>
        <Icon name={item.icon} size={22} color={colors.primary} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{height: '100%', backgroundColor: colors.bgLight}}>
      <Spinner
        visible={loading}
        textContent={'Carregando...'}
        textStyle={styles.spinnerTextStyle}
      />
      <ScrollView>
        <View style={styles.layout.container}>
          {categoryList.map(item => makeRow(item))}
        </View>
        <View style={{height: 75}} />
      </ScrollView>
      <FloatingButton
        icon="plus"
        handler={() =>
          navigation.navigate('CategoryCrud', {
            _category: null,
            _lastId: lastId,
          })
        }></FloatingButton>
    </SafeAreaView>
  );
};

export default CategoryList;
