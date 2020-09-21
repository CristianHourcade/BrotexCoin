import * as firebase from 'firebase';

export function initializeApp() {
   
    if (!firebase.apps.length) {
        const firebaseConfig = {
            apiKey: "AIzaSyD1EHLZgPgDJxphE2CQAvamULAZqCxLmgA",
            authDomain: "brotex-c9309.firebaseapp.com",
            databaseURL: "https://brotex-c9309.firebaseio.com",
            projectId: "brotex-c9309",
            storageBucket: "brotex-c9309.appspot.com",
            messagingSenderId: "928096371988",
            appId: "1:928096371988:web:b07f87c0c9b8ffb3f62e01",
            measurementId: "G-3WJQELYC8T"
        };
        firebase.initializeApp(firebaseConfig);
    }else{
    }
}

// SingUp User
export async function SingUp(email, password) {
    return new Promise ( resolve => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(e => {
            resolve(e);
            firebase.auth().onIdTokenChanged(function (user) {
            });
        }).catch(e => {
            alert(e + "");
        });
    })
}


// SingIp User
export function SingIn(email, password, props) {
    return new Promise(resolve => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(e => {
            resolve("usuario conectado");
        });
    })
};


export function LogOut() {
    return new Promise(resolve => {
        firebase.auth().signOut().then(function () {
            resolve("Cerro sesion")
        }, function (error) {
            alert(error);
        });
    })
};

export function isLoged(){
    // console.log(firebase.auth().currentUser)
    return firebase.auth().currentUser;
}

export function VerifiyAuth(props) {
    firebase.auth().onIdTokenChanged(function (user) {
        if (user) {
            props.navigate("Home");
        } else {
            props.navigate("Login");
        }
    });
}

export async function getUser(email){
    // console.log(email);
    return new Promise(async resolve => {
        firebase.database().ref('wallet/' + email).on('value', (snapshot) => {
            resolve(snapshot.val().name);
        });
    })
}