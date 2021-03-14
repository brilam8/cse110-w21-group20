# Build Process

## On push to "dev" branches

On any push to development branches (including individual feature branches), three tests are run: 
<ol>
  <li> <b>HTMLHint,</b> which checks style and format of HTML files </li>
  <li> <b>ESLint,</b> which checks style and format of JavaScript files </li>
  <li> <b>StyleLint,</b> which checks style and format of CSS files. </li>
</ol>

## On pull request from "dev" branches

On any pull request FROM development branches (including individual feature branches), five tests are run:
<ol>
  <li> <b>HTMLHint,</b> which checks style and format of HTML files </li>
  <li> <b>ESLint,</b> which checks style and format of JavaScript files </li>
  <li> <b>StyleLint,</b> which checks style and format of CSS files. </li>
  <li> <b>Cypress,</b> which runs all of our Cypress tests, covering end-to-end testing. </li>
  <li> <b>Jest,</b> which runs all of our Jest tests, covering unit testing for our application. </li>
</ol>

Code coverage percentage is also shown on the pull request as a comment after the Cypress and Jest tests are ran.
If any one of these processes fail, the pull request will not be available to merge until the issues are fixed.


In addition to these tests, we also use Codefactor for code quality and also have one final step in our build pipeline.
We added automatic Electron application building into our pipeline, so whenever a pull request is made to update our web application,
we rebuild our Electron app, which you can then download from the web application itself.

## On push to "main" branch

Finally, on a push to the main branch, we generate documentation for our web application using JSDocs and a JSDocs template.
The documentation is generated and then pushed to a separate branch called "docs" in our repository.
