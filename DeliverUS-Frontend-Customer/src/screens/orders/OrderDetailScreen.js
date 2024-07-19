/* eslint-disable eqeqeq */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, Pressable, ScrollView, Text } from 'react-native'
import TextRegular from '../../components/TextRegular'

import { AuthorizationContext } from '../../context/AuthorizationContext'
import { showMessage } from 'react-native-flash-message'
import * as GlobalStyles from '../../styles/GlobalStyles'
import DeleteModal from '../../components/DeleteModal'
import { remove, getOrderDetail } from '../../api/OrderEndpoints'
import { getDetail } from '../../api/RestaurantEndpoints'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import ImageCard from '../../components/ImageCard'
import TextSemiBold from '../../components/TextSemibold'
import defaultProductImage from '../../../assets/product.jpeg'

// TODO: remove this style (FRHEader) and the related <View>. DONE
export default function OrderDetailScreen ({ navigation, route }) {
  const [orderToBeDeleted, setOrderToBeDeleted] = useState(null)
  const [order, setOrder] = useState({})
  const { loggedInUser } = useContext(AuthorizationContext)
  const [restaurant, setRestaurant] = useState({})
  useEffect(() => {
    setOrder(fetchOrderDetail())
    setRestaurant(fetchRestaurantDetail())
  }, [loggedInUser, route])

  const fetchOrderDetail = async () => {
    try {
      const fetchedOrder = await getOrderDetail(route.params.id)
      setOrder(fetchedOrder)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving order details (id ${route.params.id}). ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const fetchRestaurantDetail = async () => {
    try {
      const fetchedRestaurant = await getDetail(route.params.restaurantId)
      setRestaurant(fetchedRestaurant)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving restaurant details (id ${route.params.restaurantId}). ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const removeOrder = async (order) => {
    try {
      await remove(order.id)
      navigation.navigate('OrdersScreen')
      setOrderToBeDeleted(null)
      showMessage({
        message: `Order ${order.name} succesfully removed`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    } catch (error) {
      setOrderToBeDeleted(null)
      showMessage({
        message: `Order ${order.name} could not be removed because of error ${error}.`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const renderHeader = () => {
    const canEditOrDelete = order.status === 'pending'
    return (
      <View>
        { canEditOrDelete && (
          <><Pressable
            onPress={() => navigation.navigate('EditOrderScreen', { id: order.id, restaurantId: order.restaurantId, userId: loggedInUser.id })}
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? GlobalStyles.brandGreenTap
                  : GlobalStyles.brandGreen
              },
              styles.button
            ]}>
            <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
              <MaterialCommunityIcons name='plus-circle' color={'white'} size={20} />
              <TextRegular textStyle={styles.text}>
                Edit order
              </TextRegular>
            </View>
          </Pressable><Pressable
            onPress={() => { setOrderToBeDeleted(order) } }
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? GlobalStyles.brandPrimaryTap
                  : GlobalStyles.brandPrimary
              },
              styles.actionButton
            ]}>
              <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                <MaterialCommunityIcons name='delete' color={'white'} size={20} />
                <TextRegular textStyle={styles.text}>
                  Delete
                </TextRegular>
              </View>
            </Pressable></>
        )
        }
        { !canEditOrDelete && (
          <TextRegular style={styles.text1}> The order cannot be deleted nor eddited because its state is not pending
          anymore, sorry for the inconvenience</TextRegular>
        )
      }
      </View>
    )
  }

  const renderEmptyDetailsList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        We could not retrieve any details of this order. Sorry for the problem.
        We will fix it as soon as posible.
      </TextRegular>
    )
  }

  const renderProduct = ({ item: product }) => {
    return (
      <ImageCard
        imageUri={product.image ? { uri: process.env.API_BASE_URL + '/' + product.image } : defaultProductImage}
        title={product.name}
      >
        <TextRegular numberOfLines={2}>{product.description}</TextRegular>
        <TextSemiBold>{product.price.toFixed(2) * product.OrderProducts.quantity}€</TextSemiBold>
          <Text>{product.OrderProducts.quantity} {product.OrderProducts.quantity === 1 ? 'unidad' : 'unidades'}</Text>
      </ImageCard>
    )
  }

  const renderOrder = () => {
    if (!order) {
      return (
        <View>
          {renderEmptyDetailsList()}
        </View>
      )
    }
    return (
      <View style={styles.container}>
        {renderHeader()}
        {/* Renderizar aquí los detalles del pedido */}
        <TextSemiBold>Order Details:</TextSemiBold>
        <TextRegular>Restaurant: {restaurant.name}</TextRegular>
        <TextRegular>Created At: {order.createdAt}</TextRegular>
        <TextRegular>Started At: {order.startedAt}</TextRegular>
        <TextRegular>Status: {order.status}</TextRegular>
        {order.status === 'delivered' && <TextRegular>Delivered At: {order.deliveredAt}</TextRegular>}
        <TextRegular>Price: {order.price}€</TextRegular>
        <TextRegular>Address: {order.address}</TextRegular>
        <TextRegular>Shipping Costs: {order.shippingCosts}€</TextRegular>
        {/* Renderizar la lista de productos */}
        <FlatList
          data={order.products}
          renderItem={renderProduct}
          keyExtractor={item => item.id.toString()}
        />
        <DeleteModal
          isVisible={orderToBeDeleted !== null}
          onCancel={() => setOrderToBeDeleted(null)}
          onConfirm={() => removeOrder(orderToBeDeleted)}>
          <TextRegular>If the order is on delivering, it cannot be deleted.</TextRegular>
        </DeleteModal>
      </View>
    )
  }

  return (
    <ScrollView>
      {renderOrder()}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: GlobalStyles.brandSecondary
  },
  orderHeaderContainer: {
    height: 250,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'column',
    alignItems: 'center'
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center'
  },
  image: {
    height: 100,
    width: 100,
    margin: 10
  },
  description: {
    color: 'white'
  },
  textTitle: {
    fontSize: 20,
    color: 'white'
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  },
  button: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    width: '80%'
  },
  text: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center',
    marginLeft: 5
  },
  text1: {
    fontSize: 16,
    color: 'black',
    alignSelf: 'center',
    marginLeft: 5
  },
  availability: {
    textAlign: 'right',
    marginRight: 5,
    color: GlobalStyles.brandSecondary
  },
  actionButton: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    margin: '1%',
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'column',
    width: '50%'
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    bottom: 5,
    position: 'absolute',
    width: '90%'
  }
})
