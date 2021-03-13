describe('set up page', () => {
  const set = require('../JS/set-up-page');
  global.window = { location: { pathname: null } };
  test("test deleteComponent", ()=>{
    const mock = jest.fn(set.deleteComponent);
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
      <input type="number" class="task-right" id="task-right-len" dir="rtl" value="25" 
      min="20" max="35" step="5" onkeydown="return false">
      <input type="number" class="task-right" id="task-right-total" dir="rtl" value="4" 
          min="4" max="5" step="1" onkeydown="return false" style="width: 39px; margin-right: 5px;">
      <input type="number" class="task-right" id="task-right-break-btw" dir="rtl" value="5" 
          min="5" max="10" step="1" onkeydown="return false">
      <input type="number" class="task-right" id="task-right-long-break" dir="rtl" value="20" 
          min="15" max="30" step="5" onkeydown="return false">
      <div><b>Total Time: <span id="total">0</span> minutes</b></div>
      <a href="#active-page"><button id="begin" class="bButton">Begin</button></a>
    </section>
    `;
    expect(document.getElementById("active-task-container").children.length).toEqual(2);
    mock(0);
    expect(mock).toHaveBeenCalled();
    expect(document.getElementById("active-task-container").children.length).toEqual(1);
  });
  test("test setup_localStore", ()=>{
    const mock = jest.fn(set.setup_localStore);
    document.body.innerHTML = 
    `
    <section id="setup" class="set-up-page">
      <div class="flex-container">
        <div class="task-title">
            <div class="task-left"><b>Pomo Settings</b></div>
            <div class="task-right"><b>Options &nbsp &nbsp &nbsp</b></div>
        </div>
        <div class="task-entry">
            <div class="task-left">Pomo Length</div>
            <div class="task-right">
                <div class="task-right">mins&nbsp&nbsp</div>
                <input type="number" class="task-right" id="task-right-len" dir="rtl" value="25" 
                    min="20" max="35" step="5" onkeydown="return false">
            </div>
        </div>
        <div class="task-entry">
            <div class="task-left">Long Break on every <span id="long-break-indicator">4th</span> Pomo</div>
            <div class="task-right">
                <div class="task-right" style="margin-left: -4px; margin-right: 3px;">pomo</div>
                <input type="number" class="task-right" id="task-right-total" dir="rtl" value="4" 
                    min="4" max="5" step="1" onkeydown="return false" style="width: 39px; margin-right: 5px;">
            </div>
            
        </div>
        <div class="task-entry">
            <div class="task-left">Short Breaks Timer</div>
            <div class="task-right">
                <div class="task-right">mins&nbsp&nbsp</div>
                <input type="number" class="task-right" id="task-right-break-btw" dir="rtl" value="5" 
                    min="5" max="10" step="1" onkeydown="return false">
            </div>
        </div>
        <div class="task-entry">
            <div class="task-left">Long Break Timer</div>
            <div class="task-right">
                <div class="task-right">mins&nbsp&nbsp</div>
                <input type="number" class="task-right" id="task-right-long-break" dir="rtl" value="20" 
                    min="15" max="30" step="5" onkeydown="return false">
            </div>
        </div>       
      </div>
    </section>
    `;
    mock();
    expect(mock).toHaveBeenCalled();
  });
  test("test createTask", ()=>{
    const mock = jest.fn(set.createTask);
    const mockname =  jest.fn(set.setTaskName);
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
      <input type="number" class="task-right" id="task-right-len" dir="rtl" value="25" 
      min="20" max="35" step="5" onkeydown="return false">
      <input type="number" class="task-right" id="task-right-total" dir="rtl" value="4" 
          min="4" max="5" step="1" onkeydown="return false" style="width: 39px; margin-right: 5px;">
      <input type="number" class="task-right" id="task-right-break-btw" dir="rtl" value="5" 
          min="5" max="10" step="1" onkeydown="return false">
      <input type="number" class="task-right" id="task-right-long-break" dir="rtl" value="20" 
          min="15" max="30" step="5" onkeydown="return false">
      <div><b>Total Time: <span id="total">0</span> minutes</b></div>
      <a href="#active-page"><button id="begin" class="bButton">Begin</button></a>
    </section>
    `;
    expect(document.getElementById("active-task-container").children.length).toEqual(2);
    mockname(0, "task1");
    mock();
    expect(mock).toHaveBeenCalled();
    expect(mockname).toHaveBeenCalled();
    expect(document.getElementById("active-task-container").children.length).toEqual(3);
  });
  test("test setTaskName and calculateTotalTime", ()=>{
    const mockname = jest.fn(set.setTaskName);
    const mocktime = jest.fn(set.calculateTotalTime);
    const mocktask = jest.fn(set.updateTaskList);
    document.body.innerHTML=
    `
    <section id="setup" class="set-up-page">
        <div id="active-task-container" class="flex-container">
            <div class="task-title">
                <div class="task-left"><b>Task List</b></div>
                <div class="task-right"><b>Estimate &nbsp &nbsp &nbsp &nbsp</b></div>
            </div>
            <task-component></task-component>
        </div>
        <input type="number" class="task-right" id="task-right-len" dir="rtl" value="25" 
            min="20" max="35" step="5" onkeydown="return false">
        <input type="number" class="task-right" id="task-right-total" dir="rtl" value="4" 
            min="4" max="5" step="1" onkeydown="return false" style="width: 39px; margin-right: 5px;">
        <input type="number" class="task-right" id="task-right-break-btw" dir="rtl" value="5" 
            min="5" max="10" step="1" onkeydown="return false">
        <input type="number" class="task-right" id="task-right-long-break" dir="rtl" value="20" 
            min="15" max="30" step="5" onkeydown="return false">
      <div><b>Total Time: <span id="total">0</span> minutes</b></div>
    </section>
    `;
    expect(document.getElementById("task-right-len").value).toEqual("25");
    expect(document.getElementById("task-right-break-btw").value).toEqual("5");
    expect(document.getElementById("total").textContent).toEqual("0");
    mockname(0, "task1");
    mocktask(0, "task1", 1);
    mocktime();
    expect(mockname).toHaveBeenCalled();
    expect(mocktime).toHaveBeenCalled();
    expect(mocktask).toHaveBeenCalled();
    expect(document.getElementById("total").textContent).toEqual("0 hours and 30");
  });

  test("test clicking begin with no tasks", ()=>{
    global.alert = jest.fn();
    global.set_time = ()=>{return true};
    global.startTimer = (page)=>{return page};
    const mockname = jest.fn(set.setTaskName);
    const mocktask = jest.fn(set.updateTaskList);
    const mockbegin = jest.fn(set.exitSetUp);
    document.body.innerHTML=
    `
    <header id="pTitle">Set Up
      <a href="how-to-page.html"><button id="to-how-to-page">How To</button></a>
    </header>
    <section id="setup" class="set-up-page">
      <div id="active-task-container" class="flex-container">
          <div class="task-title">
              <div class="task-left"><b>Task List</b></div>
              <div class="task-right"><b>Estimate</b></div>
          </div>
          <task-component id="task1"></task-component>
      </div> 
      <button id="create" class="cButton">Create</button>
      <input type="number" class="task-right" id="task-right-len" dir="rtl" value="25" 
      min="20" max="35" step="5" onkeydown="return false">
      <input type="number" class="task-right" id="task-right-total" dir="rtl" value="4" 
          min="4" max="5" step="1" onkeydown="return false" style="width: 39px; margin-right: 5px;">
      <input type="number" class="task-right" id="task-right-break-btw" dir="rtl" value="5" 
          min="5" max="10" step="1" onkeydown="return false">
      <input type="number" class="task-right" id="task-right-long-break" dir="rtl" value="20" 
          min="15" max="30" step="5" onkeydown="return false">
      <div><b>Total Time: <span id="total">0</span> minutes</b></div>
      <a href="#active-page"><button id="begin" class="bButton">Begin</button></a>
    </section>
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
    document.getElementById("active-page").style.display = "none";
    mockname(0, ""); // no task
    mocktask(0, "", 1);
    mockbegin();
    expect(alert).toHaveBeenCalled();
    expect(document.getElementById("active-page").style.display).toEqual("none");
  });

  test("test clicking begin after making two tasks", ()=>{
    global.set_time = ()=>{return true};
    global.startTimer = (page)=>{return page};
    const mockname = jest.fn(set.setTaskName);
    const mocktask = jest.fn(set.updateTaskList);
    const mockbegin = jest.fn(set.exitSetUp);
    const mockcreate = jest.fn(set.createTask);
    document.body.innerHTML=
    `
    <header id="pTitle">Set Up
      <a href="how-to-page.html"><button id="to-how-to-page">How To</button></a>
    </header>
    <section id="setup" class="set-up-page">
      <div id="active-task-container" class="flex-container">
          <div class="task-title">
              <div class="task-left"><b>Task List</b></div>
              <div class="task-right"><b>Estimate</b></div>
          </div>
          <task-component id="task1"></task-component>
      </div> 
      <button id="create" class="cButton">Create</button>
      <input type="number" class="task-right" id="task-right-len" dir="rtl" value="25" 
      min="20" max="35" step="5" onkeydown="return false">
      <input type="number" class="task-right" id="task-right-total" dir="rtl" value="4" 
          min="4" max="5" step="1" onkeydown="return false" style="width: 39px; margin-right: 5px;">
      <input type="number" class="task-right" id="task-right-break-btw" dir="rtl" value="5" 
          min="5" max="10" step="1" onkeydown="return false">
      <input type="number" class="task-right" id="task-right-long-break" dir="rtl" value="20" 
          min="15" max="30" step="5" onkeydown="return false">
      <div><b>Total Time: <span id="total">0</span> minutes</b></div>
      <a href="#active-page"><button id="begin" class="bButton">Begin</button></a>
    </section>
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
    document.getElementById("active-page").style.display = "none";
    mockname(0, "task"); // add a task
    mocktask(0, "task", 1);
    mockcreate();
    mockname(1, "task"); // add second task
    mocktask(1, "task", 1);
    mockbegin();
    expect(mockname).toHaveBeenCalled();
    expect(mocktask).toHaveBeenCalled();
    expect(mockbegin).toHaveBeenCalled();
    expect(mockcreate).toHaveBeenCalled();
    expect(document.getElementById("setup").style.display).toEqual("none");
    expect(document.getElementById("active-page").style.display).toEqual("inline");
  });

  test("test recording with white background", ()=>{
    class object{
      constructor(){
        this.x = "hello";
      }
      start(){
        return true;
      }
    }
    global.webkitSpeechRecognition= object;
    const mock = jest.fn(set.record);
    document.body.innerHTML =`
    <div id="active-task-container" class="flex-container">
      <div class="task-title">
        <div class="task-left"><b>Task List</b></div>
        <div class="task-right"><b>Estimate</b></div>
      </div>
      <task-component id="task1"></task-component>
    </div> 
    <button id="create" class="cButton">Create</button>
    `
    mock();
    expect(mock).toHaveBeenCalled();
    expect(document.body.style.background).toEqual("rgba(0, 0, 0, 0.1)");
    expect(document.getElementById("active-task-container").style.background).toEqual("white");
    expect(document.body.style.pointerEvents).toEqual("none");

  });

  test("test recording with dark mode (black background)", ()=>{
    class object{
      constructor(){
        this.x = "hello";
      }
      start(){
        return true;
      }
    }
    global.webkitSpeechRecognition= object;
    const mock = jest.fn(set.record);
    document.body.innerHTML =`
    <div id="active-task-container" class="flex-container">
      <div class="task-title">
        <div class="task-left"><b>Task List</b></div>
        <div class="task-right"><b>Estimate</b></div>
      </div>
      <task-component id="task1"></task-component>
    </div> 
    <button id="create" class="cButton">Create</button>
    `
    document.body.style.background = "#1a1a1a";
    mock();
    expect(mock).toHaveBeenCalled();
    expect(document.body.style.background).toEqual("rgba(0, 0, 0, 0.1)");
    expect(document.getElementById("active-task-container").style.background).toEqual("rgb(26, 26, 26)"); //#1a1a1a equivalent
    expect(document.body.style.pointerEvents).toEqual("none");

  });

  test("test recordingEnd, should return to white background", ()=>{
    class object{
      constructor(){
        this.x = "hello";
      }
      stop(){
        return false;
      }
    }
    var recognition = new object;
    var savedbackground = "white";
    const mock = jest.fn(set.recordingEnd);
    document.body.innerHTML =`
    <div id="active-task-container" class="flex-container">
      <div class="task-title">
        <div class="task-left"><b>Task List</b></div>
        <div class="task-right"><b>Estimate</b></div>
      </div>
      <task-component id="task1"></task-component>
    </div> 
    <button id="create" class="cButton">Create</button>
    `
    document.body.style.background = "rgba(0,0,0,0.1)";
    mock(recognition, savedbackground);
    expect(mock).toHaveBeenCalled();
    expect(document.body.style.background).toEqual("white");
    expect(document.getElementById("active-task-container").style.background).toEqual("");
    expect(document.body.style.pointerEvents).toEqual("all");

  });

  test("test recordingEnd, shound return to black background", ()=>{
    class object{
      constructor(){
        this.x = "hello";
      }
      stop(){
        return false;
      }
    }
    var recognition = new object;
    var savedbackground = "rgb(26, 26, 26)";
    const mock = jest.fn(set.recordingEnd);
    document.body.innerHTML =`
    <div id="active-task-container" class="flex-container">
      <div class="task-title">
        <div class="task-left"><b>Task List</b></div>
        <div class="task-right"><b>Estimate</b></div>
      </div>
      <task-component id="task1"></task-component>
    </div> 
    <button id="create" class="cButton">Create</button>
    `
    document.body.style.background = "rgba(0,0,0,0.1)";
    mock(recognition, savedbackground);
    expect(mock).toHaveBeenCalled();
    expect(document.body.style.background).toEqual("rgb(26, 26, 26)");
    expect(document.getElementById("active-task-container").style.background).toEqual("");
    expect(document.body.style.pointerEvents).toEqual("all");

  });

});
