
const button = document.getElementById('break-button');
const timer = document.getElementById('break-timer');
const tick = document.getElementById('tick');
const click = document.getElementById('click');
const beep = document.getElementById('beep');
const bar = document.getElementById('break-progress-bar');
const barwidth = 600;
let time = 60;
let counter = time; 
let state;

updateCountdown();
setTimer();

button.addEventListener('click', ()=>{
     abort();
});

function redirect(){
    clearInterval(state);
    beep.play();
    document.location.href = '../HTML/pomo-page.html';
}

function setTimer(){
    click.play();
    button.innerHTML = "Abort";
    state = setInterval(()=>{
        counter -= 1;
        counter == 0 ? redirect() : (counter < 6 ? tick.play() : false);
        bar.style.width = ((barwidth*counter)/time).toString() + "px";
        updateCountdown();
    },1000);
 
}

function abort(){
    clearInterval(state);
    reset();
    updateCountdown();
    beep.play();
    document.location.href = '../HTML/results-page.html';
}

function updateCountdown(){
    let minute = Math.floor(counter/60);
    let second = counter % 60;
    minute = minute < 10 ? "0" + parseInt(minute) : parseInt(minute);
    second = second < 10 ? "0" + parseInt(second) : parseInt(second);
    timer.innerHTML= minute + ":" + second;
    document.title=minute + ":" + second + " Timer Active";
}

function reset(){
    state = null;
    counter =  time;
    bar.style.width = "600px";
    button.innerHTML = "Start";
}
