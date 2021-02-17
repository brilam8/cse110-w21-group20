const startMinute= 5;
let time = startMinute *60;

const countdown = document.getElementById('break-timer');


setInterval(updateCountdown,1000);

function updateCountdown(){

    const minute = Math.floor(time/60);
    let second = time% 60;

    second = second <5? '0'+second:second;
    countdown.innerHTML= `${minute}:${second}`;
    time --;
    
}