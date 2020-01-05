importScripts('https://unpkg.com/minterjs-wallet');

function getPerfectMatch(inputValue, mode) {
  var wallet = minterWallet.generateWallet();
  var address = wallet.getAddressString();

  inputValue = inputValue.toLowerCase().trim();

  var message = {
    address: address,
    mnemonic: wallet.getMnemonic(),
    match: false,
    input: inputValue
  };

  if ((mode === "all" && address.includes(inputValue)) || (mode === "end" && address.includes(inputValue, address.length - inputValue.length))) {
    message.match = true;
  }
  postMessage(message);
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

self.addEventListener("message", function(e) {
  sleep(10).then(() => getPerfectMatch(e.data.rule, e.data.mode));
}, false);
