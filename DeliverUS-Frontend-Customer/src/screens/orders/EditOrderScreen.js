import React, { useEffect, useState, useCallback } from 'react'
import { StyleSheet, View, FlatList, ImageBackground, Image, TouchableOpacity, Text, Pressable, TextInput } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { getDetail } from '../../api/RestaurantEndpoints'
import ImageCard from '../../components/ImageCard'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import * as GlobalStyles from '../../styles/GlobalStyles'
import defaultProductImage from '../../../assets/product.jpeg'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { getOrderDetail } from '../../api/OrderEndpoints'
import debounce from 'lodash/debounce'

export default function EditOrderScreen ({ navigation, route }) {
  const [restaurant, setRestaurant] = useState({})
  const [productsDict, setProductsDict] = useState({})
  const [address, setAddress] = useState('')

  useEffect(() => {
    fetchRestaurantDetail()
    fetchOrderDetail()
  }, [route])

  const handleAddressChange = useCallback(
    debounce((newAddress) => {
      setAddress(newAddress)
    }, 1000),
    []
  )

  const fetchOrderDetail = async () => {
    try {
      const fetchedOrder = await getOrderDetail(route.params.id)
      const productDiccionary = {}
      fetchedOrder.products.forEach(product => {
        productDiccionary[product.id] = product.OrderProducts.quantity
      })
      setProductsDict(productDiccionary)
      setAddress(fetchedOrder.address)
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

  const handleAddProduct = (product) => {
    if (product.availability) {
      setProductsDict(prevOrder => ({
        ...prevOrder,
        [product.id]: (prevOrder[product.id] || 0) + 1
      }))
    }
  }

  const handleRemoveProduct = (product) => {
    if (product.availability) {
      setProductsDict(prevOrder => ({
        ...prevOrder,
        [product.id]: Math.max((prevOrder[product.id] || 0) - 1, 0)
      }))
    }
  }

  const toArray = (productsDict) => {
    const productsArray = []
    for (const [productId, quantity] of Object.entries(productsDict)) {
      productsArray.push({ productId, quantity })
    }
    return productsArray
  }

  const obtenerShippingCosts = (precio) => {
    let shippingCosts = 0
    if (precio <= 10) {
      shippingCosts = restaurant.shippingCosts
    }
    return shippingCosts
  }

  const obtenerPrecio = (productos) => {
    let precioT = 0
    for (const producto of productos) {
      if (producto.id in productsDict) {
        precioT += producto.price * productsDict[producto.id]
      }
    }
    return precioT
  }

  const renderHeader = () => {
    return (
        <View>
          <ImageBackground source={(restaurant?.heroImage) ? { uri: process.env.API_BASE_URL + '/' + restaurant.heroImage, cache: 'force-cache' } : undefined} style={styles.imageBackground}>
            <View style={styles.restaurantHeaderContainer}>
              <TextSemiBold textStyle={styles.textTitle}>{restaurant.name}</TextSemiBold>
              <Image style={styles.image} source={restaurant.logo ? { uri: process.env.API_BASE_URL + '/' + restaurant.logo, cache: 'force-cache' } : undefined} />
              <TextRegular textStyle={styles.description}>{restaurant.description}</TextRegular>
              <TextRegular textStyle={styles.description}>{restaurant.restaurantCategory ? restaurant.restaurantCategory.name : ''}</TextRegular>
            </View>
          </ImageBackground>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="map-marker" size={20} color="gray" style={styles.icon} />
            <TextInput
                style={styles.input}
                placeholder="Enter address"
                placeholderTextColor="gray"
                defaultValue={address}
                onChangeText={handleAddressChange}
            />
          </View>
        </View>
    )
  }

  const renderFooter = () => {
    return (
        <View style={styles.actionButtonsContainer && { height: 75 }}>
          <Pressable
              onPress={() => {
                const precioTotal = obtenerPrecio(restaurant.products)
                const orderShippingCosts = obtenerShippingCosts(precioTotal)
                navigation.navigate('ConfirmEditOrderScreen', {
                  id: route.params.id,
                  restaurantId: restaurant.id,
                  products: toArray(productsDict),
                  address,
                  userId: route.params.userId,
                  price: precioTotal,
                  shippingCosts: orderShippingCosts
                })
              }}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? GlobalStyles.brandBlueTap
                    : GlobalStyles.brandBlue
                },
                styles.actionButton
              ]}>
            <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
              <MaterialCommunityIcons name='pencil' color={'white'} size={20}/>
              <TextRegular textStyle={styles.text}>
                Edit Order
              </TextRegular>
            </View>
          </Pressable>
        </View>
    )
  }

  const renderProduct = ({ item: product }) => {
    return (
        <ImageCard
            imageUri={product.image ? { uri: process.env.API_BASE_URL + '/' + product.image } : defaultProductImage}
            title={product.name}
        >
          <TextRegular numberOfLines={2}>{product.description}</TextRegular>
          <TextSemiBold textStyle={styles.price}>{product.price.toFixed(2)}€</TextSemiBold>
          {!product.availability &&
              <TextRegular textStyle={styles.availability }>Not available</TextRegular>
          }
          <View style={styles.orderControls}>
            <TouchableOpacity onPress={() => handleRemoveProduct(product)}>
              <Text>-</Text>
            </TouchableOpacity>
            <Text>{productsDict[product.id] || 0}</Text>
            <TouchableOpacity onPress={() => handleAddProduct(product)}>
              <Text>+</Text>
            </TouchableOpacity>
          </View>
        </ImageCard>
    )
  }

  const renderEmptyProductsList = () => {
    return (
        <TextRegular textStyle={styles.emptyList}>
          Seems like we could not retrieve this order products, we are sorry.
        </TextRegular>
    )
  }

  return (
      <FlatList
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyProductsList}
          ListFooterComponent={renderFooter}
          style={styles.container}
          data={restaurant.products}
          renderItem={renderProduct}
          keyExtractor={item => item.id.toString()}
      />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  orderControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 100
  },
  row: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: GlobalStyles.brandSecondary
  },
  restaurantHeaderContainer: {
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
  actionButtonText: {
    color: 'white'
  },
  price: {
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
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
    marginHorizontal: 20
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333'
  },
  icon: {
    marginRight: 10
  },
  text: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center',
    marginLeft: 5
  }
})
