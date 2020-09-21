import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image,KeyboardAvoidingView , Keyboard} from 'react-native';
import { Dimensions } from "react-native";
// import { apiSand, url } from '../../../Toto/RNWallet/utilities/dataString';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { AsyncStorage } from 'react-native';
import { isLoged, LogOut } from '../../utilities/FirebaseAuth';
import * as firebase from 'firebase';
import 'babel-polyfill';
import { aMoneda, opcionesPesos } from '../../utilities/Currency';
import * as Crypto from 'expo-crypto';
import { LinearGradient } from 'expo-linear-gradient';
import { GetUrlToPay } from '../../utilities/Mercadopago/GetReference';
import { WebView } from 'react-native-webview';



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
        isHistory:1,
        destinario:'',
        montoDestinitario:0,
        urlPay:null
    }

    componentDidUpdate(){
       
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
        GetUrlToPay().then(e => {
            this.setState({urlPay: e});
        });
        // this.Blockchain.createTransaction(new Transaction('Brotex', this.state.TokenWallet, 100))
        // this.Blockchain.minePendingTransactions(this.state.TokenWallet,
        //      Object.keys(this.Blockchain.chain[0])[Object.keys(this.Blockchain.chain[0]).length-1]);

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
                    <Text style={{color:'white', fontSize:16}}>Envio de brotex</Text>
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
        <KeyboardAvoidingView behavior={'padding'} style={{flex:1}} keyboardVerticalOffset={30}> 

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
                </KeyboardAvoidingView>
            )
    }

    render() {
        
        
        
        if(this.Blockchain == null){
            return <Text>Cargando</Text>
        }
        return (
            <View style={styles.firstContainer}>
               
                <View style={{  flex:0.65, position:'relative', flexDirection:'column'}}>
                
                    <ImageBackground style={{width:width, flex:1, flexDirection:'column' }}
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
                        <View style={{  marginTop:30, justifyContent:"center", alignItems:'center'}}>
                            <Text style={{fontFamily:'font2', fontSize:20, color:'white', textAlign:'center'}}>Bienvenido {this.state.name}!</Text>
                            <Text style={{fontFamily:'font1', fontSize:18, color:'#DFDFDF', textAlign:'center', position:'relative', top:-5}}>Esta es tu billetera</Text>
                        </View>
                        <View style={{marginLeft:0, marginTop:30}}>
                           
                            <LinearGradient
                            style={{width:width-40, marginLeft:20,height:170, shadowColor: "#000",
                            flexDirection:'column', padding:15, borderRadius:15,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 8,
                            },
                            shadowOpacity: 0.44,
                            shadowRadius: 10.32,
                            
                            elevation: 16,}}
                            colors={['#0c0c0c', '#171717', '#151515']}> 
                            <LinearGradient style={{position:'absolute', right:30,top:43, height:94, width:94,transform: [{ rotate: "45deg" }]}}
                                colors={['black', '#b7650091', '#4c2a00e0']}
                                start={[0,0.33]}/>            
                                <LinearGradient style={{position:'absolute', right:32.1,top:40, height:90, width:90,transform: [{ rotate: "45deg" }],
                                borderTopLeftRadius:3, justifyContent:'center', alignItems:"center"}}
                                colors={['#2d2d2d', '#0c0c0c', '#0c0c0c']}
                                start={[0.3,0]}>
                                    <Text style={{fontFamily:'font4', transform: [{ rotate: "-45deg" }], color:'#f5f5f5db', fontSize:50 }}>B</Text>
                                </LinearGradient>
                                <Text style={{color:'white', flex:0.4, fontSize:20, fontFamily:'font4'}}>Brotex Card</Text>
                                <View style={{flex:0.6, justifyContent:'flex-end', alignItems:'flex-start'}}>
                                    <Text style={{color:'white',  fontSize:36,
                                    justifyContent:"flex-end"}}>
                                        {aMoneda(this.state.balance * Number(this.Blockchain.value), opcionesPesos
                                    )}</Text>
                                    <Text style={{color:'#929292',justifyContent:"flex-start",
                                    fontSize:16, fontFamily:'font1'}}>
                                        Tenés 
                                        <Text style={{fontFamily:'font2',color:'#3483fa'}}> {this.state.balance}</Text> Brotexs
                                    </Text>
                                 </View>
                            </LinearGradient>
                                <View style={{position:'absolute',bottom:-44, backgroundColor:'#ffffffb3', width:width-80, left:40,
                                padding:15, borderBottomLeftRadius:10, borderBottomRightRadius:10}}>
                                    <View style={{flex:1, flexDirection:"row"}}>

                                            <View style={{flex:1, justifyContent:'center', alignItems:'center', borderRightWidth:1,borderColor:"#17171717"}}>
                                                <TouchableOpacity onPress={() => {this.methodExample()}}>
                                                <Text style={{fontFamily:'font2', position:'relative', top:3}}>Ingresar Dinero</Text>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                                <TouchableOpacity>
                                                <Text style={{fontFamily:'font2', position:'relative', top:3}}>Retirar Dinero</Text>
                                                </TouchableOpacity>
                                            </View>
                                    </View>
                                </View>
                        </View>
                     
                        <View style={{position:"absolute", bottom:0,flexDirection:'row', flex:1,elevation:18, backgroundColor:'', width:width}}>
                            <View style={{flex:0.5}}>
                                <TouchableOpacity style={{flex:1, backgroundColor:"#d6d6d6", paddingLeft:30, paddingRight:30, height:45,
                            justifyContent:'center',alignItems:'center',borderTopColor:'#0F0F0F',
                             borderTopWidth:2}}
                            onPress={() => { this.setState({isHistory:1}); }}>
                                    <Text style={{
                                        fontFamily:(this.state.isHistory == 1)?'font2':'font3',
                                        color:(this.state.isHistory == 1)?'black':'#424242', 
                                    }}>
                                    Ultimos movimientos
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex:0.5}}>
                                <TouchableOpacity style={{flex:1, backgroundColor:"#d6d6d6",
                                paddingLeft:30, paddingRight:30,height:45,
                                justifyContent:'center', alignItems:'center', borderTopColor:'#0F0F0F', 
                                borderTopWidth:2}} 
                                onPress={() => { this.setState({isHistory:2})}}>
                                    <Text 
                                    style={{
                                        fontFamily:(this.state.isHistory == 2)?'font2':'font3',
                                        color:(this.state.isHistory == 2)?'black':'#424242',                                        
                                    }}>
                                    Enviar dinero
                                    </Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </ImageBackground>
                </View>

                <View style={{  flex:0.35}}>
                    <View style={{width:width, flex:1,
                    alignItems:'center',
                    backgroundColor:'#131313'}}>
                         <ScrollView style={{padding:15,}}>
                            {
                                (this.state.isHistory == 1)?
                                this.GetLastMovement():
                                this.sendBrotex()
                            }
                            <View style={{ height:15}}/>

                        </ScrollView>
                        <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={80}/>
                    </View>
                </View>
                {(this.state.urlPay != null)?
                <View style={{position:'absolute', width:width-40, marginLeft:20,marginTop:40,top:0,left:0, height:height-30, borderRadius:25,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 12,
                },
                shadowOpacity: 0.58,
                shadowRadius: 16.00,

                elevation: 24,}}>    
                    <WebView source={{ uri: this.state.urlPay }} style={{ height:height }} />
                </View>
                :null}
            
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