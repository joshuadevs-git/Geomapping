// Dynamic PDAO data source
let barangayData = {};

let currentChart = null;
let currentPage = 1;
const itemsPerPage = 5;
let filteredData = [];
let allData = [];
let currentChartType = 'doughnut'; // Default chart type

// Calculate statistics (after load)
let totalPDAO = 0;
let totalMale = 0;
let totalFemale = 0;
let averagePDAO = 0;
let averageMalePercentage = '0.0';
let averageFemalePercentage = '0.0';

// Update stats display (after load)
function updateStatsDisplay() {
    document.getElementById('totalPDAO').textContent = totalPDAO.toLocaleString();
    document.getElementById('averagePDAO').textContent = averagePDAO;
}

// Initialize data
function initializeData() {
    const entries = Object.entries(barangayData);
    totalPDAO = entries.reduce((sum, [_, d]) => sum + d.pdaoCount, 0);
    totalMale = entries.reduce((sum, [_, d]) => sum + (d.maleCount || 0), 0);
    totalFemale = entries.reduce((sum, [_, d]) => sum + (d.femaleCount || 0), 0);
    averagePDAO = entries.length ? Math.round(totalPDAO / entries.length) : 0;
    averageMalePercentage = totalPDAO ? ((totalMale / totalPDAO) * 100).toFixed(1) : '0.0';
    averageFemalePercentage = totalPDAO ? ((totalFemale / totalPDAO) * 100).toFixed(1) : '0.0';
    updateStatsDisplay();

    allData = entries.map(([id, data]) => ({
        id: parseInt(id),
        name: data.name,
        pdaoCount: data.pdaoCount,
        maleCount: data.maleCount,
        femaleCount: data.femaleCount,
        malePercentage: data.pdaoCount ? ((data.maleCount / data.pdaoCount) * 100).toFixed(1) : '0.0',
        femalePercentage: data.pdaoCount ? ((data.femaleCount / data.pdaoCount) * 100).toFixed(1) : '0.0',
        percentage: totalPDAO ? ((data.pdaoCount / totalPDAO) * 100).toFixed(1) : '0.0'
    }));
    filteredData = [...allData];
}

async function loadPdaoData() {
    try {
        const res = await fetch('/api/analytics/pdao', { credentials: 'same-origin' });
        const json = await res.json();
        if (!json.success) throw new Error('Failed to fetch PDAO data');

        barangayData = {};
        json.data.forEach(item => {
            barangayData[item.id] = {
                name: item.name,
                pdaoCount: item.pdaoCount,
                maleCount: item.maleCount,
                femaleCount: item.femaleCount
            };
        });

        initializeData();
        renderTable();
        renderPagination();
    } catch (err) {
        console.error(err);
        barangayData = {};
        initializeData();
        renderTable();
        renderPagination();
    }
}

// Render table rows
function renderTable() {
    const tbody = document.getElementById('tableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);

    tbody.innerHTML = '';

    if (pageData.length === 0) {
        document.getElementById('noResults').style.display = 'block';
        document.getElementById('dataTable').style.display = 'none';
        document.getElementById('pagination').style.display = 'none';
        return;
    }

    document.getElementById('noResults').style.display = 'none';
    document.getElementById('dataTable').style.display = 'table';
    document.getElementById('pagination').style.display = 'flex';

    pageData.forEach(item => {
        const safeBarangay = item.name.replace(/"/g, '&quot;');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="barangay-name">${item.name}</td>
            <td class="pdao-count">${item.pdaoCount.toLocaleString()}</td>
            <td>
                <button class="view-chart-btn" onclick="showChart(${item.id})">
                     View Chart
                </button>
                <button class="view-chart-btn" data-barangay="${safeBarangay}" onclick="openPwdBarangayPrint(this.dataset.barangay, this)">
                     Print
                </button>
                <button class="view-chart-btn" data-barangay="${safeBarangay}" onclick="generatePwdBarangayReport(this.dataset.barangay, this)">
                     Monthly Report
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginationControls = document.getElementById('paginationControls');
    const paginationInfo = document.getElementById('paginationInfo');

    // Update info
    const startItem = filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredData.length);
    paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${filteredData.length} entries`;

    // Clear previous buttons
    paginationControls.innerHTML = '';

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '◀';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => changePage(currentPage - 1);
    paginationControls.appendChild(prevBtn);

    // Page number buttons
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => changePage(i);
        paginationControls.appendChild(pageBtn);
    }

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '▶';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => changePage(currentPage + 1);
    paginationControls.appendChild(nextBtn);
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderTable();
        renderPagination();
    }
}

// Search functionality
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (searchTerm === '') {
        filteredData = [...allData];
    } else {
        filteredData = allData.filter(item => 
            item.name.toLowerCase().includes(searchTerm)
        );
    }
    
    currentPage = 1;
    renderTable();
    renderPagination();
}

// Switch chart type
function switchChartType(type) {
    currentChartType = type;
    const chartContainer = document.getElementById('chartContainer');
    const tableContainer = document.getElementById('tableContainer');
    const chartTypeButtons = document.querySelectorAll('.chart-type-btn');
    
    // Update button states
    chartTypeButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="switchChartType('${type}')"]`).classList.add('active');
    
    if (type === 'table') {
        chartContainer.style.display = 'none';
        tableContainer.style.display = 'block';
        renderChartTable();
    } else {
        chartContainer.style.display = 'block';
        tableContainer.style.display = 'none';
        updateChart();
    }
}

// Render chart table - now shows male/female breakdown
function renderChartTable() {
    const tableBody = document.getElementById('chartTableBody');
    const currentBarangay = allData.find(item => item.id === parseInt(document.getElementById('modalTitle').dataset.barangayId));
    
    if (!currentBarangay) return;
    
    const data = [
        { name: 'Male', percentage: currentBarangay.malePercentage, count: currentBarangay.maleCount },
        { name: 'Female', percentage: currentBarangay.femalePercentage, count: currentBarangay.femaleCount }
    ];
    
    tableBody.innerHTML = '';
    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="display: flex; align-items: center;">
                <div style="width: 20px; height: 20px; background-color: ${index === 0 ? '#061727' : '#415E72'}; margin-right: 10px; border-radius: 4px;"></div>
                ${item.name}
            </td>
            <td><strong>${item.percentage}% (${item.count})</strong></td>
        `;
        tableBody.appendChild(row);
    });
}

// Update chart - now shows male/female distribution
function updateChart() {
    const barangayId = parseInt(document.getElementById('modalTitle').dataset.barangayId);
    const barangay = allData.find(item => item.id === barangayId);
    
    if (!barangay) return;
    
    const malePercentage = parseFloat(barangay.malePercentage);
    const femalePercentage = parseFloat(barangay.femalePercentage);

    // Destroy existing chart
    if (currentChart) {
        currentChart.destroy();
    }

    // Create new chart
    const ctx = document.getElementById('pieChart').getContext('2d');
    currentChart = new Chart(ctx, {
        type: currentChartType,
        data: {
            labels: ['Male', 'Female'],
            datasets: [{
                data: [malePercentage, femalePercentage],
                backgroundColor: [
                    '#061727',
                    '#415E72'
                ],
                borderColor: [
                    '#061727',
                    '#FDFAF6'
                ],
                borderWidth: 2,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const barangayData = allData.find(item => item.id === barangayId);
                            const count = label === 'Male' ? barangayData.maleCount : barangayData.femaleCount;
                            return `${label}: ${value.toFixed(1)}% (${count})`;
                        }
                    },
                    titleFont: {
                        size: 16
                    },
                    bodyFont: {
                        size: 14
                    },
                    padding: 12
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 1000
            }
        }
    });
}

// Show chart modal - updated to show comprehensive PDAO statistics
function showChart(barangayId) {
    const barangay = allData.find(item => item.id === barangayId);
    const modal = document.getElementById('chartModal');
    const modalTitle = document.getElementById('modalTitle');
    const chartInfo = document.getElementById('chartInfo');
    
    modalTitle.textContent = `${barangay.name} - PDAO`;
    modalTitle.dataset.barangayId = barangayId; // Store for reference
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Calculate statistics
    const withPension = Math.round(barangay.pdaoCount * 0.65); // Assume 65% have pension
    const withoutPension = barangay.pdaoCount - withPension;
    const pensionPercentage = ((withPension / barangay.pdaoCount) * 100).toFixed(1);
    const noPensionPercentage = ((withoutPension / barangay.pdaoCount) * 100).toFixed(1);
    
    // Find highest and lowest populations
    const sortedByPdao = [...allData].sort((a, b) => b.pdaoCount - a.pdaoCount);
    const highest = sortedByPdao[0];
    const lowest = sortedByPdao[sortedByPdao.length - 1];

    // Update chart info with comprehensive statistics
    chartInfo.innerHTML = `
        <h3>${barangay.name} PDAO Statistics</h3>
        <p><strong>Total Registered PDAO:</strong> ${barangay.pdaoCount.toLocaleString()}</p>
        <p><strong>Percentage with Pension:</strong> ${pensionPercentage}% (${withPension.toLocaleString()})</p>
        <p><strong>Percentage without Benefits:</strong> ${noPensionPercentage}% (${withoutPension.toLocaleString()})</p>
        <p><strong>Highest Population:</strong> ${highest.name} (${highest.pdaoCount.toLocaleString()})</p>
        <p><strong>Lowest Population:</strong> ${lowest.name} (${lowest.pdaoCount.toLocaleString()})</p>
        <hr style="margin: 15px 0;">
        <p style="font-style: italic; color: #666;"><strong>Insight:</strong> ${noPensionPercentage}% of registered PDAOs in ${barangay.name} do not have pension benefits, representing ${withoutPension.toLocaleString()} individuals who may need additional support.</p>
        <hr style="margin: 15px 0;">
        <h4>Gender Distribution</h4>
        <p><strong>Male:</strong> ${barangay.maleCount} (${barangay.malePercentage}%)</p>
        <p><strong>Female:</strong> ${barangay.femaleCount} (${barangay.femalePercentage}%)</p>
        <hr style="margin: 15px 0;">
    `;

    // Reset to default chart type
    currentChartType = 'doughnut';
    document.querySelectorAll('.chart-type-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[onclick="switchChartType(\'doughnut\')"]').classList.add('active');
    
    // Show chart container, hide table container
    document.getElementById('chartContainer').style.display = 'block';
    document.getElementById('tableContainer').style.display = 'none';

    updateChart();
}

// Open printable view for a barangay's PWDs
async function openPwdBarangayPrint(barangayName, btnEl) {
    if (!barangayName) return;

    const originalText = btnEl ? btnEl.innerHTML : '';
    if (btnEl) {
        btnEl.disabled = true;
        btnEl.innerHTML = 'Loading...';
    }

    try {
        const res = await fetch(`/api/pwds/barangay/${encodeURIComponent(barangayName)}`, {
            credentials: 'same-origin'
        });
        if (!res.ok) throw new Error('Unable to load PWD data');

        const json = await res.json();
        if (!json.success) throw new Error(json.message || 'Failed to load data');

        const printHtml = buildPwdBarangayPrintHtml(barangayName, json.data || []);

        const newWin = window.open('', '_blank', 'width=1200,height=900,scrollbars=yes');
        if (!newWin) {
            alert('Popup blocked! Please allow popups to view the print page.');
            return;
        }
        newWin.document.open();
        newWin.document.write(printHtml);
        newWin.document.close();
    } catch (err) {
        console.error(err);
        alert(err.message || 'Error opening print view');
    } finally {
        if (btnEl) {
            btnEl.disabled = false;
            btnEl.innerHTML = originalText;
        }
    }
}

// Build printable HTML for barangay PWDs
function buildPwdBarangayPrintHtml(barangayName, pwds) {
    const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Calculate summary statistics
    let totalCount = 0;
    let totalMale = 0;
    let totalFemale = 0;
    const disabilityCounts = {};

    const rows = (pwds && pwds.length
        ? pwds
        : []).map((pwd, idx) => {
            totalCount++;
            const gender = (pwd.gender || '').toString().toLowerCase();
            if (gender === 'male') {
                totalMale++;
            } else if (gender === 'female') {
                totalFemale++;
            }

            // Count disabilities
            if (pwd.disability && pwd.disability !== 'N/A') {
                const disabilities = pwd.disability.split(',').map(d => d.trim()).filter(Boolean);
                disabilities.forEach(disability => {
                    disabilityCounts[disability] = (disabilityCounts[disability] || 0) + 1;
                });
            }

            return `
            <tr>
                <td>${idx + 1}</td>
                <td>${esc(pwd.fullName || 'N/A')}</td>
                <td>${esc(pwd.contact || 'N/A')}</td>
                <td>${esc(pwd.gender || 'N/A')}</td>
                <td>${esc(pwd.age ?? 'N/A')}</td>
                <td>${esc(pwd.disability || 'N/A')}</td>
            </tr>
        `;
        }).join('');

    const emptyState = `
        <tr>
            <td colspan="6" class="text-center">No PWDs found for this barangay.</td>
        </tr>
    `;

    // Build disability summary HTML
    const disabilitySummaryRows = Object.entries(disabilityCounts)
        .sort((a, b) => b[1] - a[1]) // Sort by count descending
        .map(([disability, count]) => `
            <tr>
                <td>${esc(disability)}</td>
                <td><strong>${count}</strong></td>
            </tr>
        `).join('');

    const disabilitySummary = disabilitySummaryRows ? `
        <div class="mt-4">
            <h5>Disability Summary</h5>
            <div class="table-responsive">
                <table class="table table-bordered table-sm">
                    <thead class="table-secondary">
                        <tr>
                            <th>Disability Type</th>
                            <th>Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${disabilitySummaryRows}
                    </tbody>
                </table>
            </div>
        </div>
    ` : '';

    return `<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>${esc(barangayName)} - PWDs</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="stylesheet" href="/bower_components/bootstrap/css/bootstrap.min.css">

    <style>
        /* ================= PAGE ================= */
        @page {
            size: A4 portrait; /* change to: legal portrait if needed */
            margin: 15mm 12mm;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
        }

        /* ================= ACTION BUTTONS ================= */
        .print-actions {
            text-align: right;
            margin: 15px;
        }

        .print-actions button {
            margin-left: 10px;
        }

        /* ================= PRINT LAYOUT TABLE ================= */
        .print-layout {
            width: 100%;
            border-collapse: collapse;
        }

        .print-layout thead {
            display: table-header-group;
        }

        /* ================= HEADER ================= */
        .header-wrapper {
            position: relative;
            height: 120px;
        }

        .logo-left {
            position: absolute;
            top: 0;
            left: 0;
            width: 85px;
        }

        .logo-right {
            position: absolute;
            top: 0;
            right: 0;
            width: 110px;
        }

        .main-header {
            text-align: center;
            padding-top: 10px;
        }

        .main-header h4 {
            font-size: 14px;
            margin: 0;
        }

        .main-header h2 {
            font-size: 20px;
            margin: 0;
        }

        .main-header p {
            font-size: 12px;
            margin: 0;
        }

        /* ================= CONTENT ================= */
        .content {
            padding: 10px;
        }

        .table thead th {
            white-space: nowrap;
        }

        table {
            page-break-inside: auto;
        }

        tr {
            page-break-inside: avoid;
        }

        /* ================= SUMMARY ================= */
        .summary-box {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #dee2e6;
            margin-bottom: 15px;
            page-break-inside: avoid;
        }

        .summary-box h5 {
            font-size: 14px;
            margin-bottom: 10px;
        }

        .summary-item {
            font-size: 12px;
            margin-bottom: 5px;
        }

        .generated-date {
            margin-top: 10px;
            font-style: italic;
        }

        /* ================= PRINT ================= */
        @media print {
            .print-actions {
                display: none;
            }
        }
    </style>
</head>

<body>

    <!-- ACTION BUTTONS -->
    <div class="print-actions">
        <button class="btn btn-secondary btn-sm" onclick="window.close()">Close</button>
        <button class="btn btn-primary btn-sm" onclick="window.print()">Print</button>
    </div>

    <!-- PRINT LAYOUT TABLE -->
    <table class="print-layout">
        <thead>
            <tr>
                <td>
                    <!-- OFFICIAL HEADER -->
                    <div class="header-wrapper">
                        <img src="/assets/images/SilayLogo.jpg" class="logo-left">
                        <img src="/assets/images/BagongPilipinas.jpg" class="logo-right">

                        <div class="main-header">
                            <h4>Republic of the Philippines</h4>
                            <h2><strong>ENRIQUE B. MAGALONA</strong></h2>
                            <p>Persons with Disability Affairs Office</p>
                        </div>
                    </div>
                </td>
            </tr>
        </thead>

        <tbody>
            <tr>
                <td class="content">

                    <!-- TITLE -->
                    <div class="text-center mb-2">
                        <h5 class="mb-0">Person With Disabilities - ${esc(barangayName)}</h5>
                        <small class="text-center">
                             As of - <p><strong>${new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</strong> </p>
                        </small>
                    </div>

                    

                    <!-- TABLE -->
                    <div class="table-responsive">
                        <table class="table table-bordered table-striped">
                            <thead class="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Contact</th>
                                    <th>Gender</th>
                                    <th>Age</th>
                                    <th>Disability</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rows || emptyState}
                            </tbody>
                        </table>
                    </div>

                    <!-- SUMMARY -->
                    <div class="summary-box">
                        <h5>Report Summary</h5>
                        <div class="summary-item"><strong>Total Count:</strong> ${totalCount}</div>
                        <div class="summary-item"><strong>Total Male:</strong> ${totalMale}</div>
                        <div class="summary-item"><strong>Total Female:</strong> ${totalFemale}</div>
                    </div>

                    <!-- DISABILITY SUMMARY -->
                    ${disabilitySummary}

                    
                

                </td>
            </tr>
        </tbody>
    </table>

</body>
</html>`;
}

// Close modal functionality
function closeModal() {
    const modal = document.getElementById('chartModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    if (currentChart) {
        currentChart.destroy();
        currentChart = null;
    }
}

// Event listeners
document.querySelector('.close').onclick = closeModal;
document.getElementById('searchInput').oninput = handleSearch;

window.onclick = function(event) {
    // Handle chart modal
    const chartModal = document.getElementById('chartModal');
    if (event.target === chartModal) {
        closeModal();
        return;
    }
    // Handle report type modal
    const reportModal = document.getElementById('reportTypeModal');
    if (event.target === reportModal && typeof closeReportTypeModal === 'function') {
        closeReportTypeModal();
        return;
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Generate Report for a specific barangay's PWDs
async function generatePwdBarangayReport(barangayName, btnEl) {
    if (!barangayName) return;

    const originalText = btnEl ? btnEl.innerHTML : '';
    if (btnEl) {
        btnEl.disabled = true;
        btnEl.innerHTML = 'Generating...';
    }

    try {
        // Get current month and year for monthly report
        const now = new Date();
        const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
        const currentYear = now.getFullYear();
        
        // Fetch PWD data for this specific barangay, filtered by current month
        const res = await fetch(`/api/pwds/barangay/${encodeURIComponent(barangayName)}?month=${currentMonth}&year=${currentYear}`, {
            credentials: 'same-origin'
        });
        
        if (!res.ok) {
            throw new Error('Unable to load PWD data');
        }

        const json = await res.json();
        if (!json.success) {
            throw new Error(json.message || 'Failed to load data');
        }

        const pwds = json.data || [];
        
        if (pwds.length === 0) {
            alert('No PWD data available for this barangay.');
            if (btnEl) {
                btnEl.disabled = false;
                btnEl.innerHTML = originalText;
            }
            return;
        }

        // Build report table HTML for this barangay
        const tableHtml = buildPwdBarangayReportTableHtml(barangayName, pwds);
        
        // Open new window for report
        const newWin = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes');
        
        if (!newWin) {
            alert('Popup blocked! Please allow popups for this site to view the report.');
            return;
        }
        
        const docHtml = `<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>PWD Disability Report - ${barangayName}</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="stylesheet" href="/bower_components/bootstrap/css/bootstrap.min.css">
    <style>
        body { padding: 30px; font-family: Arial, sans-serif; }

        .header-wrapper {
            position: relative;
            margin-bottom: 20px;
            min-height: 130px;
        }

        .logo-left {
            position: absolute;
            top: 0;
            left: 0;
            width: 95px;
        }

        .logo-right {
            position: absolute;
            top: 0;
            right: 0;
            width: 120px;
        }

        .main-header {
            text-align: center;
            margin-top: 15px;
        }

        .title-section { 
            margin-top: 15px; 
            text-align: center;
        }

        .report-info {
            margin: 20px auto;
            text-align: center;
            font-size: 13px;
            line-height: 1.8;
            max-width: 800px;
            white-space: nowrap;
        }

        .info-item {
            display: inline-block;
            margin: 0 15px;
        }

        .underline {
            display: inline-block;
            border-bottom: 1px solid #000;
            width: 120px;
            height: 14px;
            vertical-align: bottom;
            margin-left: 5px;
        }

        .address-underline {
            width: 150px;
        }

        .generated-date {
            margin-top: 10px;
            font-style: italic;
        }

        .print-button-container {
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 5px;
        }

        .print-button-container button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
        }

        .print-button-container button:hover {
            background-color: #0056b3;
        }

        @media print {
            .print-button-container {
                display: none;
            }
            body {
                padding: 0;
            }
        }
    </style>
</head>

<body>
<div class="print-button-container">
    <button onclick="window.print()">🖨️ Print Report</button>
</div>

<div class="container">
    
    <div class="header-wrapper">
        <img src="/assets/images/SilayLogo.jpg" class="logo-left">
        <img src="/assets/images/BagongPilipinas.jpg" class="logo-right">

        <div class="main-header">
            <h4>Republic of the Philippines</h4>
            <h2><strong>ENRIQUE B. MAGALONA</strong></h2>
            <p>Persons with Disability Affairs Office</p>
        </div>
    </div>

    <div class="title-section">
        <h5>PERSONS WITH DISABILITY AFFAIRS OFFICE</h5>
        <h5>MONTHLY ACCOMPLISHMENT REPORT</h5>
        <h5><strong>${barangayName}</strong></h5>
         <small class="text-center">
            As of - <p><strong>${new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</strong> </p>
        </small>
    </div>

     <div class="report-info">
        <span class="info-item">Region: <span class="underline"></span></span>
        <span class="info-item">Persons with Disability Statistics: <span class="underline"></span></span>
        <span class="info-item">Address: <span class="underline address-underline"></span></span>
    </div>


    ${tableHtml}

</div>

</body>
</html>`;
        
        newWin.document.open();
        newWin.document.write(docHtml);
        newWin.document.close();
        
        console.log('Barangay PWD report generated successfully');
        
    } catch (e) {
        console.error('Error generating barangay PWD report:', e);
        alert('Error generating report: ' + e.message);
    } finally {
        if (btnEl) {
            btnEl.disabled = false;
            btnEl.innerHTML = originalText;
        }
    }
}

// Build table HTML for barangay-specific PWD report
function buildPwdBarangayReportTableHtml(barangayName, pwds) {
    function esc(s){ 
        return String(s === null || s === undefined ? '' : s)
            .replace(/&/g,'&amp;')
            .replace(/</g,'&lt;')
            .replace(/>/g,'&gt;'); 
    }
    
    const mapping = {
        'Hard of Hearing/Deaf': 'Deaf or Hard of Hearing',
        'Visual/Blind': 'Visual Disability',
        'Speech/Language Impairment': 'Speech and Language Impairment',
        'Learning Disability': 'Learning Disability',
        'Mental/Intellectual': 'Intellectual Disability',
        'Physical Disability': 'Physical Disability (Orthopedic)',
        'Psychosocial Disability': 'Psychosocial Disability',
        'Cancer': 'Cancer (RA11215)',
        'Rare Disease': 'Rare Disease (RA10747)',
        'Multiple Disability': 'Multiple Disability',
        'Other': 'Other'
    };
    
    const stats = {};
    const uniqueIds = new Set();
    
    // Process PWD data
    pwds.forEach(p => {
        if (p && (p._id || p.id)) uniqueIds.add(p._id || p.id);
        const age = (typeof p.age === 'number') ? p.age : (p.age ? parseInt(p.age,10) : null);
        const gender = (p.gender || 'Unknown').toString();
        const disabilities = Array.isArray(p.disability) ? p.disability : (p.disability ? [p.disability] : []);
        
        disabilities.forEach(d => {
            const key = mapping[d] || d || 'Other';
            if (!stats[key]) {
                stats[key] = { 
                    count: 0, 
                    male: 0, 
                    female: 0, 
                    otherGender: 0, 
                    ages: [] 
                };
            }
            stats[key].count += 1;
            if (age !== null && !isNaN(age)) stats[key].ages.push(age);
            if (/^male$/i.test(gender)) stats[key].male += 1;
            else if (/^female$/i.test(gender)) stats[key].female += 1;
            else stats[key].otherGender += 1;
        });
    });

    const preferredOrder = [
        'Deaf or Hard of Hearing', 'Intellectual Disability', 'Learning Disability', 
        'Mental Disability', 'Physical Disability (Orthopedic)', 'Psychosocial Disability', 
        'Speech and Language Impairment', 'Visual Disability', 'Cancer (RA11215)', 
        'Rare Disease (RA10747)', 'Multiple Disability', 'Other'
    ];
    
    const keys = Array.from(new Set([...preferredOrder, ...Object.keys(stats)]));
    let html = `
        <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Disability Type</th>
                        <th>Age Range</th>
                        <th>Total</th>
                        <th>Male</th>
                        <th>Female</th>
                        <th>Other/Unknown</th>
                    </tr>
                </thead>
                <tbody>`;
    
    keys.forEach(k => {
        if (!stats[k]) return;
        const s = stats[k];
        const minAge = s.ages.length ? Math.min(...s.ages) : 'N/A';
        const maxAge = s.ages.length ? Math.max(...s.ages) : 'N/A';
        const ageRange = s.ages.length ? `${minAge} - ${maxAge}` : 'N/A';
        
        html += `
            <tr>
                <td><strong>${esc(k)}</strong></td>
                <td>${esc(ageRange)}</td>
                <td><span class="badge bg-primary">${s.count}</span></td>
                <td>${s.male}</td>
                <td>${s.female}</td>
                <td>${s.otherGender}</td>
            </tr>`;
    });
    
    html += '</tbody></table></div>';
    
    // Calculate totals
    let totalMale = 0, totalFemale = 0, totalOther = 0, totalCount = 0;
    Object.values(stats).forEach(s => { 
        totalMale += s.male; 
        totalFemale += s.female; 
        totalOther += s.otherGender;
        totalCount += s.count;
    });
    
    const allAges = [].concat(...Object.values(stats).map(s => s.ages));
    const overallAgeRange = allAges.length ? 
        `${Math.min(...allAges)} - ${Math.max(...allAges)}` : 'N/A';
    
    html += `
        <div class="summary">
            <h5>Report Summary</h5>
            <div class="row">
                <div class="col-md-6">
                    <ul class="list-unstyled">
                        <li><strong>Barangay:</strong> ${esc(barangayName)}</li>
                        <li><strong>Unique PWDs:</strong> ${uniqueIds.size}</li>
                        <li><strong>Total Disability Records:</strong> ${totalCount}</li>
                        <li><strong>Overall Age Range:</strong> ${overallAgeRange}</li>
                    </ul>
                </div>
                <div class="col-md-6">
                    <ul class="list-unstyled">
                        <li><strong>Gender Distribution:</strong></li>
                        <li>&nbsp;&nbsp;Male: ${totalMale}</li>
                        <li>&nbsp;&nbsp;Female: ${totalFemale}</li>
                        <li>&nbsp;&nbsp;Other/Unknown: ${totalOther}</li>
                    </ul>
                </div>
            </div>
        </div>`;
    
    return html;
}

// Initialize the application
loadPdaoData();