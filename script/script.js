var UPDATE_POP_UP = document.getElementById("pop-up-update-id")
var updatedCheckId;

function handleAddTaskScreen() {
    let addTaskForm = document.getElementById("pop-for-upload")
    addTaskForm.classList.add("active")
}

function handlePendingTaskScreen() {

}

function handleCompleteTaskScreen() {

}

const findTaskByTaskName = async (name) => {
    const response = await fetch(`http://localhost:3000/data?name=${name}`);
    const jsonData = await response.json();
    let data = await jsonData
    
    if (data.length > 0) {
        return true
    } else {
        return false
    }
}

var flag = 0
function handleClickSort() {
    flag += 1
    var arrow = document.getElementById("arr")
    if (flag === 1) {
        arrow.classList.add("active")
        console.log("FLAG true :: ", flag);
    }

    if (flag === 2) {
        var rotation = 180;
        arrow.style.transform = `rotate(${rotation}deg)`;

        console.log("FLAG false :: ", flag);
    }

    if (flag === 3) {
        var rotation = 0;
        arrow.style.transform = `rotate(${rotation}deg)`;
        arrow.classList.remove("active")
        console.log("FLAG null :: ", flag);
        flag = 0
    }
}

let todayDateDisply = document.getElementById("today-date-id")
todayDateDisply.innerHTML = formatDate(todaysDate())



const dummyData = [
    {
        taskName: "Task 1",
        priority: "High",
        createDate: "2024-02-18",
        updateDate: "2024-02-19",
        priorityDate: "2024-02-20"
    },
    {
        taskName: "Task 2",
        priority: "Medium",
        createDate: "2024-02-19",
        updateDate: "2024-02-20",
        priorityDate: "2024-02-21"
    },
    {
        taskName: "Task 3",
        priority: "Low",
        createDate: "2024-02-20",
        updateDate: "2024-02-21",
        priorityDate: "2024-02-22"
    },
    {
        taskName: "Task 1",
        priority: "High",
        createDate: "2024-02-18",
        updateDate: "2024-02-19",
        priorityDate: "2024-02-20"
    },
    {
        taskName: "Task 2",
        priority: "Medium",
        createDate: "2024-02-19",
        updateDate: "2024-02-20",
        priorityDate: "2024-02-21"
    },
    {
        taskName: "Task 3",
        priority: "Low",
        createDate: "2024-02-20",
        updateDate: "2024-02-21",
        priorityDate: "2024-02-22"
    },
    {
        taskName: "Task 1",
        priority: "High",
        createDate: "2024-02-18",
        updateDate: "2024-02-19",
        priorityDate: "2024-02-20"
    },
    {
        taskName: "Task 2",
        priority: "Medium",
        createDate: "2024-02-19",
        updateDate: "2024-02-20",
        priorityDate: "2024-02-21"
    },
    {
        taskName: "Task 3",
        priority: "Low",
        createDate: "2024-02-20",
        updateDate: "2024-02-21",
        priorityDate: "2024-02-22"
    }
];

async function fetchDateData() {
    console.log("TODAYS DATE :: ", todaysDate());
    const response = await fetch(`http://localhost:3000/data?createDate=${todaysDate()}`);
    const jsonData = await response.json();
    console.log("RESPONSE :: ", jsonData);
    createAccordionItems(jsonData)
    return jsonData
}

fetchDateData()

function createAccordionItems(data) {
    const accordion = document.getElementById("accordion");
    while (accordion.lastChild) {
        accordion.removeChild(accordion.lastChild);
    }

    data.forEach((task, index) => {
        const button = document.createElement("button");
        button.classList.add("accordion");
        let status = task.status == true ? "Complete" : "Pending"
        let swapStatus = status == "Complete" ? "Pending" : "Complete"
        button.innerHTML = `
            <div class="accor-info-block">
                <h4>${task.name}</h4>
                <div class="club-priority">
                    <h4>${status}</h4>
                </div>
            </div>
        `;
        accordion.appendChild(button);

        const panel = document.createElement("div");
        panel.classList.add("panel");
        accordion.appendChild(panel);

        const taskDetails = `
            <div class="task-main-block">
                <div class="task-info-block">
                    <div class="task-info-left">
                        <h5>Created date</h5>
                    </div>
                    <div class="task-info-right">
                        <h5>${task.createDate}</h5>
                    </div>
                </div>
            </div>
            <div class="task-main-block">
                <div class="task-info-block">
                    <div class="task-info-left">
                        <h5>Due date</h5>
                    </div>
                    <div class="task-info-right">
                        <h5>${task.dueDate}</h5>
                    </div>
                </div>
            </div>
            <div class="task-main-block">
                <div class="task-info-block">
                    <div class="task-info-left">
                        <h5>Priority</h5>
                    </div>
                    <div class="task-info-right">
                        <h5>${task.priority}</h5>
                    </div>
                </div>
            </div>
            <div class="button-container">
                <button class="edit-button" onclick="handleEditText(${task.id})">Edit</button>
                <button class="complete-button" onclick="handleUpdateStatus(${task.status},${task.id})">${swapStatus}</button>
            </div>
        `;
        panel.innerHTML = taskDetails;

        button.addEventListener("click", function () {
            this.classList.toggle("active");
            const panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });

    if (dummyData.length > 6) {
        accordion.classList.add("scrollable");
    }
}

const fetchSingleData = async (id) => {
    const response = await fetch('http://localhost:3000/data/' + id)
    const responseData = await response.json();
    return responseData
}

async function handleEditText(id) {
    var userResponse = await fetchSingleData(id)
    updatedCheckId = userResponse.id
    var priority = document.getElementsByName('priority');
    var priorityUpdate = document.getElementsByName('priority-update');

    document.getElementById("task-name-update-id").value = userResponse.name
    document.getElementById("create-date-update-input").value = userResponse.createDate
    document.getElementById("due-date-update-input").value = userResponse.dueDate
    // document.getElementById("complete-date-update-input").value = userResponse.completeDate

    sessionStorage.setItem("task-name", userResponse.name)

    if (userResponse.priority === "high") {
        priorityUpdate[0].checked = true
    } else if (userResponse.priority === "medium") {
        priorityUpdate[1].checked = true
    } else if (userResponse.priority === "low") {
        priorityUpdate[2].checked = true
    }


    var background1 = document.getElementById("bar-id")
    var background2 = document.getElementById("grid-container-id")
    // var background3 = document.getElementById("popup")

    background1.classList.add("blur")
    background2.classList.add("blur")
    // background3.classList.add("blur")

    document.getElementById('overlay').style.display = 'block';

    UPDATE_POP_UP.classList.add("active")
}

function handleClosePopup() {

    var background1 = document.getElementById("bar-id")
    var background2 = document.getElementById("grid-container-id")

    background1.classList.remove("blur")
    background2.classList.remove("blur")
    // background4.classList.remove("blur")
    sessionStorage.removeItem("task-name")

    document.getElementById('overlay').style.display = 'none';
    UPDATE_POP_UP.classList.remove("active")
}

function todaysDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var day = new Date(`${yyyy}-${mm}-${dd}`).toLocaleDateString('en-CA')
    return day
}

function formatDate(date) {
    let readableDate = new Date(date)
    return readableDate.toDateString()
}

function handleUploadData() {
    event.preventDefault();
    validateForm();
}

async function validateForm() {
    const taskNameInput = document.getElementById("task-name-id");
    const createDateInput = document.getElementById("create-date-input");
    const dueDateInput = document.getElementById("due-date-input");
    const highPriorityInput = document.getElementById("high-id");
    const mediumPriorityInput = document.getElementById("medium-id");
    const lowPriorityInput = document.getElementById("low-id");

    const nameError = document.getElementById("name-error-id");
    const createDateError = document.getElementById("create-date-error-id");
    const dueDateError = document.getElementById("due-date-error-id");

    const isNameValid = taskNameInput.value.trim() !== "";
    const isCreateDateValid = createDateInput.value !== "";
    let isDueDateValid = dueDateInput.value !== "";
    const isPrioritySelected = highPriorityInput.checked || mediumPriorityInput.checked || lowPriorityInput.checked;
    let userPresent = await findTaskByTaskName(taskNameInput.value)

    if (userPresent === true) {
        document.getElementById("popup-exist").style.display = "block";
        setTimeout(() => {
            document.getElementById("popup-exist").style.display = "none";
        }, 2000);
        return
    }

    var priority = document.getElementsByName('priority');
    let priorityInput;
    for (var i = 0; i < priority.length; i++) {
        if (priority[i].checked) {
            priorityInput = priority[i].value;
        }
    }
    nameError.style.display = isNameValid ? "none" : "block";
    createDateError.style.display = isCreateDateValid ? "none" : "block";

    const createDate = new Date(createDateInput.value);
    const dueDate = new Date(dueDateInput.value);
    if (isDueDateValid) {
        if (dueDate < createDate) {
            dueDateError.textContent = "Due date cannot be before create date";
            isDueDateValid = false;
        } else {
            dueDateError.textContent = "";
        }
    } else {
        dueDateError.textContent = "Due date is required";
    }

    dueDateError.style.display = isDueDateValid ? "none" : "block";

    if (!isNameValid || !isCreateDateValid || !isDueDateValid || !isPrioritySelected) {
        return;
    }

    fetch("http://localhost:3000/data", {
        method: "POST",
        body: JSON.stringify({
            name: taskNameInput.value.trim(),
            createDate: createDateInput.value,
            dueDate: dueDateInput.value,
            priority: priorityInput,
            completeDate: "",
            updatedDate: "",
            status: false
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(data => {
        if (data.status == 201) {
            document.getElementById("popup-create").style.display = "block";
            setTimeout(closePopup, 3000);
        }
    }).then(error => {
        console.log("ERROR :: ", error);
    })
}

function closePopup() {
    document.getElementById("popup-create").style.display = "none";
    document.getElementById("popup-update").style.display = "none";
    document.getElementById("popup-exist").style.display = "none";
    window.location.reload();
}

function handleNameKeyUp() {

}
function handleChangeDate() {

}

function handleOnChecked(id) {

    var date = todaysDate()

    fetch("http://localhost:3000/data/" + id, {
        method: "PATCH",
        body: JSON.stringify({
            completeDate: date,
            status: true
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(data => {
        console.log("RESPONSE DATA :: ", data.status)
        if (data.status == 200) {
            document.getElementById("popup").style.display = "block";
            setTimeout(closePopup, 3000);
        }
    })
}

// ------------------------------------------------------------------------------------
// update validation

async function validateUpdateForm() {

    const taskNameInput = document.getElementById("task-name-update-id");
    const createDateInput = document.getElementById("create-date-update-input");
    const dueDateInput = document.getElementById("due-date-update-input");
    // const completeDateInput = document.getElementById("complete-date-update-input");
    const highPriorityInput = document.getElementById("high-id");
    const mediumPriorityInput = document.getElementById("medium-id");
    const lowPriorityInput = document.getElementById("low-id");
    var priorityUpdate = document.getElementsByName('priority-update');

    const nameError = document.getElementById("name-error-id");
    const createDateError = document.getElementById("create-date-error-id");
    const dueDateError = document.getElementById("due-date-update-error-id");
    // const completeDateError = document.getElementById("complete-update-error-id");
    // const completeDatePastError = document.getElementById("complete-update-past-error-id");
    // const completeDateFutureError = document.getElementById("complete-update-future-error-id");

    const isNameValid = taskNameInput.value.trim() !== "";
    const isCreateDateValid = createDateInput.value !== "";
    let isDueDateValid = dueDateInput.value !== "";
    // let isCompleteDateValid = completeDateInput.value === "" || completeDateInput.value >= createDateInput.value;
    const isPrioritySelected = highPriorityInput.checked || mediumPriorityInput.checked || lowPriorityInput.checked;

    nameError.style.display = isNameValid ? "none" : "block";
    createDateError.style.display = isCreateDateValid ? "none" : "block";

    const createDate = new Date(createDateInput.value);
    const dueDate = new Date(dueDateInput.value);
    if (isDueDateValid) {
        if (dueDate < createDate) {
            dueDateError.textContent = "Due date cannot be before create date";
            isDueDateValid = false;
        } else {
            dueDateError.textContent = "";
        }
    } else {
        dueDateError.textContent = "Due date is required";
    }

    // const completeDate = new Date(completeDateInput.value);
    // const todayDate = new Date(todaysDate());

    // if (completeDateInput.value !== "") {
    //     if (completeDate < createDate) {
    //         completeDatePastError.textContent = "Complete date cannot be before create date";
    //         isCompleteDateValid = false;
    //     } else {
    //         completeDatePastError.textContent = "";
    //     }

    //     if (completeDate > todayDate) {
    //         completeDateFutureError.textContent = "Complete date cannot be in the future";
    //         isCompleteDateValid = false;
    //     } else {
    //         completeDateFutureError.textContent = "";
    //     }
    // } else {
    //     completeDatePastError.textContent = "";
    //     completeDateFutureError.textContent = "";
    // }

    dueDateError.style.display = isDueDateValid ? "none" : "block";
    // completeDatePastError.style.display = isCompleteDateValid ? "none" : "block";
    // completeDateFutureError.style.display = isCompleteDateValid ? "none" : "block";

    if (!isNameValid || !isCreateDateValid || !isDueDateValid || !isPrioritySelected) {
        return false;
    }

    var idUpdate = updatedCheckId
    // i am here

    var priorityInput;
    for (var i = 0; i < priorityUpdate.length; i++) {
        if (priorityUpdate[i].checked) {
            priorityInput = priorityUpdate[i].value;
        }
    }

    let userPresent = await findTaskByTaskName(taskNameInput.value)
    if (userPresent === true && sessionStorage.getItem("task-name") != taskNameInput.value) { 
        console.log("In same ");
        // nameError.textContent = "Task name already exist"
        document.getElementById("popup-exist").style.display = "block";
        setTimeout(() => {
            document.getElementById("popup-exist").style.display = "none";

        }, 2000);
        return
    } 

    fetch("http://localhost:3000/data/" + idUpdate, {
        method: "PATCH",
        body: JSON.stringify({
            name: taskNameInput.value,
            createDate: createDateInput.value,
            updatedDate: todaysDate(),
            dueDate: dueDateInput.value,
            completeDate: todaysDate(),
            priority: priorityInput,
            status: true
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(data => {
        console.log("RESPONSE DATA :: ", data.status)
        handleClosePopup()
        if (data.status == 200) {
            document.getElementById("popup-update").style.display = "block";
            setTimeout(closePopup, 3000);
        }
    })


    // if (completeDateInput.value == null || completeDateInput.value == "") {
    //     fetch("http://localhost:3000/data/" + idUpdate, {
    //         method: "PATCH",
    //         body: JSON.stringify({
    //             name: taskNameInput.value,
    //             createDate: createDateInput.value,
    //             updatedDate: todaysDate(),
    //             dueDate: dueDateInput.value,
    //             completeDate: completeDateInput.value,
    //             priority: priorityInput,
    //             status: false
    //         }),
    //         headers: {
    //             "Content-type": "application/json; charset=UTF-8"
    //         }
    //     }).then(data => {
    //         console.log("RESPONSE DATA :: ", data.status)
    //         handleClosePopup()
    //         if (data.status == 200) {
    //             document.getElementById("popup-update").style.display = "block";
    //             setTimeout(closePopup, 3000);
    //         }
    //     })
    // } else {
    //     fetch("http://localhost:3000/data/" + idUpdate, {
    //         method: "PATCH",
    //         body: JSON.stringify({
    //             name: taskNameInput.value,
    //             createDate: createDateInput.value,
    //             updatedDate: todaysDate(),
    //             dueDate: dueDateInput.value,
    //             completeDate: completeDateInput.value,
    //             priority: priorityInput,
    //             status: true
    //         }),
    //         headers: {
    //             "Content-type": "application/json; charset=UTF-8"
    //         }
    //     }).then(data => {
    //         console.log("RESPONSE DATA :: ", data.status)
    //         handleClosePopup()
    //         if (data.status == 200) {
    //             document.getElementById("popup-update").style.display = "block";
    //             setTimeout(closePopup, 3000);
    //         }
    //     })
    // }
    console.log("SUBMIT DETAILS");
    sessionStorage.removeItem("task-name")
    return true;
}

function handleUpdateDetails() {
    event.preventDefault();
    const isValid = validateUpdateForm();

}

function handleUpdateStatus(status,id) {
    console.log("STATUS :: ",status);
    var date = todaysDate()

    if (status == true) {
        fetch("http://localhost:3000/data/" + id, {
            method: "PATCH",
            body: JSON.stringify({
                completeDate: date,
                status: false
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(data => {
            console.log("RESPONSE DATA :: ", data.status)
            if (data.status == 200) {
                document.getElementById("popup-remove").style.display = "block";
                setTimeout(closePopup, 3000);
            }
        })
    }else{
        fetch("http://localhost:3000/data/" + id, {
            method: "PATCH",
            body: JSON.stringify({
                completeDate: date,
                status: true
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(data => {
            console.log("RESPONSE DATA :: ", data.status)
            if (data.status == 200) {
                document.getElementById("popup-add").style.display = "block";
                setTimeout(closePopup, 3000);
            }
        })
    }
}

const fetchFilterSearchData = async (text) => {
    let date = todaysDate()
    const response = await fetch(`http://localhost:3000/data?q=${text}&createDate=${date}`)
    const responseData = await response.json()
    console.log("DATA :: ", responseData);
    const errorText = document.getElementById("no-data-text-id")
    if (responseData.length == 0 || responseData.length == null) {
        errorText.style.display = "block"
    }else{
        errorText.style.display = "none"
    }

    if (text.length === 0) {
        fetchDateData()
    }else{
        createAccordionItems(responseData)
    }
}

function submitSearchValue(){
    console.log("I AM IN HOME");
    event.preventDefault()
    var searchInputId = document.getElementById("search-input-id")
    fetchFilterSearchData(searchInputId.value)
}