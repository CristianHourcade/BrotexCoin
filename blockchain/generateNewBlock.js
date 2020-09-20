import * as firebase from 'firebase';

export function createNewBlock(bloque) {
    firebase.database().ref('Blocks/0x'+bloque.hash).push({
      bloque
    });
  }