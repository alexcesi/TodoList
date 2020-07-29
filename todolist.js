//date
const date = document.getElementById('date');
const options = {weekday: "long", month: "long", day: "numeric"}
const today = new Date();
date.innerHTML = today.toLocaleDateString("fr-rouen", options);

// variables
let id = 0;
const list = document.querySelector('#list');


class UI{
    //affichage
    static displayToDo(){
        const todos = Store.getToDos();
        todos.forEach((todo) => UI.addToDoToList(todo.text, todo.id, todo.completed));
    }

    // ajout d'un todo à la liste
    static addToDoToList(toDo, id, ifChecked){
        // 
        const completed = ifChecked ? 'checkedLine' : '';
        const statusIcon = ifChecked ? 'fa-check-circle' : 'fa-circle';
        const liItem = `<li>
        <p class="text ${completed}">${toDo}</p>
        <i class="far ${statusIcon} co" action="complete" id="${id}"></i>
        <i class="far fa-trash-alt" action="delete" id="${id}"></i>
        </li>`;
        const position = "beforeend";
        list.insertAdjacentHTML(position, liItem);
    }

    // supprimer un todo
    static removeToDo(element){
        // effacer l'affichage
        element.parentNode.parentNode.removeChild(element.parentNode);
        
        // recupere la valeur de l'id et le supprime du localstorage
        const curId = element.attributes.id.value;
        const todos = Store.getToDos();
        todos.forEach((todo, index) => {
            if(+todo.id === +curId){
                todos.splice(index, 1);
            }
        });

        localStorage.setItem('toDo', JSON.stringify(todos));
    }

    // tache réalisée
    static completeToDo(element){
        const CHECK = "fa-check-circle";
        const UNCHECK = "fa-circle";
        element.classList.toggle(CHECK);
        element.classList.toggle(UNCHECK);
        element.parentNode.querySelector(".text").classList.toggle("checkedLine");

        // mettre a jour le localstorage
        const curId = element.attributes.id.value;
        const todos = Store.getToDos();
        todos.forEach((todo, index) => {
            if(+todo.id === +curId){
                todos[index].completed = todos[index].completed ? false : true;
            }
        });

        localStorage.setItem('toDo', JSON.stringify(todos));
    }

    // bonus effacer toute la liste
    static clearToDo(){
        list.innerHTML = '';
        localStorage.clear();
    }
}


class Store{
    static getToDos(){
        let todos;
        if(localStorage.getItem('toDo') === null){
            todos = [];
        }else{
            todos = JSON.parse(localStorage.getItem('toDo'));
        }
        return todos;
    }

    static addToDoToList(toDo, id){

        const todos = Store.getToDos();

        todos.push({text: toDo, id: id, completed: false});

        localStorage.setItem('toDo', JSON.stringify(todos));
    }
}

// event affichage
document.addEventListener('DOMContentLoaded', UI.displayToDo);

// validation avec la touche entrée
document.addEventListener("keyup", function(){
    if(event.keyCode == 13){
        const toDoItem = input.value;
       
        if(toDoItem){
            // ajout todo à l'affichage
            UI.addToDoToList(toDoItem, Date.now());

            // ajout todo au localstorage
            Store.addToDoToList(toDoItem, Date.now());

            // incrementation
            id++;
        }
        input.value = "";
    }
});

list.addEventListener("click", (event) => {
    
    const element = event.target;
    if(element.attributes.action){
        const elementAction = element.attributes.action.value;
        if(elementAction == "complete"){
            UI.completeToDo(element);
        }else if(elementAction == "delete"){
            UI.removeToDo(element);
        }
    }
});



