# How do we give users a way to track their progress - allow them to print/save their results page!

* Status: accepted
* Deciders: Ari, Jack, Megan, Jiahong, Brian, Iain, Zongchen, Tommy
* Date: 2021-02-21

## Context and Problem Statement

How do we let users track their progress as they work through pomo sessions? 
How do they know what tasks they completed on previous days and what tasks they should continue on today?
Our website needs to have a way for users to track their progress as they complete pomo sessions.

## Decision Drivers

* Users need to be able to track their progress after a pomo session
* Users need to be able to know what tasks they finished the previous session so they can put their uncompleted tasks on the next session

## Considered Options

* Login system and user profiles - history tab to track past pomo sessions
* Allow for users to save their results page (either as a PDF or printing it out)


## Decision Outcome

Chosen Option 2: Allowing for users to save their results page as a PDF or by printing it. We chose this options because
we were not only limited on our time but we also wanted to focus on making our application lightweight, simple, and easily accessible - user 
profiles would instead make our app more complex and increase the barrier to entry (login, remembering password and username, ... etc.).
User profiles also might pose a security risk in terms of saving account details in a location where it would be safe and worrying about
not leaking information out to those who shouldn't be getting them.

### Positive Consequences 

* Users now have a way to save their progress after a pomo session

### Negative Consequences 

* We lose the ability to gather statistics as a user goes through many pomo sessions (like average estimated pomos, average pomos taken, etc.) because
we do not have access to previous pomo sessions

## Pros and Cons of the Options 

### Save results page (or print it)

* Good, because it is not very complex and can be done with vanilla JavaScript through the web browser
* Good, because it is lightweight and easy to access/perform
* Bad, because it decreases the potential of our application in terms of tracking user statistics as they progress through pomo sessions

### User profiles and pomo history

* Good, because it is robust and provides many avenues to expand (statistic gathering, history of pomo sessions, etc.)
* Bad, because authentication and security for user profiles can be complex and may involve bringing in other libraries that may bog our application down
* Bad, because having an account/login system can serve as a barrier of entry to those who just want a small, lightweight pomo timer to use.
