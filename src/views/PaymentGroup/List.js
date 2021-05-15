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

const PaymentGroupList = ({navigation, route}) => {
  const [loading, setLoading] = useState(true);
  const [paymentGroupList, setPaymentGroupList] = useState([]);
  const [lastId, setLastId] = useState(0);

  const collection = 'paymentGroup';

  const {_refreshList, _shouldUpdate} = route.params;

  useEffect(() => {
    db.list(collection, 'paymentDay')
      .then(res => {
        setPaymentGroupList(res);
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
      const item = _shouldUpdate.data;
      let newList = [];
      switch (_shouldUpdate.action) {
        case 'add':
          newList = paymentGroupList;
          newList.push({...item});
          break;
        case 'update':
          newList = paymentGroupList.map(i => (item.id == i.id ? item : i));
          break;
        case 'delete':
          newList = paymentGroupList.filter(i => i.id != item);
          break;

        default:
          break;
      }
      setPaymentGroupList(
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
          navigation.navigate('PaymentGroupCrud', {
            _paymentGroup: item,
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
        <Text style={styles.text.badge}>
          {item.paymentDay >= 10 ? item.paymentDay : `0${item.paymentDay}`}{' '}
          {item.paymentDayType == 'workday' ? 'DU' : 'DC'}
        </Text>
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
          {paymentGroupList.map(item => makeRow(item))}
        </View>
        <View style={{height: 75}} />
      </ScrollView>
      <FloatingButton
        icon="plus"
        handler={() =>
          navigation.navigate('PaymentGroupCrud', {
            _paymentGroup: null,
            _lastId: lastId,
          })
        }></FloatingButton>
    </SafeAreaView>
  );
};

export default PaymentGroupList;
