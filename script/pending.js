
let PAGE_COUNT = 10
let PAGE_NUMBER = 1
let PAGE_END_INDEX = '';

var WRAPPER = document.getElementById("table-wrapper-id")

var STORE_ARRAY = []

var UPDATE_POP_UP = document.getElementById("pop-up-update-id")
var popUpId = document.getElementById("pop-for-upload")

var SORTING_COUNTER = false
var FILTER_SEARCH_FLAG = false
var updatedCheckId;

let nameFlag = 0
let createDateFlag = 0
let updatedDateFlag = 0
let dueDateFlag = 0
let taskPriorityFlag = 0

document.getElementById("link-1").style.backgroundColor = "#444";
// document.getElementById("link-1").style.textDecoration = "underline";


document.addEventListener("DOMContentLoaded", function() {
    var selectedValue = document.getElementById("select-option-id");
    console.log("RUN AFTER RELOAD");
    console.log("SESSION LOG :: ",sessionStorage.getItem("page-total-list"));
    console.log("PAGE NUMBER :: ",sessionStorage.getItem("page-number"));
    console.log("PAGE COUNT :: ",sessionStorage.getItem("page-count"));
    if (sessionStorage.getItem("page-number") != null && sessionStorage.getItem("page-count") != null) {
        PAGE_NUMBER = parseInt(sessionStorage.getItem("page-number"), 10)
        PAGE_COUNT = parseInt(sessionStorage.getItem("page-count"), 10)
        selectedValue.value = parseInt(sessionStorage.getItem("page-total-list"), 10)
        selectedValue.options[selectedValue.selectedIndex].text = sessionStorage.getItem("page-total-list")
        sessionStorage.clear()
    }
});

// window.onload = function () {
//     var selectedValue = document.getElementById("select-option-id");
//     console.log("RUN AFTER RELOAD");
//     console.log("SESSION LOG :: ",sessionStorage.getItem("page-total-list"));
//     console.log("PAGE NUMBER :: ",sessionStorage.getItem("page-number"));
//     console.log("PAGE COUNT :: ",sessionStorage.getItem("page-count"));
//     if (sessionStorage.getItem("page-number") != null && sessionStorage.getItem("page-count") != null) {
//         PAGE_NUMBER = parseInt(sessionStorage.getItem("page-number"), 10)
//         PAGE_COUNT = parseInt(sessionStorage.getItem("page-count"), 10)
//         selectedValue.value = parseInt(sessionStorage.getItem("page-total-list"), 10)
//         selectedValue.options[selectedValue.selectedIndex].text = sessionStorage.getItem("page-total-list")
//         sessionStorage.clear()
//     }
// }

// fetch('http://localhost:3000/tasks?date_gte=2024-02-18&date_lte=2024-02-20')
//   .then(response => response.json())
//   .then(data => {
//     console.log(data); // Process the data here
//   })
//   .catch(error => {
//     console.error('Error fetching data:', error);
//   });




const fetchData = async () => {
    const response = await fetch("http://localhost:3000/data");
    const jsonData = await response.json();

    // PAGE_END_INDEX = Math.ceil(jsonData.length / PAGE_COUNT)
    // responseJsonLength = jsonData.length
    while (WRAPPER.lastChild) {
        WRAPPER.removeChild(WRAPPER.lastChild);
    }

    while (STORE_ARRAY.length > 0) {
        STORE_ARRAY.pop();
    }

    jsonData.map((data) => {
        STORE_ARRAY.push(data)
    })

    renderDataFromArray()


    return jsonData;
};

function renderSortedDataFromArray() {
    while (WRAPPER.lastChild) {
        WRAPPER.removeChild(WRAPPER.lastChild);
    }

    if (STORE_ARRAY.length === 0) {
        // errorMessageId.innerHTML = "No data to display"    
    } else {
        // errorMessageId.innerHTML = ""
    }



    STORE_ARRAY.map((data, index) => {
        index += 1;
        var startIndex = (PAGE_NUMBER * PAGE_COUNT) - (PAGE_COUNT - 1);
        var endIndex = (PAGE_NUMBER * PAGE_COUNT);

        if (index >= startIndex && index <= endIndex) {
            WRAPPER.append(createHtml(data));
        }
    });

    updateIndex()
}

function renderDataFromArray() {
    FILTER_SEARCH_FLAG = false
    var highArray = []
    var mediumArray = []
    var lowArray = []

    var errorMessageId = document.getElementById("no-data-text-id")

    STORE_ARRAY.map((element) => {
        if (element.priority === "high" && element.status == false) {
            highArray.push(element)
        } else if (element.priority === "medium" && element.status == false) {
            mediumArray.push(element)
        } else if (element.priority === "low" && element.status == false) {
            lowArray.push(element)
        }
    })

    while (WRAPPER.lastChild) {
        WRAPPER.removeChild(WRAPPER.lastChild);
    }

    while (STORE_ARRAY.length > 0) {
        STORE_ARRAY.pop();
    }


    STORE_ARRAY = [...highArray, ...mediumArray, ...lowArray]
    console.log("STORE MAP :: ", STORE_ARRAY);

    PAGE_END_INDEX = Math.ceil(STORE_ARRAY.length / PAGE_COUNT)
    responseJsonLength = STORE_ARRAY.length

    if (STORE_ARRAY.length === 0) {
        errorMessageId.innerHTML = "No data to display"
    } else {
        errorMessageId.innerHTML = ""
    }

    console.log("===> ",PAGE_NUMBER);
    console.log("===> ",PAGE_COUNT);

    STORE_ARRAY.map((data, index) => {
        index += 1;
        var startIndex = (PAGE_NUMBER * PAGE_COUNT) - (PAGE_COUNT - 1);
        var endIndex = (PAGE_NUMBER * PAGE_COUNT);

        if (index >= startIndex && index <= endIndex) {
            WRAPPER.append(createHtml(data));
        }
    });

    updateIndex()
}

const fetchSingleData = async (id) => {
    const response = await fetch('http://localhost:3000/data/' + id)
    const responseData = await response.json();

    return responseData
}

function createHtml(data) {
    let td = document.createElement('tr');
    td.innerHTML = `

    <tr>
        <td style="text-align: center;">
            <input type="checkbox" name="checked" id="${data.id}" onclick="handleOnChecked(this.id)">
        </td>
        <td>${data.name}</td>
        <td>${data.createDate}</td>
        <td>${data.updatedDate}</td>
        <td>${data.dueDate}</td>
        <td>${data.priority}</td>
        <td style="text-align: center;">
        <img id="${data.id}" class="icon-image" onclick="handleEditText(this.id)" src="../assets/images/editing.png" alt=""></img>
        </td>
        <td style="text-align: center;">
        <img id="${data.id}" class="icon-image" onclick="handleDelete(this.id)" src="../assets/images/delete.png" alt=""></img>
        </td>
        </tr>
        
        `;
    return td;
    // <td>${data.completeDate}</td>
}

function updateIndex() {
    var currentIndexId = document.getElementById("span-current-page-id")
    var endIndexId = document.getElementById("span-end-page-id")
    PAGE_END_INDEX = Math.ceil(responseJsonLength / PAGE_COUNT)
    currentIndexId.innerHTML = PAGE_NUMBER
    endIndexId.innerHTML = PAGE_END_INDEX
}

function getData() {
    let data = fetchData();
    // populateList(data)
}

getData()

function todaysDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var day = new Date(`${yyyy}-${mm}-${dd}`).toLocaleDateString('en-CA')
    return day
}

function displayPostForm() {
    var background1 = document.getElementById("bar-id")
    var background2 = document.getElementById("container-id")
    var background3 = document.getElementById("bottom-block-id")
    var background4 = document.getElementById("search-container-id")

    background1.classList.add("blur")
    background2.classList.add("blur")
    background3.classList.add("blur")
    // background4.classList.add("blur")

    document.getElementById('overlay').style.display = 'block';
    popUpId.classList.add("active")

    var createDateInput = document.getElementById("create-date-input")
    var todayDate = todaysDate()
    createDateInput.value = todayDate
}
// ----------------------------------------------------------------------------
function handleClosePopup() {

    var background1 = document.getElementById("bar-id")
    var background2 = document.getElementById("container-id")
    var background3 = document.getElementById("bottom-block-id")
    var background4 = document.getElementById("search-container-id")

    background1.classList.remove("blur")
    background2.classList.remove("blur")
    background3.classList.remove("blur")
    // background4.classList.remove("blur")

    sessionStorage.removeItem("task-name")

    document.getElementById('overlay').style.display = 'none';
    popUpId.classList.remove("active")
    UPDATE_POP_UP.classList.remove("active")
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

function handleChangeDate() {
    let updateSubmitId = document.getElementById("update-button-id")

    var createDateInput = document.getElementById("create-date-input")
    var createDateInputError = document.getElementById("create-date-error-id")
    var selectedCreateDate = new Date(createDateInput.value).toLocaleDateString('en-CA')

    var dueDateInput = document.getElementById("due-date-input")
    var dueDateInputError = document.getElementById("due-date-error-id")
    var selectedDueDate = new Date(dueDateInput.value).toLocaleDateString('en-CA')

    var createUpdateDateInput = document.getElementById("create-date-update-input")
    var updateDueDateInput = document.getElementById("due-date-update-input")
    var updateDueDateInputError = document.getElementById("due-date-update-error-id")
    var selectedUpdateDueDate = new Date(updateDueDateInput.value).toLocaleDateString('en-CA')

    var completeDateUpdate = document.getElementById("complete-date-update-input")
    var completeDateUpdateError = document.getElementById("complet-update-error-id")
    var selectedCompleteDateUpdate = new Date(completeDateUpdate.value).toLocaleDateString('en-CA')
    // var selectedUpdateDueDate = updateDueDateInput.value

    if (selectedCreateDate > todaysDate()) {
        createDateInput.value = todaysDate()
        createDateInputError.innerHTML = "Create date should not be greater then today's date"
    } else {
        createDateInputError.innerHTML = ""
    }

    if (selectedDueDate < createDateInput.value) {
        // dueDateInput.value = todaysDate()
        dueDateInputError.innerHTML = "Due date should not be less then today's date"
    } else {
        dueDateInputError.innerHTML = ""
    }

    if (new Date(selectedUpdateDueDate).toLocaleDateString('en-CA') < createUpdateDateInput.value) {
        updateDueDateInputError.innerHTML = "Due date should not be less then created date"
    } else {
        console.log("IN ELSE");
        updateDueDateInputError.innerHTML = ""
    }

    console.log("SELECTED DATE :: ", selectedCompleteDateUpdate);
    console.log("CREATE DATE :: ", createUpdateDateInput.value);
    console.log("TODAYS DATE :: ", todaysDate());
    console.log("COMP 1 DATE :: ", selectedCompleteDateUpdate < createUpdateDateInput.value)
    if (selectedCompleteDateUpdate < createUpdateDateInput.value || selectedCompleteDateUpdate != "Invalid Date" && new Date(selectedCompleteDateUpdate).toLocaleDateString('en-CA') > todaysDate()) {
        console.log("IN TRUE");
        if (selectedCompleteDateUpdate < createUpdateDateInput.value) {
            completeDateUpdateError.innerHTML = "Complete date should not be less then created date"
        } else {
            completeDateUpdateError.innerHTML = "Complete date should not be greater then todays date"
        }
    } else {
        console.log("IN ELSE");
        completeDateUpdateError.innerHTML = ""
    }


    // if (selectedDueDate < createUpdateDateInput.value){
    //     updateSubmitId.disabled = true
    // }else{
    //     updateSubmitId.disabled = false
    // }


}

function handleNameKeyUp() {
    var nameInput = document.getElementById("task-name-id")
    var nameInputError = document.getElementById("name-error-id")
    if (nameInput.value.length >= 50) {
        nameInputError.innerHTML = "Reached max limit"
    } else {
        nameInputError.innerHTML = ""
    }
}

function handleUploadData() {
    event.preventDefault()
    let createSubmitId = document.getElementById("update-button-id")
    var nameInput = document.getElementById("task-name-id")
    var createDateInput = document.getElementById("create-date-input")
    var dueDateInput = document.getElementById("due-date-input")
    var priority = document.getElementsByName('priority');

    var priorityInput;
    for (var i = 0; i < priority.length; i++) {
        if (priority[i].checked) {
            priorityInput = priority[i].value;
        }
    }

    console.log("DUE DATE :: ", dueDateInput.value);
    console.log("DUE DATE :: ", createDateInput.value);

    if (dueDateInput.value < createDateInput.value) {
        console.log(" I am here");
        createSubmitId.disabled = false
    } else {

        fetch("http://localhost:3000/data", {
            method: "POST",
            body: JSON.stringify({
                name: nameInput.value,
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
        });
    }

    createSubmitId.disabled = true
}

async function handleEditText(id) {
    var userResponse = await fetchSingleData(id)
    updatedCheckId = userResponse.id
    var priority = document.getElementsByName('priority');
    var priorityUpdate = document.getElementsByName('priority-update');

    document.getElementById("task-name-update-id").value = userResponse.name
    document.getElementById("create-date-update-input").value = userResponse.createDate
    // document.getElementById("update-date-update-input").value = userResponse.updateDate
    document.getElementById("due-date-update-input").value = userResponse.dueDate
    document.getElementById("complete-date-update-input").value = userResponse.completeDate
    if (userResponse.priority === "high") {
        priorityUpdate[0].checked = true
    } else if (userResponse.priority === "medium") {
        priorityUpdate[1].checked = true
    } else if (userResponse.priority === "low") {
        priorityUpdate[2].checked = true
    }

    sessionStorage.setItem("task-name", userResponse.name)

    var background1 = document.getElementById("bar-id")
    var background2 = document.getElementById("container-id")
    var background3 = document.getElementById("bottom-block-id")

    background1.classList.add("blur")
    background2.classList.add("blur")
    background3.classList.add("blur")

    document.getElementById('overlay').style.display = 'block';

    UPDATE_POP_UP.classList.add("active")
}

async function handleUpdateDetails() {
    event.preventDefault()
    let updateSubmitId = document.getElementById("update-button-id")
    var updateDueDateInput = document.getElementById("due-date-update-input")
    var selectedUpdateDueDate = new Date(updateDueDateInput.value).toLocaleDateString('en-CA')
    var completeDateUpdate = document.getElementById("complete-date-update-input")
    var selectedCompleteDateUpdate = new Date(completeDateUpdate.value).toLocaleDateString('en-CA')
    var createUpdateDateInput = document.getElementById("create-date-update-input")



    var idUpdate = updatedCheckId
    var nameUpdate = document.getElementById("task-name-update-id").value
    var createUpdate = document.getElementById("create-date-update-input").value
    var dueUpdate = document.getElementById("due-date-update-input").value
    var completeUpdate = document.getElementById("complete-date-update-input").value
    var priorityUpdate = document.getElementsByName('priority-update');

    var selectedValue = document.getElementById("select-option-id").value;

    var priorityInput;
    for (var i = 0; i < priorityUpdate.length; i++) {
        if (priorityUpdate[i].checked) {
            priorityInput = priorityUpdate[i].value;
        }
    }
    if (selectedUpdateDueDate < createUpdateDateInput.value) {
        updateSubmitId.disabled = true
        console.log("IN ISSUE");
        // return
    } else if (selectedCompleteDateUpdate < createUpdateDateInput.value || selectedCompleteDateUpdate != "Invalid Date" && new Date(selectedCompleteDateUpdate).toLocaleDateString('en-CA') > todaysDate()) {
        updateSubmitId.disabled = true
        console.log("IN ISSUE 2");
        // return
    } else {
        updateSubmitId.disabled = false
        console.log("EVERY THING FINE");
        console.log("--------->",PAGE_NUMBER)
        console.log("--------->",PAGE_COUNT)
        console.log("--------->",selectedValue)
        sessionStorage.setItem("page-number", PAGE_NUMBER)
        sessionStorage.setItem("page-count", PAGE_COUNT)
        sessionStorage.setItem("page-total-list", selectedValue)

        let userPresent = await findTaskByTaskName(nameUpdate)
        if (userPresent === true && sessionStorage.getItem("task-name") != nameUpdate) { 
            console.log("In same ");
            document.getElementById("popup-exist").style.display = "block";
            setTimeout(() => {
                document.getElementById("popup-exist").style.display = "none";

            }, 2000);
            return
        }

        if (completeUpdate == null || completeUpdate == "") {
            fetch("http://localhost:3000/data/" + idUpdate, {
                method: "PATCH",
                body: JSON.stringify({
                    name: nameUpdate,
                    createDate: createUpdate,
                    updatedDate: todaysDate(),
                    dueDate: dueUpdate,
                    completeDate: completeUpdate,
                    priority: priorityInput,
                    status: false
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
            }).catch(error => {
                console.error("Something went wrong", error);
            });
        } else {
            fetch("http://localhost:3000/data/" + idUpdate, {
                method: "PATCH",
                body: JSON.stringify({
                    name: nameUpdate,
                    createDate: createUpdate,
                    updatedDate: todaysDate(),
                    dueDate: dueUpdate,
                    completeDate: completeUpdate,
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
        }

        sessionStorage.setItem("ID", completeUpdate)
    }



    updateSubmitId.disabled = false
}

const getPageData = async (rowCount, pageNumber) => {
    const response = await fetch(`http://localhost:3000/data?_limit=${rowCount}&_page=${pageNumber}`)
    const responseData = await response.json()
    const arr = []
    // responseJsonLength = responseData.length
    while (WRAPPER.lastChild) {
        WRAPPER.removeChild(WRAPPER.lastChild);
    }

    // while (storeArray.length > 0) {
    //     storeArray.pop();
    // }

    responseData.map((data) => {
        arr.push(data)
    })

    return arr
}

function handleDelete(id) {
    var selectedValue = document.getElementById("select-option-id").value;
    sessionStorage.setItem("page-number", PAGE_NUMBER)
    sessionStorage.setItem("page-count", PAGE_COUNT)
    sessionStorage.setItem("page-total-list", selectedValue)
    fetch("http://localhost:3000/data/" + id, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }

    }).then(data => {
        console.log("RESPONSE DATA :: ", data.status)
        if (data.status == 200) {
            document.getElementById("popup-delete").style.display = "block";
            setTimeout(closePopup, 3000);
        }
    })

}

function handleOnChecked(id) {

    var selectedValue = document.getElementById("select-option-id").value;

    var date = todaysDate()

    sessionStorage.setItem("page-number", PAGE_NUMBER)
    sessionStorage.setItem("page-count", PAGE_COUNT)
    sessionStorage.setItem("page-total-list", selectedValue)

    fetch("http://localhost:3000/data/" + id, {
        method: "PATCH",
        body: JSON.stringify({
            completeDate: date,
            updatedDate: date,
            status: true
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(data => {
        console.log("RESPONSE DATA :: ", data.status)
        if (data.status == 200) {
            playAudio()
            document.getElementById("popup-add").style.display = "block";
            setTimeout(closePopup, 3000);
        }
    })
}

function playAudio() { 
    var x = document.getElementById("myAudio");
    x.play(); 
  } 

function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("popup-add").style.display = "none";
    location.reload();
}

function handleSelectionChange() {
    var selectedValue = document.getElementById("select-option-id").value;
    PAGE_NUMBER = 1
    PAGE_COUNT = selectedValue
    renderDataFromArray()
}

function incrementPage() {
    document.getElementById("table-id").scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    if (parseInt(PAGE_NUMBER) < parseInt(PAGE_END_INDEX)) {
        PAGE_NUMBER += parseInt(1)
    }

    if (SORTING_COUNTER === true) {
        console.log("I am comming here");
        renderSortedDataFromArray()
    }else if (FILTER_SEARCH_FLAG == true) {
        
        renderFilterDataFromArray()
        
    }else {
        renderDataFromArray()
    }
    updateIndex()
}

function decrementPage() {
    document.getElementById("table-id").scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    if (Number(PAGE_NUMBER) > Number(1)) {   // change it to parseInt
        PAGE_NUMBER -= 1
    }
    if (SORTING_COUNTER === true) {
        renderSortedDataFromArray()
    }else if (FILTER_SEARCH_FLAG == true) {
        renderFilterDataFromArray()
    } else {
        renderDataFromArray()
    }
    updateIndex()
}

var taskFlag = false
var createFlag = false
var updateFlag = false
var dueFlag = false
var completeFlag = false
var priorityFlag = false

const fetchSortedData = async (table, method) => {
    const response = await fetch(`http://localhost:3000/data?_sort=${table}&_order=${method}&status=false`) // data?_sort=name&_order=asc
    const responseData = await response.json()
    console.log("MAIN SORT DATA :: ", responseData);
    responseJsonLength = responseData.length
    while (WRAPPER.lastChild) {
        WRAPPER.removeChild(WRAPPER.lastChild);
    }

    while (STORE_ARRAY.length > 0) {
        STORE_ARRAY.pop();
    }

    responseData.map((data) => {
        STORE_ARRAY.push(data)
    })
    renderSortedDataFromArray()
}

function handleSort(param) {
    const asc = "asc"
    const desc = "desc"
    if (param == 1) {
        taskFlag = !taskFlag
        let current = taskFlag
        if (current === true) {
            sortArrayData("name", asc)
        } else {
            sortArrayData("name", desc)
        }
    } else if (param == 2) {
        createFlag = !createFlag
        let current = createFlag
        if (current === true) {
            sortArrayData("createDate", asc)
        } else {
            sortArrayData("createDate", desc)
        }

    } else if (param == 3) {
        updateFlag = !updateFlag
        let current = updateFlag
        if (current === true) {
            sortArrayData("updatedDate", asc)
        } else {
            sortArrayData("updatedDate", desc)
        }
    } else if (param == 4) {
        dueFlag = !dueFlag
        let current = dueFlag
        if (current === true) {
            sortArrayData("dueDate", asc)
        } else {
            sortArrayData("dueDate", desc)
        }
    } else if (param == 5) {
        completeFlag = !completeFlag
        let current = completeFlag
        if (current === true) {
            sortArrayData("completeDate", asc)
        } else {
            sortArrayData("completeDate", desc)
        }
    } else if (param == 6) {
        priorityFlag = !priorityFlag
        let current = priorityFlag
        if (current === true) {
            sortArrayData("priority", asc)
        } else {
            sortArrayData("priority", desc)
        }
    }
}

async function sortArrayData(param, method) {
    console.log("ARRAY TO FILTER :: ", STORE_ARRAY);
    let gotArray = []
    while (WRAPPER.lastChild) {
        WRAPPER.removeChild(WRAPPER.lastChild);
    }
    STORE_ARRAY.map((data, index) => {
        index += 1;
        var startIndex = (PAGE_NUMBER * PAGE_COUNT) - (PAGE_COUNT - 1);
        var endIndex = (PAGE_NUMBER * PAGE_COUNT);

        if (index >= startIndex && index <= endIndex) {
            // WRAPPER.append(createHtml(data));
            gotArray.push(data)
        }
    });
    // let gotArray = await getPageData(PAGE_COUNT,PAGE_NUMBER)
    if (method === 'asc') {

        gotArray = gotArray.sort((a, b) => {
            if (a[param] < b[param]) {
                return -1 // if a should come before b then "-1" .Then it means that the elements should be swapped because they are in inverse order. 
                // return 1 - if b should come before a then "1" it means that the elements are in the right order.
                // return 0 - it means that the elements are either equal or have equal positions
            }
        })
    } else if (method === "desc") {

        gotArray = gotArray.sort((a, b) => {
            if (a[param] > b[param]) {
                return -1
            }
        })
    }

    console.log("NEW ARRAY :: ", gotArray);
    renderSortedData(gotArray)
}

function renderSortedData(array) {
    var errorMessageId = document.getElementById("no-data-text-id")

    if (array.length === 0) {
        errorMessageId.innerHTML = "No data to display"
    } else {
        errorMessageId.innerHTML = ""
    }

    array.map((data, index) => {
        WRAPPER.append(createHtml(data));
    });

}

// function renderDataFromArrayWithStatus() {
//     var highArray = []
//     var mediumArray = []
//     var lowArray = []

//     var errorMessageId = document.getElementById("no-data-text-id")

//     STORE_ARRAY.map((element) => {
//         if (element.priority === "high") {
//             highArray.push(element)
//         } else if (element.priority === "medium") {
//             mediumArray.push(element)
//         } else if (element.priority === "low") {
//             lowArray.push(element)
//         }
//     })

//     while (WRAPPER.lastChild) {
//         WRAPPER.removeChild(WRAPPER.lastChild);
//     }

//     while (STORE_ARRAY.length > 0) {
//         STORE_ARRAY.pop();
//     }

//     STORE_ARRAY = [...highArray, ...mediumArray, ...lowArray]
//     console.log("STORE MAP :: ", STORE_ARRAY);

//     if (STORE_ARRAY.length === 0) {
//         errorMessageId.innerHTML = "No data to display"
//     } else {
//         errorMessageId.innerHTML = ""
//     }

//     STORE_ARRAY.map((data, index) => {
//         index += 1;
//         var startIndex = (PAGE_NUMBER * PAGE_COUNT) - (PAGE_COUNT - 1);
//         var endIndex = (PAGE_NUMBER * PAGE_COUNT);

//         if (index >= startIndex && index <= endIndex && data.status == true) {
//             WRAPPER.append(createHtml(data));
//         }
//     });

//     updateIndex()
// }

// const fetchCompleteDateData = async () => {
//     const response = await fetch("http://localhost:3000/data?status=true");
//     const jsonData = await response.json();

//     PAGE_END_INDEX = Math.ceil(jsonData.length / PAGE_COUNT)
//     responseJsonLength = jsonData.length
//     while (WRAPPER.lastChild) {
//         WRAPPER.removeChild(WRAPPER.lastChild);
//     }

//     while (STORE_ARRAY.length > 0) {
//         STORE_ARRAY.pop();
//     }

//     jsonData.map((data) => {
//         STORE_ARRAY.push(data)
//     })

//     renderDataFromArrayWithStatus()


//     return jsonData;
// };

// function displayCompletedTable() {

//     fetchCompleteDateData()
// }

function renderFilterDataFromArray() {
    // PAGE_NUMBER = 1
    var errorMessageId = document.getElementById("no-data-text-id")

    while (WRAPPER.lastChild) {
        WRAPPER.removeChild(WRAPPER.lastChild);
    }

    if (STORE_ARRAY.length === 0) {
        errorMessageId.innerHTML = "No data to display"
    } else {
        errorMessageId.innerHTML = ""
    }

    STORE_ARRAY.map((data, index) => {
        index += 1;
        var startIndex = (PAGE_NUMBER * PAGE_COUNT) - (PAGE_COUNT - 1);
        var endIndex = (PAGE_NUMBER * PAGE_COUNT);
        if (index >= startIndex && index <= endIndex) {
            WRAPPER.append(createHtml(data));
        }
    });

    updateIndex()
}

const fetchFilterSearchData = async (text) => {
    FILTER_SEARCH_FLAG = true
    const response = await fetch(`http://localhost:3000/data?q=${text}&status=false`)
    const responseData = await response.json()
    console.log("DATA :: ", responseData);
    responseJsonLength = responseData.length
    while (WRAPPER.lastChild) {
        WRAPPER.removeChild(WRAPPER.lastChild);
    }

    while (STORE_ARRAY.length > 0) {
        STORE_ARRAY.pop();
    }

    responseData.map((data) => {
        STORE_ARRAY.push(data)
    })
    if (text.length === 0) {
        renderDataFromArray()
    }
    renderFilterDataFromArray()
}

function submitSearchValue() {
    console.log("I AM IN PENDING");
    event.preventDefault()
    var searchInputId = document.getElementById("search-input-id")
    var selectedValue = document.getElementById("select-option-id").value;
    if (selectedValue == 0) {
        console.log("IN HERE");
        PAGE_NUMBER = 1
        PAGE_COUNT = 10
        selectedValue = 10
    }

    fetchFilterSearchData(searchInputId.value)

    let arrow1 = document.getElementById("arr1")
    let arrow2 = document.getElementById("arr2")
    let arrow3 = document.getElementById("arr3")
    let arrow4 = document.getElementById("arr4")
    let arrow5 = document.getElementById("arr5")

    arrow1.classList.remove("active")
    arrow2.classList.remove("active")
    arrow3.classList.remove("active")
    arrow4.classList.remove("active")
    arrow5.classList.remove("active")

    nameFlag = 0
    createDateFlag = 0
    updatedDateFlag = 0
    dueDateFlag = 0
    taskPriorityFlag = 0

}

function highlightTab(tab) {
    // const tabs = document.querySelectorAll('.tabs-list');
    // tabs.forEach(tab => {
    //     tab.classList.remove('highlight');
    // });
    // tab.classList.add('highlight');
}

// async function getSortData(type,string){

// }


async function handleDataSort(param) {
    document.getElementById("search-input-id").value = ""
    let arrow1 = document.getElementById("arr1")
    let arrow2 = document.getElementById("arr2")
    let arrow3 = document.getElementById("arr3")
    let arrow4 = document.getElementById("arr4")
    let arrow5 = document.getElementById("arr5")



    if (param == 1) {
        nameFlag += 1
        arrow2.classList.remove("active")
        arrow3.classList.remove("active")
        arrow4.classList.remove("active")
        arrow5.classList.remove("active")

        arrow2.style.transform = `rotate(${0}deg)`;
        arrow3.style.transform = `rotate(${0}deg)`;
        arrow4.style.transform = `rotate(${0}deg)`;
        arrow5.style.transform = `rotate(${0}deg)`;

        createDateFlag = 0
        updatedDateFlag = 0
        dueDateFlag = 0
        taskPriorityFlag = 0

        if (nameFlag == 1) {
            arrow1.classList.add("active")
            SORTING_COUNTER = true
            fetchSortedData("name", "asc")
        } else if (nameFlag == 2) {
            var rotation = 180;
            arrow1.style.transform = `rotate(${rotation}deg)`;
            fetchSortedData("name", "desc")
        } else if (nameFlag == 3) {
            var rotation = 0;
            arrow1.style.transform = `rotate(${rotation}deg)`;
            arrow1.classList.remove("active")
            nameFlag = 0
            fetchData()
        }

    }

    if (param == 2) {
        createDateFlag += 1

        nameFlag = 0
        updatedDateFlag = 0
        dueDateFlag = 0
        taskPriorityFlag = 0

        console.log("CREATE DATE FLAG :: ", createDateFlag);
        arrow1.classList.remove("active")
        arrow3.classList.remove("active")
        arrow4.classList.remove("active")
        arrow5.classList.remove("active")

        arrow1.style.transform = `rotate(${0}deg)`;
        arrow3.style.transform = `rotate(${0}deg)`;
        arrow4.style.transform = `rotate(${0}deg)`;
        arrow5.style.transform = `rotate(${0}deg)`;

        if (createDateFlag == 1) {
            arrow2.classList.add("active")
            SORTING_COUNTER = true
            fetchSortedData("createDate", "asc")
        } else if (createDateFlag == 2) {
            var rotation = 180;
            arrow2.style.transform = `rotate(${rotation}deg)`;
            fetchSortedData("createDate", "desc")
        } else if (createDateFlag == 3) {
            var rotation = 0;
            arrow2.style.transform = `rotate(${rotation}deg)`;
            arrow2.classList.remove("active")
            createDateFlag = 0
            fetchData()
        }
    }

    if (param == 3) {
        updatedDateFlag += 1

        nameFlag = 0
        createDateFlag = 0
        dueDateFlag = 0
        taskPriorityFlag = 0

        arrow1.classList.remove("active")
        arrow2.classList.remove("active")
        arrow4.classList.remove("active")
        arrow5.classList.remove("active")

        arrow1.style.transform = `rotate(${0}deg)`;
        arrow2.style.transform = `rotate(${0}deg)`;
        arrow4.style.transform = `rotate(${0}deg)`;
        arrow5.style.transform = `rotate(${0}deg)`;

        if (updatedDateFlag == 1) {
            arrow3.classList.add("active")
            SORTING_COUNTER = true
            fetchSortedData("updatedDate", "asc")
        } else if (updatedDateFlag == 2) {
            var rotation = 180;
            arrow3.style.transform = `rotate(${rotation}deg)`;
            fetchSortedData("updatedDate", "desc")
        } else if (updatedDateFlag == 3) {
            var rotation = 0;
            arrow3.style.transform = `rotate(${rotation}deg)`;
            arrow3.classList.remove("active")
            updatedDateFlag = 0
            fetchData()
        }
    }

    if (param == 4) {
        dueDateFlag += 1

        nameFlag = 0
        createDateFlag = 0
        updatedDateFlag = 0
        taskPriorityFlag = 0

        arrow1.classList.remove("active")
        arrow2.classList.remove("active")
        arrow3.classList.remove("active")
        arrow5.classList.remove("active")

        arrow1.style.transform = `rotate(${0}deg)`;
        arrow2.style.transform = `rotate(${0}deg)`;
        arrow3.style.transform = `rotate(${0}deg)`;
        arrow5.style.transform = `rotate(${0}deg)`;

        if (dueDateFlag == 1) {
            arrow4.classList.add("active")
            SORTING_COUNTER = true
            fetchSortedData("dueDate", "asc")
        } else if (dueDateFlag == 2) {
            var rotation = 180;
            arrow4.style.transform = `rotate(${rotation}deg)`;
            fetchSortedData("dueDate", "desc")
        } else if (dueDateFlag == 3) {
            var rotation = 0;
            arrow4.style.transform = `rotate(${rotation}deg)`;
            arrow4.classList.remove("active")
            dueDateFlag = 0
            fetchData()
        }
    }

    if (param == 5) {
        taskPriorityFlag += 1

        nameFlag = 0
        createDateFlag = 0
        updatedDateFlag = 0
        dueDateFlag = 0

        arrow1.classList.remove("active")
        arrow2.classList.remove("active")
        arrow3.classList.remove("active")
        arrow4.classList.remove("active")

        arrow1.style.transform = `rotate(${0}deg)`;
        arrow2.style.transform = `rotate(${0}deg)`;
        arrow3.style.transform = `rotate(${0}deg)`;
        arrow4.style.transform = `rotate(${0}deg)`;

        if (taskPriorityFlag == 1) {
            arrow5.classList.add("active")
            SORTING_COUNTER = true
            fetchSortedData("priority", "asc")
        } else if (taskPriorityFlag == 2) {
            var rotation = 180;
            arrow5.style.transform = `rotate(${rotation}deg)`;
            fetchSortedData("priority", "desc")
        } else if (taskPriorityFlag == 3) {
            var rotation = 0;
            arrow5.style.transform = `rotate(${rotation}deg)`;
            arrow5.classList.remove("active")
            taskPriorityFlag = 0
            fetchData()
        }
    }
}
