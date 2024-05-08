const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupTitle= popupBox.querySelector("header p"),
closeIcon = popupBox.querySelector("header i"),
titleTag = popupBox.querySelector("input"),
descTag = popupBox.querySelector("textarea"),
addBtn = popupBox.querySelector("button"),
modal = document.getElementById("modal"),
modalContent = document.getElementById("modal-content");



const months = ["January","February","March","April","May","June",
               "July","August","September","October","November","December"];
// parsing the input notes stored in local storage to js object 
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;

addBox.addEventListener("click", () =>{
    titleTag.focus();
    popupTitle.innerText = "Add a new Note";
    addBtn.innerText = "Add Note";
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";

});
closeIcon.addEventListener("click", () =>{
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
    
});



function showNotes(){
    document.querySelectorAll(".note").forEach(note => note.remove());
    notes.forEach((note,id) => {
    let liTag = `  <li class="note" data-id = "${id}">
                        <div class="details"> 
                            <p>${note.title}</p>
                                <span>${note.description}</span>
                            </div>
                                <div class="bottom-content">
                                    <span>${note.date}</span>
                                    <div class="settings">
                                    <i onclick = "showMenu(this)" class="uil uil-ellipsis-h" ></i> 
                                    <ul class="menu">
                                        <li onclick = "updateNote(${id}, '${note.title}', '${note.description}')"> <i class="uil uil-pen"></i>Edit</li>
                                        <li onclick = "deleteNote(${id})"> <i class="uil uil-trash"></i>Delete</li>
                                    </ul>
                                </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend",liTag);
    });
}
showNotes();

function openModal(noteContent) {
    modalContent.innerHTML = noteContent;
    modal.style.display = "block";
    
    }


document.querySelectorAll(".note").forEach((note) => {
    note.addEventListener("click", (event) => {
        const id = parseInt(note.getAttribute("data-id"));
        // Check if the click target is not the settings menu icon
        if (!event.target.classList.contains("uil-ellipsis-h") &&
    !event.target.classList.contains("uil-pen") &&
    !event.target.classList.contains("uil-trash") &&
    !event.target.closest(".menu")) {
            const noteContent = note.innerHTML; // Get the content of the clicked note
            openModal(noteContent);    
        }
        
    });
});
// Event listener for the "Edit" option
document.querySelectorAll(".menu li").forEach((editOption) => {
    editOption.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent click event from bubbling up to note click event
    });
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

function showMenu(elem){
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e =>{
        //removing the show class from settings menu on doc click 
        if(e.target.tagName != "I" || e.target != elem){
            elem.parentElement.classList.remove("show");
        }
    });
}


function deleteNote(noteId){
    
    notes.splice(noteId, 1);//removing the selected note
    //saving updated notes to local storage
    localStorage.setItem("notes",JSON.stringify(notes));
    showNotes();
}

function updateNote(noteId, title, description) {
    
    isUpdate = true;
    udpdateId = noteId;
    addBox.click();
    titleTag.value = title;
    descTag.value = description;
    addBtn.innerText = "Update Note";
    popupTitle.innerText = "Update a Note";
    document.querySelectorAll("body").style.overflow = "hidden";
}

addBtn.addEventListener("click", e =>{
    e.preventDefault();
    let noteTitle = titleTag.value.trim(),
    noteDesc = descTag.value.trim();
    
    if(noteTitle || noteDesc){
        let dateObj =  new Date(),
        month =months[ dateObj.getMonth()],
        day = dateObj.getDate(),
        year = dateObj.getFullYear();


        let noteInfo = {
            title: noteTitle,
            description : noteDesc,
            date : `${month} ${day}, ${year}`
        };
        
        if(!isUpdate){
            notes.push(noteInfo);
        }
        else{
            isUpdate = false;
            notes[udpdateId] = noteInfo;
        }
        
        //saving notes to local storage
        localStorage.setItem("notes",JSON.stringify(notes));
        showNotes();
        closeIcon.click(); 
    }
    

});
