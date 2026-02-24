function getData(id) {
    let newStudent = { id: id };
    inputs.forEach(input => {
        let name = input.name;
        newStudent[name] = input.value;
    })
    return newStudent;
}

//* show student
function showStudent(student) {
    tbody.innerHTML += `
        <tr data-index = "${student.id}">
            <th scope="row">${student.id}</th>
            <td>${student.firstName}</td>
            <td>${student.lastName}</td>
            <td>${student.email}</td>
            <td>${student.age}</td>
            <td>${student.phone}</td>
            <td>
                <button class="btn btn-info text-light" onclick="insertStudentIntoForm(${student.id})" ><i class="fa-solid fa-pen-to-square text-light"></i> Edit</button>
                <button class="btn btn-danger" onclick="showpopup(${student.id})"><i class="fa-solid fa-trash text-light"></i> Delete</button>
            </td>
        </tr>

    `
}

//* show All data
function showStudents(students) {
    tbody.innerHTML = "";
    students.forEach(student => {
        showStudent(student);
    })
}

//* show error
function showError(messageError, input) {
    messageError.classList.remove("d-none");
    input.classList.add("is-invalid");
    input.classList.add("valid");
}

function assignRegex(inputName) {
    let regex;
    switch (inputName) {
        case "firstName":
        case "lastName":
            regex = /^(\s)*[A-Za-z]{3,}(\s)*$/;
            return regex;

        case "email":
            regex = /^[A-Za-z]+[a-zA-z0-9\.\-_]*@(gmail\.com|yahoo\.com)[\s]*$/;
            return regex;

        case "age":
            regex = /^[0-9]{1,2}$/;
            return regex;

        case "phone":
            regex = /^(\+20|0)1[0125][0-9]{8}$/;
            return regex;

        default:
            break;
    }

}

//* validate
function checkValidateInput(input) {
    let inputName = input.name,
        inputValue = input.value,
        regex = assignRegex(inputName),
        messageError = input.parentElement.nextElementSibling;

    //* if input is empty
    if (inputValue == "") {
        messageError.textContent = "This input is required";
        showError(messageError, input);
    }

    //* if input is First Name and last Name
    else if ((!regex.test(inputValue)) && (inputName == "firstName" || inputName == "lastName")) {
        messageError.textContent = "Invalid Name";
        showError(messageError, input);
    }

    //* if input email
    else if ((!regex.test(inputValue)) && (inputName == "email")) {
        messageError.textContent = "Invalid Email (example@gmail.com)";
        showError(messageError, input);
    }

    //* if input age or phone
    else if ((!regex.test(inputValue)) && (inputName == "age" || inputName == "phone")) {
        messageError.textContent = "Invalid Number";
        showError(messageError, input);
    }

    //* if valid input
    else {
        messageError.classList.add("d-none");
        input.classList.add("is-valid");
        input.classList.add("success");
        input.classList.remove("valid");
        input.classList.remove("is-invalid");
    }

}

//* convert form to add
function convertToAdd() {
    form.dataset.type = "add";
    btn.textContent = "Add Student";
    btn.classList.add("btn-success");
    btn.classList.remove("btn-info", "text-light");
    let html = document.querySelector("html");
    html.style.removeProperty("--main-color");
}

//* convert form to Edit 
function convertToEdit(id) {
    let btnclearInput = btnClear.querySelector("button");
    form.dataset.type = "edit";
    form.setAttribute("data-student-index", id);
    btn.textContent = "Edit Student";

    btn.classList.remove("btn-success");
    btn.classList.add("btn-info", "text-light");

    btnclearInput.classList.remove("btn-success");
    btnclearInput.classList.add("btn-info", "text-light");

    let html = document.querySelector("html");
    html.style.setProperty("--main-color", "#0dcaf0");
}

//* reset form
function resetForm() {
    form.reset();
    inputs.forEach(input => {
        input.classList.remove("is-invalid");
        input.classList.remove("is-valid");
        input.classList.remove("success");
        input.classList.remove("valid");
        input.parentElement.nextElementSibling.classList.add("d-none");
    })
    btnClear.classList.add("d-lg-none");
    btnClear.classList.remove("d-lg-flex");
    iconReset.classList.add("d-none");

    let btnTable = document.querySelectorAll("#Results .student-table button");
    btnTable.forEach(btn => {
        btn.disabled = false;
    })

    let btnclearInput = btnClear.querySelector("button");
    btnclearInput.classList.add("btn-success");
    btnclearInput.classList.remove("btn-info", "text-light");

    convertToAdd();
}


//* update local storage
function updateLocalStorage() {
    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("id", id);
}

//* Delet student 
function deletStudent(id) {
    students = students.filter(student => student.id != id);
    updateLocalStorage();
    let select = tbody.querySelector(`tr[data-index = "${id}"]`) ?? undefined;
    select?.remove();
    isEmpty(students);
}

//* Edit student
function insertStudentIntoForm(id) {
    resetForm();
    let editStu = students.find(student => student.id == id);
    inputs.forEach(input => {
        input.value = editStu[input.name];
    })
    convertToEdit(id);
    iconReset.classList.remove("d-none");

    let btnTable = document.querySelectorAll("#Results .student-table button");
    btnTable.forEach(btn => {
        btn.disabled = true;
    })
}

//* add student
function addStudent() {
    //* insert data     
    let student = getData(++id);
    showStudent(student);
    students.push(student);

    //* update local storage
    updateLocalStorage();

    //* reset form
    resetForm();

    //* show alert if no data is found
    isEmpty(students);
}

//* Edit Student
function editStudents() {
    let currentId = form.dataset.studentIndex,
        TrEle = document.querySelector(`tr[data-index="${currentId}"]`),
        student = getData(currentId),
        indexForstudent = students.findIndex(index => index.id == currentId);

    students[indexForstudent] = student;
    updateLocalStorage();
    TrEle.innerHTML =
        `
        <th scope="row">${student.id}</th>
        <td>${student.firstName}</td>
        <td>${student.lastName}</td>
        <td>${student.email}</td>
        <td>${student.age}</td>
        <td>${student.phone}</td>
        <td>
            <button class="btn btn-info text-light" onclick="insertStudentIntoForm(${student.id})" ><i class="fa-solid fa-pen-to-square text-light"></i> Edit</button>
            <button class="btn btn-danger" onclick="showpopup(${student.id})"><i class="fa-solid fa-trash text-light"></i> Delete</button>
        </td>
    `
    resetForm();

    let btnTable = document.querySelectorAll("#Results .student-table button");
    btnTable.forEach(btn => {
        btn.disabled = false;
    });
    iconReset.classList.add("d-none");

    TrEle.classList.add("table-success");
    TrEle.classList.remove("table-light");
    setTimeout(function () {
        TrEle.classList.remove("table-success");
        TrEle.classList.add("table-light");
    }, 1500);
}

//* reset form
function forgetEdit() {
    resetForm();
    let btnTable = document.querySelectorAll("#Results .student-table button");
    btnTable.forEach(btn => {
        btn.disabled = false;
    });
    iconReset.classList.add("d-none");
}

//* show alert if data empty or not found
function isEmpty(data) {
    if (data.length === 0) {
        emptyStudent.classList.remove("d-none");
    } else {
        emptyStudent.classList.add("d-none");
    }
}

function showpopup(id) {
    popupDelete.classList.add("active");
    btnDelete.addEventListener("click", function () {
        deletStudent(id);
        hidepopup();
        setTimeout(function () {
            showConfirm();
        }, 500);
    });
}

function showConfirm() {
    let header = popupDelete.querySelector("#head"),
        parEle = popupDelete.querySelector("p"),
        img = popupDelete.querySelector("img"),
        btnSave = popupDelete.querySelector(".save");
    btnSave.classList.add("d-none");
    header.textContent = "Deleted!";
    parEle.textContent = "Your file has been deleted"
    btnCancel.textContent = "OK";
    btnCancel.classList.add("btn-success");
    img.setAttribute("src", "images/correct.gif");
    btnDelete.classList.add("d-none");
    showpopup();
}

function hidepopup() {
    popupDelete.classList.remove("active");
    setTimeout(function () {
        resetPopup();
    }, 400);
}

function resetPopup() {
    let header = popupDelete.querySelector("#head"),
        parEle = popupDelete.querySelector("p"),
        img = popupDelete.querySelector("img"),
        btnSave = popupDelete.querySelector(".save"),
        btnDontSave = popupDelete.querySelector(".dontSave");
    btnSave.classList.add("d-none")
    header.textContent = "Are you sure?";
    parEle.textContent = "You won't be able to revert this!"
    btnCancel.textContent = "No, cancel";
    img.setAttribute("src", "images/delete.gif");
    header.classList.remove("mb-4");
    btnDelete.classList.remove("d-none");
    btnDelete.classList.remove("d-none");
    btnDontSave.classList.add("d-none");
    parEle.classList.remove("d-none");
};

function showConfirmEdit() {
    let header = popupDelete.querySelector("#head"),
        parEle = popupDelete.querySelector("p"),
        img = popupDelete.querySelector("img"),
        btnSave = popupDelete.querySelector(".save"),
        btnDontSave = popupDelete.querySelector(".dontSave");
    btnSave.classList.remove("d-none");
    header.textContent = "Do you want to save the changes?";
    header.classList.add("mb-4");
    btnDelete.classList.add("d-none");
    btnDontSave.classList.remove("d-none");
    parEle.classList.add("d-none");
    btnCancel.textContent = "cancel";
    img.setAttribute("src", "images/edit.gif");

    //* reset form
    btnDontSave.addEventListener("click", function () {
        resetForm();
        hidepopup();

        //* remove disable from input
        let btnTable = document.querySelectorAll("#Results .student-table button");
        btnTable.forEach(btn => {
            btn.disabled = false;
        });
    });

    //* show popup
    showpopup();
}