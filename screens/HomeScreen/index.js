import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image} from 'react-native';
import { Dimensions } from "react-native";
// import { apiSand, url } from '../../../Toto/RNWallet/utilities/dataString';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { AsyncStorage } from 'react-native';
import { isLoged, LogOut } from '../../utilities/FirebaseAuth';
import * as firebase from 'firebase';
import 'babel-polyfill';
import { aMoneda, opcionesPesos } from '../../utilities/Currency';
import * as Crypto from 'expo-crypto';



const BlockChain  = require("../../blockchain/class/blockchain");
const Transaction  = require("../../blockchain/class/transaction");
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
// const marioCoin = new BlockChain();

export default class HomeScreen extends Component{
    
    Blockchain;

    state = {
        balance: '0',
        TokenWallet:"",
        name:"",
        isHistory:true,
        destinario:'',
        montoDestinitario:0
    }

    componentDidUpdate(){
        // if(this.Blockchain !== undefined)
        // console.log(this.Blockchain.getBalanceOfAddress("Brotex"))
    }

    async componentDidMount() {
        const value = await AsyncStorage.getItem('TokenWallet');
        const name = await AsyncStorage.getItem('Name');
        this.setState({TokenWallet:value, name:name})
        if(isLoged() === null || this.state.TokenWallet === ""){
            this.props.navigation.navigate("Login");
        }
        
        /**! GET DATA BLOCKCHAIN !**/
        await firebase.database().ref('Blockchain').on('value', (snapshot) => {
            const x = snapshot.val();
            this.Blockchain = new BlockChain(x.chain, x.difficulty, x.miningReward, x.value);
            this.setState({balance: Number(this.Blockchain.getBalanceOfAddress(this.state.TokenWallet))})
        });
        

    }

    CerrarSesion(){
        LogOut().then(e => {
            this.props.navigation.navigate("Login");
        });
    }

    methodExample(){
        this.Blockchain.createTransaction(new Transaction('Brotex', this.state.TokenWallet, 100))
        this.Blockchain.minePendingTransactions(this.state.TokenWallet,
             Object.keys(this.Blockchain.chain[0])[Object.keys(this.Blockchain.chain[0]).length-1]);

    }

    async sendRequestBrotex() {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       
        if(!re.test(this.state.destinario)){
            alert("El correo ingresado tiene un formato invalido, revisalo, por favor.");
            return;
        }

        await(Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, this.state.destinario))
        .then(async e => {
            this.Blockchain.createTransaction(new Transaction(this.state.TokenWallet, e, this.state.montoDestinitario));
            this.Blockchain.minePendingTransactions(this.state.TokenWallet,
                Object.keys(this.Blockchain.chain[0])[Object.keys(this.Blockchain.chain[0]).length-1]);
        });

    }

     GetLastMovement = () => {
        const transactions = [];
        Object.values(this.Blockchain.chain[0]).map(e => {
            Object.values(e.transactions).map(trans => {
                                
                                console.log(trans)
                if (trans.toAddress === this.state.TokenWallet) {
                    transactions.push(
                        <TouchableOpacity style={{flexDirection:'row',  marginBottom:15,
                         height:72, backgroundColor:'#0F0F0F', width:width-30, borderRadius:5}}>
                        <View style={{flex:0.2, backgroundColor:'#242424', borderRadius:5, justifyContent:'center', alignItems:'center'}}>
                        <Text style={{fontSize:42, color:'white'}}>$</Text>
                        </View>
                        <View style={{flex:0.6, paddingLeft:15, paddingTop:15, paddingBottom:15, justifyContent:'center'}}>
                        <Text style={{color:'white', fontSize:16}}>Compra de brotex</Text>
                        <Text style={{color:'#AEAEAE', fontSize:14}}>Ayer a las 10AM</Text>
                        </View>
                        <View style={{flex:0.4, paddingRight:20, justifyContent:'center'}}>
                            <Text style={{color:'white', fontSize:16, color:'#0AFF64', fontFamily:'font2',textAlign:'right'}}>
                                {aMoneda(trans.amount * this.Blockchain.value, opcionesPesos)}
                            </Text>
                            <Text style={{color:'#3483fa', fontSize:12, fontFamily:'font3', textAlign:'right'}}>
                                {trans.amount} Brotexs
                            </Text>
                        </View>
                        </TouchableOpacity>
                    )
                }else if(trans.fromAddress === this.state.TokenWallet){
                    transactions.push(
                        <TouchableOpacity style={{flexDirection:'row',  marginBottom:15,
                         height:72, backgroundColor:'#0F0F0F', width:width-30, borderRadius:5}}>
                        <View style={{flex:0.2, backgroundColor:'#242424', borderRadius:5, justifyContent:'center', alignItems:'center'}}>
                        <Text style={{fontSize:42, color:'white'}}>$</Text>
                        </View>
                        <View style={{flex:0.6, paddingLeft:15, paddingTop:15, paddingBottom:15, justifyContent:'center'}}>
                        <Text style={{color:'white', fontSize:16}}>Compra de brotex</Text>
                        <Text style={{color:'#AEAEAE', fontSize:14}}>Ayer a las 10AM</Text>
                        </View>
                        <View style={{flex:0.4, paddingRight:20, justifyContent:'center'}}>
                            <Text style={{ fontSize:16, color:'#ff5a5f', fontFamily:'font2',textAlign:'right'}}>
                                {aMoneda(trans.amount * this.Blockchain.value, opcionesPesos)}
                            </Text>
                            <Text style={{color:'#3483fa', fontSize:12, fontFamily:'font3', textAlign:'right'}}>
                                {trans.amount} Brotexs
                            </Text>
                        </View>
                        </TouchableOpacity>
                    )
                }
                }); 
            });
            if(transactions.length === 0){
                return (
                    <View style={{justifyContent:'center', alignItems:'center', marginTop:30}}>
                        <Text style={{fontFamily:'font3', fontSize:16, color:'white', textAlign:'center', marginTop:15}}>¡Todavía no hiciste ningun movimiento!</Text>
                        <Text style={{fontFamily:'font4', fontSize:16, color:'white', textAlign:'center', marginTop:15}}>Compra Brotex y empeza a ahorrar</Text>
                        <TouchableOpacity style={{backgroundColor:'#ff5a5f', padding:20, paddingLeft:30, paddingRight:30,
                    borderRadius:15, marginTop:30}}>
                            <Text style={{fontFamily:'font4', fontSize:20, color:'white'}}>Comprar Brotex</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
            return transactions;
    }

    sendBrotex = () => {
            return (
                <View style={{justifyContent:'center', alignItems:'center',marginBottom:15}}>
                    <Text style={{fontFamily:'font4', fontSize:16, color:'white', textAlign:'center', marginTop:15}}>Envia Brotex de manera sencilla</Text>
                    <View style={{marginBottom:15, marginTop:30}}>
                        <TextInput
                        keyboardType="email-address"
                        style={{ height: 45,width:width-30,
                            color:"white", paddingLeft:15,borderRadius:5, borderColor: 'gray', borderWidth: 1 }}
                        onChangeText={text => this.setState({destinario: text})}
                        value={this.state.destinario}
                        placeholderTextColor="#fff" 
                        placeholder="Email del destinitario"
                        />
                    </View>
                    <View style={{marginBottom:15}}>
                        <TextInput
                        keyboardType="number-pad"
                        style={{ height: 45,width:width-30, paddingLeft:15,borderRadius:5, borderColor: 'gray',color:'white', borderWidth: 1 }}
                        onChangeText={text => this.setState({montoDestinitario: text})}
                        value={this.state.montoDestinitario}
                        placeholder="Monto"
                        placeholderTextColor="#fff" 
                        />
                    </View>
                    
                    <TouchableOpacity style={{backgroundColor:'#ff5a5f', padding:20, paddingLeft:30, paddingRight:30,
                borderRadius:15, marginTop:15}} onPress={() => {this.sendRequestBrotex()}}>
                        <Text style={{fontFamily:'font4', fontSize:20, color:'white'}}>Enviar Brotexs</Text>
                    </TouchableOpacity>
                </View>
            )
    }

    render() {
       
        
        
        
        if(this.Blockchain == null){
            return <Text>Cargando</Text>
        }
        return (
            <View style={styles.firstContainer}>
                
                <TouchableOpacity style={{position:'absolute', elevation: 9, top:30, right:43, width:400,height:400, backgroundColor:'yellow'}} 
                >
                            <Image source={require('../../assets/account.png')} style={{height:40, width:40}} />
                        </TouchableOpacity>
                <View style={{  height:height/1.5, position:'relative'}}>
                
                    <ImageBackground style={{width:width, height:height/1.5, flexDirection:'column' }}
                     source={require("../../assets/bg.png")}>
                         <View style={{flexDirection:'row'}}>
                        <View style={{flex:0.33, marginTop:45}}>
                            <TouchableOpacity style={{marginLeft:15}} onPress={() => {this.CerrarSesion()}}>
                                <Image source={require('../../assets/sett.png')} style={{height:30, width:30}}/>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={{flex:0.33, marginTop:50}}>
                            <Text style={{fontSize:34, color:'white', fontFamily:'font4', marginLeft:4}}>Brotex</Text>
                        </View>
                        <View style={{flex:0.33, marginTop:45, alignItems:'flex-end'}}>
                            <TouchableOpacity style={{marginRight:15}}>
                                <Image source={require('../../assets/account.png')} style={{height:30, width:30}}/>
                            </TouchableOpacity>
                        </View>
                        </View>
                        <View style={{ marginLeft:15, marginTop:30}}>
                            <Text style={{fontFamily:'font2', fontSize:20, color:'white'}}>Bienvenido {this.state.name}!</Text>
                            <Text style={{fontFamily:'font1', fontSize:18, color:'#DFDFDF', position:'relative', top:-5}}>Esta es tu billetera</Text>
                        </View>
                        <View style={{marginLeft:0, marginTop:10}}>
                            <ImageBackground style={{width:300, height:170, shadowColor: "#000",
                            flexDirection:'column', padding:15, }}
                            source={require("../../assets/card.png")}>
                                <Text style={{color:'white', flex:0.4,marginLeft:25,marginTop:15, fontSize:20}}>Brotex</Text>
                                <Text style={{color:'white', flex:0.3,marginLeft:25, fontSize:36, justifyContent:"flex-end"}}>{aMoneda(this.state.balance * Number(this.Blockchain.value), opcionesPesos
                                )}</Text>
                                <Text style={{color:'#929292', flex:0.3, marginLeft:27, marginTop:3,justifyContent:"flex-start"}}>Tenés {this.state.balance} Brotexs</Text>

                            </ImageBackground>
                        </View>
                        <View style={{flexDirection:'row', marginTop:30}}>
                            <View style={{flex:0.5, justifyContent:'flex-start', alignItems:'flex-end', flexDirection:'row', }}> 
                            <TouchableOpacity style={{flexDirection:'row', justifyContent:'center', alignItems:'center', marginLeft:34+15 }}
                            onPress={() => { 
                                this.methodExample();
                            }}>
                                <TouchableOpacity style={{backgroundColor:'white', height:55, width:55, borderRadius:50, opacity:0.23,}}>
                                </TouchableOpacity>
                                <Image source={require("../../assets/call_made-black-18dp.png")} style={{width:30, height:30, position:'absolute', left:12}}/>
                                <Text style={{ marginLeft:10, width:80, fontFamily:'font1', color:'white', marginTop:2}}>Ingresar Dinero</Text>
                            </TouchableOpacity>
                            </View>
                            <View style={{flex:0.5, justifyContent:'flex-end', alignItems:'flex-end', flexDirection:'row', }}> 
                            <TouchableOpacity style={{flexDirection:'row', justifyContent:'center', alignItems:'center', marginRight:15}}>
                                <TouchableOpacity style={{backgroundColor:'white', height:55, width:55, borderRadius:50, opacity:0.23,}}>
                                </TouchableOpacity>
                                <Image source={require("../../assets/call_made-black-18dp.png")} style={{width:30, height:30, position:'absolute', left:12}}/>
                                <Text style={{ marginLeft:10, width:80, fontFamily:'font1', color:'white', marginTop:2}}>Ingresar Dinero</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{position:"absolute", bottom:0,flexDirection:'row', flex:1, backgroundColor:'', width:width}}>
                            <View style={{flex:0.5}}>
                                <TouchableOpacity style={{flex:1, backgroundColor:"#ffffff6b", paddingLeft:30, paddingRight:30, height:45,
                            justifyContent:'center',alignItems:'center',borderTopColor:'#0F0F0F',
                             borderTopWidth:(this.state.isHistory)?2:0}}
                            onPress={() => { this.setState({isHistory:true}); }}>
                                    <Text style={{fontFamily:'font3'}}>Ultimos movimientos</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex:0.5}}>
                                <TouchableOpacity style={{flex:1, backgroundColor:"#ffffff6b", paddingLeft:30, paddingRight:30,height:45,
                            justifyContent:'center',alignItems:'center',borderTopColor:'#0F0F0F', 
                            borderTopWidth:(!this.state.isHistory)?2:0}} 
                            onPress={() => { this.setState({isHistory:false})}}>
                                    <Text  style={{fontFamily:'font3'}}>Enviar dinero</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </ImageBackground>
                </View>

                <View style={{  height:height/2.7,}}>
                    
                    <View style={{width:width, height:height/3, flex:1,
                    alignItems:'center',
                     backgroundColor:'#131313'}}>

                         <ScrollView style={{padding:15,}}>
                            {
                                (this.state.isHistory)?
                                this.GetLastMovement():
                                this.sendBrotex()
                            }
                            <View style={{ height:15}}/>
                        </ScrollView>

                    </View>
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