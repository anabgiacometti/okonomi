/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import colors from './src/resources/colors';
import {PAYMENT_TYPE} from './src/resources/enums';

// Screens
import HomeScreen from './src/views/HomeScreen';
import PaymentGroupList from './src/views/PaymentGroup/List';
import PaymentGroupCrud from './src/views/PaymentGroup/Crud';
import CategoryList from './src/views/Category/List';
import CategoryCrud from './src/views/Category/Crud';
import BillsList from './src/views/Bills/List';
import BillsCrud from './src/views/Bills/Crud';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({navigation}) => {
  const defaultItems = [
    {name: 'Inicio', route: 'Home', icon: 'home'},
    {name: 'Extrato', route: 'Home', icon: 'file-text'},
    {name: 'Outro Link', route: 'Home', icon: 'home'},
  ];

  const configItems = [
    {
      name: 'Receitas',
      route: 'IncomeList',
      icon: 'plus',
      params: {type: PAYMENT_TYPE.INCOME, _refreshList: true},
    },
    {
      name: 'Despesas',
      route: 'OutcomeList',
      icon: 'minus',
      params: {type: PAYMENT_TYPE.OUTCOME, _refreshList: true},
    },
    {
      name: 'Categorias',
      route: 'CategoryList',
      icon: 'tag',
      params: {_refreshList: true},
    },
    {
      name: 'Grupo de Pagamentos',
      route: 'PaymentGroupList',
      icon: 'calendar',
      params: {_refreshList: true},
    },
  ];

  const renderHeader = () => {
    return (
      <View style={[styles.header, styles.row]}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Icon style={{padding: 15}} name="x" size={20}></Icon>
        </TouchableOpacity>
        <Text style={styles.headerText}>Menu</Text>
      </View>
    );
  };

  const renderDefaultItems = () => {
    return defaultItems.map(item => (
      <TouchableOpacity
        key={item.name}
        style={itemsStyles.row}
        onPress={() => navigation.navigate(item.route, item.params)}>
        <Icon style={itemsStyles.linkIcon} name={item.icon} size={20}></Icon>
        <Text style={itemsStyles.linkText}>{item.name}</Text>
      </TouchableOpacity>
    ));
  };

  const renderConfigItems = () => {
    return configItems.map(item => (
      <TouchableOpacity
        key={item.name}
        style={itemsStyles.row}
        onPress={() => navigation.navigate(item.route, item.params)}>
        <Icon style={itemsStyles.linkIcon} name={item.icon} size={20}></Icon>
        <Text style={itemsStyles.linkText}>{item.name}</Text>
      </TouchableOpacity>
    ));
  };

  const renderItems = items => {
    const mappedItems =
      items === 'default' ? renderDefaultItems() : renderConfigItems();
    return mappedItems;
  };

  return (
    <DrawerContentScrollView>
      {renderHeader()}
      <View style={itemsStyles.container}>
        {renderItems('default')}
        <View style={itemsStyles.divisor}></View>
        {renderItems('config')}
      </View>
    </DrawerContentScrollView>
  );
};

function StackNavigator({navigation}) {
  const screenOptions = title => {
    return {
      header: () => (
        <View style={[styles.header, styles.row]}>
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Icon style={{padding: 15}} name="menu" size={20}></Icon>
          </TouchableOpacity>
          <Text style={styles.headerText}>{title}</Text>
        </View>
      ),
    };
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={screenOptions('Inicio')}
      />
      <Stack.Screen
        name="CategoryList"
        component={CategoryList}
        options={screenOptions('Categorias')}
      />
      <Stack.Screen
        name="CategoryCrud"
        component={CategoryCrud}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PaymentGroupList"
        component={PaymentGroupList}
        options={screenOptions('Grupo de Pagamentos')}
      />
      <Stack.Screen
        name="PaymentGroupCrud"
        component={PaymentGroupCrud}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="IncomeList"
        component={BillsList}
        options={screenOptions('Receitas')}
      />
      <Stack.Screen
        name="IncomeCrud"
        component={BillsCrud}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OutcomeList"
        component={BillsList}
        options={screenOptions('Despesas')}
      />
      <Stack.Screen
        name="OutcomeCrud"
        component={BillsCrud}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function DrawerNavigator({navigation, route}) {
  return (
    <Drawer.Navigator
      drawerStyle={{width: '100%'}}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Stack" component={StackNavigator} />
    </Drawer.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.bgLight,
    padding: 10,
    paddingTop: 25,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    paddingLeft: 10,
    color: colors.primary,
  },
});

const itemsStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgLight,
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingBottom: 20,
  },
  linkIcon: {
    fontSize: 20,
    color: colors.primary,
  },
  linkText: {
    fontSize: 20,
    paddingLeft: 25,
    color: colors.primary,
  },
  divisor: {
    backgroundColor: colors.gray,
    height: 5,
    marginHorizontal: 45,
    borderRadius: 5,
    marginTop: 15,
    marginBottom: 40,
  },
});

export default App;
