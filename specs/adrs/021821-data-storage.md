# Data Storage: Local vs Remote

* Status: Accepted
* Deciders: Full Group
* Date: 2021-02-18


## Context and Problem Statement

How do we want to store information for the site? Specifically for tasks that the user creates: what information do we want to keep and how do we want to keep it?

## Decision Drivers <!-- optional -->

* Easy Use
* Quick access to information

## Considered Options

* Local Storage
* Remote Storage


## Decision Outcome

Chosen option: Local Storage because we all have practice with local storage and it gives quick access to the data.

### Positive Consequences <!-- optional -->

* Consistent code for everybody, people understand how to use this without need for explanation

#### Task Information
* Data needed to be stored for each task is as follow
```
{ 
id: 1 (Order of tasks follows the ids)
task-description: "text about task"
expected-pomos: 1 (Assigned by the user on the setup page)
actual-pomos: 0 (Update this if the current task is true and the user moves to the break page)
current-task: false (First task implemented)
completed-task: false (If the task is checked off make this true)
}
```
