
describe ('redirect buttons', () => {
  test('redirects to landing page', () => {
    document.body.innerHTML =
    `
    <a href="landing-page.html" id="to-home-page">
      <button class="wb-button">Home Page</button>
    </a>

    `
    const homeButton = document.getElementById("to-home-page");
    expect(homeButton.getAttribute('href')).toEqual('landing-page.html');
  });

  test('redirects to set-up page', () => {
    document.body.innerHTML =
    `
    <a href="setup-active-break-pages.html" id="to-set-up-page">
      <button class="wb-button">Set Up</button>
    </a>

    `
    const setupButton = document.getElementById("to-set-up-page");
    expect(setupButton.getAttribute('href')).toEqual('setup-active-break-pages.html');
  });
});

