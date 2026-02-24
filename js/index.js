let form = document.querySelector("form"),
    inputs = form.querySelectorAll("input"),
    btn = form.querySelector("button"),
    students = [],
    id = 0,
    tbody = document.querySelector("#Results tbody"),
    iconReset = document.querySelector(".box .back"),
    searchInput = document.querySelector("#Search input"),
    emptyStudent = document.querySelector("#Results .container div.alert"),
    popupDelete = document.querySelector("div.delete"),
    btnDelete = popupDelete.querySelector(".box .buttons .delete"),
    btnCancel = popupDelete.querySelector(".box .buttons .cancel"),
    btnClear = document.querySelector(".box .clear");

(function () {
    if (localStorage.getItem("students") == null) {
        localStorage.setItem("students", JSON.stringify(students));
        localStorage.setItem("id", id);
    } else {
        students = JSON.parse(localStorage.getItem("students"));
        id = +localStorage.getItem("id");
    }
    showStudents(students);
    isEmpty(students);
})();

form.addEventListener("submit", (e) => {
    e.preventDefault();


    let focusInput = form.querySelector("input:focus") ?? undefined;
    focusInput?.blur();

    let checkValid = form.querySelector("input.is-invalid");
    if (checkValid !== null) {
        return;
    }

    if (form.dataset.type == "add") {
        addStudent();
    } else {
        showConfirmEdit();
    }

});

inputs.forEach(input => {
    input.addEventListener("blur", () => {
        checkValidateInput(input);
    });
});

inputs.forEach(input => {
    input.addEventListener("focus", () => {
        btnClear.classList.remove("d-lg-none");
        btnClear.classList.add("d-lg-flex");
    });
});


searchInput.addEventListener("keyup", () => {
    let searchValue = searchInput.value.toLocaleLowerCase(),
        filterStudent = students.filter(student => {
            return (student.firstName.toLocaleLowerCase().includes(searchValue) ||
                student.id.toString().includes(searchValue) ||
                student.lastName.toLocaleLowerCase().includes(searchValue) ||
                student.email.toLocaleLowerCase().includes(searchValue) ||
                student.age.toString().includes(searchValue) ||
                student.phone.toString().includes(searchValue)
            );
        });
    showStudents(filterStudent);
    isEmpty(filterStudent);
})
