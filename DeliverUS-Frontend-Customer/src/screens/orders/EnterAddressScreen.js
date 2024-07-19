/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react'
import { TextInput, StyleSheet, View, Pressable } from 'react-native'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import TextRegular from '../../components/TextRegular'
import { showMessage } from 'react-native-flash-message'

export default function EnterAddressScreen ({ navigation, route }) {
  const [address, setAddress] = useState('')

  const renderFooter = () => {
    return (
        <View style={styles.actionButtonsContainer && { height: 75 }}>
          <Pressable
              onPress={() => {
                if (address !== '') {
                  navigation.navigate('SelectOrderProductsScreen', { address, userId: route.params.userId, id: route.params.id })
                } else {
                  showMessage('Please, specify a valid address')
                }
              }}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? GlobalStyles.brandBlueTap
                    : GlobalStyles.brandBlue
                },
                styles.actionButton
              ]}>
            <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }] }>
              <MaterialCommunityIcons name='pencil' color={'white'} size={20}/>
              <TextRegular textStyle={styles.text}>
                Continue to confirm
              </TextRegular>
            </View>
          </Pressable>
        </View>
    )
  }

  return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="map-marker" size={20} color="gray" style={styles.icon} />
          <TextInput
              style={styles.input}
              placeholder="Enter address"
              placeholderTextColor="gray"
              value={address}
              onChangeText={setAddress}
          />
        </View>
        {renderFooter()}
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20
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
    marginBottom: 20
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
