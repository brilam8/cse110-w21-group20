window.addEventListener('DOMContentLoaded', () => {
document.getElementById("to-how-to").addEventListener('click', toHowTo); //clcik to redirect to how to page
document.getElementById("to-set-up").addEventListener('click', toSetUp); // click to redirect to set up page
document.getElementById("download-wepomo").addEventListener('click', osSupport); //click to download wepomo
setInterval(funFacts, 5000); //cycle through fun facts array
});

/**
 * Function used in click event by to-how-to
 */
function toHowTo(){
    window.location.href = "./how-to-page.html";
}

/**
 * Function used in click event by to-set-up
 */
function toSetUp(){
    window.location.href = "./setup-active-break-pages.html";
}

/**
 * Function used in click event by download-wepomo
 */
function osSupport(){
    document.getElementById("download-wepomo").href = "../wepomo-win32-x64.zip";
    //user is on windows device
    if (navigator.appVersion.indexOf("Win") != -1){
        document.getElementById("download-wepomo").href = "../wepomo-win32-x64.zip";
    } 
    //user is on darwin device
    if (navigator.appVersion.indexOf("Mac") != -1) {
        document.getElementById("download-wepomo").href = "../wepomo-darwin-x64.zip";
    }
    //user is on linux device
    if (navigator.appVersion.indexOf("Linux") != -1){
        document.getElementById("download-wepomo").href = "../wepomo-linux-x64.zip";
    }
}


//fun facts array container
let facts = ['Fun Fact: Pomodoro means Tomato in Italian!',
            'Fun Fact: Francesco Cirillo was the original creator of the Pomodoro Timer!', 
            'Fun Fact: The Pomodoro timer was inspired by a tomato shaped timer!', 
            "Remember: The Pomodoro timer's biggest strength is its simplicity!"];

//variable for keeping track of index of fun facts
let index = 0;

/**
 * Function used on setInterval to cycle through fun facts array
 */
function funFacts(){
    if (index >= facts.length) index = 0;
    document.getElementById('fun-facts').innerHTML = facts[index];
    index++;
}

exports.toHowTo = toHowTo;
exports.toSetUp = toSetUp;
exports.osSupport = osSupport;
exports.funFacts = funFacts;
