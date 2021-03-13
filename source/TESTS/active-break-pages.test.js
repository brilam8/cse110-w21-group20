const act = require('../JS/active-break-pages');
global.window = { location: { pathname: null } };

describe('test active and break pages', () => {
  beforeEach(() => {
    global.confirm = jest.fn(()=>{return true});
    global.tasklist = [["task1", 1], ["task2", 2]];
    global.copytasklist = [["task1", 1], ["task2", 2]];
    global.completed = ["task1"];
    global.setup_value = [25, 4, 5, 20];
    global.totalpomo = 3;
    global.activetime = 1500
    global.shortbreaktime = 500
    global.longbreaktime = 1200
    document.body.innerHTML = 
    `
    <header id="pTitle">Set Up
      <a href="how-to-page.html"><button id="to-how-to-page">How To</button></a>
    </header>
    <div id="alert-right-container" class="task-right" style="display: none;">
      <div class="task-right">mins&nbsp&nbsp</div>
      <input type="number" class="task-right" id="alert-frequency" dir="rtl"
          min="5" max="15" step="5" onkeydown="return false" value="10">
    </div>
    <section id="active-page" class="section-page">
      <main>
        <div class="timer-container">
            <div id="progress-bar" class="progress-bar"></div> 
            <p class="timer" id="timer"></p>
        </div>
        <div>
            <p id="first-task" class="task">Sample Task 1</p>
        </div>
        
        <button id="pomo-button">Abort</button>
      </main>
      <a id="to-break-page" href="#break-page" style="visibility: hidden;"></a>
    </section>
    <section id="break-page" class="break-page">
      <main>
        <div class="break-timer-container">
          <div class="timer-container"> 
              <div id="break-bar" class="progress-bar"></div> 
              <p class="timer" id="break-timer"></p>
          </div>
          <button id="break-button">Abort</button>
        </div>
        <div id="break-task-container" class="flex-container">
          <div class="task-title">
              <div class="task-left"><b>Current Task</b></div>
              <div class="task-right"><b>Mark Done &nbsp&nbsp&nbsp &nbsp</b></div>
          </div>
          <!-- <task-component type="checkbox" left-pointer-event="none"></task-component> -->
        </div>
        <div id="incompleted-task-container" class="flex-container">
          <div class="task-title">
              <div class="task-left"><b>Incomplete Tasks</b></div>
              <div class="task-right"><b>Expected &nbsp &nbsp &nbsp &nbsp</b></div>
          </div>
        </div>
        <div id="completed-task-container" class="flex-container">
          <div class="task-title">
              <div class="task-left"><b>Completed Tasks</b></div>
              <div class="task-right"><b>Actual &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp</b></div>
          </div>
        </div>
      </main>
      <a id="to-active-page" href="#active-page" style="visibility: hidden;"></a>
    </section>
    `;
    document.getElementById("progress-bar").style.width = "600px";
    document.getElementById("break-bar").style.width = "600px";
    document.getElementById('break-task-container').appendChild(document.createElement("task-component"));
    document.getElementById('incompleted-task-container').appendChild(document.createElement("task-component"));
  });
  
  test('test abortActive', () => {
    const mock = jest.fn(act.abortActive);
    document.getElementById("active-page").style.display = "inline";
    delete window.location;
    window.location = { replace: jest.fn() }

    mock();
    expect(confirm).toHaveBeenCalled();
    expect(document.getElementById("active-page").style.display).toEqual("none");
    expect(document.getElementById("break-page").style.display).toEqual("none");
    expect(window.location.replace).toHaveBeenCalled();
  })
  test('test abortBreak', () => {
    const mock = jest.fn(act.abortBreak);
    document.getElementById("break-page").style.display = "inline";
    delete window.location;
    window.location = { replace: jest.fn() }

    mock();
    expect(confirm).toHaveBeenCalled();
    expect(document.getElementById("active-page").style.display).toEqual("none");
    expect(document.getElementById("break-page").style.display).toEqual("none");
    expect(window.location.replace).toHaveBeenCalled();
  })

  test('test startTimer with active page', () => {
    const mock = jest.fn(act.startTimer);
    const setup = jest.fn(act.set_time);
    
    setup();
    mock("active");
    expect(document.title).toEqual("25:00 Active Timer");
    expect(document.getElementById("first-task").textContent).toEqual("Task: task1");
    expect(document.getElementById("progress-bar").style.width).toEqual("600px");
    expect(document.getElementById("break-bar").style.width).toEqual("600px");
    expect( document.getElementById('timer').innerHTML).toEqual("25:00");
    expect( document.getElementById('break-timer').innerHTML).toEqual("");
  })

  test('test startTimer with break page', () => {
    const mock = jest.fn(act.startTimer);
    const setup = jest.fn(act.set_time);
    
    setup();
    mock("break");
    expect(document.title).toEqual("05:00 Break Timer");
    expect(document.getElementById("progress-bar").style.width).toEqual("600px");
    expect(document.getElementById("break-bar").style.width).toEqual("600px");
    expect( document.getElementById('break-timer').innerHTML).toEqual("05:00");
    expect( document.getElementById('timer').innerHTML).toEqual("");
  })
  test('test startTimer with break page', () => {
    const mock = jest.fn(act.startTimer);
    const setup = jest.fn(act.set_time);
    
    setup();
    mock("break");
    expect(document.title).toEqual("05:00 Break Timer");
    expect(document.getElementById("progress-bar").style.width).toEqual("600px");
    expect(document.getElementById("break-bar").style.width).toEqual("600px");
    expect( document.getElementById('break-timer').innerHTML).toEqual("05:00");
    expect(document.getElementById("pTitle").textContent).toEqual("Short Break");
    expect( document.getElementById('timer').innerHTML).toEqual("");
  })

  test('test startTimer with 0 pomos, this should end session', () => {
    const mock = jest.fn(act.startTimer);
    const setup = jest.fn(act.set_time);
    const setCounter = jest.fn(act.setCounter);
    
    setup();
    setCounter(1500, 0);
    mock("active");
    expect(document.getElementById("active-page").style.display).toEqual("none");
    expect(document.getElementById("break-page").style.display).toEqual("none");
    expect(window.location.replace).toHaveBeenCalled();
  })

  test('test timer function, it should count down active timer by 1 sec', () => {
    const mock = jest.fn(act.timer);
    const setup = jest.fn(act.set_time);
    const setCounter = jest.fn(act.setCounter);
    
    setup();
    setCounter(1500, 3);
    mock("active");
    expect(document.title).toEqual("24:59 Active Timer");
    expect(document.getElementById("progress-bar").style.width).toEqual("599.6px");
    expect( document.getElementById('timer').innerHTML).toEqual("24:59");
    expect( document.getElementById('break-timer').innerHTML).toEqual("");
  })
  test('test timer function, it should count down break timer by 1 sec', () => {
    const mock = jest.fn(act.timer);
    const setup = jest.fn(act.set_time);
    const setCounter = jest.fn(act.setCounter);
    
    setup();
    setCounter(300, 3);
    mock("break");
    expect(document.title).toEqual("04:59 Break Timer");
    expect(document.getElementById("break-bar").style.width).toEqual("598px");
    expect( document.getElementById('break-timer').innerHTML).toEqual("04:59");
    expect( document.getElementById('timer').innerHTML).toEqual("");
  })
  test('test redirectToPage function, redirect user to break if curPage is active', () => {
    const mock = jest.fn(act.redirectToPage);
    const mockHelper = jest.fn(act.redirectHelper);
    const setup = jest.fn(act.set_time);
    const setCounter = jest.fn(act.setCounter);
    document.getElementById("break-page").style.display = "none";
    document.getElementById("active-page").style.display = "inline";


    setup();
    setCounter(0, 3);
    mock("active");
    mockHelper("active");
    expect(document.getElementById("active-page").style.display).toEqual("none");
    expect(document.getElementById("break-page").style.display).toEqual("inline");
  })
  test('test redirectToPage function, redirect user to active if curPage is break', () => {
    const mock = jest.fn(act.redirectToPage);
    const mockHelper = jest.fn(act.redirectHelper);
    const setup = jest.fn(act.set_time);
    const setCounter = jest.fn(act.setCounter);
    document.getElementById("active-page").style.display = "none";
    document.getElementById("break-page").style.display = "inline";
    expect(document.getElementById('break-task-container').children.length).toEqual(2);
    expect(document.getElementById('incompleted-task-container').children.length).toEqual(2);
    expect(document.getElementById('completed-task-container').children.length).toEqual(1);
    
    setup();
    setCounter(0, 3);
    mock("break");
    mockHelper("break");
    expect(document.getElementById("active-page").style.display).toEqual("inline");
    expect(document.getElementById("break-page").style.display).toEqual("none");
    expect(document.getElementById('break-task-container').children.length).toEqual(2);
    expect(document.getElementById('incompleted-task-container').children.length).toEqual(1);
    expect(document.getElementById('completed-task-container').children.length).toEqual(2);
  })
  test("reset then encountering long break", ()=>{
    const mock = jest.fn(act.reset);
    const setLongBreak = jest.fn(act.setLongBreak);

    setLongBreak();
    mock("break");
    expect(document.getElementById("pTitle").textContent).toEqual("Long Break");
  });
  
  test("No set up values", ()=>{
    global.setup_value = [];
    const mock = jest.fn(act.set_time);
    mock();
  });
});


