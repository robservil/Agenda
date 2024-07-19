/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from 'react'
import { getAllOrders } from '../../api/OrderEndpoints'
import { showMessage } from 'react-native-flash-message'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { FlatList, StyleSheet, ScrollView } from 'react-native'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import ImageCard from '../../components/ImageCard'
import defaultProductImage from '../../../assets/product.jpeg'

export default function Top3ProductsScreen ({ navigation, route }) {
  const [top3Products, setTop3Products] = useState([])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await getAllOrders()
      filterOrders(fetchedOrders, route.params.restaurant)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving orders. ${error} `,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const filterOrders = (orders, restaurant) => {
    const newOrders = orders.filter(order => order.restaurantId === restaurant.id).map(o => o.products)
    const topProducts = {}
    let restaurantHasOrders = true
    if (newOrders.lenght === 0) {
      restaurantHasOrders = false
    }
    if (restaurantHasOrders) {
      for (const productos of newOrders) {
        for (const product of productos) {
          const { ProductId, quantity } = product.OrderProducts
          if (topProducts[ProductId]) {
            topProducts[ProductId] += quantity
          } else {
            topProducts[ProductId] = quantity
          }
        }
      }

      const sortedTopProducts = Object.entries(topProducts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([productId, quantity]) => ({ productId: parseInt(productId), quantity }))

      console.log('Top 3 productos', sortedTopProducts)

      setTop3Products(sortedTopProducts)
    }
  }

  const renderProduct = ({ item }) => {
    const product = route.params.restaurant.products.find(p => p.id === item.productId)
    if (!product) return null

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
        <TextSemiBold>Bought {item.quantity} {item.quantity === 1 ? 'time' : 'times'}</TextSemiBold>
      </ImageCard>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <TextSemiBold textStyle={{ fontSize: 15 }}>Top 3 Products</TextSemiBold>
      { top3Products && (
        <FlatList
        data={top3Products}
        renderItem={renderProduct}
        keyExtractor={item => item.productId.toString()}
      />
      )
      }
      { top3Products.length === 0 && (
        <TextRegular style={styles.text}>This restaurant does not have any order and therefore we cannot provide
        its top 3 products. Why do you not order something so that they appear here instead of this text? </TextRegular>
      )
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16
  },
  price: {
    fontSize: 16,
    color: GlobalStyles.brandPrimary
  },
  availability: {
    color: 'red',
    fontStyle: 'italic'
  },
  text: {
    fontSize: 16,
    color: 'black',
    alignSelf: 'center',
    marginLeft: 5
  }
})
