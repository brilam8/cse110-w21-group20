window.localStorage.removeItem('tasklist');
window.localStorage.removeItem("completedlist");
var tasklist = [];
var completed = [];

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

        const right = container.appendChild(document.createElement('input'));
        right.setAttribute('class', "right");
        right.type = "number";
        right.placeholder = "   1 pomo";
        right.min = "1"; right.max = "5"; right.step = "1";


        this.left = left;
        this.right= right;

        left.addEventListener('input', ()=>{
            if (right.value && right.type == "number"){
                tasklist.push([left.value, right.value]);
            }
        });
        right.addEventListener('input', ()=>{
            if (left.value && right.type == "number"){ //only in set up
                tasklist.push([left.value, right.value]);
            }
            else{
                if (right.value = 'on'){ //only in break-page. If checkbox checked, then move checked task to completed, if unchecked, keep in tasklist
                    if (!completed.includes(left.value)) completed.push(left.value);
                    else completed.splice(completed.indexOf(left.value), 1);
                }
            }
        });
    
        const style = document.createElement('style');
        style.textContent = `
          .entry {
            height: 40px;
            background-color: white;
            border: solid;
            border-color: lightgrey;
            border-width: 0 0 2px 0;
          }
          
          .left {
            float: left;
            margin-top: 8px;
            margin-left: 15px;
            text-align: left;
            height: 30px;
            width: 70%;
            border: none;
            color: rgb(255, 81, 0);
            font-size: 20px;
          }
          
          .right {
            float: right;
            margin-top: 8px;
            text-align: center;
            width: 20%;
            height: 30px;
            border: none;
            color: rgb(255, 81, 0);
            font-size: 20px;
          }
          
          ::placeholder {
            color: rgb(255, 166, 125);
            font-size: 18px;
          }
        `;

        this.shadowRoot.append(style, container);
    }

    static get observedAttributes() {
        return [`type`, `left-pointer-event`, `left-task`];
    }
    attributeChangedCallback(name, oldValue, newValue){
        if (name == "type"){
            this.right.type = newValue;
        }
        else if (name == "left-pointer-event"){
            this.left.style['pointer-events'] = newValue;
        }
        else if (name == 'left-task'){
            this.left.value = newValue;
        }
    }  

}

customElements.define('task-component', TaskComponent);

document.getElementById("begin").addEventListener("click", ()=>{
    if (tasklist.length){
        for (const task of tasklist){
            let entry = document.createElement("task-component");
            entry.setAttribute('type', "checkbox")
            entry.setAttribute('left-pointer-event', "none");
            entry.setAttribute('left-task', task[0]);
            document.getElementById("break-task-container").appendChild(entry);
        }
        window.localStorage.setItem("tasklist", tasklist.join(',')); //stores copy for results page
        document.getElementById("active-page").style.display = "inline";
        document.getElementById("setup").style.display = "none";
        startTimer("active");
    }
    else{
        alert("Please add a task before beginning Pomo Session");
    }
});

document.getElementById("create").addEventListener("click", ()=>{
    if (document.getElementById("active-task-container").children.length <= 6){
        let entry = document.createElement("task-component");
        document.getElementById("active-task-container").appendChild(entry);
    }
});
