/* eslint-disable eqeqeq */
/* eslint-disable semi */
/* eslint-disable react/prop-types */
import React, { useContext, useState, useEffect } from 'react'
import { View, Text, Pressable, StyleSheet, ScrollView, FlatList } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import ImageCard from '../../components/ImageCard'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import * as GlobalStyles from '../../styles/GlobalStyles'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as yup from 'yup'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import defaultProductImage from '../../../assets/product.jpeg'
import { getDetail } from '../../api/RestaurantEndpoints'
import { updateOrder } from '../../api/OrderEndpoints'

export default function CreateOrderScreen ({ navigation, route }) {
  const { loggedInUser } = useContext(AuthorizationContext)
  const [order, setOrder] = useState({})
  const [orderPrice, setOrderPrice] = useState(route.params.price)
  const [restaurant, setRestaurant] = useState({})
  const [loading, setLoading] = useState(true) // Estado de carga para que de tiempo a hacer fecth del restaurante

  const initialOrderValues = {
    createdAt: new Date(),
    startedAt: null,
    sentAt: null,
    state: 'pending',
    deliveredAt: null,
    price: orderPrice,
    address: route.params.address,
    shippingCosts: route.params.shippingCosts,
    restaurantId: route.params.restaurantId,
    userId: route.params.userId,
    products: route.params.products
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
    } finally {
      setLoading(false) // Finaliza la carga
    }
  }

  useEffect(() => {
    setOrderPrice(route.params.price)
    setOrder(initialOrderValues)
    fetchRestaurantDetail()
  }, [loggedInUser, route])

  // El usuario solo pone el address, el restaurante y los productos. El resto se genera automáticamente
  const validationSchema = yup.object().shape({
    createdAt: yup.date().required(),
    startedAt: yup.date().nullable(),
    state: yup.string().required(),
    sentAt: yup.date().nullable(),
    deliveredAt: yup.date().nullable(),
    price: yup.number().required('Sorry, there was an error retrieving the price of the order'),
    shippingCosts: yup.number().required(),
    address: yup.string().required('Address is required'),
    userId: yup.number().positive().integer().min(1).required('User ID is required'),
    products: yup.array().of(
      yup.object().shape({
        productId: yup.number().min(1).required(),
        quantity: yup.number().min(1).required()
      })
    ).required()
  })

  const renderProduct = ({ item: productoIdAndQuantity }) => {
    const product = restaurant.products.filter(p => p.id == productoIdAndQuantity.productId)[0]
    return (
            <View key={product.id}>
                <ImageCard
                    imageUri={product.image ? { uri: process.env.API_BASE_URL + '/' + product.image } : defaultProductImage}
                    title={product.name}
                >
                    <TextRegular numberOfLines={2}>{product.description}</TextRegular>
                    <TextSemiBold style={styles.price}>{product.price * productoIdAndQuantity.quantity}€</TextSemiBold>
                    <Text>{productoIdAndQuantity.quantity} {productoIdAndQuantity.quantity === 1 ? 'unidad' : 'unidades'}</Text>
                </ImageCard>
            </View>
    )
  }

  const handleConfirm = async () => {
    order.createdAt = new Date()
    setOrder(order)
    const isValid = validationSchema.isValidSync(order)
    try {
      if (isValid) {
        // Crear una copia del objeto order sin la propiedad restaurantId
        const { restaurantId, ...orderWithoutRestaurantId } = order
        const orderUpdated = await updateOrder(route.params.id, orderWithoutRestaurantId)
        showMessage({
          message: `Order with price ${orderUpdated.price} (including shipping costs) succesfully updated`,
          type: 'success',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
        navigation.navigate('OrdersScreen', { dirty: true })
      } else {
        showMessage({
          message: 'The order data is not correct. Please check your input.',
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    } catch (error) {
      showMessage({
        message: `The order could not be updated because of error ${error}.`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  if (loading) {
    return (
            <View style={styles.loadingContainer}>
                <TextRegular>Loading...</TextRegular>
            </View>
    )
  }

  return (
        <ScrollView contentContainerStyle={styles.contentContainer}>
            <TextSemiBold textStyle={{ fontSize: 15 }}>Please confirm order</TextSemiBold>
            <TextRegular>Restaurant: {restaurant.name}</TextRegular>
            <TextRegular>Address: {order.address}</TextRegular>
            <TextRegular>Price: {order.price}</TextRegular>
            <TextRegular>Shipping costs: {order.shippingCosts}</TextRegular>
            <TextRegular>Products:</TextRegular>
            <FlatList
                data={order.products}
                renderItem={renderProduct}
                keyExtractor={item => item.productId.toString()}
            />
            <Pressable
                onPress={handleConfirm}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? GlobalStyles.brandPrimaryTap : GlobalStyles.brandPrimary
                  },
                  styles.actionButton
                ]}>
                <View style={styles.buttonContent}>
                    <MaterialCommunityIcons name='check' color={'white'} size={20}/>
                    <TextRegular style={styles.text}>
                        Confirm Edit Order
                    </TextRegular>
                </View>
            </Pressable>
        </ScrollView>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 16
  },
  actionButton: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    width: '80%'
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  text: {
    fontSize: 16,
    color: 'white',
    marginLeft: 5
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold'
  }
})
