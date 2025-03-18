let charts = {}; // Store active charts by canvas ID

document.addEventListener("countySelected", function (event) {
    const { countyName, congressData } = event.detail;

    console.log(`Profile Cards: Received data for ${countyName}`, congressData);

    const container = d3.select("#profileContainer");
    container.html(""); // Clear old content

    congressData.forEach((rep, index) => {
        if (!rep.expenses) {
            console.warn(`No expenses found for ${rep.name}. Setting default values.`);
            rep.expenses = { salary: 0, staff: 0, operations: 0, travel: 0, total: 0 }; // Ensure it exists
        }

        const profileWrapper = document.createElement("div");
        profileWrapper.classList.add("profile-wrapper");

        // ✅ Convert expenses to a JSON string and store it in the button attribute
        const expensesJSON = JSON.stringify(rep.expenses);

        profileWrapper.innerHTML = `
            <div class="card">
                <img src="${rep.img}" alt="Portrait" class="profile-img">
                <div class="info">
                    <p class="name">${rep.name}</p>
                    <div class="details">
                        <span class="party" style="color: ${rep.party === 'Democrat' ? '#b20f3b' : '#173e72'}">${rep.party}</span>
                        <span>${rep.district}</span>
                        <span class="phone">${rep.phone}</span>
                    </div>
                    <div class="additional-info">
                        <span>In Office Since: ${rep.since} &nbsp;&nbsp;|&nbsp;&nbsp; Next Vote: ${rep.nextVote}</span>
                    </div>
                </div>
            </div>
            <div class="expansion-container">
                <div class="grey-bar"></div>
                <div class="btn-container">
                    <button class="btn-expenses" data-expenses='${expensesJSON}'>EXPENSES</button>
                </div>
                <div class="expansion-content">
                    <div class="graph-key">
                        <div class="key-box"><div class="dashed-line"></div> <div class="key-text">Rep Avg</div></div>
                    </div>
                    <div class="chart-container">
                        <canvas id="chart-${index}"></canvas>
                    </div>
                    <div class="averages-container">
                        <div class="table-title">Rep Averages</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Salary</th>
                                    <th>Staff</th>
                                    <th>Ops</th>
                                    <th>Travel</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>$${rep.expenses.salary.toLocaleString()}</td>
                                    <td>$${rep.expenses.staff.toLocaleString()}</td>
                                    <td>$${rep.expenses.operations.toLocaleString()}</td>
                                    <td>$${rep.expenses.travel.toLocaleString()}</td>
                                    <td>$${rep.expenses.total.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        container.node().appendChild(profileWrapper);
    });

    console.log(`Profile cards updated for ${countyName}.`);
});



    // Add event listeners for expanding profile cards & generating charts
document.querySelectorAll('.btn-expenses').forEach((btn, index) => {
    btn.addEventListener('click', function () {
        const profileWrapper = this.closest('.profile-wrapper');
        const expansionContainer = profileWrapper.querySelector('.expansion-container');
        const expansionContent = expansionContainer.querySelector('.expansion-content');
        const canvas = expansionContent.querySelector("canvas");

        // ✅ Log the data-expenses attribute before parsing
        console.log(`Clicked EXPAND for Rep ${index}.`);
        console.log(`data-expenses attribute:`, this.getAttribute("data-expenses"));

        // ✅ Parse expenses safely
        let expenses = this.getAttribute("data-expenses");
        if (expenses) {
            expenses = JSON.parse(expenses);
        } else {
            console.error(`No expenses data found for Rep ${index}!`);
            expenses = { salary: 0, staff: 0, operations: 0, travel: 0, total: 0 }; // Prevent errors
        }

        console.log(`Parsed expenses:`, expenses);

        if (expansionContainer.classList.contains("expanded")) {
            expansionContainer.classList.remove("expanded");
            expansionContainer.style.maxHeight = "60px";
            this.textContent = "EXPENSES";
        } else {
            expansionContainer.classList.add("expanded");
            expansionContainer.style.maxHeight = "500px"; 
            this.textContent = "COLLAPSE";

            // ✅ Delay chart rendering to avoid DOM race conditions
            setTimeout(() => {
                createChart(canvas, index, expenses);
            }, 300);
        }
    });
});


function createChart(canvas, index, expenses) {
    if (!canvas) {
        console.error(`Canvas not found for Rep ${index}!`);
        return;
    }

    console.log(`Creating chart for Rep ${index} on canvas ${canvas.id} with data:`, expenses);

    const ctx = canvas.getContext("2d");

    // ✅ Destroy existing chart only if it exists for this canvas
    if (charts[canvas.id]) {
        charts[canvas.id].destroy();
    }

    const categories = ["Salary", "Staff", "Operations", "Travel", "Total"];
    const dataValues = [
        expenses.salary || 0,
        expenses.staff || 0,
        expenses.operations || 0,
        expenses.travel || 0,
        expenses.total || 0
    ];

    // ✅ Store new chart instance in `charts` global object
    charts[canvas.id] = new Chart(ctx, {
        type: "bar",
        data: {
            labels: categories,
            datasets: [
                {
                    label: "Expenses ($)",
                    data: dataValues,
                    backgroundColor: dataValues.map((val) =>
                        val > 5000 ? "rgba(255, 99, 132, 0.8)" : "rgba(23, 62, 114, 0.7)"
                    ),
                },
            ],
        },
        options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { display: false },
                y: { grid: { display: false } },
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "#333",
                    titleFont: { family: "Roboto", size: 14, weight: "bold" },
                    bodyFont: { family: "Roboto", size: 12, weight: "bold" },
                    padding: 10,
                    cornerRadius: 5,
                    displayColors: false,
                    callbacks: {
                        label: (context) => `$${context.parsed.x.toLocaleString()}`,
                    },
                },
            },
            layout: { padding: { right: 60 } },
        },
    });

    console.log(`Chart ${canvas.id} created successfully!`);
}
