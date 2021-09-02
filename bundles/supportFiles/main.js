//
// This is the script that interacts with the IOTA DLT
//

// Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)

"use strict";
// Require the IOTA libraries
const Iota = require("@iota/core");
// Create a new instance of the IOTA object
// Use the `provider` field to specify which IRI node to connect to
const iota = Iota.composeAPI({
  provider: "https://nodes.devnet.iota.org:443",
});

//MAM
const Mam = require("./mam.client.js");
const { asciiToTrytes } = require("@iota/converter");
const { trytesToAscii } = require("@iota/converter");
let mamState = Mam.init("https://nodes.devnet.thetangle.org:443");
mamState = Mam.changeMode(mamState, "public");

//All rights reserved - Copyright © 2019 Xtense

//Array
var userArray = [];
var assetArray = [];

//Functions

// aux
function seedBalance(seed) {
  iota
    .getInputs(seed)
    .then(({ inputs, totalBalance }) => {
      console.log(inputs, totalBalance);
      return totalBalance;
    })
    .catch((err) => {
      if (err.message === errors.INSUFFICIENT_BALANCE) {
        // ...
      }
      // ...
    });
}

//finders

//returns user if found, else returns false
function findUser(userID) {
  var i = 0;
  for (var a = 0; a < userArray.length; a++) {
    if (userArray[a].userID == userID) {
      i = a;
      //console.log("Found user: "+userArray[i].userID);
    }
  }
  if (userArray.length > 0 && userArray[i].userID == userID) {
    return userArray[i];
  } else {
    return false;
  }
}

//returns asset if found, else returns false
function findAsset(assetID) {
  var i = 0;
  for (var a = 0; a < assetArray.length; a++) {
    if (assetArray[a].assetID == assetID) {
      i = a;
      //console.log("//Found asset: "+assetArray[i].assetID);
    }
  }
  if (assetArray.length > 0 && assetArray[i].assetID == assetID) {
    return assetArray[i];
  } else {
    return false;
  }
}

//find seed from a specicic user from an specific asset
function findSeed(userID, assetID) {
  var i = -1;
  var userAux = new Object();
  userAux = findUser(userID);
  if (userAux != false) {
    for (var a = 0; a < userAux.seedArray.length; a++) {
      if (userAux.seedArray[a].asset == assetID) {
        i = 1;
        //console.log("User "+userAux.userID+" has this seed for asset id "+ assetID + ": "+userAux.seedArray[a].seed);
        return userAux.seedArray[a].seed;
      }
    }
    if (i == -1) {
      console.log("Wrong assetID");
      return false;
    }
  } else {
    console.log("Wrong userID");
    return false;
  }
}

//find all seeds from one user
function findAllSeeds(userID) {
  var user = new Object();
  var ar = [];
  user = findUser(userID);
  for (var a = 0; a < user.seedArray.length; a++) {
    console.log(
      "const seed" +
        user.userID +
        "_" +
        user.seedArray[a].asset +
        " = '" +
        user.seedArray[a].seed +
        "';"
    );
    ar.push(user.seedArray[a]);
  }
  return ar;
}

// Initializers

//Initialize a user with all the seeds for each asset
function initUser(userID) {
  var user = new Object();
  if (findUser(userID) == false) {
    user.seedArray = [];
    user.userID = userID;
    for (var a = 0; a < assetArray.length; a++) {
      //var auxSeed = GenerateSeed();

      //START Only for testing - Always generate the same seeds
      var n = "A9";
      if (a == 1) {
        n = "B9";
      }
      if (a == 2) {
        n = "C9";
      }
      if (a == 3) {
        n = "D9";
      }
      var auxSeed =
        "PUEOTSEITFEVEWCWBTSIZM9NKRGJEIMXTULBACGFRQK9IMGICLBKW9TTEVSDQMGWKBXPVCBMMCXS" +
        n +
        userID;
      //END Only for testing

      var assetSeed = new Object();
      assetSeed.asset = assetArray[a].assetID;
      assetSeed.seed = auxSeed;
      user.seedArray.push(assetSeed);
    }
    userArray.push(user);
    console.log("Succesfully init user: " + user.userID);
  } else {
    console.log("User " + userID + " already exists");
  }
}

//add asset, and generate seeds for all the users for this asset
const addAsset = async (assetID, name, ammount, ISIN) => {
  var asset = new Object();
  if (findAsset(assetID) == false) {
    asset.assetID = assetID;
    asset.name = name;
    asset.ammount = ammount;
    asset.isin = ISIN;
    var data = JSON.stringify(asset);
    asset.rootMAM = await publish(data);
    for (var a = 0; a < userArray.length; a++) {
      //var auxSeed = GenerateSeed();

      //START Only for testing - Always generate the same seeds
      var n = "A9";
      if (a == 1) {
        n = "B9";
      }
      if (a == 2) {
        n = "C9";
      }
      if (a == 3) {
        n = "D9";
      }
      var auxSeed =
        "PUEOTSEITFEVEWCWBTSIZM9NKRGJEIMXTULBACGFRQK9IMGICLBKW9TTEVSDQMGWKBXPVCBMMCXS" +
        n +
        assetID;
      //END Only for testing

      var assetSeed = new Object();
      assetSeed.asset = asset.assetID;
      assetSeed.seed = auxSeed;
      userArray[a].seedArray.push(assetSeed);
    }
    assetArray.push(asset);
    console.log("Succesfully init asset: " + asset.assetID);
  } else {
    console.log("Asset " + assetID + " already exists");
  }
};

// Seed generator

//seed generator (Used in Beta releases) DONT USE FOR PRODOUCTION
var GenerateSeed = function () {
  var length = 81;
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ9";
  var randomValues = new Uint32Array(length);
  var result = new Array(length);
  window.crypto.getRandomValues(randomValues);
  var cursor = 0;
  for (var i = 0; i < randomValues.length; i++) {
    cursor += randomValues[i];
    result[i] = chars[cursor % chars.length];
  }
  return result.join("");
};

//MAM  FUNCTIONS! :)

//publish PUBLIC
const publish = async (data) => {
  var myobj = JSON.parse(data); //for testing
  // Convert the JSON to trytes and create a MAM message
  const trytes = asciiToTrytes(data);
  const message = Mam.create(mamState, trytes);

  // Update the MAM state to the state of this latest message
  // We need this so the next publish action knows it's state
  mamState = message.state;

  // Attach the message
  await Mam.attach(message.payload, message.address, 3, 9);
  //console.log('Sent message to the Tangle!')
  console.log("Name: " + myobj.name + " - Root address: " + message.root);
  return message.root;
};

//fetch public

// Auxiliar: Display coordinate data on our screen when we receive it
const showData = (raw) => {
  const data = trytesToAscii(raw);
  console.log(data);
};
//Fetch
const readMam = async (root) => {
  await Mam.fetch(root, "public", null, showData);
};

//Main functions to interact

// Create a wrapping function so we can use async/await
const transferShares = async (userTxID, userRxID, assetID, ammount) => {
  var userTx = new Object();
  var userRx = new Object();
  var asset = new Object();
  userTx = findUser(userTxID);
  userRx = findUser(userRxID);
  asset = findAsset(assetID);
  //IMPORTANT: Obtain seeds from the same assetID!
  const seedTx = findSeed(userTx.userID, asset.assetID);
  const seedRx = findSeed(userRx.userID, asset.assetID);
  console.log("Seed from user transmiter " + userTx.userID + " is: " + seedTx);
  console.log("Seed from user receiver " + userRx.userID + " is: " + seedRx);
  //obtain receiving address
  const receivingAddress = await iota.getNewAddress(seedRx, {});

  // Construct a TX to our new address
  const transfers = [
    {
      value: ammount,
      address: receivingAddress,
    },
  ];
  console.log("Sending  " + ammount + " shares: " + receivingAddress);
  console.log(transfers);

  //Attaches to tanlge, stores and broadcasts a list of transaction trytes.
  try {
    // Construct bundle and convert to trytes
    const trytes = await iota.prepareTransfers(seedTx, transfers);
    // Send bundle to node.
    const response = await iota.sendTrytes(trytes, 3, 9);

    console.log("Completed TXs");
    response.map((tx) => console.log(tx));
    console.log(
      userTx.userID +
        " sent  " +
        ammount +
        " shares to " +
        userRx.userID +
        " at address: " +
        "\n" +
        "'" +
        receivingAddress +
        "'"
    );
    return response;
  } catch (e) {
    console.log(e);
    ar.push(0);
    return ar;
  }
};

//verify that a group of seeds has a constant ammount of iotas
//It verifies seed balances versus MAM data
const checkAssetBalance = async (assetID) => {
  try {
    var balance = 0;
    var key = 0;
    var ar = [];
    var auxObj = new Object();
    var asset = findAsset(assetID);
    for (var a = 0; a < userArray.length; a++) {
      console.log("Checking balances from USER: " + userArray[a].userID);
      for (var b = 0; b < userArray[a].seedArray.length; b++) {
        console.log("   Checking - ASSET: " + userArray[a].seedArray[b].asset);
        if (userArray[a].seedArray[b].asset == asset.assetID) {
          var aux = await iota.getInputs(userArray[a].seedArray[b].seed);
          balance = aux.totalBalance + balance;
          key = 1;
        }
      }
    }
    if (key == 1) {
      console.log(
        "BALANCE IS: " + balance + " token shares from asset " + asset.assetID
      );
      ar.push(1);
      /*auxObj.name = asset.name
		auxObj.assetID = asset.assetID
		auxObj.isin = asset.isin
		auxObj.ammount = asset.ammount
		auxObj.balance = balance*/
      asset.balance = balance;
      ar.push(asset);
      console.log("Retriving MAM data...");
      var data = await Mam.fetch(ar[1].rootMAM, "public", null, null);
      var myobj = new Object();
      const dataNotTrytes = trytesToAscii(data.messages[0]);
      myobj = JSON.parse(dataNotTrytes);
      ar.push(myobj);
      console.log(ar);
      return ar;
    } else {
      console.log("Asset: " + assetID + " is not initialized");
      ar.push("Asset: " + assetID + " is not initialized");
      return ar;
    }
  } catch (e) {
    console.log(e);
    ar.push(e);
  }
};

//obtain the balance of certain address
const addressBalance = async (address) => {
  try {
    console.log("Getting balance...");
    const balance = await iota.getBalances([address], 100);
    console.log("Address '" + address + "' balance is; " + balance.balances);
  } catch (e) {
    console.log(e);
  }
};

//obtain the balance of certain user for certain asset
var userBalanceInAsset = async (userID, assetID) => {
  try {
    var seed = findSeed(userID, assetID);
    if (seed != false) {
      console.log("Getting balance...");
      const total = await iota.getInputs(seed);
      console.log(
        '   User "' +
          userID +
          '" ' +
          'balance for asset "' +
          assetID +
          '"is :' +
          total.totalBalance
      );
      return total.totalBalance;
    } else {
      console.log("ERROR USER BALANCE: FindSeed function didn't find seed");
    }
  } catch (e) {
    console.log(e);
  }
};

//obtain the balance of certain user for all assets
const userTotalBalance = async (userID) => {
  try {
    var user = new Object();
    var ar = [];
    user = findUser(userID);
    if (user != false) {
      ar.push(1);
      for (var a = 0; a < user.seedArray.length; a++) {
        var step = a + 1;
        var aux = new Object();
        console.log("Step " + step + " from " + user.seedArray.length);
        //aux.assetID = user.seedArray[a].asset;
        var asset = new Object();
        asset = findAsset(user.seedArray[a].asset);
        aux.name = asset.name;
        aux.balance = await userBalanceInAsset(user.userID, asset.assetID);
        ar.push(aux);
      }
      console.log(ar);
      return ar;
    } else {
      console.log("ERROR USER TOTAL BALANCE: Didnt find user");
      ar.push("ERROR USER TOTAL BALANCE: Didnt find user");
      console.log(ar);
      return ar;
    }
  } catch (e) {
    console.log(e);
  }
};

//Shares percentage distribution among users
const sharesDistribution = async (assetID) => {
  var ar = [];
  var asset = new Object();
  asset = findAsset(assetID);
  if (asset != false) {
    console.log("Shares distribution for asset: " + asset.name + "... ");
    ar.push(1);
    for (var a = 0; a < userArray.length; a++) {
      console.log("Checking: " + userArray[a].userID);
      var aux = new Object();
      aux.user = userArray[a].userID;
      aux.balance = await userBalanceInAsset(
        userArray[a].userID,
        asset.assetID
      );
      aux.percentage = (aux.balance / asset.ammount) * 100; //
      ar.push(aux);
    }
    console.log("Shares distribution for asset: " + asset.name + " finalized:");
    console.log(ar);
    return ar;
  } else {
    console.log("ERROR in SHARES DISTRIBUTION function: asset not in array");
    ar.push("ERROR in SHARES DISTRIBUTION function: asset not in array");
    return ar;
  }
};

//BOOTSTRAPPING 3 USERS and 3 ASSETS - always same seeds!
const init = async () => {
  await addAsset("GGG", "Musa de oro", 10000, "FR0111");
  await addAsset("HHH", "La noche estrellada", 20000, "UK0222");
  await addAsset("III", "Lirios", 30000, "MX0333");
  initUser("AAA");
  initUser("BBB");
  initUser("CCC");
  await addAsset("ZZZ", "La maja vestida", 40000, "UA0444");
  initUser("DDD");
};

//Export functions
module.exports = {
  init,
  findAllSeeds,
  checkAssetBalance,
  transferShares,
  userArray,
  assetArray,
  addressBalance,
  userBalanceInAsset,
  userTotalBalance,
  sharesDistribution,
};
//ENTRY FUNCTIONS TO BE RUN
//init();

//obtainAddress('BBB', 'III');
//transferShares('AAA', 'DDD', 'GGG', 100);
//findAllSeeds('AAA'); findAllSeeds('BBB'); findAllSeeds('CCC'); findAllSeeds('DDD');
//checkAssetBalance('HHH');
//addressBalance('FKBOECBTHURFCBTBGBGZJVM9TMC9HXQNOSXAZWHIQYKIHWUIVVUYUVGDYNSXJ9WYIVMOHLISBL9RXUTHW');
//userBalanceInAsset('AAA','HHH');
//userTotalBalance('DDD')
//sharesDistribution('GGG')
