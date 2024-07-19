import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, Pressable, FlatList } from 'react-native'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import { getAllOrders, remove } from '../../api/OrderEndpoints'
import { showMessage } from 'react-native-flash-message'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import ImageCard from '../../components/ImageCard'
import restaurantLogo from '../../../assets/restaurantLogo.jpeg'
import DeleteModal from '../../components/DeleteModal'

export default function OrdersScreen ({ navigation, route }) {
  const [orders, setOrders] = useState([])
  const [orderToBeDeleted, setOrderToBeDeleted] = useState(null)
  const { loggedInUser } = useContext(AuthorizationContext)

  useEffect(() => {
    if (loggedInUser) {
      fetchOrders()
    } else {
      setOrders(null)
    }
  }, [loggedInUser, route])

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await getAllOrders()
      setOrders(fetchedOrders)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving orders. ${error} `,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const renderHeader = () => {
    return (
        <>
          {loggedInUser &&
              <Pressable
                  onPress={() => navigation.navigate('SelectRestaurantToCreateOrderScreen', { userId: loggedInUser.id })
                  }
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed
                        ? GlobalStyles.brandGreenTap
                        : GlobalStyles.brandGreen
                    },
                    styles.button
                  ]}>
                <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                  <MaterialCommunityIcons name='plus-circle' color={'white'} size={20}/>
                  <TextRegular textStyle={styles.text}>
                    Create order
                  </TextRegular>
                </View>
              </Pressable>
          }
        </>
    )
  }

  const renderEmptyOrdersList = () => {
    return (
        <TextRegular textStyle={styles.emptyList}>
          No orders were retrieved, are you logged in?
        </TextRegular>
    )
  }

  const renderOrder = ({ item: order }) => {
    const canEditOrDelete = order.status === 'pending'

    return (
        <ImageCard
            imageUri={order.restaurant && order.restaurant.logo ? { uri: process.env.API_BASE_URL + '/' + order.restaurant.logo } : restaurantLogo}
            title={order.name}
            onPress={() => {
              navigation.navigate('OrderDetailScreen', { id: order.id, restaurantId: order.restaurantId })
            }}
        >
            <TextRegular numberOfLines={2}>{order.description}</TextRegular>
            {order.averageServiceMinutes !== null &&
                <TextSemiBold>Avg. service time: <TextSemiBold
                    textStyle={{ color: GlobalStyles.brandPrimary }}>{order.averageServiceMinutes} min.</TextSemiBold></TextSemiBold>
            }
            <TextSemiBold>Shipping: <TextSemiBold
                textStyle={{ color: GlobalStyles.brandPrimary }}>{order.shippingCosts.toFixed(2)}€</TextSemiBold></TextSemiBold>
            <View style={styles.actionButtonsContainer}>
                {canEditOrDelete && (
                    <>
                        <Pressable
                            onPress={() => navigation.navigate('EditOrderScreen', { id: order.id, restaurantId: order.restaurantId, userId: loggedInUser.id })}
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
                              Edit
                            </TextRegular>
                          </View>
                        </Pressable>

                        <Pressable
                            onPress={() => { setOrderToBeDeleted(order) }}
                            style={({ pressed }) => [
                              {
                                backgroundColor: pressed
                                  ? GlobalStyles.brandPrimaryTap
                                  : GlobalStyles.brandPrimary
                              },
                              styles.actionButton
                            ]}>
                          <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                            <MaterialCommunityIcons name='delete' color={'white'} size={20}/>
                            <TextRegular textStyle={styles.text}>
                              Delete
                            </TextRegular>
                          </View>
                        </Pressable>
                    </>
                )}
            </View>
        </ImageCard>
    )
  }
  /*
          (
          <View style={styles.container}>
              <Pressable
                  onPress={() => {
                    navigation.navigate('OrderDetailScreen', { id: Math.floor(Math.random() * 100) })
                  }}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed
                        ? brandPrimaryTap
                        : brandPrimary
                    },
                    styles.button
                  ]}
              >
                  <TextRegular textStyle={styles.text}>Go to Order Detail Screen</TextRegular>
              </Pressable>
          </View>
    )
    */

  const removeOrder = async (order) => {
    try {
      await remove(order.id)
      await fetchOrders()
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

  return (
      <>
        <FlatList
            style={styles.container}
            data={orders}
            renderItem={renderOrder}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderEmptyOrdersList}
            keyExtractor={item => item.id.toString()}
        />
        <DeleteModal
            isVisible={orderToBeDeleted !== null}
            onCancel={() => setOrderToBeDeleted(null)}
            onConfirm={() => removeOrder(orderToBeDeleted)}>
              <TextRegular>If the order is on delivering, it cannot be deleted.</TextRegular>
        </DeleteModal>
      </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
  text: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center',
    marginLeft: 5
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  }
})
