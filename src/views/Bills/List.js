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

const BillsList = ({navigation, route}) => {
  const [loading, setLoading] = useState(true);
  const [billsList, setBillsList] = useState([]);
  const [lastId, setLastId] = useState(0);

  const collection = 'bill';
  const url = type == PAYMENT_TYPE.INCOME ? 'IncomeCrud' : 'OutcomeCrud';

  const {type, _shouldUpdate} = route.params;

  useEffect(() => {
    db.listWithEqualsQuery(collection, 'description', {
      column: 'type',
      data: type,
      operator: '==',
    })
      .then(res => {
        setBillsList(res);
        setLastId(res.length > 0 ? getLastId(res) : 0);
        setLoading(false);
      })
      .catch(error => console.log(error));
  }, [_shouldUpdate]);

  const getLastId = list => {
    const orderedList = list.sort((a, b) =>
      a.id > b.id ? 1 : b.id > a.id ? -1 : 0,
    );
    return orderedList[orderedList.length - 1].id;
  };

  useEffect(() => {
    if (_shouldUpdate) {
      const item = _shouldUpdate.data;
      let newList = [];
      switch (_shouldUpdate.action) {
        case 'add':
          newList = billsList;
          newList.push({...item});
          break;
        case 'update':
          newList = billsList.map(i => (item.id == i.id ? item : i));
          break;
        case 'delete':
          newList = billsList.filter(i => i.id != item);
          break;

        default:
          break;
      }
      setBillsList(
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
          navigation.navigate(url, {
            _type: type,
            _bill: item,
            _lastId: lastId,
          })
        }
        style={[
          styles.layout.card,
          styles.layout.row,
          styles.layout.rowAlignCenter,
        ]}
        key={item.id}>
        <Icon name="chevron-right" size={20}></Icon>
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
          {billsList.map(item => makeRow(item))}
        </View>
        <View style={{height: 75}} />
      </ScrollView>
      <FloatingButton
        icon="plus"
        handler={() =>
          navigation.navigate(url, {
            _type: type,
            _bill: null,
            _lastId: lastId,
          })
        }></FloatingButton>
    </SafeAreaView>
  );
};

export default BillsList;
