let gorevListesi = [];

if (localStorage.getItem("gorevListesi") != null) {
    gorevListesi = JSON.parse(localStorage.getItem("gorevListesi"));
}

let editId;
let isEditTask = false;

const taskİnput = document.querySelector("#txtTaskName");
const btnClear = document.querySelector("#btnClear");
const filters = document.querySelectorAll(".filters span");

function displayTasks(filter) {
    let ul = document.getElementById("task-list");
    ul.innerHTML = "";
    
    if(gorevListesi.length == 0) {
        ul.innerHTML= "<p class='p-3 m-0'>Görev Listesi Boş!</p>"
    }
    else {
        for (let gorev of gorevListesi) {
        let completed = gorev.durum == "completed" ? "checked" : "" ;
        if (filter == gorev.durum || filter == "all") {
            let li =
            `<li class="task list-group-item">
                <div class="form-check">
                    <input onclick="updateStatus(this)" type="checkbox" id="${gorev.id}" class="form-check-input" ${completed}>
                    <label for="${gorev.id}" class="form-check-label ${completed}">${gorev.gorevAdi}</label>
                </div>
                <div class="dropdown">
                    <button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis"></i>
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><a onclick="deleteTask(${gorev.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash"></i> Sil</a></li>
                        <li><a onclick='editTask(${gorev.id}, "${gorev.gorevAdi}")' class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Düzenle</a></li>
                    </ul>
                </div>
            </li>`;
            ul.insertAdjacentHTML("beforeend", li);
        }
        }
    }

}

displayTasks("all");

document.querySelector("#btnAddNewTask").addEventListener("click", tiklama);

//Enter basınca ekleme kodu
document.querySelector("#btnAddNewTask").addEventListener("click", function(){
    if (event.key == "Enter") {
        document.getElementById("btnAddNewTask").click();
    }
});

for (let span of filters) {
    span.addEventListener("click", function() {
        document.querySelector("span.active").classList.remove("active");
        span.classList.add("active");
        displayTasks(span.id);
    });
}

function tiklama() {
    if (taskİnput.value == "") {
        alert("Görev alanı boş bırakılamaz!");
    }
    else {
        if (!isEditTask) {
            //ekleme
            gorevListesi.push({"id": gorevListesi.length + 1, "gorevAdi": taskİnput.value, "durum": "pending"}); //taskinput.value değer almamızı sağlayan operatör
        }
        else {
            //güncelleme
            for (let gorev of gorevListesi) {
                if (gorev.id == editId) {
                    gorev.gorevAdi = taskİnput.value;
                }
                isEditTask = false;
            }
        }
        taskİnput.value = "";
        displayTasks(document.querySelector("span.active").id);
        localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
    }
    event.preventDefault();
}

function deleteTask(id) {
    let deleted;
    
    // 1.YOL
    for (let index in gorevListesi) {
        if (gorevListesi[index].id == id) {
            deleted = index;
        }
    }

    // 2.YOL
    // deleted = gorevListesi.findIndex(function (gorev) {
    //     return gorev.id == id;
    // });

    // 3.YOL - Arrow Function
    //deleted = gorevListesi.findIndex(gorev => gorev.id == id) 

    gorevListesi.splice(deleted,1);
    displayTasks(document.querySelector("span.active").id);
    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
};

function editTask (taskId, taskName) {
    editId = taskId;
    isEditTask = true;
    taskİnput.value = taskName;
    taskİnput.focus();
    taskİnput.classList.add("active");
}

btnClear.addEventListener("click", function() {
    gorevListesi.splice(0, gorevListesi.length);
    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
    displayTasks("all");
});

function updateStatus(selectedTask) { //this metodu var olan yeri verir, selectedtask ile aldık..
    let label = selectedTask.nextElementSibling;
    let durum;

    if (selectedTask.checked) {
        label.classList.add("checked");
        durum = "completed";
    }
    else {
        label.classList.remove("checked");
        durum = "pending";
    }

    for (let gorev of gorevListesi) {
        if(gorev.id == selectedTask.id) {
            gorev.durum = durum;
        }
    }
    displayTasks(document.querySelector("span.active").id);
    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
}