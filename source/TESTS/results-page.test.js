const res = require('../JS/results-page');

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