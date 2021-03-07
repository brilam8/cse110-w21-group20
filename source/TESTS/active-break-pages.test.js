describe('active page', () => {
    test('active', () => {
      document.body.innerHTML = 
        `
      <section id="active-page" class="active-page section-page">
        <p class="p-title">Pomodoro Timer</p>
        <main>
            <div class="timer-container">
                <div id="progress-bar" class="progress-bar"></div> 
                <p class="timer" id="timer"></p>
            </div>
            <div>
                <p id="first-task" class="task">Sample Task 1</p>
            </div>
            
            <button id="pomo-button" class="button">Abort</button>
        </main>
        <a id="to-break-page" href="#break-page" style="visibility: hidden;"></a>
      </section>
      <audio id="beep"><source src="./sounds/Beep.mp3"></audio>
      <audio id="tick"><source src="./sounds/Tick.mp3"></audio>
      <audio id="click"><source src="./sounds/Click.mp3"></audio>
        `;
      expect(document.body.innerHTML).toContain('Pomodoro Timer');
    })
});

describe('break page', () => {
    test('break page', () => {
      document.body.innerHTML = 
    `
    <section id="break-page" class="break-page section-page">
      <p class="p-title">Short Break</p>
      <div class="break-timer-container">
          <div class="timer-container">
              <p class="timer" id="break-timer"></p>
          </div>
          <button id="break-button" class="button">Abort</button>
      </div>
      <div id="break-task-container" class="flex-container">
          <div class="task-title">
              <div class="task-left"><b>Task List</b></div>
              <div class="task-right"><b>Mark Done</b></div>
          </div>
          <!-- <task-component type="checkbox" left-pointer-event="none"></task-component> -->
      </div>
      <a id="to-active-page" href="#active-page" style="visibility: hidden;"></a>
    </section>
    <audio id="beep"><source src="./sounds/Beep.mp3"></audio>
    <audio id="tick"><source src="./sounds/Tick.mp3"></audio>
    <audio id="click"><source src="./sounds/Click.mp3"></audio>
    `;
      expect(document.body.innerHTML).toContain('Short Break');
    })
})

