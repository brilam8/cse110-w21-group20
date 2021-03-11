
const land = require('../JS/landing-page');
global.window = { location: { pathname: null } };

describe ('test landing page', () => {
  test('redirects to how to page', () => {
    delete window.location;
    window.location = { href: jest.fn() }

    const mock = jest.fn(land.toHowTo);
    mock();
    expect(window.location.href).toEqual('./how-to-page.html');
  });

  test('redirects to set-up page', () => {
    delete window.location;
    window.location = { href: jest.fn() }

    const mock = jest.fn(land.toSetUp);
    mock();
    expect(window.location.href).toEqual('./setup-active-break-pages.html');
  });

  test('different osSupport', () => {
    document.body.innerHTML = 
    `
    <a id="download-wepomo" href="" style="color: #fff; position: fixed; transform: translateY(170px);" download>download wepomo</a>
    `
    expect(document.getElementById("download-wepomo").href).toEqual("http://localhost/");
    const mock = jest.fn(land.osSupport);
    mock();
    expect(document.getElementById("download-wepomo").href).toEqual("http://localhost/wepomo-win32-x64.zip");
  });
  test('rotate through facts', () => {
    document.body.innerHTML = 
    `
    <div id="fun-facts">Fun Fact: Pomodoro is Tomato in Italian!</div>
    `
    const mock = jest.fn(land.funFacts);
    mock();
    expect(document.getElementById('fun-facts').innerHTML).toEqual("Fun Fact: Pomodoro means Tomato in Italian!");
    mock();
    expect(document.getElementById('fun-facts').innerHTML).toEqual('Fun Fact: Francesco Cirillo was the original creator of the Pomodoro Timer!');
    mock();
    expect(document.getElementById('fun-facts').innerHTML).toEqual('Fun Fact: The Pomodoro timer was inspired by a tomato shaped timer!');

  });
});

