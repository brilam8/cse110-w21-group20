customElements.define('task-component', class extends HTMLElement {
  constructor(){
      super();
      const container = document.createElement('div');
      container.setAttribute('class', 'entry');

      const left = container.appendChild(document.createElement('input'));
      left.setAttribute('class', "left");
      left.type = "text";
      left.placeholder = "Enter Task Here";
      left.maxLength = 20; // TO CHANGE

      const right = container.appendChild(document.createElement('input'));
      right.setAttribute('class', "right");
      right.type = "number";
      right.placeholder = "   1 pomo";
      right.onkeydown=()=>{return false;};
      right.min = "1"; right.max = "5"; right.step = "1";

      const deleteButton = container.appendChild(document.createElement('button'));
      deleteButton.setAttribute('class', 'deleteTask');
      deleteButton.textContent = "X";


      this.left = left;
      this.right= right;
      this.deleteButton = deleteButton;
      this.index = 1;

      deleteButton.addEventListener('click', ()=>{
          deleteComponent();
      });
      function deleteComponent(){
        document.getElementById("active-task-container").children[1].remove(); //removes task component
      }
  
      const style = document.createElement('style');
      style.textContent = `
        .entry {
          height: 40px;
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
        
        .right {
          margin-top: 8px;
          text-align: center;
          width: 20%;
          height: 30px;
          border: none;
          color: rgb(255, 81, 0);
          font-size: 20px;
          caret-color: transparent;
          cursor: default;
          outline: none;
        }

        .deleteTask {
            position: absolute;
            height: 35px;
            width: 35px;
            right: 16%;
            transform: translateY(5px);
            cursor: pointer;
            outline: none;
            
            background-color: white;
            border: 3.5px solid rgba(242, 71, 38, 0.9);;
            color: rgba(242, 71, 38, 0.9);
            font-weight: bold;
            border-radius: 5px;
            transition: all 0.3s ease-in;
        }

        .deleteTask:hover {
          background-color: rgba(242, 71, 38, 0.2);
        }
        
        ::placeholder {
          color: rgb(255, 166, 125);
          font-size: 18px;
        }
      `;

      this.append(style, container);
  }

  static get observedAttributes() {
      return [`type`, `left-pointer-event`, `left-task`, 'delete', 'index'];
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
      else if (name == 'delete'){
          this.deleteButton.style.display = newValue;
      }
      else if (name == 'index'){
          this.index -= 1;
      }
  }  
})

describe('set up page', () => {
  document.body.innerHTML = 
    `
    <section id="setup" class="set-up-page">
      <div id="active-task-container" class="flex-container">
          <div class="task-title">
              <div class="task-left"><b>Task List</b></div>
              <div class="task-right"><b>Estimate</b></div>
          </div>
          <task-component id="task1"></task-component>
      </div> 
      <button id="create" class="cButton">Create</button>
      <a href="#active-page"><button id="begin" class="bButton">Begin</button></a>
    </section>
    `;
  document.getElementById("begin").addEventListener('click', ()=>{
    document.getElementById("setup").style.display = "none";
  });
  document.getElementById("create").addEventListener("click", ()=>{
    if (document.getElementById("active-task-container").children.length <= 6){
        document.getElementById("active-task-container").appendChild(document.createElement("div"));
    }
  });
    
  test('Checking page title', () => {
    expect(document.body.innerHTML).toContain('Begin');
    expect(document.getElementById("setup").style.display).toEqual("") //not set
  })

  test('Checking number of children in active-task-container div', () => {
    expect(document.getElementById("active-task-container").children.length).toEqual(2);
  })

  test('Checking number of children in active-task-container div after clicking create', () => {
    document.getElementById("create").click();
    expect(document.getElementById("active-task-container").children.length).toEqual(3);
  })

  test('Checking number of children in active-task-container div after clicking delete', () => {
    document.getElementById("task1").deleteButton.click();
    expect(document.getElementById("active-task-container").children.length).toEqual(2);
  })

  test('Checking setup after clicking begin', () => {
    document.getElementById("begin").click();
    expect(document.getElementById("setup").style.display).toEqual("none");
  })

  test("Checking setAttribute for task-component", ()=>{
    document.body.innerHTML = 
    `
    <section id="setup" class="set-up-page">
      <div id="active-task-container" class="flex-container">
          <div class="task-title">
              <div class="task-left"><b>Task List</b></div>
              <div class="task-right"><b>Estimate</b></div>
          </div>
          <task-component id="task1"></task-component>
      </div> 
      <button id="create" class="cButton">Create</button>
      <a href="#active-page"><button id="begin" class="bButton">Begin</button></a>
    </section>
    `;
    expect(document.getElementById('task1').right.type).toEqual("number");
    expect(document.getElementById('task1').left.style['pointer-events']).toEqual("");
    expect(document.getElementById('task1').left.value).toEqual("");
    expect(document.getElementById('task1').deleteButton.style.display).toEqual("");
    expect(document.getElementById('task1').index).toEqual(1);


    document.getElementById('task1').setAttribute('type', 'checkbox');
    document.getElementById('task1').setAttribute('left-pointer-event', 'none');
    document.getElementById('task1').setAttribute('left-task', 'sample task');
    document.getElementById('task1').setAttribute('delete', 'none');
    document.getElementById('task1').setAttribute('index', '1');
    
    expect(document.getElementById('task1').right.type).toEqual("checkbox");
    expect(document.getElementById('task1').left.style['pointer-events']).toEqual("none");
    expect(document.getElementById('task1').left.value).toEqual("sample task");
    expect(document.getElementById('task1').deleteButton.style.display).toEqual("none");
    expect(document.getElementById('task1').index).toEqual(0);
  });
}) 