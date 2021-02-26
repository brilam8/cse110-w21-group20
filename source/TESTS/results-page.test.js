const res = require('../JS/results-page');

class TaskItem extends HTMLElement {
  static get observedAttributes() {
      return ['completed', 'name', 'actualpomos', 'expectedpomos']
  }

  constructor() {
      super();
      this.attachShadow({mode: 'open'});
  
      let style = document.createElement('style')
      style.textContent = `
          .task-comp {
              border-radius: 5px;
              border: 2px rgba(235, 235, 235, 0.8);
              background-color: rgba(245, 245, 245, 0.8);
              width: 70%;
              height: 50px;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              padding-left: 15px;
              padding-right: 15px;
              margin-left:auto;
              margin-right:auto;
              margin-bottom:15px;
          }
          .task-main {
              display: flex;
              flex-direction: row;
              align-items: center;
          }

          .task-name {
              font-family: 'Open Sans', sans-serif;
              color: black;
              font-size: 18px;
              font-style: normal;
              font-weight: 500;
              padding-left: 10px;
          }

          .actual-pomo {
              font-family: 'Open Sans', sans-serif;
              color: black;
              font-size: 18px;
              font-style: normal;
              font-weight: bold;
          }

          .expected-pomo {
              font-family: 'Open Sans', sans-serif;
              color: black;
              font-size: 15px;
              font-style: normal;
          }

          .checkMark {
              d: path("M 12 0 c -6.627 0 -12 5.373 -12 12 s 5.373 12 12 12 s 12 -5.373 12 -12 s -5.373 -12 -12 -12 Z m -1.25 17.292 l -4.5 -4.364 l 1.857 -1.858 l 2.643 2.506 l 5.643 -5.784 l 1.857 1.857 l -7.5 7.643 Z");
          }

          .svgIcon {
              width: 24px;
              height: 24px;
          }
      `

      const container = document.createElement('div');
      container.setAttribute('class', 'task-comp');
      const taskMain = container.appendChild(document.createElement('div'));
      taskMain.setAttribute('class', 'task-main')
      const svg = taskMain.appendChild(document.createElementNS(ns, "svg"));
      svg.setAttribute("width", "24");
      svg.setAttribute("height", "24");
      svg.setAttribute("viewBox", "0 0 24 24");
      const path = svg.appendChild(document.createElementNS(ns, "path"));
      this.path = path;
      path.setAttribute("d", checkmarkPATH);
      path.setAttribute("style", "fill: green;");

      const taskName = taskMain.appendChild(document.createElement("span"));
      taskName.setAttribute("class", "task-name");
      this.taskName = taskName;

      const taskInfo = container.appendChild(document.createElement('div'));
      taskInfo.setAttribute('class', 'task-info')


      const actualPomos = taskInfo.appendChild(document.createElement("span"));
      actualPomos.setAttribute("class", "actual-pomo");
      this.actualPomos = actualPomos;
      actualPomos.textContent = "0";

      const expectedPomos = taskInfo.appendChild(document.createElement("span"));
      expectedPomos.setAttribute("class", "expected-pomo");
      this.expectedPomos = expectedPomos;
      expectedPomos.textContent = "0";

      

      this.shadowRoot.append(style, container)

  }

  attributeChangedCallback(name, oldValue, newValue){
      if (name == "name"){
          this.taskName.textContent = newValue;
      }
      else if (name == "actualpomos"){
          this.actualPomos.textContent = newValue;
      }
      else if (name == 'expectedpomos'){
          this.expectedPomos.textContent = `/${newValue} pomos`;
      }
      else if (name == "completed") {
          this.updatePath(newValue);
      }
  }  

  updatePath(compValue){
      if (compValue == "true"){
          console.log(this.getAttribute("expectedpomos"))
          if (Number(this.getAttribute("actualpomos")) > Number(this.getAttribute("expectedpomos"))) {
              this.path.setAttribute("style", "fill:rgb(255, 115, 1)")
          }
          else {
              this.path.setAttribute("style", "fill:green")
          }
          this.path.setAttribute("d", checkmarkPATH);
      }
      else {
          this.path.setAttribute("style", "fill:red")
          this.path.setAttribute("d", xPATH);
      }
      
  }
}

// sample test
require('../JS/results-page')
global.window = { location: { pathname: null } };

describe ('restart button', () => {
  test('redirects to landing page', () => {
    document.body.innerHTML =
    `
      <a href="landing-page.html" id="restart-btn"> 
        <button class="ob-button"> Restart </button>
      </a>
    `
    const restartButton = document.getElementById("restart-btn");
    expect(restartButton.getAttribute('href')).toEqual('landing-page.html');
  });
});

describe ('print button', () => {
  test('opens print dialogue', () => {
    document.body.innerHTML =
    `
      <div class="div-flex-row">
        <button class="ob-button" id="print" onclick="print()">Assessment</button>
      </div>
    `
    const consoleSpy = jest.spyOn(console, 'log');

    window.print = function() {
      console.log("printed!");
    }

    const printButton = document.getElementById("print");
    printButton.click();
    expect(consoleSpy).toHaveBeenCalledWith('printed!');
  });
});

describe('task list', () => {
  const mock = jest.fn(res.populateTasks);
  test('checks local storage', () => {
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    document.body.innerHTML =
    `
    <grid class="two-col-grid-container" id="results">
        <p class="table-header">Tasks completed: </p>
        <p class="table-header">Tasks left to do: </p>
        <ol id="complete-items">
        </ol>
        <ol id="uncomplete-items">
        </ol>
    </grid>
    <div style="text-align: center;">
        <p class="p-body" id="prog-num"></p>
    </div>
    <div class="task-progress-bar">
        <div class="progress-bar-fill" id="prog-bar-fill">
        </div>
    </div>
    <div style="text-align: center;">
        <p class="p-body" id="message"></p>
    </div>
    `;
    
    mock();
    expect(localStorage.getItem).toHaveBeenCalled();
    expect(mock).toHaveBeenCalled();
  }),
  test('adds messages on empty task list', () => {
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    document.body.innerHTML =
    `
    <grid class="two-col-grid-container" id="results">
        <p class="table-header">Tasks completed: </p>
        <p class="table-header">Tasks left to do: </p>
        <ol id="complete-items">
        </ol>
        <ol id="uncomplete-items">
        </ol>
    </grid>
    <div style="text-align: center;">
        <p class="p-body" id="prog-num"></p>
    </div>
    <div class="task-progress-bar">
        <div class="progress-bar-fill" id="prog-bar-fill">
        </div>
    </div>
    <div style="text-align: center;">
        <p class="p-body" id="message"></p>
    </div>
    `;
    
    mock();
    expect(localStorage.getItem).toHaveBeenCalled();
    expect(mock).toHaveBeenCalled();
    expect(document.getElementsByClassName('p-body')[0].textContent).toEqual("No tasks completed");
    expect(document.getElementsByClassName('p-body')[1].textContent).toEqual("No tasks uncompleted");
  });
  test('populates completed tasks correctly', () => {
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    document.body.innerHTML =
    `
    <grid class="two-col-grid-container" id="results">
        <p class="table-header">Tasks completed: </p>
        <p class="table-header">Tasks left to do: </p>
        <ol id="complete-items">
        </ol>
        <ol id="uncomplete-items">
        </ol>
    </grid>
    <div style="text-align: center;">
        <p class="p-body" id="prog-num"></p>
    </div>
    <div class="task-progress-bar">
        <div class="progress-bar-fill" id="prog-bar-fill">
        </div>
    </div>
    <div style="text-align: center;">
        <p class="p-body" id="message"></p>
    </div>
    `;
    localStorage.setItem('tasks', JSON.stringify([
      {
        "id": 1,
        "actualpomos": 4,
        "expectedpomos" : 5,
        "completed": true,
        "taskdescription": "eat cheese"
      },
      {
        "id": 2,
        "actualpomos": 2,
        "expectedpomos" : 5,
        "completed": true,
        "taskdescription": "play games"
      },
      {
        "id": 3,
        "actualpomos": 3,
        "expectedpomos" : 5,
        "completed": false,
        "taskdescription": "finish cse 110"
      },
      {
        "id": 4,
        "actualpomos": 0,
        "expectedpomos" : 5,
        "completed": true,
        "taskdescription": "take a trip downtown"
      },
      {
        "id": 5,
        "actualpomos": 6,
        "expectedpomos" : 5,
        "completed": true,
        "taskdescription": "build covid 19 vaccine"
      }
    ]));
    mock();

    const completedItems = document.getElementById('complete-items');
    const uncompletedItems = document.getElementById('uncomplete-items');
    let complete_count = completedItems.childNodes.length - 1;
    let uncomplete_count = uncompletedItems.childNodes.length - 1;

    expect(localStorage.getItem).toHaveBeenCalled();
    expect(mock).toHaveBeenCalled();
    expect(complete_count).toEqual(4);
    expect(uncomplete_count).toEqual(1);
    expect(uncompletedItems.firstElementChild.taskName.textContent).toEqual("finish cse 110");
    expect(completedItems.firstElementChild.taskName.textContent).toEqual("eat cheese");
  });
  test('displays congratulations message if all tasks completed', () => {
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    document.body.innerHTML =
    `
    <grid class="two-col-grid-container" id="results">
        <p class="table-header">Tasks completed: </p>
        <p class="table-header">Tasks left to do: </p>
        <ol id="complete-items">
        </ol>
        <ol id="uncomplete-items">
        </ol>
    </grid>
    <div style="text-align: center;">
        <p class="p-body" id="prog-num"></p>
    </div>
    <div class="task-progress-bar">
        <div class="progress-bar-fill" id="prog-bar-fill">
        </div>
    </div>
    <div style="text-align: center;">
        <p class="p-body" id="message"></p>
    </div>
    `;
    localStorage.setItem('tasks', JSON.stringify([
      {
        "id": 1,
        "actualpomos": 4,
        "expectedpomos" : 5,
        "completed": true,
        "taskdescription": "eat cheese"
      },
      {
        "id": 2,
        "actualpomos": 2,
        "expectedpomos" : 5,
        "completed": true,
        "taskdescription": "play games"
      },
      {
        "id": 4,
        "actualpomos": 0,
        "expectedpomos" : 5,
        "completed": true,
        "taskdescription": "take a trip downtown"
      },
      {
        "id": 5,
        "actualpomos": 6,
        "expectedpomos" : 5,
        "completed": true,
        "taskdescription": "build covid 19 vaccine"
      }
    ]));
    mock();

    const completedItems = document.getElementById('complete-items');
    const uncompletedItems = document.getElementById('uncomplete-items');
    let complete_count = completedItems.childNodes.length - 1;
    let uncomplete_count = uncompletedItems.childNodes.length - 1;
    const message = document.getElementById('message');

    expect(localStorage.getItem).toHaveBeenCalled();
    expect(mock).toHaveBeenCalled();
    expect(complete_count).toEqual(4);
    expect(uncomplete_count).toEqual(1);
    expect(completedItems.firstElementChild.taskName.textContent).toEqual("eat cheese");
    expect(document.getElementsByClassName('p-body')[0].textContent).toEqual("No tasks uncompleted");
    expect(message.textContent).toEqual("Congratulations! You finished all your tasks this session!");
  });
  test('test message on no completed tasks', () => {
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    document.body.innerHTML =
    `
    <grid class="two-col-grid-container" id="results">
        <p class="table-header">Tasks completed: </p>
        <p class="table-header">Tasks left to do: </p>
        <ol id="complete-items">
        </ol>
        <ol id="uncomplete-items">
        </ol>
    </grid>
    <div style="text-align: center;">
        <p class="p-body" id="prog-num"></p>
    </div>
    <div class="task-progress-bar">
        <div class="progress-bar-fill" id="prog-bar-fill">
        </div>
    </div>
    <div style="text-align: center;">
        <p class="p-body" id="message"></p>
    </div>
    `;
    localStorage.setItem('tasks', JSON.stringify([
      {
        "id": 1,
        "actualpomos": 4,
        "expectedpomos" : 5,
        "completed": false,
        "taskdescription": "eat cheese"
      },
      {
        "id": 2,
        "actualpomos": 0,
        "expectedpomos" : 5,
        "completed": false,
        "taskdescription": "play games"
      },
      {
        "id": 4,
        "actualpomos": 0,
        "expectedpomos" : 5,
        "completed": false,
        "taskdescription": "take a trip downtown"
      },
      {
        "id": 5,
        "actualpomos": 0,
        "expectedpomos" : 5,
        "completed": false,
        "taskdescription": "build covid 19 vaccine"
      }
    ]));
    mock();

    const completedItems = document.getElementById('complete-items');
    const uncompletedItems = document.getElementById('uncomplete-items');
    let complete_count = completedItems.childNodes.length - 1;
    let uncomplete_count = uncompletedItems.childNodes.length - 1;
    
    expect(localStorage.getItem).toHaveBeenCalled();
    expect(mock).toHaveBeenCalled();
    expect(complete_count).toEqual(1);
    expect(uncomplete_count).toEqual(4);
    expect(uncompletedItems.firstElementChild.taskName.textContent).toEqual("eat cheese");
    expect(document.getElementsByClassName('p-body')[0].textContent).toEqual("No tasks completed");
  });
});