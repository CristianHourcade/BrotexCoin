import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { initializeApp, storeHighScore } from './utilities/FirebaseAuth';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen  from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import * as Font from "expo-font";
import 'babel-polyfill';


const BlockChain  = require("./blockchain/class/blockchain")
const Transaction  = require("./blockchain/class/transaction")

const Stack = createStackNavigator();

export default class App extends Component {

  state = {}

  async componentDidMount(){

    initializeApp();    
    // let marioCoin = new BlockChain();
    // marioCoin.createGenesisBlock();

    // marioCoin.createTransaction(new Transaction('mariaddress', 'mario-address', 100))
    // marioCoin.minePendingTransactions('mario-address');
    // marioCoin.createTransaction(new Transaction('address2', 'mario-address', 50))

    // console.log('Balance of Mario is ', marioCoin.getBalanceOfAddress('mario-address'))
    // console.log('Balance of adress is ', marioCoin.getBalanceOfAddress('address2'))

    await Font.loadAsync({      
      font1: require("./assets/fonts/Poppins-Light.ttf"),
      font2: require("./assets/fonts/Poppins-SemiBold.ttf"),
      font3: require("./assets/fonts/Poppins-Medium.ttf"),
      font4: require("./assets/fonts/LEIXO-DEMO.ttf"),
    });

    this.setState({ fontsLoaded: true });
   

  }

  render(){
    if(!this.state.fontsLoaded){
      return <Text>loading...</Text>
    }
    return (
      <NavigationContainer>
      <Stack.Navigator headerMode="none">
      
        <Stack.Screen
          name="Login"
          component={LoginScreen}/>

        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
