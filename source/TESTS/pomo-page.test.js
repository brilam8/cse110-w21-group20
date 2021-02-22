// sample test
// const pomo = require("../JS/pomo-page");
global.window = { location: { pathname: null } };

// describe('text here', () => {
//   const mock = jest.fn(res.reset);
//   test('test1', () => {
//     jest.spyOn(window.localStorage.__proto__, 'task');
//     document.body.innerHTML =
//     `
//     <div></div>
//     `;
//   })
// });


test('reseting progressbar', () => {
  document.body.innerHTML = 
  `
  <section id="active-page" class="active-page section-page">
    <p class="p-title">Pomodoro Timer</p>
    <main>
        <div class="timer-container">
            <div id="progress-bar" class="progress-bar" style="width: 300px"></div> 
            <p class="timer" id="timer"></p>
        </div>
        <div>
            <p id="first-task" class="task">Sample Task 1</p>
        </div>
        <button id="pomo-button" class="button">Abort</button>
    </main>
    <a id="to-break-page" href="#break-page" style="visibility: hidden;"></a>
  </section>
  `;
  // const myMock = jest.spyOn(pomo, "reset");
  // const result = myMock();
  // const style = getComputedStyle(document.body.innerHTML);
  expect(document.getElementById("progress-bar").style.width).toBe('300px');
})
