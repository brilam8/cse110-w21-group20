/**
 * Global variables that are used in active-break-pages.js
 *      copytasklist :  copy of tasklist used to create task list in local storage. Not manipulated
 *      tasklist     :  Stores tasks that the user sets in set-up page. The variable that is manipulated.
 *      completed    :  Variable to append completed tasks to create task list in local storage.
 */
var copytasklist = [];
var tasklist = [];
var completed = [];


//Active page button, timer, and progress bar 
const activebutton = document.getElementById('pomo-button');
const activetimer = document.getElementById('timer');
const activebar = document.getElementById('progress-bar');
const barwidth = 600; //600px in style.css

//Break page button and timer
const breakbutton = document.getElementById('break-button');
const breaktimer = document.getElementById('break-timer');

//Sounds for both active and break page
const tick = document.getElementById('tick');
const click = document.getElementById('click');
const beep = document.getElementById('beep');

//timer variables
let time = 20; //should be set to pomodoro timer (1500s/ 1800s/ 2100s) == (25mins/ 30mins/ 35mins)
let counter = time; 
let state;

/**
 *  Variables to keep track of tasks:
 *  store how many pomos you spend on a task
 *  During break page, check off tasks is stored completetask
 *  After break page, checked off task is moved to actualpomo
 */
let actualpomo = {};
let pomocount = 0;
let currTask;
let completedtask = [];

//warning variable, bool for warning prompt when clicking on abort, second click will abort pomo
let abortClicked = false;

//used to update actual pomo when aborting out of break page
let abortBreak = false;


/**
 *  Clicking on abort button on active page will first warn the user
 *  that aborting will end the session. Second click on abort will
 *  end the timer and redirect to results page
 */
activebutton.addEventListener('click', ()=>{
    if (abortClicked) {
        actualpomo[currTask] = pomocount;
        abortTimer();
    }
    else {
        alert("Abort will end all pomo sessions, click again if you want to continue");
        abortClicked = true;
    }
});

/**
 *  Clicking on abort button on break page will first warn the user
 *  that aborting will end the session. Second click on abort will
 *  end the timer, update the task list (how many pomos are spent on the task) for
 *  local storage, and redirect to results page
 */
breakbutton.addEventListener('click', ()=>{
    if (abortClicked) {
        abortBreak = true;
        redirectToPage("break");
    }
    else {
        alert("Abort will end all pomo sessions, click again if you want to continue");
        abortClicked = true;
    }
});

/**
 *  Increments pomocount everytime user reach break page and 
 *  resets pomocount when user checks off at least one task in break page.
 *  Sets timer to count down in active and break page
 *  Once timer reaches zero, either redirect to active or break page if there are still tasks left or
 *  if there is no more tasks, redirect to results page
 */
function startTimer(page){
    let task = tasklist[0] ? tasklist[0][0] : false;
    if (page == "break") {
        pomocount++;
    }
    else {
        if (completedtask.length){
            for (const task of completedtask){ actualpomo[task] = pomocount/completedtask.length; }
            pomocount = 0;
            completedtask = [];
        }
        currTask = task;
    }
    page == "active" && (task && !abortBreak) ? document.getElementById("first-task").textContent = "Task: " + task : task && !abortBreak ? false : abortTimer();
    click.play();
    reset();
    updateCounter(page);
    state = setInterval(()=>{
        counter -= 1;
        counter == 0 ? redirectToPage(page) : (counter < 6 ? tick.play() : false);
        if (page == "active"){
            activebar.style.width = ((barwidth*counter)/time).toString() + "px";
            updateCounter("active");
        }
        else updateCounter("break");
    },1000);
}

/**
 *  Function used in startTimer to redirect to active or break page. If came from active page
 *  hide active page and transition to break page. Else if came from break page hide break page,
 *  remove all tasks that are checked off from task list, and transition to active page.
 */
function redirectToPage(curPage){
    clearInterval(state);
    beep.play();
    setTimeout(function(){ 
        if (curPage == "active"){
            document.getElementById("active-page").style.display = "none";
            document.getElementById("break-page").style.display = "inline";
            document.getElementById("to-break-page").click();
            startTimer("break");
        }
        else if (curPage == "break"){
            for (let i = 0; i < tasklist.length; i++){
                if (completed.includes(tasklist[i][0])){
                    let task = document.getElementById('break-task-container').children[i+1];
                    if (task) document.getElementById('break-task-container').children[i+1].remove();
                    completedtask.push(tasklist[i][0]);
                    tasklist.splice(i--, 1);
                }
            }
            document.getElementById("active-page").style.display = "inline";
            document.getElementById("break-page").style.display = "none";
            startTimer("active");
            document.getElementById("to-active-page").click();
        }
    }, 500);
}

/**
 *  Used in startTimer to display timer countdown on html title and timer p element.
 */
function updateCounter(page){
    let mins = Math.floor(counter / 60);
    let secs = counter % 60;
    mins = mins < 10 ? "0" + parseInt(mins) : parseInt(mins);
    secs = secs < 10 ? "0" + parseInt(secs) : parseInt(secs);
    if (page == "active"){
        activetimer.innerHTML = mins + ":" + secs;
        document.title = mins + ":" + secs + " Timer Active";
    }
    else if (page == "break"){
        breaktimer.innerHTML= mins + ":" + secs;
        document.title = mins + ":" + secs + " Timer Break";
    }
}

/**
 *  Function used in startTimer to reset timer variables, 
 *  warning variable and progress bar.
 */
function reset(){
    state = null;
    counter =  time;
    abortClicked = false;
    activebar.style.width = "600px";
}

/**
 *  Function used in startTimer when all tasks are completed or button when 
 *  user clicks abort. It will save data to local storage in JSON format 
 *  and redirect user to results page.
 */
function abortTimer(){
    clearInterval(state);
    beep.play();
    let output = [];
    for (let i = 0; i < copytasklist.length; i++){
        let objTask = {};
        objTask.id = i;
        objTask.expectedpomos = copytasklist[i][1];
        objTask.actualpomos = actualpomo[copytasklist[i][0]] ? actualpomo[copytasklist[i][0]] : 0;
        objTask.currrenttask = copytasklist[i][0] == currTask;
        objTask.completed = completed.includes(copytasklist[i][0]) ? true : false;
        objTask.taskdescription = copytasklist[i][0];
        output.push(objTask);
    }
    window.localStorage.setItem("tasks", JSON.stringify(output)); 
    document.location.replace('../HTML/results-page.html');
    
}

module.exports = {startTimer, redirectToPage, updateCounter, reset, abortTimer};