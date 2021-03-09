window.addEventListener('DOMContentLoaded', () => {
document.getElementById("to-home-page").addEventListener('click', ()=> { toLanding();}); document.getElementById("to-set-up-page").addEventListener('click', ()=> { toSetUp();});
});
function toLanding(){
  window.location.href = "./landing-page.html";
}
function toSetUp(){
  window.location.href = "./setup-active-break-pages.html";
}
exports.toLanding = toLanding;
exports.toSetUp = toSetUp;