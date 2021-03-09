
const how = require('../JS/how-to-page');
global.window = { location: { pathname: null } };

describe ('redirect buttons', () => {
  test('redirects to landing page', () => {
    document.body.innerHTML =
    `
    <a href="landing-page.html" id="to-home-page">
      <button class="wb-button">Home Page</button>
    </a>

    `
    delete window.location;
    window.location = { href: jest.fn() }

    const mock = jest.fn(how.toLanding);
    mock();
    expect(window.location.href).toEqual('./landing-page.html');
  });

  test('redirects to set-up page', () => {
    document.body.innerHTML =
    `
    <a href="setup-active-break-pages.html" id="to-set-up-page">
      <button class="wb-button">Set Up</button>
    </a>

    `
    delete window.location;
    window.location = { href: jest.fn() }

    const mock = jest.fn(how.toSetUp);
    mock();
    expect(window.location.href).toEqual('./setup-active-break-pages.html');
  });
});

