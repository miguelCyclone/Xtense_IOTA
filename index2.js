//
// This is the initial script that interacts with the html
//

// All rights reserved - Copyright © 2019 Xtense
// Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)

import './bundles/bundle.js'

var xtsFunction = -1;
var xtsUserTx = -1;
var xtsUserRx = -1;
var xtsAsset = -1;
var xtsShares = -1;
var users = xts.userArray;
var assets = xts.assetArray;
var noMultipleClick = 1;

const initialized = async () => {
  document.getElementById("loadingDiv2").style.display = "block";
  noMultipleClick = 0;
  window.alert("Initialzinf MAM roots click to start, please be patient...");
  await xts.init();
  document.getElementById("button").style.opacity = 1;
  noMultipleClick = 1;
  document.getElementById("loadingDiv2").style.display = "none";
  window.alert("Done! :)");
};
window.onload = initialized();

function run() {
  xtsFunction = demoForm.function;
  xtsUserTx = demoForm.TxList;
  xtsUserRx = demoForm.RxList;
  xtsAsset = demoForm.Paintings;
  xtsShares = demoForm.Shares;

  if (xtsAsset[xtsAsset.selectedIndex].value == "GGG") {
    document.getElementById("musa").style.display = "block";
    document.getElementById("noche").style.display = "none";
    document.getElementById("lirios").style.display = "none";
    document.getElementById("maja").style.display = "none";
  }
  if (xtsAsset[xtsAsset.selectedIndex].value == "HHH") {
    document.getElementById("musa").style.display = "none";
    document.getElementById("noche").style.display = "block";
    document.getElementById("lirios").style.display = "none";
    document.getElementById("maja").style.display = "none";
  }
  if (xtsAsset[xtsAsset.selectedIndex].value == "III") {
    document.getElementById("musa").style.display = "none";
    document.getElementById("noche").style.display = "none";
    document.getElementById("lirios").style.display = "block";
    document.getElementById("maja").style.display = "none";
  }
  if (xtsAsset[xtsAsset.selectedIndex].value == "ZZZ") {
    document.getElementById("musa").style.display = "none";
    document.getElementById("noche").style.display = "none";
    document.getElementById("lirios").style.display = "none";
    document.getElementById("maja").style.display = "block";
  }
}

const action = async () => {
  try {
    if (noMultipleClick == 1) {
      document.getElementById("button").style.opacity = 0.6;
      noMultipleClick = 0;
      var text = document.getElementById("Output_message");
      switch (xtsFunction.selectedIndex) {
        case 0:
          noMultipleClick = 1;
          document.getElementById("button").style.opacity = 1;
          break;

        case 1: //User global balance
          text.innerHTML =
            "Obtaining user global shares. " +
            "\n" +
            "This process may take upto one minute..." +
            "\n" +
            "\n";
          if (xtsUserTx != -1) {
            document.getElementById("loadingDiv").style.display = "block";
            var aux = await xts.userTotalBalance(
              users[xtsUserTx.selectedIndex - 1].userID
            );
            document.getElementById("loadingDiv").style.display = "none";
            if (aux[0] == 1) {
              var username = 0;
              if (xtsUserTx[xtsUserTx.selectedIndex].value == "AAA") {
                username = "Alice";
              }
              if (xtsUserTx[xtsUserTx.selectedIndex].value == "BBB") {
                username = "Bob";
              }
              if (xtsUserTx[xtsUserTx.selectedIndex].value == "CCC") {
                username = "Charlie";
              }
              if (xtsUserTx[xtsUserTx.selectedIndex].value == "DDD") {
                username = "Evie";
              }
              text.innerHTML = "User: " + username + "\n" + "\n";
              for (var a = 1; a < aux.length; a++) {
                text.innerHTML =
                  text.innerHTML +
                  ("Painting: " +
                    aux[a].name +
                    " - Balance: " +
                    aux[a].balance +
                    "\n");
              }
            } else {
              text.innerHTML = aux[0];
            }
          }
          break;

        case 2: //Verify number of shares in circulation
          if (xtsAsset != -1) {
            //console.log(xts.checkAssetBalance(assets[xtsAsset.selectedIndex-1].assetID));
            text.innerHTML =
              "Verifing number of shares in circulation for one painting. " +
              "\n" +
              "This process may take upto one minute..." +
              "\n" +
              "\n";
            text.innerHTML =
              text.innerHTML +
              "The data in the local server is  compared VS the MAM data, and the current balance of all the seeds.";
            document.getElementById("loadingDiv").style.display = "block";
            var aux = await xts.checkAssetBalance(
              assets[xtsAsset.selectedIndex - 1].assetID
            );
            document.getElementById("loadingDiv").style.display = "none";
            if (aux[0] == 1) {
              text.innerHTML =
                "**Local server data**" +
                "\n" +
                "Asset name: " +
                aux[1].name +
                "\n" +
                "Code: " +
                aux[1].assetID +
                "\n" +
                "ISIN: " +
                aux[1].isin +
                "\n" +
                "Total shares: " +
                aux[1].ammount +
                "\n" +
                "\n";
              text.innerHTML =
                text.innerHTML +
                ("**MAM data**" +
                  "\n" +
                  "Public ROOT: " +
                  "'" +
                  aux[1].rootMAM +
                  "'" +
                  "\n" +
                  "Asset name: " +
                  aux[2].name +
                  "\n" +
                  "Code: " +
                  aux[2].assetID +
                  "\n" +
                  "ISIN: " +
                  aux[2].isin +
                  "\n" +
                  "Total shares: " +
                  aux[2].ammount +
                  "\n" +
                  "\n" +
                  "Account balance total shares: " +
                  aux[1].balance);
            } else {
              text.innerHTML = text.innerHTML + aux[0];
            }
          }
          break;

        case 3: //Shares distribution among users
          if (xtsAsset != -1) {
            //console.log(xts.sharesDistribution(assets[xtsAsset.selectedIndex-1].assetID));
            text.innerHTML =
              "Obtaining shares distribution for one painting. " +
              "\n" +
              "This process may take upto one minute..." +
              "\n" +
              "\n";
            document.getElementById("loadingDiv").style.display = "block";
            var aux = await xts.sharesDistribution(
              assets[xtsAsset.selectedIndex - 1].assetID
            );
            document.getElementById("loadingDiv").style.display = "await";
            if (aux[0] == 1) {
              text.innerHTML =
                "Painting " +
                assets[xtsAsset.selectedIndex - 1].name +
                " shares distribution" +
                "\n" +
                "ISIN code: " +
                assets[xtsAsset.selectedIndex - 1].isin +
                "\n" +
                "\n";
              for (var a = 1; a < aux.length; a++) {
                var username = 0;
                if (aux[a].user == "AAA") {
                  username = "Alice";
                }
                if (aux[a].user == "BBB") {
                  username = "Bob";
                }
                if (aux[a].user == "CCC") {
                  username = "Charlie";
                }
                if (aux[a].user == "DDD") {
                  username = "Evie";
                }
                text.innerHTML =
                  text.innerHTML +
                  (username +
                    " has: " +
                    aux[a].balance +
                    " shares - " +
                    aux[a].percentage +
                    "%" +
                    "\n");
              }
            } else {
              text.innerHTML = text.innerHTML + aux[0];
            }
          }
          break;

        /*case 4: //Add user - Implented in backend
			   break;
			   
			case 5: //Add asset - Implemented in backend
			   break;
			*/
        case 4: //Transfer shares
          if (xtsUserTx != -1 && xtsUserRx != -1 && xtsAsset != -1) {
            text.innerHTML =
              "Making shares transfer. " +
              "\n" +
              "This process may take upto one minute..." +
              "\n" +
              "\n";
            var tx = users[xtsUserTx.selectedIndex - 1].userID;
            var rx = users[xtsUserRx.selectedIndex - 1].userID;
            var asset = assets[xtsAsset.selectedIndex - 1].assetID;
            var value = parseInt(xtsShares[xtsShares.selectedIndex].value, 10);
            document.getElementById("loadingDiv").style.display = "block";
            var aux = await xts.transferShares(tx, rx, asset, value);
            document.getElementById("loadingDiv").style.display = "none";
            if (aux[0] != 0) {
              text.innerHTML =
                "Transaction sent to address: " +
                "'" +
                aux[0].address +
                "'" +
                "\n" +
                "\n" +
                assets[xtsAsset.selectedIndex - 1].name +
                " shares sent : " +
                aux[0].value +
                "\n" +
                "\n" +
                "Bundle: " +
                "'" +
                aux[0].bundle +
                "'" +
                "\n" +
                "\n" +
                "Trunk transaction: " +
                "'" +
                aux[0].trunkTransaction +
                "'" +
                "\n" +
                "\n" +
                "Branch transaction: " +
                "'" +
                aux[0].branchTransaction +
                "'" +
                "\n" +
                "\n" +
                "Hash: " +
                "'" +
                aux[0].hash +
                "'" +
                "\n" +
                "\n" +
                "Nonce: " +
                "'" +
                aux[0].nonce +
                "'" +
                "\n";
            } else {
              text.innerHTML =
                "ERROR: Transaction failed, please open browser terminal for more detailed information.";
            }
          }
          break;
      } //end switch
      document.getElementById("button").style.opacity = 1;
      noMultipleClick = 1;
    } //end if
  } catch (e) {
    document.getElementById("button").style.opacity = 1;
    text.innerHTML = e;
    noMultipleClick = 1;
  }
}; //end action()
