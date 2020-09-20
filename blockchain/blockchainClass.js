import * as firebase from 'firebase';

export function updateChain(Block) {
    firebase.database().ref('Blockchain/chain/'+Block.hash).set({
        hash:Block.hash,
        nonce:Block.nonce,
        previousHash:Block.previousHash,
        timestamp:Block.timestamp,
        transactions:Block.transactions
    });
}
