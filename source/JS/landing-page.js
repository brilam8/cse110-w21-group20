document.getElementById("to-how-to").addEventListener('click', ()=>
{
    window.location.href = "./how-to-page.html";
    //window.location.replace("./how-to-page.html");
});

document.getElementById("to-set-up").addEventListener('click', ()=>
{
    //change to href due to no button back, so it allows for back
    window.location.href = "./setup-active-break-pages.html";
    //window.location.replace("./setup-active-break-pages.html");
});


//fun facts array container
let facts = ['Fun Fact: Pomodoro means Tomato in Italian!',
            'Fun Fact: Francesco Cirillo was the original creator of the Pomodoro Timer!', 
            'Fun Fact: The Pomodoro timer was inspired by a tomato shaped timer!', 
            "Remember: The Pomodoro timer's biggest strength is its simplicity!"];

//variable for keeping track of index of fun facts
let index = 0;

//Updates the fun facts so that it cycles through them all
setInterval(function()
{
    if (index >= facts.length) index = 0;
    document.getElementById('fun-facts').innerHTML = facts[index];
    index++;
}, 5000);

