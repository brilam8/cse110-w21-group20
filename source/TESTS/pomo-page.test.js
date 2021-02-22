// sample test
const res = require("../JS/pomo-page");


// sample test
require("../JS/pomo-page");
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

describe('reset function', () => {
  const mock = jest.fn(res.reset);
  test('reseting progressbar', () => {
    document.body.innerHTML = 
    `
    <div class="timer-container">
        <div id="progress-bar" class="progress-bar"></div> 
        <p class="timer" id="timer"></p>
    </div>
    `
    mock();
    const style = getComputedStyle(document.body.innerHTML);
    expect(mock).toHaveBeenCalled();
    expect(style.backgroundColor).toBe('rgba(242, 71, 38, 0.5)');
  })
});