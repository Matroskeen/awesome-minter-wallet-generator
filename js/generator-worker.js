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

  var isAllMatched = (mode === "all" && address.includes(inputValue));
  var isSuffixMatched = (mode === "suffix" && address.includes(inputValue, address.length - inputValue.length));
  var isPrefixMatched = (mode === "prefix" && address.startsWith(inputValue, 2));

  if (isAllMatched || isSuffixMatched || isPrefixMatched) {
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
