import { TouchableOpacity } from 'react-native-gesture-handler';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, ImageBackground, TextInput, Image} from 'react-native';
import { Dimensions } from "react-native";
import { AsyncStorage } from 'react-native';
import { getUser, isLoged, LogOut, SingIn, SingUp } from '../../utilities/FirebaseAuth';
import { createNewWallet } from '../../blockchain/generateNewWallet';

import * as Crypto from 'expo-crypto';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class LoginScreen extends Component<any>{
   
    state = {
        email: '',
        password: '',
        nombre:'',
        login:false,
        TokenEmail: null,
        Conectado: null
    }
   
    async componentDidMount(){
        if(isLoged() !== null){
            this.props.navigation.navigate("Home");
        }
    }
    
    async componentDidUpdate(){
        if(this.state.TokenEmail != null){
            await(Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, this.state.email))
                .then(async e => {
                    createNewWallet(e,this.state.nombre);
                    await AsyncStorage.setItem('TokenWallet', e).then(async e => {
                        await AsyncStorage.setItem('Name', this.state.nombre).then(e => {
                            this.props.navigation.navigate("Home");
                        })
                    })
            })
        }
        if(this.state.Conectado != null){
            await(Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, this.state.email))
                .then(async emailEncriptado => {
                    await AsyncStorage.setItem('TokenWallet', emailEncriptado).then(e => {
                        getUser(emailEncriptado).then(async e => {
                            await AsyncStorage.setItem('Name', e).then(e => {
                                this.props.navigation.navigate("Home");
                            })
                        })
                    })
            })
        }
    }

    ValidateAccounts = async () => {
       if(this.state.login){
            SingIn(this.state.email, this.state.password).then(e => {
                this.setState({Conectado:e});
            })
       }else{

        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       
        if(!re.test(this.state.email)){
            alert("Por favor, escribi un email valido");
            return;
        }

        if(this.state.password.length < 6){
            alert("Escribi una contraseña más larga");
            return;
        }

            await SingUp(this.state.email, this.state.password).then( e => {
                this.setState({TokenEmail:e})
            })
        }

    }
  
    render() {
        return (
            <View style={styles.firstContainer}>
                <View style={{  height:200}}>
                    <ImageBackground style={{width:width, height:210, flex:1, justifyContent:'center',  alignItems:'center', position:'relative'}} source={require("../../assets/header.png")}>
                        <Text style={{position:'relative', top:-40, fontSize:34, color:'white', fontFamily:'font4'}}>Brotex</Text>
                    </ImageBackground>
                </View>

                <View style={{ justifyContent:'center', alignItems:'center',  paddingBottom:30}}>
                    <Text style={{fontSize:32, fontFamily:'font3', color:'#FFB73B'}}>¡Bienvenido!</Text>
                    <Text style={{fontSize:24, fontFamily:'font1', color:'#CFCFCF'}}>Empezá a generar ganancias</Text>
                    
                </View>
                {(!this.state.login)?
                    
                    <View style={{marginBottom:15}}>
                    <TextInput
                    style={{ height: 45,width:width-30,marginLeft:15, paddingLeft:15,borderRadius:5, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={text => this.setState({nombre: text})}
                    value={this.state.nombre}
                    placeholder="Nombre "
                    />
                    </View>
                    :null}
                <View style={{marginBottom:15}}>
                <Image source={require("../../assets/email-black-18dp.png")} style={{position:'absolute', top:7, left:30}}/>

                    <TextInput
                    style={{ height: 45,width:width-30,marginLeft:15, paddingLeft:55,borderRadius:5, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={text => this.setState({email: text})}
                    value={this.state.email}
                    keyboardType="email-address"
                    placeholder="Correo electronico"
                    />
                </View>
                <View style={{marginBottom:15}}>
                <Image source={require("../../assets/vpn_key-24px.png")} style={{position:'absolute', top:7, left:30}}/>

                    <TextInput 
                    style={{ height: 45,width:width-30,marginLeft:15, paddingLeft:55,borderRadius:5, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={text => this.setState({password: text})}
                    value={this.state.password}
                    placeholder="Contraseña"
                    />
                </View>
                <View style={{marginBottom:15, marginTop:15}}>
                    <TouchableOpacity style={{backgroundColor:(!this.state.login)?'black':'#DB8B00', color:"white", borderRadius:15, width:width-30, marginLeft:15, paddingTop:20,
                    paddingBottom:20, justifyContent:'center', alignItems:'center'}} onPress={ () => {this.ValidateAccounts()}}>
                        <Text style={{color:'white', fontFamily:'font4', fontSize:22}}>{(this.state.login) ? 'Iniciar sesion': 'crear cuenta'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{marginBottom:5, marginTop:15, justifyContent:'center', alignItems:'center'}}>
                  <Text style={{fontFamily:'font1', fontSize:16}}>O si tenes cuenta</Text>       
                </View>

                <View style={{marginBottom:15}}>
                    <TouchableOpacity style={{ width:width-30, marginLeft:15, paddingTop:20,
                    paddingBottom:20, justifyContent:'center', alignItems:'center'}}>
                        <Text style={{ fontFamily:'font4', fontSize:22, color:"#FFB73B"}} 
                        onPress={() => { this.setState({login:!this.state.login})}}>
                        {(!this.state.login) ? 'Iniciar sesion': 'crear cuenta'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{marginBottom:15, marginTop:15}}>
                    <TouchableOpacity style={{ width:width-30, marginLeft:15, paddingTop:20,
                    paddingBottom:20, justifyContent:'center', alignItems:'center'}}>
                        <Text style={{ fontFamily:'font3', fontSize:22, color:"#FF653F"}}>¿Olvidaste tu cuenta?</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    firstContainer: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
    },
});