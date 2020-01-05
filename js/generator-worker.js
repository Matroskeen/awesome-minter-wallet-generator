importScripts('https://unpkg.com/minterjs-wallet');

function getPerfectMatch(inputValue, mode) {
  var wallet = minterWallet.generateWallet();
  var address = wallet.getAddressString();

  inputValue = inputValue.toLowerCase().trim();

  var message = {
    address: address,
    mnemonic: wallet.getMnemonic(),
    match: false
  };

  if ((mode === "all" && address.includes(inputValue)) || (mode === "end" && address.includes(inputValue, address.length - inputValue.length))) {
    message.match = true;
  }
  postMessage(message);

  if (!message.match) {
    sleep(10).then(() => getPerfectMatch(inputValue, mode));
  }
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

self.addEventListener("message", function(e) {
  getPerfectMatch(e.data.rule, e.data.mode);
}, false);
