/*global tasklist, copytasklist, completed, setup_value, totalpomo*/
/* eslint-disable no-unused-vars */

//Active page button
const activebutton = document.getElementById('pomo-button');
const barwidth = 600; //600px in style.css


//Break page button
const breakbutton = document.getElementById('break-button');

//Sounds for both active and break page
const tick = document.getElementById('tick');
const click = document.getElementById('click');
const beep = document.getElementById('beep');



//timer variables
let activetime = 8; //should be set to pomodoro timer (1500s/ 1800s/ 2100s) == (25mins/ 30mins/ 35mins)
let shortbreaktime = 5; // should be set to break time (5mins /)
let longbreaktime = 10;
let counter = activetime; 
let state;
let longbreakindicator = 3; // by default, after 3 short breaks, a long break will occur (when set to 3)
let longbreakcounter = 0; // by default, after 3 short breaks, a long break will occur (when set to 3)
let pomos;

//alert sound that plays every X mins
let alertsound;
let alertfrequency; // the X mins, options are every 5, 10, or 15 mins
let alertindicator = null; 
let totalcounter = 0;

// Variables to keep track of tasks:
let actualpomo = {}; //store how many pomos you spend on a task
let pomocount = 0; 
let currTask;
let completedtask = []; // During break page, check off tasks is stored in completetask and after break page, checked off task is moved to actualpomo

window.addEventListener('DOMContentLoaded', () => {
    /**
     *  Clicking on abort button on active page will first warn the user
     *  that aborting will end the session. Second click on abort will
     *  end the timer and redirect to results page
     */
    activebutton.addEventListener('click', ()=>{
        abortActive();
    });

    /**
     *  Clicking on abort button on break page will first warn the user
     *  that aborting will end the session. Second click on abort will
     *  end the timer, update the task list (how many pomos are spent on the task) for
     *  local storage, and redirect to results page
     */
    breakbutton.addEventListener('click', ()=>{
        abortBreak();
    });

});

/**
 * Function used in click event for activebutton to alert user with a confirmation to end session 
 */
function abortActive(){
    if (confirm("Abort will end all pomo sessions, click ok if you want to continue")) {
        actualpomo[currTask] = pomocount;
        abortTimer();
    }
}
/**
 * Function used in click event for breakbutton to alert user with a confirmation to end session 
 */
function abortBreak(){
    if (confirm("Abort will end all pomo sessions, click ok if you want to continue")) {
        actualpomo[currTask] = pomocount;
        if (completed.includes(tasklist[0][0])){
            tasklist.splice(0, 1);
            currTask = tasklist[0] ? tasklist[0][0] : false;
        }
        abortTimer();
    }
}

/**
 *  Increments pomocount everytime user reach break page and 
 *  resets pomocount when user checks off at least one task in break page.
 *  Sets timer to count down in active and break page
 *  Once timer reaches zero, either redirect to active or break page if there are still tasks left or
 *  if there is no more tasks, redirect to results page
 *  @param {string} page - current page of user
 */
function startTimer(page){
    // gets current task
    let task = tasklist[0] ? tasklist[0][0] : false;
    if (page == "break") {
        pomocount++; //as user enters break page, increment pomo count of current task
    }
    else {
        if (completedtask.length){ // as user enters active page, reset pomo count if task was checked off from break page
            for (const task of completedtask){ actualpomo[task] = pomocount/completedtask.length; }
            pomocount = 0;
            completedtask = [];
        }
        currTask = task; //update new current task if task was checked off from break page
    }
    if (pomos == 0){ // if user runs out of time, end session
        currTask ? actualpomo[currTask] = pomocount : false;
        abortTimer();
    }

    // updates current task displayed on active page or if user runs of tasks, end sesson
    page == "active" && task ? document.getElementById("first-task").textContent = "Task: " + task : task ? false : abortTimer(); 

    //plays sound as user enters different page
    click ? click.play() : true;

    //refreshes page and variables for pages
    reset(page);

    //sets start timer
    updateCounter(page);

    //sets alert settings
    setAlert();

    //timer
    state = setInterval(()=>{
        timer(page);
    },1000);
}

/**
 * Function used in setInterval to count down timer
 */
function timer(page){
    totalcounter++; //counter used for alert settings
    counter -= 1; //decrement timer
    counter == 0 ? redirectToPage(page) : (counter < 6 ? tick.play() : false); // redirects pages when timer hits 0 and plays ticks last 5 secs
    if (alertsound) (totalcounter%(alertfrequency*60)) == 0 ? beep.play() : false; // alert user every (5, 10, or 15) mins
    if (page == "active"){ //updates progress bar and timer as timer decrements on active page
        document.getElementById("progress-bar").style.width = ((barwidth*counter)/activetime).toString() + "px";
        updateCounter("active");
    }
    else { //updates progress bar and timer as timer decrements on break page
        document.getElementById("break-bar").style.width = document.getElementById("pTitle").textContent == "Long Break" ? ((barwidth*counter)/longbreaktime).toString() + "px" : ((barwidth*counter)/shortbreaktime).toString() + "px";
        updateCounter("break");
    }
}

/**
 *  Function used in startTimer to redirect to active or break page. If came from active page
 *  hide active page and transition to break page. Else if came from break page hide break page,
 *  remove all tasks that are checked off from task list, and transition to active page.
 *  @param {string} curPage - current page of user to know which page to switch to
 */
function redirectToPage(curPage){
    clearInterval(state);
    beep ? beep.play() : true;
    setTimeout(function(){ 
       redirectHelper(curPage);
    }, 500);
}
/**
 * Function used in redirectToPage's setTimeout
 */
function redirectHelper(curPage){
    if (curPage == "active"){
        // if user is on active page, redirect to break page
        document.getElementById("active-page").style.display = "none";
        document.getElementById("break-page").style.display = "inline";
        document.getElementById("to-break-page").click();
        startTimer("break");
        
    }
    else if (curPage == "break"){
        // if user is on break page, redirect to active page with updated task
        if (completed.includes(tasklist[0][0])){
            // if user checked off a task on break page, update tasklist variable and break page
            let task = document.getElementById('break-task-container').children[1];
            if (task) {
                //updates break page tasks
                document.getElementById('break-task-container').children[1].remove();
                let completed = document.createElement("task-component");
                completed.setAttribute('left-pointer-event', "none");
                completed.setAttribute('set-right-input', pomocount);
                completed.setAttribute('left-task', tasklist[0][0]);
                completed.setAttribute('delete', 'none');
                document.getElementById("completed-task-container").appendChild(completed);
                completedtask.push(tasklist[0][0]);
                tasklist.splice(0, 1);


                let newTask = document.getElementById('incompleted-task-container').children[1];
                if (newTask){
                    document.getElementById('incompleted-task-container').children[1].remove();
                    let newTask = document.createElement("task-component");
                    newTask.setAttribute('type', "checkbox");
                    newTask.setAttribute('left-task', tasklist[0][0]);
                    newTask.setAttribute('left-pointer-event', "none");
                    newTask.setAttribute('remove-right-suffix', "none");
                    newTask.setAttribute('delete', 'none');
                    document.getElementById("break-task-container").appendChild(newTask);
                }
            }
        }
        //decrements amount of pomos remaining, when hits 0, end session
        pomos--;
        document.getElementById("active-page").style.display = "inline";
        document.getElementById("break-page").style.display = "none";
        document.getElementById("pTitle").textContent = "Pomodoro Timer";
        startTimer("active");
        document.getElementById("to-active-page").click();
        
    }
}

/**
 *  Used in startTimer to display timer countdown on html title and timer p element.
 *  @param {string} page - current page of user
 */
function updateCounter(page){
    let mins = Math.floor(counter / 60);
    let secs = counter % 60;
    mins = mins < 10 ? "0" + parseInt(mins) : parseInt(mins);
    secs = secs < 10 ? "0" + parseInt(secs) : parseInt(secs);
    if (page == "active"){
        document.getElementById('timer').innerHTML = mins + ":" + secs;
        document.title = mins + ":" + secs + " Active Timer";
    }
    else if (page == "break"){
        document.getElementById('break-timer').innerHTML= mins + ":" + secs;
        document.title = mins + ":" + secs + " Break Timer";
    }
}

/**
 *  Function used in startTimer to reset timer variables, 
 *  warning variable, and progress bar.
 *  @param {string} page - current page of user
 */
function reset(page){
    if (!pomos) pomos = totalpomo;
    state = null;
    if (page == "active") counter = activetime;
    else {
        if (longbreakcounter >= longbreakindicator) {
            longbreakcounter = 0;
            counter = longbreaktime;
            document.getElementById("pTitle").textContent = "Long Break";
        }
        else {
            longbreakcounter++;
            counter = shortbreaktime;
            document.getElementById("pTitle").textContent = "Short Break";
        }
    }
    alertindicator = null;
    document.getElementById("progress-bar").style.width = "600px";
    document.getElementById("break-bar").style.width = "600px";
}

/**
 *  Function used in startTimer when all tasks are completed or button when 
 *  user clicks abort. It will save data to local storage in JSON format 
 *  and redirect user to results page.
 */
function abortTimer(){
    clearInterval(state);
    beep ? beep.play() : true;
    let output = [];
    // sets the JSON data to save to local storage for results page
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
    document.getElementById("active-page").style.display = "none";
    document.getElementById("break-page").style.display = "none";
    window.location.replace('../HTML/results-page.html');
    
}


/**
 * Function used in startTimer() as user enters active page to set alert sounds that is played every (5, 10, or 15) mins 
 */
function setAlert(){
    alertsound = document.getElementById("alert-right-container").style.display == "inline" ? true : false;
    alertfrequency = document.getElementById("alert-frequency").value; // the X mins, options are every 5, 10, or 15 mins
}

/**
 * Function that set up timer based on user's set-up values.
 * As default (timer/counter is 8, default shortbreaktime = 5, default longbreaktime = 10) for testing
 */
function set_time(){   
    if(setup_value[0]==''){
        activetime=8;
    }
    else{
        activetime = 60 * setup_value[0];
    }
    if(setup_value[1]!=''){
        longbreakindicator = setup_value[1]-1;
    }
    if(setup_value[2]==''){
        shortbreaktime = 5;
    }
    else{
        shortbreaktime = 60 * setup_value[2];
    }
    if(setup_value[3]==''){
        longbreaktime  = 10;
    }
    else{
        longbreaktime  = 60 * setup_value[3];
    }
}

/**
 * Function used for Jest testing, used to manipulate the time
 * @param {int} x = counter value
 * @param {int} y = pomos value
 */
function setCounter(x, y){
    counter = x;
    pomos = y;
}

function setLongBreak(){
    longbreakcounter = 3;
}

exports.set_time = set_time;
exports.setAlert = setAlert;
exports.abortTimer = abortTimer;
exports.reset = reset;
exports.updateCounter = updateCounter;
exports.redirectToPage = redirectToPage;
exports.timer = timer;
exports.startTimer = startTimer;
exports.abortBreak = abortBreak;
exports.abortActive = abortActive;
exports.setCounter = setCounter;
exports.redirectHelper = redirectHelper;
exports.setLongBreak = setLongBreak;
