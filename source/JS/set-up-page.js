/*global startTimer, set_time, webkitSpeechRecognition*/

// variables used in active and break pages
var copytasklist = [];
var tasklist = [];
var completed = [];
var setup_value=[];
var totalpomo = 0;

//recording input variables
var recognition;
var recordstart;
var savedbackground;
var savedcolor;

let totaltime = 0;
let timersettingIDs=["task-right-len","task-right-total","task-right-break-btw","task-right-long-break"];

window.addEventListener('DOMContentLoaded', () => {
    // resets tasks list in localstorage every time user enters set-up page
    window.localStorage.removeItem('tasks');
    window.localStorage.removeItem('set-up');

    /**
     * Clicking the begin button create render all the task-components in the break-page,
     * set the tasklist by removing all empty tasks, and redirect to and start the timer for active page.
     */
    document.getElementById("begin").addEventListener("click", ()=>{
        exitSetUp();
    });

    /**
     * Clicking the create button will create a task-component on the set-up page. 
     * It will only allow 6 task-components.
     */
    document.getElementById("create").addEventListener("click", ()=>{
        createTask();
    });

    /** 
     * Updates span for 'long break on every 4th pomo' setting
     */ 
    document.getElementById('task-right-total').addEventListener('change', ()=>{
        let value = document.getElementById('task-right-total').value;
        document.getElementById("long-break-indicator").textContent = value == 1 ? "1st" : value == 2 ? "2nd" : value == 3 ? "3rd"  : value + "th";
        calculateTotalTime();
    });

    /**
     * Everytime input for timer settings is changed, update the totaltime
     */
    timersettingIDs.forEach(ele =>{
        document.getElementById(ele).addEventListener('change', ()=>{
            calculateTotalTime();
        });
    });
});
/**
 * Component used to create tasks in set-up page and break page.
 * Allows you to manipulate the tasks by deleting, creating and editting tasks
 */
class TaskComponent extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        
        const container = document.createElement('div');
        container.setAttribute('class', "entry");
        
        const left = container.appendChild(document.createElement('input'));
        left.setAttribute('class', "task-left");
        left.type = "text";
        left.placeholder = "Enter Task Here";
        left.maxLength = 20; // TO CHANGE

        const speaker = container.appendChild(document.createElement('img'));
        speaker.src = "../assets/microphone.png";
        speaker.style.margin = "6px 0 0 0";
        speaker.width = "30";
        speaker.height = "30";
        speaker.id = "mic";
        if (window.localStorage.getItem('dark-mode')) window.localStorage.getItem('dark-mode') == "#1a1a1a" ? speaker.style.filter = "invert(1)" : "";
        
        const rightcontainer = container.appendChild(document.createElement('div'));
        rightcontainer.setAttribute('class', 'task-right');

        const deleteButton = rightcontainer.appendChild(document.createElement('button'));
        
        const rightsuffix = rightcontainer.appendChild(document.createElement('div'));
        rightsuffix.setAttribute('class', 'task-right');
        rightsuffix.textContent = "pomo";

        const right = rightcontainer.appendChild(document.createElement('input'));
        right.setAttribute('class', "task-right");
        right.type = "number";
        right.dir = "rtl";
        right.onkeydown=()=>{return false;};
        right.min = "1"; right.max = "5"; right.step = "1";
        right.value = "1";

        this.left = left;
        this.right= right;
        this.speaker = speaker;
        this.rightsuffix = rightsuffix;
        this.deleteButton = deleteButton;
        tasklist.push(["", 1]);
        this.index = tasklist.length - 1;

        left.addEventListener('input', ()=>{
            if (right.type == "number"){ //only in set up
                updateTaskList(this.index, left.value, right.value);
            }
        });
        speaker.addEventListener('click', ()=>{
            record();
        });
        right.addEventListener('input', ()=>{
            if (right.type == "number"){ //only in set up
                updateTaskList(this.index, left.value, right.value);
            }
            else{
                //only in break-page. If checkbox checked, then move checked task to completed, if unchecked, keep in tasklist
                if (!completed.includes(left.value)) completed.push(left.value);
                else completed.splice(completed.indexOf(left.value), 1);
            }
        });

        deleteButton.addEventListener('click', ()=>{
            deleteComponent(this.index);
        });
    
        const style = document.createElement('style');
        style.textContent = `
        .entry {
            height: 40px;
            border: solid;
            border-color: lightgrey;
            border-width: 0 0 2px 0;
        }

        img {
            float:left;
        }

        .entry *{
            background-color: transparent;
        }
        .task-left {
            float: left;
            margin-top: 7px;
            margin-left: 20px;
            text-align: left;
            height: 30px;
            width: 50%;
            border: none;
            color: rgb(255, 81, 0);
            font-size: 20px;
        }

        .entry > .task-left:hover , .entry > .task-left:focus {
            border: 2px solid lightgrey;
            border-radius: 10px;
            transform: translate(-2px, -2px);
            outline: none;
            margin-top: 6px;
            margin-left: 19px;
        }

        .task-right {
            float: right;
            margin-top: 3px;
            padding-right: 10px;
            text-align: center;
            height: 30px;
            border: none;
            color: rgb(255, 81, 0);
            font-size: 20px;
        }

        .task-right > input {
            height: 25px;
            width: 35px;
            border: none;
            outline: none;
            text-align: right;
            padding-right: 3px;
            caret-color: transparent;
        }

        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button {  
            opacity: 1;
        }
        
        button {
            float: right;
            height: 30px;
            width: 30px;
            cursor: pointer;
            outline: none;
            border: none;
            color: white;
            font-weight: bold;
            border-radius: 5px;
            transition: all 0.3s ease-in;
            pointer-events: none;
        }
        .deleteTask {
            background-color: rgba(242, 71, 38, 1);
            pointer-events: auto;
        }

        .deleteTask:hover {
            background-color: rgba(242, 71, 38, 0.8);
        }
        
        ::placeholder {
            font-size: 20px;
            color: rgb(255, 81, 0);
        }       
        `;

        this.shadowRoot.append(style, container);
    }
    
    static get observedAttributes() {
        return [`type`, `left-pointer-event`, `left-task`, 'delete', 'index', 'set-right-input', 'remove-right-suffix'];
    }
    attributeChangedCallback(name, oldValue, newValue){
        if (name == "type"){
            this.right.type = newValue;
            this.right.style.height = "100%";
            this.right.style.margin = "0 0 0 0";
        }
        else if (name == "left-pointer-event"){
            this.left.style['pointer-events'] = newValue;
        }
        else if (name == 'left-task'){
            this.left.value = newValue;
        }
        else if (name == 'delete'){
            this.deleteButton.style.display = newValue;
            this.right.style.transform = "translate(-74px, 3px)";
            this.speaker.style.display = newValue;
        }
        else if (name == 'index'){
            this.index -= 1;
        }
        else if (name == "set-right-input"){
            this.right.style.display = "none";
            this.rightsuffix.textContent = parseInt(newValue) + " pomo";
            this.rightsuffix.style.transform = "translateX(-60%)";
        }
        else if (name == "remove-right-suffix"){
            this.rightsuffix.style.display = newValue;
        }
    }  
}

customElements.define('task-component', TaskComponent);

/**
 * Function to enable Speech to text for task input
 */
function record(){
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
    recognition = new SpeechRecognition();
    recognition.grammars = new SpeechGrammarList();
    recognition.interimResults = false;
    recognition.maxAlternatives = 2;

    //changes background to focus on input
    recordstart = true;
    recognition.interimResults = false;
    savedbackground = document.body.style.backgroundColor;
    savedcolor =  document.body.style.color;
    document.body.style.background = "rgba(0,0,0,0.1)";
    document.getElementById("active-task-container").style.background = savedbackground;
    document.body.style.pointerEvents = "none";


    recognition.start();

    let ATContainer = document.getElementById("active-task-container");
    let ATCLength = ATContainer.children.length;
    let container = ATContainer.children[ATCLength-1].shadowRoot.children[1];
    let input = container.children[0];

    //updates input
    recognition.onresult = function(e) {
        input.value = e.results[0][0].transcript;
        input.dispatchEvent(new Event("input"));
        recordingEnd();
    };

    recognition.onend = recordingEnd();
    
}

/**
 * Function used by function record to resets background after recording ends.
 */
function recordingEnd(){
    recordstart = false;
    document.body.style.background = savedbackground;
    document.getElementById("active-task-container").style.background = "";
    document.body.style.pointerEvents = "all";
    recognition.stop();
}

/**
 * Function used in TaskComponent to delete the component 
 * if user clicks the X button next to task on set-up page.
 */
function deleteComponent(index){
    for (let i = index; i < tasklist.length; i++){
        document.getElementById("active-task-container").children[i+1].setAttribute('index', i);
    }
    tasklist.splice(index, 1); //removes task from tasklist 
    document.getElementById("active-task-container").children[index+1].remove(); //removes task component
    calculateTotalTime();
}

/**
 * Function sets the timer settings for active and break pages
 */
function setup_localStore(){
    for(let i=0;i<4;i++){
        let set_value=document.getElementById(timersettingIDs[i]).value;
        setup_value.push(set_value);
    }
}

/**
 * Function used to set the total time. It is used in any every of the set up page that changes task list or timer
 */
function calculateTotalTime(){
    totaltime = 0;
    totalpomo = 0;
    for (let i = 0; i < tasklist.length; i ++){
        if (tasklist[i][0] != ""){
            // gets total time for all tasks
            totaltime += tasklist[i][1] * document.getElementById("task-right-len").value;
            // gets total pomo for all tasks
            totalpomo += parseInt(tasklist[i][1]);
        }
    }
    if (totaltime){
        // gets time for all long and short breaks based on number of pomos
        let numOfLongBrk = Math.floor(totalpomo/document.getElementById("task-right-total").value);
        totaltime += numOfLongBrk*document.getElementById("task-right-long-break").value + (totalpomo-numOfLongBrk)*document.getElementById("task-right-break-btw").value;

        // sets total time span
        document.getElementById('total').textContent = Math.floor(totaltime/60) + " hours and " + totaltime%60;
    }
    else{
        document.getElementById('total').textContent = "0";
    }
}

/**
 * Function used in Create button click event. It will create a new task if task input is filled. 
 * There is also a only a maximum of 6 task
 */
function createTask(){
    let ATContainer = document.getElementById("active-task-container");
    let ATCLength = ATContainer.children.length;
    let container = ATContainer.children[ATCLength-1].shadowRoot.children[1];
    let input = container.children[0];
    
    if (ATCLength<=6 && input.value.length!=0){
        
        let input = container.children[0];
        input.style.pointerEvents = "none";
        
        let speaker = container.children[1];
        speaker.style.opacity = 0;
        speaker.style.pointerEvents = "none";
        
        let wheel = container.children[2].children[2];
        wheel.type = "text";
        wheel.style.pointerEvents = "none";
        
        let button = container.children[2].children[0];
        button.setAttribute('class', 'deleteTask');
        button.textContent = "X";
        
        let entry = document.createElement("task-component");
        ATContainer.append(entry);
    }
}

/**
 * Function used in Begin button click event. It will start the pomo session once a user has entered atleast 1 task
 * It will redirect to active page.
 */
function exitSetUp(){
    let notempty = tasklist.filter(task => task[0] != "");
    if (tasklist.length && notempty.length){ //checks if tasklist is empty
        let dups = {};
        for (let i = 0; i < tasklist.length; i++){
            if (tasklist[i][0] != ""){ //checks for empty tasks
                for (const task of copytasklist){ // checks for duplicate task descriptions
                    if (task[0] == tasklist[i][0]){
                        dups[task[0]] ? dups[task[0]] += 1 : dups[task[0]] = 1; //store amount of copies
                        tasklist[i][0] = tasklist[i][0] + "-" + dups[task[0]]; //changes description name
                        break;
                    }
                }
                if ( document.getElementById("break-task-container").children.length <= 1){ //first task is set in current break task
                    let firstentry = document.createElement("task-component");
                    firstentry.setAttribute('type', "checkbox");
                    firstentry.setAttribute('left-task', tasklist[i][0]);
                    firstentry.setAttribute('left-pointer-event', "none");
                    firstentry.setAttribute('remove-right-suffix', "none");
                    firstentry.setAttribute('delete', 'none');
                    document.getElementById("break-task-container").appendChild(firstentry);
                }
                else {
                    let entry = document.createElement("task-component"); //rest of task are set in incomplete tasks
                    entry.setAttribute('left-pointer-event', "none");
                    entry.setAttribute('set-right-input', tasklist[i][1]);
                    entry.setAttribute('left-task', tasklist[i][0]);
                    entry.setAttribute('delete', 'none');
                    document.getElementById("incompleted-task-container").appendChild(entry);
                }
                copytasklist.push(tasklist[i]);
            }
            else {
                tasklist.splice(i--, 1); //removes any empty tasks and fix index i
            }
        }
        document.getElementById("active-page").style.display = "inline"; //redirect to active
        document.getElementById("setup").style.display = "none";
        document.getElementById("to-how-to-page").style.display = "none";
        document.getElementById("pTitle").textContent = "Pomodoro Timer";
        setup_localStore();
        set_time();
        startTimer("active");
    }
    else{
        alert("Please add a task before beginning Pomo Session");
    }
}


/**
 * Function used for jest testing to set task description
 * @param {int} i = task index in container
 * @param {string} name = descroption of task
 */
function setTaskName(i, name){
    document.getElementById("active-task-container").children[i+1].setAttribute('left-task', name);
}

/**
 * Functuon used in task-component to update tasklist 
 * as user changes task description and pomo count
 * @param {int} index = task in tasklist
 * @param {string} left = new task description
 * @param {int} right = new pomo count
 */
function updateTaskList(index, left, right){
    tasklist[index] = [left ? left : "", right ? right : 1]; //replaces pomo
    calculateTotalTime();
}


exports.deleteComponent = deleteComponent;
exports.setup_localStore = setup_localStore;
exports.calculateTotalTime = calculateTotalTime;
exports.createTask = createTask;
exports.exitSetUp = exitSetUp;
exports.setTaskName = setTaskName;
exports.updateTaskList = updateTaskList;