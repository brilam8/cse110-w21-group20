const button = document.getElementById('pomo-button');
const timer = document.getElementById('timer');
const tick = document.getElementById('tick');
const click = document.getElementById('click');
const beep = document.getElementById('beep');
const bar = document.getElementById('progress-bar');
const barwidth = 600; //600px in style.css

let time = 60; //should be set to pomodoro timer (1500s/ 1800s/ 2100s) == (25mins/ 30mins/ 35mins)
let counter = time; 
let state;
setTimerString();

button.addEventListener('click', ()=>{
    state ? abortTimer() : setTimer();
});

function setTimer(){
    click.play();
    button.innerHTML = "Abort";
    state = setInterval(()=>{
        counter -= 1;
        counter == 0 ? abortTimer() : (counter < 6 ? tick.play() : false);
        bar.style.width = ((barwidth*counter)/time).toString() + "px";
        setTimerString();
    },1000);
    
}

function abortTimer(){
    clearInterval(state);
    reset();
    setTimerString();
    beep.play();
    // setTimeout(function(){  //left out redirect to break page for now
    //     window.location.href = "./break-page.html";
    // }, 500);
}

function setTimerString(){
    let mins = Math.floor(counter / 60);
    let secs = counter % 60;
    mins = mins < 10 ? "0" + parseInt(mins) : parseInt(mins);
    secs = secs < 10 ? "0" + parseInt(secs) : parseInt(secs);
    timer.innerHTML = mins + ":" + secs;
    document.title = mins + ":" + secs + " Timer Active";
}

function reset(){
    state = null;
    counter =  time;
    bar.style.width = "600px";
    button.innerHTML = "Start";
}