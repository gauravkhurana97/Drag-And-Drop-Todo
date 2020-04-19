//localstorage

localStorage.getItem('');

function updateStorage(work) {
   var storetodos = JSON.stringify(work);
   localStorage.setItem('gaurav_khurana_drag_and_drop_todos', storetodos);
}

function getStorage() {
   if (localStorage.getItem('gaurav_khurana_drag_and_drop_todos')) {
      var getTodos = JSON.parse(localStorage.getItem('gaurav_khurana_drag_and_drop_todos'));
      return getTodos;
   } else {
      return {
         todos: [],
         doing: [],
         done: []
      };
   }
}

function clearStorage() {
   localStorage.removeItem('gaurav_khurana_drag_and_drop_todos');
}


const work = getStorage();

function getArray(whichArray) {
   if (whichArray == "todos") {
      editthis = work.todos;
   } else if (whichArray == "doing") {
      editthis = work.doing;
   } else {
      editthis = work.done;
   }
   return editthis;
}


function drag(ev) {
   console.log(ev.target.id);
   ev.dataTransfer.setData("text", ev.target.id);
   ev.dataTransfer.setData("makechange", ev.target.parentNode.parentNode.parentNode.className);
}

function allowDrop(ev) {
   ev.preventDefault();
}

function getTodo(arr, data) {
   return arr.find((todo) => {
      return todo.id1 == data;
   });
}

function filterTodo(arr, data) {
   const newarr = arr.filter((todo) => {
      return todo.id1 != data;
   });
   return newarr;

}



function drop(ev) {
   ev.preventDefault();
   var src = ev.dataTransfer.getData("makechange");
   var dest = ev.target.parentNode.parentNode.className;
   var removefromhere = src;
   var addinthisarray = getArray(dest);
   var data = ev.dataTransfer.getData("text");
   var edit_it = getArray(removefromhere);


   if ((src == "todos" || src == "done" || src == "doing") && (dest == "todos" || dest == "done" || dest == "doing")) {
      if (edit_it != addinthisarray) {
         console.log(src + " " + dest);

         var drag_part = getTodo(edit_it, data);
         new_edited_array = filterTodo(edit_it, data);
         addinthisarray.push(drag_part);
         console.log(new_edited_array + " " + addinthisarray);


         work[src] = [...new_edited_array];
         work[dest] = [...addinthisarray];


      } else {
         console.log("are u MAD")
      }
      updateStorage(work);
      renderTodos();

   }






}


class ListModal {


   constructor(content, state) {
      this.id1 = uuidv4(),
         this.id2 = uuidv4(),
         this.state = state,
         this.cont = content,
         this.createdAt = Date.now(),
         this.editedAt = Date.now()
   }

   addlist() {

      if (this.state === "Pending") {
         work.todos.push(this);
      } else if (this.state === "Done") {
         work.done.push(this);
      } else {
         work.doing.push(this);
      }

      updateStorage(work);
      renderTodos();

   }
}




const DOMSTRING = {
   workadder: document.querySelector(".enterWork"),
   work: document.querySelector("#what_work"),
   type_of_work: document.querySelector("#type_of_work")

}

DOMSTRING.workadder.addEventListener('submit', (event) => {

      event.preventDefault();
   document.getElementById("check").blur();
   // event.target.focus = none;
   var inputvalue = DOMSTRING.work.value;
   var state = DOMSTRING.type_of_work.options[DOMSTRING.type_of_work.selectedIndex].value;
   console.log(state);
   var newList = new ListModal(inputvalue, state);
   console.log(newList);
   newList.addlist();


   DOMSTRING.work.value = "";
})

function upTo(el, tagName) {
   tagName = tagName.toLowerCase();

   while (el && el.parentNode) {
      el = el.parentNode;
      if (el.tagName && el.tagName.toLowerCase() == tagName) {
         return el;
      }
   }
   return null;
}


function getArrayName(tagName) {
   var parent = "div";
   var parentele = upTo(tagName, parent);
   var whichArray = parentele.className;
   return getArray(whichArray);
}


document.querySelector(".wrapper_todos").addEventListener("click", (event) => {

   event.preventDefault();

   if (event.target.closest(".edit")) {

      var p = event.target.closest(".btn").previousElementSibling;
      console.log(p);
      var id2 = p.id;
      p.readOnly = false;
      p.focus();
      p.setSelectionRange(p.value.length, p.value.length, "forward");

      var tagName = event.target.closest("fieldset");


      var editthis = getArrayName(tagName);


      console.log(id2);
      p.addEventListener("change", (event) => {
         // if (event.keyCode === 13) {
         event.preventDefault();

         console.log(id2);
         var x = editthis.findIndex((todo) => {
            return todo.id2 == id2;
         });

         if (x != -1) {
            editthis[x].cont = event.target.value;
         }
         console.log(x);

         updateStorage(work);
         renderTodos();

         // }

      })
   }

   if (event.target.closest(".delete")) {

      var id1 = event.target.closest(".single_list").id;

      var tagName = event.target.closest("fieldset");


      var editthis = getArrayName(tagName);



      var indx = editthis.findIndex((todo) => {
         return todo.id1 == id1;
      });


      if (indx != -1) {
         editthis.splice(indx, 1);
      }

      updateStorage(work);
      renderTodos();
   }


});





const renderlist = (todo, index) => {
   index++;
   const markUP = `<div id="${todo.id1}" class="single_list" draggable="true" ondragstart="drag(event)" ><span>${index}</span><input id="${todo.id2}" class="edittodo" type="text" value="${todo.cont}"  readonly/><div class = "btn"><button class ="edit"><img src="./edit-24px.svg" alt="edit"></button><button class="delete"><img src="./delete_forever-24px.svg" alt="edit"></button></div></div>`;

   return markUP;
}

const renderTodos = () => {

   document.querySelector(".todos fieldset .allTODOLists").innerHTML = "";
   document.querySelector(".doing fieldset .allTODOLists").innerHTML = "";
   document.querySelector(".done fieldset .allTODOLists").innerHTML = "";


   var alltodo = work.todos.map((todo, index) => {
      if (todo != null) return renderlist(todo, index);
   })

   var alldoing = work.doing.map((todo, index) => {
      if (todo != null) return renderlist(todo, index);
   })

   var alldone = work.done.map((todo, index) => {
      if (todo != null) return renderlist(todo, index);
   })


   var alltodo = alltodo.join('');
   var alldoing = alldoing.join('');
   var alldone = alldone.join('');

   document.querySelector(".todos fieldset .allTODOLists").insertAdjacentHTML('afterbegin', alltodo);
   document.querySelector(".doing fieldset .allTODOLists").insertAdjacentHTML('afterbegin', alldoing);
   document.querySelector(".done fieldset .allTODOLists").insertAdjacentHTML('afterbegin', alldone);


}

renderTodos();