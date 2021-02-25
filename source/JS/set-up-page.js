/*global startTimer*/

var copytasklist = [];
var tasklist = [];
var completed = [];

// resets tasks list in localstorage every time user enters set-up page
window.localStorage.removeItem('tasks');


/**
 * Component used to create tasks in set-up page and break page.
 * Allows you to manipulate the tasks by deleting, creating and editting tasks
 */
class TaskComponent extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        const container = document.createElement('div');
        container.setAttribute('class', 'entry');

        const left = container.appendChild(document.createElement('input'));
        left.setAttribute('class', "left");
        left.type = "text";
        left.placeholder = "Enter Task Here";
        left.maxLength = 20; // TO CHANGE

        const rightcontainer = container.appendChild(document.createElement('div'));
        rightcontainer.setAttribute('class', 'rightcontainer');

        const right = rightcontainer.appendChild(document.createElement('input'));
        right.setAttribute('class', "right");
        right.type = "number";
        right.onkeydown=()=>{return false;};
        right.min = "1"; right.max = "5"; right.step = "1";
        right.value = "1";

        const rightsuffix = rightcontainer.appendChild(document.createElement('span'));
        rightsuffix.setAttribute('class', 'rightsuffix');
        rightsuffix.textContent = "pomo";

        const deleteButton = container.appendChild(document.createElement('button'));
        deleteButton.setAttribute('class', 'deleteTask');
        deleteButton.textContent = "X";


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
                
                right.value > 1 ? rightsuffix.textContent = "pomos" : rightsuffix.textContent = "pomo"; 
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
            font-family: 'Oswald', sans-serif;
            height: 40px;
            width: 59.15vw;
            background-color: white;
            border: solid;
            border-color: lightgrey;
            border-width: 0 0 2px 0;
            display: flex;
          }
          
          .left {
            margin-top: 8px;
            margin-left: 15px;
            margin-right: 10%;
            text-align: left;
            height: 30px;
            width: 70%;
            border: none;
            color: rgb(255, 81, 0);
            font-size: 20px;
          }

          .rightcontainer, .right, .rightsuffix {
            border: none;
            color: rgb(255, 81, 0);
            font-size: 20px;
            text-align: center;
          }
          .rightcontainer {
            margin-top: 8px;
            width: 20%;
            height: 30px;            
          }
          
          .right {
            width: 100%;
            height: 30px;
            caret-color: transparent;
            cursor: default;
            outline: none;
            transform: translateX(-3%);
          }

          .rightsuffix {
            position: absolute;
            transform: translate(-25px, -29px);
            color: rgba(255, 81, 0, 0.6);
          }

          input[type=number]::-webkit-inner-spin-button, 
          input[type=number]::-webkit-outer-spin-button {  
            opacity: 1;
            margin-left: 32%;
          }

          .deleteTask {
              position: absolute;
              height: 35px;
              width: 35px;
              transform: translate(60vw, 5px);
              cursor: pointer;
              outline: none;
              
              background-color: white;
              border: 3.5px solid rgba(242, 71, 38, 0.9);;
              color: rgba(242, 71, 38, 0.9);
              font-weight: bold;
              border-radius: 5px;
          }

          .deleteTask:hover {
            background-color: rgba(242, 71, 38, 0.2);
          }
          
          ::placeholder {
            color: rgb(255, 166, 125);
            font-size: 18px;
          }

          @media only screen and (max-width: 1400px) {
            .rightsuffix {
                display: none;
            }
            input[type=number]::-webkit-inner-spin-button, 
            input[type=number]::-webkit-outer-spin-button {  
                opacity: 1;
                margin-left: 0;
                transform: translateX(0);
            }
            input[type=number]::-webkit-inner-spin-button, 
            input[type=number]::-webkit-outer-spin-button {  
                opacity: 1;
                margin-left: 0;
                transform: translateX(0);
            }
            .right {
                transform: translateX(-6%);
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
        }
        else if (name == 'index'){
            this.index -= 1;
        }
        else if (name == "set-right-input"){
            this.right.style.display = "none";
            this.rightsuffix.textContent = newValue > 1 ? parseInt(newValue) + " pomos" : parseInt(newValue) + " pomo";
            this.rightsuffix.style.transform = "translateX(-55%)";
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

module.exports = {deleteComponent};
