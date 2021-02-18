let darkmode = window.localStorage.getItem('dark-mode');

if (darkmode){
    let color = darkmode;
    let otherColor = color == "white" ? "#1a1a1a" : 'white';
    document.body.style.backgroundColor = color;
    document.body.style.color = otherColor;
}

/** This is just a test unit test for Jest that is supposed to sum two numbers */
module.exports = function sum(a, b) {
    return a + b;
};