/*global startTimer, set_time*/

var copytasklist = [];
var tasklist = [];
var completed = [];
var setup_value=[];

// resets tasks list in localstorage every time user enters set-up page
window.localStorage.removeItem('tasks');
window.localStorage.removeItem('set-up');

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

        const rightcontainer = container.appendChild(document.createElement('div'));
        rightcontainer.setAttribute('class', 'task-right');

        const deleteButton = rightcontainer.appendChild(document.createElement('button'));
        deleteButton.setAttribute('class', 'deleteTask');
        deleteButton.textContent = "X";
        
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
        this.rightsuffix = rightsuffix;
        this.deleteButton = deleteButton;
        tasklist.push(["", 1]);
        this.index = tasklist.length - 1;

        left.addEventListener('input', ()=>{
            if (right.type == "number"){ //only in set up
                //replaces task
                let pomo = right.value ? right.value : 1;
                tasklist[this.index] = [left.value, pomo];
            }
        });
        right.addEventListener('input', ()=>{
            if (right.type == "number"){ //only in set up
                tasklist[this.index] = [left.value ? left.value : "", right.value ? right.value : 1]; //replaces pomo
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
            outline: none;
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
            text-align:center;
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

        .deleteTask {
            float: right;
            height: 30px;
            width: 30px;
            cursor: pointer;
            outline: none;
            background-color: rgba(242, 71, 38, 1);
            border: none;
            color: white;
            font-weight: bold;
            border-radius: 5px;
            transition: all 0.3s ease-in;
        }
        .deleteTask:hover {
            background-color: rgba(242, 71, 38, 0.8);
        }
        
        ::placeholder {
            font-size: 20px;
            color: rgb(255, 81, 0);
        }

        @media only screen and (max-width: 600px) {
            .task-left {
                width: 30%;
            }
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
            this.right.style.transform = "translate(-59px, 3px)";
        }
        else if (name == 'index'){
            this.index -= 1;
        }
        else if (name == "set-right-input"){
            this.right.style.display = "none";
            this.rightsuffix.textContent = parseInt(newValue) + " pomo";
            this.rightsuffix.style.transform = "translateX(-43%)";
        }
        else if (name == "remove-right-suffix"){
            this.rightsuffix.style.display = newValue;
        }
    }  
}

customElements.define('task-component', TaskComponent);

/**
 * Clicking the begin button create render all the task-components in the break-page,
 * set the tasklist by removing all empty tasks, and redirect to and start the timer for active page.
 */
document.getElementById("begin").addEventListener("click", ()=>{

    let notempty = tasklist.filter(task => task[0] != "");
    if (tasklist.length && notempty.length){ //checks if tasklist is empty
        for (let i = 0; i < tasklist.length; i++){
            if (tasklist[i][0] != ""){ //checks for empty tasks
                if ( document.getElementById("break-task-container").children.length <= 1){
                    let firstentry = document.createElement("task-component");
                    firstentry.setAttribute('type', "checkbox");
                    firstentry.setAttribute('left-task', tasklist[i][0]);
                    firstentry.setAttribute('left-pointer-event', "none");
                    firstentry.setAttribute('remove-right-suffix', "none");
                    firstentry.setAttribute('delete', 'none');
                    document.getElementById("break-task-container").appendChild(firstentry);
                }
                else {
                    let entry = document.createElement("task-component");
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
        setup_localStore();
        set_time();
        startTimer("active");
    }
    else{
        alert("Please add a task before beginning Pomo Session");
    }


});

/**
 * Clicking the create button will create a task-component on the set-up page. 
 * It will only allow 6 task-components.
 */
document.getElementById("create").addEventListener("click", ()=>{
    if (document.getElementById("active-task-container").children.length <= 6){
        let entry = document.createElement("task-component");
        document.getElementById("active-task-container").appendChild(entry);
    }
});

//updates text for setting
document.getElementById('task-right-total').addEventListener('change', ()=>{
    let value = document.getElementById('task-right-total').value
    document.getElementById("long-break-indicator").textContent = value == 1 ? "1st" : value == 2 ? "2nd" : value == 3 ? "3rd"  : value + "th";
});

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
}


/**
 * Function stores set-up page values, stringifying and send them to local-storage.
 */
function setup_localStore(){
    let arr=["task-right-len","task-right-total","task-right-break-btw","task-right-long-break"];
    for(let i=0;i<4;i++){
        let set_value=document.getElementById(arr[i]).value;
        setup_value.push(set_value);
    }
}

