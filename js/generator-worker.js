importScripts('https://unpkg.com/minterjs-wallet');

function getPerfectMatch(rule, mode) {
  var wallet = minterWallet.generateWallet();
  var address = wallet.getAddressString();

  var message = {
    address: address,
    mnemonic: null,
  };

  if ((mode === "all" && address.includes(rule)) || (mode === "end" && address.includes(rule, address.length - rule.length))) {
    message.mnemonic = wallet.getMnemonic();
  }
  postMessage(message);

  sleep(50).then(() => {
    getPerfectMatch(rule, mode);
  });
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

self.addEventListener("message", function(e) {
  getPerfectMatch(e.data.rule, e.data.mode);
}, false);
