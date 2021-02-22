const localStorage = window.localStorage;

/**
 * Populates the tasks completed and tasks left to do
 * by checking the tasks stored in local storage once
 * the page loads
 */
window.addEventListener('DOMContentLoaded', () => {
    populateTasks();
});

/**
 * Using the local storage, populates the two ordered lists containing
 * completed and uncompleted tasks.
 */
function populateTasks(){
    const completedItems = document.getElementById('complete-items');
    const uncompletedItems = document.getElementById('uncomplete-items');
    if (!localStorage.getItem('tasks')) {
        //console.log("There are no tasks in the storage?");
        checkEmpty();
    }
    else {
        const data = JSON.parse(localStorage.getItem('tasks'));
        for (let i = 0; i < data.length; i++ ) {
            if (data[i].complete === true){
                let item = completedItems.appendChild(document.createElement("li"));
                item.setAttribute('class', 'li-task');
                item.textContent = `${data[i].name} (${data[i].pomos} pomos)`;
            }
            else if (data[i].complete === false){
                let item = uncompletedItems.appendChild(document.createElement("li"));
                item.setAttribute('class', 'li-task');
                item.textContent = `${data[i].name} (${data[i].pomos} pomos)`;
            }
        }
        checkEmpty();
    }
}


/**
 * Checks to see whether either the completed items or uncompleted items 
 * arrays are empty or not and appropriately adds a message if so
 */
function checkEmpty(){
    const completedItems = document.getElementById('complete-items');
    const uncompletedItems = document.getElementById('uncomplete-items');
    let complete_count = completedItems.childNodes.length - 1;
    let uncomplete_count = uncompletedItems.childNodes.length - 1;
    const message = document.getElementById('message');
    if (complete_count <= 0) {
        let complete_error = completedItems.appendChild(document.createElement("p"));
        complete_error.setAttribute('class', 'p-body');
        complete_error.textContent = `No tasks completed`;
        
    }
    if (uncomplete_count <= 0) {
        let uncomplete_error = uncompletedItems.appendChild(document.createElement("p"));
        uncomplete_error.setAttribute('class', 'p-body');
        uncomplete_error.textContent = `No tasks uncompleted`;
        if (complete_count > 0) {
            message.textContent = `Congratulations! You finished all your tasks this session!`;
        }
    }
}

module.exports = {populateTasks, checkEmpty}