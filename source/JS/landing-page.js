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

var facts = ['Fun Fact: Pomodoro means Tomato in Italian!',
            'Fun Fact: Francesco Cirillo was the original creator of the Pomodoro Timer!', 
            'Fun Fact: The Pomodoro timer was inspiried by a tomato shaped timer!', 
            'Remember: The Pomodoro timer\'s biggest strength is its simplicity!'];

funFacts(1);
function funFacts(index)
{
    let num = index;
    if(num < facts.length)
    {
        setTimeout(function()
        {
            document.getElementById('fun-facts').innerHTML = facts[num];
            num++;
            funFacts(num);
        }, 7000);
    }
    else if(num == facts.length)
    {
        funFacts(num);
    }

}