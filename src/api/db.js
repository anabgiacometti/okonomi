import firestore from '@react-native-firebase/firestore';
import NetInfo from '@react-native-community/netinfo';

const db = firestore();

function getNetState() {
  const netInfo = NetInfo.fetch();
  return netInfo;
}

function list(collection, order_by) {
  return new Promise((resolve, reject) => {
    try {
      db.collection(collection)
        .orderBy(order_by)
        .get()
        .then(querySnapshot => {
          const list = [];
          querySnapshot.forEach(function (doc) {
            list.push({id: doc.id, ...doc.data()});
          });
          resolve(list);
        });
    } catch (error) {
      reject(error);
    }
  });
}

function listWithEqualsQuery(collection, order_by, query) {
  return new Promise((resolve, reject) => {
    try {
      db.collection(collection)
        .where(query.column, query.operator, query.data)
        .orderBy(order_by)
        .get()
        .then(querySnapshot => {
          const list = [];
          querySnapshot.forEach(function (doc) {
            list.push({id: doc.id, ...doc.data()});
          });
          resolve(list);
        });
    } catch (error) {
      reject(error);
    }
  });
}

async function add(collection, item) {
  const netState = await getNetState();
  if (netState.isConnected)
    await db.collection(String(collection)).doc(String(item.id)).set(item);
  else db.collection(String(collection)).doc(String(item.id)).set(item);
  return item;
}

async function update(collection, item) {
  const netState = await getNetState();
  if (netState.isConnected)
    await db.collection(String(collection)).doc(String(item.id)).update(item);
  else db.collection(String(collection)).doc(String(item.id)).update(item);
  return item;
}

async function remove(collection, id) {
  const netState = await getNetState();
  if (netState.isConnected)
    await db.collection(String(collection)).doc(String(id)).delete();
  else db.collection(String(collection)).doc(String(id)).delete();
  return id;
}

export default {list, listWithEqualsQuery, add, update, remove};
