let darkmode = window.localStorage.getItem('dark-mode');

if (darkmode){
    let color = darkmode;
    let otherColor = color == "white" ? "#1a1a1a" : 'white';
    document.body.style.backgroundColor = color;
    document.body.style.color = otherColor;
}
