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
                <button class="btn btn-danger" onclick="fireAlert(${student.id})"><i class="fa-solid fa-trash text-light"></i> Delete</button>
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
    form.dataset.type = "edit";
    form.setAttribute("data-student-index", id);
    btn.textContent = "Edit Student";
    btn.classList.remove("btn-success");
    btn.classList.add("btn-info", "text-light");

    let html = document.querySelector("html");
    html.style.setProperty("--main-color", "#0dcaf0");
}

//* reset form
function resetForm() {
    form.reset();
    inputs.forEach(input => {
        input.classList.remove("is-invalid");
        input.classList.remove("is-valid");
        input.parentElement.nextElementSibling.classList.add("d-none");
    })

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
    tbody.querySelector(`tr[data-index = "${id}"]`).remove();
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
            <button class="btn btn-danger" onclick="fireAlert(${student.id})"><i class="fa-solid fa-trash text-light"></i> Delete</button>
        </td>
    `
    resetForm();

    let btnTable = document.querySelectorAll("#Results .student-table button");
    btnTable.forEach(btn => {
        btn.disabled = false;
    })
    iconReset.classList.add("d-none");
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

function isEmpty(data) {
    if (data.length === 0) {
        emptyStudent.classList.remove("d-none");
    } else {
        emptyStudent.classList.add("d-none");
    }
}

function fireAlert(id) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        buttonsStyling: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
        background: "#141e30",
        color: "#fff"
    }).then((result) => {
        if (result.isConfirmed) {
            deletStudent(id);
            swalWithBootstrapButtons.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
                background: "#141e30",
                color: "#0bf387"
            });
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire({
                title: "Cancelled",
                text: "Your imaginary file is safe :)",
                icon: "error",
                background: "#141e30",
                color: "#fff"
            });
        }
    });
}
