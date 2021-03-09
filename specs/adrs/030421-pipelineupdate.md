# Testing is difficult, Electron app doesn't get built on pipeline. Solution - add Cypress testing and Electron app building to our pipeline

* Status: accepted
* Deciders: Ari, Jack, Megan, Jiahong, Brian, Iain, Zongchen, Tommy
* Date: 2021-03-04

## Context and Problem Statement

It was difficult to test our functions and pages that manipulated the DOM directly using Jest. After doing the testing Lab and some exploratory coding, we found Cypress
to be a lot easier to use to test our pages. In addiiton, our Electron app had to be manually built after every update - by including some automated way of
building it in our pipeline we can have it automatically build after each update.

## Decision Drivers

* Testing DOM manipulation was difficult using only Jest
* Had to manually build our Electron app after each update

## Considered Options

* Add Cypress to pipeline and add Electron app building to pipeline
* Try to stick with only using Jest and manually build Electron app

## Decision Outcome

Chosen option: Add Cypress to pipeline and add Electron app building to pipeline, because
this streamlines both the testing process for our application that manipulates the DOM in complicated ways in addition to automating our Electron
app production after every update.

### Positive Consequences

* Easier testing overall for all pages and functions
* We do not need to manually build our Electron app after every update

### Negative Consequences

* Pipeline can get more complicated
* Github has unexpected behavior when commiting large files to the repository

## Pros and Cons of the Options

### Add Cypress to pipeline and add Electron app building to pipeline

* Good, because it builds upon our pipeline and ensures that development code does not break any existing parts of our site
* Good, because we do not need to manually build out Electron app anymore
* Bad, because it makes our pipeline more complicated

### Try to stick with only using Jest and manually build Electron app

* Good, because it keeps our pipeline simpler and easier to understand
* Bad, because Jest caused some issues with testing our web pages, especially some that manipulated the DOM
* Bad, because we have to manually build our Electron app after every update

