window.onload = function() {
  document.getElementById("gen-start").onclick = start;
  document.getElementById("gen-stop").onclick = stop;

  document.getElementById("in").addEventListener('keyup', function() {
    validateInput();
  });
};

var worker;
var generatedWallet;
function start() {
  if (!validateInput()) {
    return;
  }

  var inEl = document.getElementById("in");
  var attemptsEl = document.getElementById("attempts");

  // Let's go back to initial state after refresh (stop-start).
  display([attemptsEl], "block");
  mnemonicInfoHide();
  initCounter();
  generationInfoShow();

  if (typeof(worker) == "undefined") {
    worker = new Worker("js/generator-worker.js");
    worker.postMessage({
      rule: inEl.value,
      mode: document.querySelector('input[name="mode"]:checked').value,
    });
  }
  worker.onmessage = function(event) {
    generatedWallet = event.data;

    generatedAddressShow();
    updateCounter();

    if (generatedWallet.match) {
      stop();
      mnemonicInfoShow();
      playSound("success");
    }
    else {
      worker.postMessage({
        rule: inEl.value,
        mode: document.querySelector('input[name="mode"]:checked').value,
      });
    }
  };
}

function stop() {
  if (typeof worker != "undefined") {
    worker.terminate();
    worker = undefined;
  }

  // Show last generated wallet.
  mnemonicInfoShow();
}

function clear(elements) {
  elements.forEach(function (element) {
    element.innerHTML = "";
  });
}

function display(elements, display) {
  elements.forEach(function (element) {
    if (typeof element === "string") {
      element = document.getElementById(element);
    }
    element.style.display = display;
  });
}

function mnemonicInfoShow() {
  if (typeof generatedWallet !== "undefined" && generatedWallet.mnemonic !== null) {
    document.getElementById("mnemonic").innerHTML = generatedWallet.mnemonic;
    display(["mnemonic-info"], "block");
  }
}

function mnemonicInfoHide() {
  document.getElementById("mnemonic").innerHTML = "";
  display(["mnemonic-info"], "none");
}

function generationInfoShow() {
  display(["generation-info", "generation-divider"], "block");
}

function generatedAddressShow() {
  var reg = new RegExp(generatedWallet.input, 'gi');
  document.getElementById("out").innerHTML = generatedWallet.address.replace(reg, function(str) {return '<span class="match">' + str + '</span>'});
}

function initCounter() {
  if (typeof generatedWallet !== "undefined" && generatedWallet.input !== "") {
    var currentIn = document.getElementById("in").value;

    // We'll clear counter only if user input was changed.
    if (currentIn !== generatedWallet.input) {
      document.getElementById("counter").innerHTML = "0";
    }
  }
}

function updateCounter() {
  var counterEl = document.getElementById("counter");
  counterEl.innerHTML = parseInt(counterEl.innerHTML) + 1;
}

function validateInput() {
  var errorMessage = "";
  var inEl = document.getElementById("in");
  var inputErrorEl = document.getElementById("input-error");
  inputErrorEl.innerHTML = "";

  var inputValue = inEl.value.trim();

  if (typeof(Worker) === "undefined") {
    errorMessage = "Sorry! Your browser doesn't support Web Workers.";
  }

  if (inputValue === "") {
    errorMessage = "This field is required";
  } else if (!(new RegExp("^[0-9a-fA-F]+$").test(inputValue))) {
    errorMessage = "Only hex symbols ([0-9] [A-F]) can be available in the address";
  }

  if (errorMessage !== "") {
    inputErrorEl.innerHTML = errorMessage;

    if (!inEl.classList.contains('error')) {
      inEl.classList.add('error');
    }
  }
  else {
    inEl.classList.remove('error');
  }

  return errorMessage === "";
}
