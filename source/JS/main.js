let darkmode = window.localStorage.getItem('dark-mode');

if (darkmode){
    let color = darkmode;
    let otherColor = color == "white" ? 'black' : 'white';
    document.body.style.backgroundColor = color;
    document.body.style.color = otherColor;
}

module.exports = function sum(a, b) {
    return a + b;
};