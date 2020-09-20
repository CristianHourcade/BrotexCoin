import * as firebase from 'firebase';

export function createNewWallet(wallet,nombre) {
    firebase.database().ref('wallet/'+wallet).set({
      id: wallet,
      name:nombre
    });
  }