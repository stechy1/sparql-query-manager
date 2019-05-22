import {firebaseConfig} from './firebase.config';

export const environment = {
  production: true,
  firebase: window['__env'].firebase || firebaseConfig,
  localStorage: {
    prefix: 'sparql-manager',
    storageType: 'localStorage'
  }
};
