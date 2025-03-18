function renderProfiles() {
    if (!window.officialsData || !window.officialsData.congress.length) {
        console.warn("Officials data not loaded yet.");
        setTimeout(renderProfiles, 500); // Retry in 0.5s
        return;
    }

    const profiles = [
        ...window.officialsData.congress,
        ...window.officialsData.stateSenate,
        ...window.officialsData.stateAssembly
    ];

    const container = d3.select("#profileContainer");

    const profileWrappers = container.selectAll(".profile-wrapper")
        .data(profiles)
        .enter()
        .append("div")
        .attr("class", "profile-wrapper")
        .html(d => `
            <div class="card">
                <img src="${d.img}" alt="Portrait" class="profile-img">
                <div class="info">
                    <p class="name">${d.name}</p>
                    <div class="details">
                        <span class="party">${d.party}</span>
                        <span>${d.district}</span>
                        <span class="phone">${d.phone}</span>
                    </div>
                    <div class="additional-info">
                        <span>Age: ${d.age} &nbsp;&nbsp;|&nbsp;&nbsp; In Office Since: ${d.since}</span>
                    </div>
                </div>
            </div>
            <div class="expansion-container">
                <div class="grey-bar"></div>
                <div class="btn-container">
                    <button class="btn-expenses">EXPENSES</button>
                </div>
                <div class="expansion-content">
                    <div class="chart-container">
                        <canvas></canvas>
                    </div>
                </div>
            </div>
        `);

    // Add expand/collapse functionality
    document.querySelectorAll('.btn-expenses').forEach(btn => {
        btn.addEventListener('click', function () {
            const expansionContainer = this.closest('.profile-wrapper').querySelector('.expansion-container');
            expansionContainer.classList.toggle('expanded');
            this.textContent = expansionContainer.classList.contains('expanded') ? 'COLLAPSE' : 'EXPENSES';
        });
    });
}

console.log("PROFILES!")
// Run renderProfiles after the page fully loads
window.addEventListener('load', renderProfiles);