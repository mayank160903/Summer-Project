function copytoclip(t) {

  navigator.clipboard.writeText(t);
  alert("Copied the text: " + t);
} 


function check() {
  return document.getElementById("mycheck").checked;
}

function getVal() {
let val = document.getElementById('promo').value;
console.log(val);
if (val == "") {
  return true;
}
  return false;
}

function confrm(){
if(check() && getVal()){
    window.alert("Please Fill A Code")
}

let str = document.getElementById('promo').value;
const reg = /^[a-zA-Z0-9]{6,}$/
let isValid = reg.test(str);
console.log(isValid); 
if(!isValid && check()) {
  window.alert("Promo Code Should be AlphaNumeric and atleast 6 characters long")
}
}
