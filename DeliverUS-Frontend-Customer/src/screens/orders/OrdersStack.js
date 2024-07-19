import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import OrdersScreen from './OrdersScreen'
import OrderDetailScreen from './OrderDetailScreen'
import SelectOrderProductsScreen from './SelectOrderProductsScreen'
import EditOrderScreen from './EditOrderScreen'
import SelectRestaurantToCreateOrderScreen from './SelectRestaurantToCreateOrderScreen'
import EnterAddressScreen from './EnterAddressScreen'
import CreateOrderScreen from './CreateOrderScreen'
import ConfirmEditOrderScreen from './ConfirmEditOrderScreen'

const Stack = createNativeStackNavigator()

export default function OrdersStack () {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='OrdersScreen'
        component={OrdersScreen}
        options={{
          title: 'My Orders'
        }} />
      <Stack.Screen
        name='OrderDetailScreen'
        component={OrderDetailScreen}
        options={{
          title: 'Order Detail'
        }} />
      <Stack.Screen
        name='EnterAddressScreen'
        component={EnterAddressScreen}
        options={{
          title: 'Enter the address for Order delivering, please'
        }} />
      <Stack.Screen
        name='SelectRestaurantToCreateOrderScreen'
        component={SelectRestaurantToCreateOrderScreen}
        options={{
          title: 'Select Restaurant To Create Order'
        }} />
      <Stack.Screen
        name={'ConfirmEditOrderScreen'}
        component={ConfirmEditOrderScreen}
        options={{
          title: 'Confirm Order'
        }} />
      <Stack.Screen
        name='SelectOrderProductsScreen'
        component={SelectOrderProductsScreen}
        options={{
          title: 'Select Order Products'
        }} />
      <Stack.Screen
        name='CreateOrderScreen'
        component={CreateOrderScreen}
        options={{
          title: 'Create Order'
        }} />
      <Stack.Screen
        name='EditOrderScreen'
        component={EditOrderScreen}
        options={{
          title: 'Edit Order'
        }} />
    </Stack.Navigator>
  )
}
