let charts = {}; // Store active charts by canvas ID

document.addEventListener("countySelected", function (event) {
    const { clickedCountyName, congressData } = event.detail;
    console.log(`Profile Cards: Received data for ${clickedCountyName}`, congressData);

    const container = d3.select("#profileContainer");
    container.html(""); // Clear previous content

    function formatNumber(value) {
        if (value >= 1000000) {
            return (Math.round(value / 100000) / 10) + "M"; // 1.3M format
        } else {
            return Math.round(value / 1000) + "K"; // 175K format
        }
    }

   // Update Averages Table Formatting
setTimeout(() => {
    document.querySelectorAll(".averages-container tbody tr").forEach(row => {
        const cells = row.children;
        if (cells.length >= 5) {
            cells[0].textContent = `$${formatNumber(averages.avgSalary)}`;
            cells[1].textContent = `$${formatNumber(averages.avgStaff)}`;
            cells[2].textContent = `$${formatNumber(averages.avgOperations)}`;
            cells[3].textContent = `$${formatNumber(averages.avgTravel)}`;
            cells[4].textContent = `$${formatNumber(averages.avgTotal)}`;
        }
    });
}, 500);


    let averages = window.expenseAverages || { avgSalary: 0, avgStaff: 0, avgOperations: 0, avgTravel: 0, avgTotal: 0 };

    // Create profile cards dynamically
    congressData.forEach((rep, index) => {
        if (!rep.expenses) {
            console.warn(`No expenses found for ${rep.name}. Setting default values.`);
            rep.expenses = { salary: 0, staff: 0, operations: 0, travel: 0, total: 0 };
        }

        const profileWrapper = document.createElement("div");
        profileWrapper.classList.add("profile-wrapper");

        const expensesJSON = JSON.stringify(rep.expenses);

        profileWrapper.innerHTML = `
            <div class="card">
                <img src="/images/Congress/district-${rep.district.match(/\d+/)[0]}.jpg" alt="Portrait" class="profile-img" onerror="this.onerror=null;this.src='/images/Congress/default.jpg';">

                <div class="info">
                    <p class="name">${rep.name}</p>
                    <div class="details">
                        <span class="party">${rep.party}</span>
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
                                    <td>$${averages.avgSalary}</td>
                                    <td>$${averages.avgStaff}</td>
                                    <td>$${averages.avgOperations}</td>
                                    <td>$${averages.avgTravel}</td>
                                    <td>$${averages.avgTotal}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        container.node().appendChild(profileWrapper);
    });


    // Add event listeners for expanding profile cards & generating charts
document.querySelectorAll('.btn-expenses').forEach((btn, index) => {
    btn.addEventListener('click', function () {
        const profileWrapper = this.closest('.profile-wrapper');
        const expansionContainer = profileWrapper.querySelector('.expansion-container');
        const expansionContent = expansionContainer.querySelector('.expansion-content');
        const canvas = expansionContent.querySelector("canvas");

        console.log(`Clicked EXPAND for Rep ${index}.`);

        // ✅ Extract expenses safely from data attribute
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

            // ✅ Delay chart rendering slightly to prevent race conditions
            setTimeout(() => {
                createChart(canvas, index, expenses);
            }, 300);
        }
    });
});



    console.log(`Profile cards updated for ${clickedCountyName}.`);
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

    // ✅ Extract Averages from the Table with Proper Parsing
    const averagesTable = canvas.closest('.expansion-content').querySelector('.averages-container table tbody tr');
    const avgValues = averagesTable
        ? Array.from(averagesTable.children).map(td => {
            return parseFloat(td.textContent.replace(/[$,K,M]/g, '')) *
       (td.textContent.includes('M') ? 1e6 : td.textContent.includes('K') ? 1e3 : 1);
        })
        : [0, 0, 0, 0, 0];

    console.log("Extracted Avg Values:", avgValues);

 const dashedLinePlugin = {
    id: `dashedLinePlugin-${canvas.id}`,
    afterDatasetDraw(chart) {
        const { ctx, scales: { y, x } } = chart;
        ctx.save();
        ctx.strokeStyle = 'orange';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]); // Short dashed line

        chart.getDatasetMeta(0).data.forEach((bar, index) => {
            const avgValue = avgValues[index];
            if (!avgValue) return; // Skip if avgValue is 0 or undefined

            const avgX = x.getPixelForValue(avgValue);
            const barTop = bar.y - bar.height / 2 - 5; // Slightly above the bar
            const barBottom = bar.y + bar.height / 2 + 5; // Slightly below the bar

            ctx.beginPath();
            ctx.moveTo(avgX, barTop);
            ctx.lineTo(avgX, barBottom);
            ctx.stroke();
        });

        ctx.restore();
    }
};

    // ✅ Create Chart with Plugin
    charts[canvas.id] = new Chart(ctx, {
        type: "bar",
        data: {
            labels: categories,
            datasets: [
                {
                    label: "Expenses ($)",
                    data: dataValues,
                    backgroundColor: dataValues.map((val, i) =>
                        val > avgValues[i] ? "rgba(255, 99, 132, 0.8)" : "rgba(23, 62, 114, 0.7)"
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
                enabled: true,
                position: 'nearest', // Fix invalid 'cursor' option
                backgroundColor: '#333',
                titleFont: { family: 'Roboto', size: 14, weight: 'bold' },
                bodyFont: { family: 'Roboto', size: 12, weight: 'bold' },
                padding: 10,
                cornerRadius: 5,
                displayColors: false,
                caretSize: 0, // Ensure caret is visible
                callbacks: {
                    title: () => null, // Fix title rendering issue
                    label: context => `$${context.parsed.x.toLocaleString()}`
                }
            }
            },
            layout: { padding: { right: 60 } },
        },
        plugins: [dashedLinePlugin] // ✅ Add the Dashed Line Plugin
    });

    console.log(`Chart ${canvas.id} created successfully!`);
}
