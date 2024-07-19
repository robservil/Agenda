/* eslint-disable no-prototype-builtins */
/* eslint-disable no-var */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, ImageBackground, Image, TouchableOpacity, Text, Pressable } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { getDetail } from '../../api/RestaurantEndpoints'
import ImageCard from '../../components/ImageCard'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import * as GlobalStyles from '../../styles/GlobalStyles'
import defaultProductImage from '../../../assets/product.jpeg'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default function SelectOrderProductsScreen ({ navigation, route }) {
  const [restaurant, setRestaurant] = useState({})
  const [productsDict, setProductsDict] = useState({})

  useEffect(() => {
    fetchRestaurantDetail()
    console.log('Route params:', route.params)
  }, [route])

  const fetchRestaurantDetail = async () => {
    try {
      const fetchedRestaurant = await getDetail(route.params.id)
      setRestaurant(fetchedRestaurant)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving restaurant details (id ${route.params.id}). ${error}`,
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
        </View>
    )
  }

  const renderFooter = () => {
    return (
        <View style={styles.actionButtonsContainer && { height: 75 }}>
          <Pressable
              onPress={() => {
                console.log(route.params.userId)
                console.log(route.params.address)
                const productos = toArray(productsDict)
                console.log('Productos array', productos)
                const precioTotal = obtenerPrecio(restaurant.products)
                console.log('Precio total:', precioTotal)
                const orderShippingCosts = obtenerShippingCosts(precioTotal)
                console.log('Shipping costs: ', orderShippingCosts)
                navigation.navigate('CreateOrderScreen', {
                  restaurantId: restaurant.id,
                  products: toArray(productsDict),
                  address: route.params.address,
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
                Create Order
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
          This restaurant has no products yet. ¡Come back later!
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
