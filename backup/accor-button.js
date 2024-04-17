function createAccordionItems(data) {
    const accordion = document.getElementById("accordion");

    // Loop through the data and create accordion items
    data.forEach((task, index) => {
        // Create accordion button
        const button = document.createElement("button");
        let taskId = task.id
        button.classList.add("accordion");
        button.innerHTML = `
            <div class="accor-info-block">
                <h4>${task.taskName}</h4>
                <div class="club-priority">
                    <h4>${task.priority}</h4>
                    <button onclick="handleEditSelected(${task.id})">
                        Complete
                    </button>
                </div>
            </div>
        `;
        accordion.appendChild(button);

        // Create accordion panel
        const panel = document.createElement("div");
        panel.classList.add("panel");
        accordion.appendChild(panel);

        // Create task details inside the panel
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
                        <h5>Updated date</h5>
                    </div>
                    <div class="task-info-right">
                        <h5>${task.updateDate}</h5>
                    </div>
                </div>
            </div>
            <div class="task-main-block">
                <div class="task-info-block">
                    <div class="task-info-left">
                        <h5>Priority date</h5>
                    </div>
                    <div class="task-info-right">
                        <h5>${task.priorityDate}</h5>
                    </div>
                </div>
            </div>
        `;
        panel.innerHTML = taskDetails;

        // Add event listener to accordion button for toggling panel visibility
        button.addEventListener("click", function() {
            this.classList.toggle("active");
            const panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });
}