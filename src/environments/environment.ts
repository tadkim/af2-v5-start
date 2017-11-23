// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyCdMAs51ZZnROWlOuBSps82pXjGVbWKIR8",
    authDomain: "af2-v5-start-dev.firebaseapp.com",
    databaseURL: "https://af2-v5-start-dev.firebaseio.com",
    projectId: "af2-v5-start-dev",
    storageBucket: "af2-v5-start-dev.appspot.com",
    messagingSenderId: "427399576279"
  },
  dialogflow: {
    angularBot: '3054fd4e77ce4e06a880d33f08e2d669'
  }
};