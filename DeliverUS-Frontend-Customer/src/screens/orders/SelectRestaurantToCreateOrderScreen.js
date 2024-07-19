/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { StyleSheet, FlatList } from 'react-native'

import { getAll } from '../../api/RestaurantEndpoints'
import ImageCard from '../../components/ImageCard'
import TextSemiBold from '../../components/TextSemibold'
import TextRegular from '../../components/TextRegular'
import * as GlobalStyles from '../../styles/GlobalStyles'

import { showMessage } from 'react-native-flash-message'
import restaurantLogo from '../../../assets/restaurantLogo.jpeg'

export default function SelectRestaurantToCreateOrderScreen ({ navigation, route }) {
  const [restaurants, setRestaurants] = useState([])

  useEffect(() => {
    fetchRestaurants()
  }, [route])

  const renderRestaurant = ({ item: restaurant }) => {
    return (
        <ImageCard
            imageUri={restaurant.logo ? { uri: process.env.API_BASE_URL + '/' + restaurant.logo } : restaurantLogo}
            title={restaurant.name}
            onPress={() => {
              navigation.navigate('EnterAddressScreen', { id: restaurant.id, userId: route.params.userId })
            }}
        >
          <TextRegular numberOfLines={2}>{restaurant.description}</TextRegular>
          {restaurant.averageServiceMinutes !== null &&
              <TextSemiBold>Avg. service time: <TextSemiBold textStyle={{ color: GlobalStyles.brandPrimary }}>{restaurant.averageServiceMinutes} min.</TextSemiBold></TextSemiBold>
          }
          <TextSemiBold>Shipping: <TextSemiBold textStyle={{ color: GlobalStyles.brandPrimary }}>{restaurant.shippingCosts.toFixed(2)}€</TextSemiBold></TextSemiBold>
        </ImageCard>
    )
  }

  const renderEmptyRestaurantsList = () => {
    return (
        <TextRegular textStyle={styles.emptyList}>
          No restaurants were retreived. Sorry, we will fix this soon!
        </TextRegular>
    )
  }
  const fetchRestaurants = async () => {
    try {
      const fetchedRestaurants = await getAll()
      setRestaurants(fetchedRestaurants)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving restaurants. ${error} `,
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
            data={restaurants}
            renderItem={renderRestaurant}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={renderEmptyRestaurantsList}
        />
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
