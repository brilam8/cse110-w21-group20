let darkmode = window.localStorage.getItem('dark-mode');

if (darkmode){
    let color = darkmode;
    let otherColor = color == "white" ? 'black' : 'white';
    document.body.style.backgroundColor = color;
    document.body.style.color = otherColor;
}

// if (window.localStorage.getItem('dark-mode') == "black"){
//     console.log(document.getElementById('dark-mode-button'));
//     document.getElementById('dark-mode-button').click();
//   }