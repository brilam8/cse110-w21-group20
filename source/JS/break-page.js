
const startMinute= 5;
let time = startMinute *60;

const countdown = document.getElementById('break-timer');
// const button = document.getElementById('break-button');

setInterval(updateCountdown,1000);


function updateCountdown(){
    const minute = Math.floor(time/60);
    let second = time% 60;
    second = second =0 ? abortTimer(): abortTimer()
    second = second < 5 ? '0' + second: second;
    countdown.innerHTML= `${minute}: ${second}`;
    time --;
}


function abortTimer(){
    clearInterval(state);
    reset_timer();
    setTimerString();
}


function reset_timer(){
    state = null;
    counter = time;
    button.innerHTML = "Aborted";
} 


button.addEventListener('click', ()=>{
     abortTimer();
});