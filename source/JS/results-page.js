localStorage = window.localStorage;
completedItems = document.getElementById('complete-items');
uncompletedItems = document.getElementById('uncomplete-items');

window.addEventListener('DOMContentLoaded', () => {
    
    if (!localStorage.getItem('tasks')) {
        console.log("There are no tasks in the storage?");
        updateCount();
      //window.location.replace("landing-page.html");
    }
    else {
        data = JSON.parse(localStorage.getItem('tasks'));
        for (let i = 0; i < data.length; i++ ) {
            console.log(data[i]);
            if (data[i].complete === true){
                let item = completedItems.appendChild(document.createElement("li"));
                item.setAttribute('class', 'item');
                item.textContent = `${data[i].name} (${data[i].pomos} pomos)`;
            }
            else if (data[i].complete === false){
                let item = uncompletedItems.appendChild(document.createElement("li"));
                item.setAttribute('class', 'item');
                item.textContent = `${data[i].name}`;
            }
        }
        updateCount();
    }
    //console.log(data[0])
    
});

function updateCount(){
    let complete_count = completedItems.childNodes.length - 1
    let uncomplete_count = uncompletedItems.childNodes.length - 1
    if (complete_count <= 0) {
        let complete_error = completedItems.appendChild(document.createElement("p"));
        complete_error.setAttribute('class', 'item');
        complete_error.textContent = `No completed tasks`;
        
    }
    if (uncomplete_count <= 0) {
        let uncomplete_error = uncompletedItems.appendChild(document.createElement("p"));
        uncomplete_error.setAttribute('class', 'item');
        uncomplete_error.textContent = `No tasks uncompleted`;
    }
}