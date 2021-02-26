# Should we merge the settings page with the setup page - and then the setup page with the timer pages? Yes.

* Status: accepted
* Deciders: Ari, Jack, Megan, Jiahong, Brian, Iain, Zongchen, Tommy
* Date: 2021-02-25

## Context and Problem Statement

How can we get the timer on the timer pages to automatically start from the set-up page?
It seems like the settings page and the set-up both had settings and the settings page did not have very much possible modifications, so we can merge
the two pages together.
We can merge all of these pages together to solve both issues at the same time and also reduce the number of files/pages that we have to manage.

## Considered Options

* Merge the pages together
* Find a way to set a "flag" so the timer would automatically begin

## Decision Outcome

Chosen option: "Merge the pages together", because this is not only the simplest solution to both of our issues, but it also decreases the number
of page files that we have to work with along with load times between pages in our Pomodoro Timer.

### Positive Consequences <!-- optional -->

* Decreases the number of files that we have to manage/work with.
* Decreased load times between pages.
* Allows us to auto-start the timer straight from the set-up page in a simple fashion.

### Negative Consequences <!-- optional -->

* The one file that houses all of the merged pages will now have a lot more code and logic in it.
* Set-up can get a little too cluttered for the user if we bring in more settings.
* If we mess someting up with one of the merged pages it may break all three.
* Local storage can be slightly more difficult to work with
