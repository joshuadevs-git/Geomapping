// ======= STATIC DATA (FALLBACK) =======
const staticBarangayData = [
  { id: 1, name: "Barangay 1", lydoCount: 0 },
  { id: 2, name: "Barangay 2", lydoCount: 0 },
  { id: 3, name: "Barangay 3", lydoCount: 0 },
  { id: 4, name: "Barangay 4", lydoCount: 0 },
  { id: 5, name: "Barangay 5", lydoCount: 0 },
  { id: 6, name: "Barangay Mambulac", lydoCount: 0 },
  { id: 7, name: "Barangay Guinhalaran", lydoCount: 0 },
  { id: 8, name: "Barangay E-Lopez", lydoCount: 0 },
  { id: 9, name: "Barangay Bagtic", lydoCount: 0 },
  { id: 10, name: "Barangay Balaring", lydoCount: 0 },
  { id: 11, name: "Barangay Hawaiian", lydoCount: 0 },
  { id: 12, name: "Barangay Patag", lydoCount: 0 },
  { id: 13, name: "Barangay Kapt. Ramon", lydoCount: 0 },
  { id: 14, name: "Barangay Guimbalaon", lydoCount: 0 },
  { id: 15, name: "Barangay Rizal", lydoCount: 0 },
  { id: 16, name: "Barangay Lantad", lydoCount: 0 },
];

// ======= VARIABLES =======
let barangayData = {};
let currentChart = null;
let currentPage = 1;
const itemsPerPage = 5;
let filteredData = [];
let allData = [];
let currentChartType = 'doughnut';

let totalLYDO = 0;
let averageLYDO = 0;
let totalWithPension = 0;
let totalWithoutBenefits = 0;
let highestPopulation = { name: '', count: 0 };
let lowestPopulation = { name: '', count: Infinity };

// ======= AGE CALCULATION UTILITIES =======
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

function isWithinYouthAge(birthDate) {
  const age = calculateAge(birthDate);
  return age >= 15 && age <= 30;
}

function shouldArchive(birthDate) {
  const age = calculateAge(birthDate);
  return age > 30;
}

// ======= INITIALIZE DATA =======
function initializeData() {
  const entries = Object.entries(barangayData);

  // Compute totals
  totalLYDO = entries.reduce((sum, [_, data]) => sum + data.lydoCount, 0);
  averageLYDO = entries.length ? Math.round(totalLYDO / entries.length) : 0;

  // Find highest and lowest populations
  highestPopulation = { name: '', count: 0 };
  lowestPopulation = { name: '', count: Infinity };

  entries.forEach(([id, data]) => {
    if (data.lydoCount > highestPopulation.count) {
      highestPopulation = { name: data.name, count: data.lydoCount };
    }
    if (data.lydoCount < lowestPopulation.count && data.lydoCount > 0) {
      lowestPopulation = { name: data.name, count: data.lydoCount };
    }
  });

  // If no data, reset lowest
  if (lowestPopulation.count === Infinity) {
    lowestPopulation = { name: 'N/A', count: 0 };
  }

  // Update statistics display
  document.getElementById('totalLYDO').textContent = totalLYDO.toLocaleString();
  document.getElementById('averageLYDO').textContent = averageLYDO;

  // Convert barangayData into array
  allData = entries.map(([id, data]) => ({
    id: parseInt(id),
    name: data.name,
    lydoCount: data.lydoCount,
    withPension: data.withPension || 0,
    withoutBenefits: data.withoutBenefits || 0,
    percentage: totalLYDO ? ((data.lydoCount / totalLYDO) * 100).toFixed(1) : '0.0'
  }));

  filteredData = [...allData];
}

// ======= LOAD DATA FROM API =======
async function loadLydoData() {
  try {
    console.log('🔄 Loading youth data from API...');
    
    showLoadingState();
    
    const response = await fetch('/api/analytics/youth');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success && result.data) {
      console.log('✅ Youth data loaded successfully:', result.data);
      
      // Update statistics
      document.getElementById('totalBarangays').textContent = result.data.totalBarangays;
      document.getElementById('totalLYDO').textContent = result.data.totalLYDO.toLocaleString();
      document.getElementById('averageLYDO').textContent = result.data.averageLYDO;
      
      // Calculate pension and benefits statistics
      totalWithPension = result.data.totalWithPension || 0;
      totalWithoutBenefits = result.data.totalWithoutBenefits || 0;
      
      // Process barangay data
      barangayData = {};
      result.data.barangays.forEach(item => {
        barangayData[item.id] = {
          name: item.name,
          lydoCount: item.lydoCount,
          withPension: item.withPension || 0,
          withoutBenefits: item.withoutBenefits || 0
        };
      });
      
      initializeData();
      renderTable();
      renderPagination();
      
      hideLoadingState();
      
      await checkAndArchiveOverageYouth();
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('❌ Error loading youth data:', error);
    
    console.log('🔄 Falling back to static data...');
    loadStaticData();
    hideLoadingState();
    
    showErrorMessage('Failed to load youth data. Using fallback data.');
  }
}

// ======= AUTO-ARCHIVE FUNCTION =======
async function checkAndArchiveOverageYouth() {
  try {
    console.log('🔄 Checking for beneficiaries to auto-archive...');
    
    const response = await fetch('/api/beneficiaries/check-age', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success && result.archivedCount > 0) {
      console.log(`✅ Auto-archived ${result.archivedCount} beneficiaries over age 30`);
      
      showInfoMessage(`${result.archivedCount} beneficiary(ies) automatically archived (age > 30)`);
      
      setTimeout(() => {
        loadLydoData();
      }, 2000);
    }
  } catch (error) {
    console.error('⚠️ Error checking auto-archive:', error);
  }
}

// ======= LOAD STATIC DATA (FALLBACK) =======
function loadStaticData() {
  barangayData = {};

  staticBarangayData.forEach(item => {
    barangayData[item.id] = {
      name: item.name,
      lydoCount: item.lydoCount,
      withPension: 0,
      withoutBenefits: 0
    };
  });

  initializeData();
  renderTable();
  renderPagination();
}

// ======= LOADING STATE FUNCTIONS =======
function showLoadingState() {
  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = `
    <tr>
      <td colspan="3" style="text-align: center; padding: 40px;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
          <div class="spinner" style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <p style="margin: 0; color: #666;">Loading youth data...</p>
        </div>
      </td>
    </tr>
  `;
  
  if (!document.querySelector('#spinner-style')) {
    const style = document.createElement('style');
    style.id = 'spinner-style';
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

function hideLoadingState() {
  // Loading state will be replaced by renderTable()
}

function showErrorMessage(message) {
  showNotification(message, '#ff6b6b');
}

function showInfoMessage(message) {
  showNotification(message, '#4CAF50');
}

function showNotification(message, bgColor) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${bgColor};
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 10000;
    font-family: Arial, sans-serif;
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }, 5000);
  
  if (!document.querySelector('#notification-animations')) {
    const style = document.createElement('style');
    style.id = 'notification-animations';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// ======= RENDER TABLE =======
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
    const row = document.createElement('tr');
    const safeBarangay = item.name.replace(/"/g, '&quot;');
    row.innerHTML = `
      <td class="barangay-name">${item.name}</td>
      <td class="lydo-count">${item.lydoCount.toLocaleString()}</td>
      <td>
        <button class="view-chart-btn" onclick="showChart(${item.id})">
          View Analytics
        </button>
        <button class="view-chart-btn" data-barangay="${safeBarangay}" onclick="openYouthBarangayPrint(this.dataset.barangay, this)" style="margin-left: 8px;">
          Print
        </button>
        <button class="view-chart-btn" data-barangay="${safeBarangay}" onclick="generateYouthBarangayReport(this.dataset.barangay, this)" style="margin-left: 8px;">
          Monthly Report
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// ======= PAGINATION =======
function renderPagination() {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginationControls = document.getElementById('paginationControls');
  const paginationInfo = document.getElementById('paginationInfo');

  const startItem = filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredData.length);
  paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${filteredData.length} entries`;

  paginationControls.innerHTML = '';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'page-btn';
  prevBtn.innerHTML = '◀';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => changePage(currentPage - 1);
  paginationControls.appendChild(prevBtn);

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

  const nextBtn = document.createElement('button');
  nextBtn.className = 'page-btn';
  nextBtn.innerHTML = '▶';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => changePage(currentPage + 1);
  paginationControls.appendChild(nextBtn);
}

function changePage(page) {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    renderTable();
    renderPagination();
  }
}

// ======= SEARCH FUNCTION =======
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

// ======= SHOW CHART MODAL =======
function showChart(barangayId) {
  const barangay = allData.find(item => item.id === barangayId);
  const modal = document.getElementById('chartModal');
  const modalTitle = document.getElementById('modalTitle');
  const chartInfo = document.getElementById('chartInfo');

  modalTitle.textContent = `${barangay.name} - Complete Analytics`;
  modalTitle.dataset.barangayId = barangayId;
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';

  // Calculate percentages
  const pensionPercentage = barangay.lydoCount > 0 
    ? ((barangay.withPension / barangay.lydoCount) * 100).toFixed(1) 
    : '0.0';
  const withoutBenefitsPercentage = barangay.lydoCount > 0 
    ? ((barangay.withoutBenefits / barangay.lydoCount) * 100).toFixed(1) 
    : '0.0';
  const othersPercentage = (100 - parseFloat(barangay.percentage)).toFixed(1);

  // Generate insights
  let insights = [];
  if (barangay.lydoCount === highestPopulation.count) {
    insights.push('🏆 This barangay has the HIGHEST youth population');
  }
  if (barangay.lydoCount === lowestPopulation.count && barangay.lydoCount > 0) {
    insights.push('📊 This barangay has the LOWEST youth population');
  }
  if (parseFloat(pensionPercentage) > 50) {
    insights.push('✅ Majority of youth have pension benefits');
  } else if (parseFloat(pensionPercentage) < 20) {
    insights.push('⚠️ Low pension coverage - requires attention');
  }
  if (parseFloat(withoutBenefitsPercentage) > 50) {
    insights.push('❗ High percentage without any benefits');
  }
  if (barangay.lydoCount > averageLYDO) {
    insights.push('📈 Above average youth population');
  } else if (barangay.lydoCount < averageLYDO) {
    insights.push('📉 Below average youth population');
  }

  // Update modal info with comprehensive statistics
  chartInfo.innerHTML = `
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="margin-top: 0; color: #061727; border-bottom: 2px solid #415E72; padding-bottom: 10px;">
        📊 ${barangay.name} Complete Statistics
      </h3>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
        <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #061727;">
          <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase;">Total Registered LYDO</p>
          <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #061727;">
            ${barangay.lydoCount.toLocaleString()}
          </p>
        </div>
        
        <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #28a745;">
          <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase;">Percentage with Pension</p>
          <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #28a745;">
            ${pensionPercentage}%
          </p>
          <p style="margin: 5px 0 0 0; color: #666; font-size: 11px;">
            (${barangay.withPension.toLocaleString()} out of ${barangay.lydoCount.toLocaleString()})
          </p>
        </div>
        
        <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #dc3545;">
          <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase;">Without Benefits</p>
          <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #dc3545;">
            ${withoutBenefitsPercentage}%
          </p>
          <p style="margin: 5px 0 0 0; color: #666; font-size: 11px;">
            (${barangay.withoutBenefits.toLocaleString()} out of ${barangay.lydoCount.toLocaleString()})
          </p>
        </div>
        
        <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #415E72;">
          <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase;">% of Total LYDO</p>
          <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #415E72;">
            ${barangay.percentage}%
          </p>
          <p style="margin: 5px 0 0 0; color: #666; font-size: 11px;">
            Other Barangays: ${othersPercentage}%
          </p>
        </div>
      </div>
      
      <div style="margin-top: 20px; background: white; padding: 15px; border-radius: 6px;">
        <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase; margin-bottom: 10px;">
          📍 Comparative Data
        </p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px;">
          <div>
            <strong>🏆 Highest Population:</strong><br/>
            ${highestPopulation.name} (${highestPopulation.count.toLocaleString()})
          </div>
          <div>
            <strong>📊 Lowest Population:</strong><br/>
            ${lowestPopulation.name} (${lowestPopulation.count.toLocaleString()})
          </div>
          <div>
            <strong>📈 Average LYDO:</strong><br/>
            ${averageLYDO.toLocaleString()} per barangay
          </div>
          <div>
            <strong>🎯 Total LYDO:</strong><br/>
            ${totalLYDO.toLocaleString()} across all barangays
          </div>
        </div>
      </div>
      
      ${insights.length > 0 ? `
        <div style="margin-top: 20px; background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107;">
          <p style="margin: 0; color: #856404; font-size: 12px; text-transform: uppercase; margin-bottom: 10px;">
            💡 Key Insights
          </p>
          <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 13px;">
            ${insights.map(insight => `<li style="margin-bottom: 5px;">${insight}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      <p style="color: #666; font-size: 11px; margin-top: 15px; margin-bottom: 0; text-align: center;">
        <em>* Data filtered for ages 15-30 only</em>
      </p>
    </div>
  `;

  // Reset to default chart
  currentChartType = 'doughnut';
  document.querySelectorAll('.chart-type-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector('[onclick="switchChartType(\'doughnut\')"]').classList.add('active');

  document.getElementById('chartContainer').style.display = 'block';
  document.getElementById('tableContainer').style.display = 'none';

  updateChart();
}

// ======= UPDATE CHART =======
function updateChart() {
  const barangayId = parseInt(document.getElementById('modalTitle').dataset.barangayId);
  const barangay = allData.find(item => item.id === barangayId);

  if (!barangay) return;

  const selectedPercentage = parseFloat(barangay.percentage);
  const othersPercentage = 100 - selectedPercentage;

  if (currentChart) {
    currentChart.destroy();
  }

  const ctx = document.getElementById('pieChart').getContext('2d');
  currentChart = new Chart(ctx, {
    type: currentChartType,
    data: {
      labels: [barangay.name, 'Other Barangays'],
      datasets: [{
        data: [selectedPercentage, othersPercentage],
        backgroundColor: ['#061727', '#415E72'],
        borderColor: ['#061727', '#FDFAF6'],
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
            font: { size: 14, weight: 'bold' }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              return `${label}: ${value.toFixed(1)}%`;
            }
          },
          titleFont: { size: 16 },
          bodyFont: { size: 14 },
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

// ======= SWITCH CHART TYPE =======
function switchChartType(type) {
  currentChartType = type;
  const chartContainer = document.getElementById('chartContainer');
  const tableContainer = document.getElementById('tableContainer');
  const chartTypeButtons = document.querySelectorAll('.chart-type-btn');

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

// ======= RENDER CHART TABLE =======
function renderChartTable() {
  const tableBody = document.getElementById('chartTableBody');
  const currentBarangay = allData.find(item => item.id === parseInt(document.getElementById('modalTitle').dataset.barangayId));

  if (!currentBarangay) return;

  const data = [
    { name: currentBarangay.name, percentage: currentBarangay.percentage },
    { name: 'Other Barangays', percentage: (100 - parseFloat(currentBarangay.percentage)).toFixed(1) }
  ];

  tableBody.innerHTML = '';
  data.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="display: flex; align-items: center;">
        <div style="width: 20px; height: 20px; background-color: ${index === 0 ? '#061727' : '#415E72'}; margin-right: 10px; border-radius: 4px;"></div>
        ${item.name}
      </td>
      <td><strong>${item.percentage}%</strong></td>
    `;
    tableBody.appendChild(row);
  });
}

// ======= CLOSE MODAL =======
function closeModal() {
  const modal = document.getElementById('chartModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';

  if (currentChart) {
    currentChart.destroy();
    currentChart = null;
  }
}

// ======= PRINT FUNCTIONALITY =======
// Open printable view for a barangay's Youths
async function openYouthBarangayPrint(barangayName, btnEl) {
  if (!barangayName) return;

  const originalText = btnEl ? btnEl.innerHTML : '';
  if (btnEl) {
    btnEl.disabled = true;
    btnEl.innerHTML = 'Loading...';
  }

  try {
    const res = await fetch(`/api/youths/barangay/${encodeURIComponent(barangayName)}`, {
      credentials: 'same-origin'
    });
    if (!res.ok) throw new Error('Unable to load Youth data');

    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to load data');

    const printHtml = buildYouthBarangayPrintHtml(barangayName, json.data || []);

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

// Build printable HTML for barangay Youths
function buildYouthBarangayPrintHtml(barangayName, youths) {
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Calculate summary statistics
  let totalCount = 0;
  let totalMale = 0;
  let totalFemale = 0;
  const educationCounts = {};
  const employmentCounts = {};
  let skRegistered = 0;
  let skVoted = 0;
  let nationalRegistered = 0;

  const rows = (youths && youths.length
    ? youths
    : []).map((youth, idx) => {
      totalCount++;
      const gender = (youth.gender || '').toString().toLowerCase();
      if (gender === 'male') {
        totalMale++;
      } else if (gender === 'female') {
        totalFemale++;
      }

      // Count education levels
      const eduLevel = youth.education_level || 'Not Specified';
      educationCounts[eduLevel] = (educationCounts[eduLevel] || 0) + 1;

      // Count employment status
      const empStatus = youth.employment_status || 'Not Specified';
      employmentCounts[empStatus] = (employmentCounts[empStatus] || 0) + 1;

      // Count registrations
      if (youth.registered_sk === 'Yes' || youth.registered_sk === true) {
        skRegistered++;
      }
      if (youth.voted_sk === 'Yes' || youth.voted_sk === true) {
        skVoted++;
      }
      if (youth.registered_national === 'Yes' || youth.registered_national === true) {
        nationalRegistered++;
      }

      return `
        <tr>
          <td>${idx + 1}</td>
          <td>${esc(youth.fullName || 'N/A')}</td>
          <td>${esc(youth.contact || 'N/A')}</td>
          <td>${esc(youth.gender || 'N/A')}</td>
          <td>${esc(youth.age ?? 'N/A')}</td>
          <td>${esc(youth.education_level || 'N/A')}</td>
          <td>${esc(youth.employment_status || 'N/A')}</td>
        </tr>
      `;
    }).join('');

  const emptyState = `
    <tr>
      <td colspan="7" class="text-center">No Youths found for this barangay.</td>
    </tr>
  `;

  // Build education summary HTML
  const educationSummaryRows = Object.entries(educationCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([edu, count]) => `
      <tr>
        <td>${esc(edu)}</td>
        <td><strong>${count}</strong></td>
      </tr>
    `).join('');

  const educationSummary = educationSummaryRows ? `
    <div class="mt-4">
      <h5>Education Level Summary</h5>
      <div class="table-responsive">
        <table class="table table-bordered table-sm">
          <thead class="table-secondary">
            <tr>
              <th>Education Level</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            ${educationSummaryRows}
          </tbody>
        </table>
      </div>
    </div>
  ` : '';

  // Build employment summary HTML
  const employmentSummaryRows = Object.entries(employmentCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([emp, count]) => `
      <tr>
        <td>${esc(emp)}</td>
        <td><strong>${count}</strong></td>
      </tr>
    `).join('');

  const employmentSummary = employmentSummaryRows ? `
    <div class="mt-4">
      <h5>Employment Status Summary</h5>
      <div class="table-responsive">
        <table class="table table-bordered table-sm">
          <thead class="table-secondary">
            <tr>
              <th>Employment Status</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            ${employmentSummaryRows}
          </tbody>
        </table>
      </div>
    </div>
  ` : '';

  return `<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>${esc(barangayName)} - Youths</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="stylesheet" href="/bower_components/bootstrap/css/bootstrap.min.css">

    <style>
        /* ================= PAGE ================= */
        @page {
            size: A4 portrait;
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
                            <p>Local Youth Development Office</p>
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
                        <h5 class="mb-0">Youth - ${esc(barangayName)}</h5>
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
                                    <th>Education Level</th>
                                    <th>Employment Status</th>
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
                        <div class="summary-item"><strong>SK Registered:</strong> ${skRegistered}</div>
                        <div class="summary-item"><strong>SK Voted:</strong> ${skVoted}</div>
                        <div class="summary-item"><strong>National Registered:</strong> ${nationalRegistered}</div>
                    </div>

                    <!-- EDUCATION SUMMARY -->
                    ${educationSummary}

                    <!-- EMPLOYMENT SUMMARY -->
                    ${employmentSummary}

                    

                

                </td>
            </tr>
        </tbody>
    </table>

</body>
</html>`;
}

// Make function globally available
window.openYouthBarangayPrint = openYouthBarangayPrint;

// Generate Monthly Report for a specific barangay's Youths
async function generateYouthBarangayReport(barangayName, btnEl) {
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
    
    // Fetch Youth data for this specific barangay, filtered by current month
    const res = await fetch(`/api/youths/barangay/${encodeURIComponent(barangayName)}?month=${currentMonth}&year=${currentYear}`, {
      credentials: 'same-origin'
    });
    
    if (!res.ok) {
      throw new Error('Unable to load Youth data');
    }

    const json = await res.json();
    if (!json.success) {
      throw new Error(json.message || 'Failed to load data');
    }

    const youths = json.data || [];
    
    if (youths.length === 0) {
      alert('No Youth data available for this barangay for the current month.');
      if (btnEl) {
        btnEl.disabled = false;
        btnEl.innerHTML = originalText;
      }
      return;
    }

    // Build report table HTML for this barangay
    const tableHtml = buildYouthBarangayReportTableHtml(barangayName, youths);
    
    // Get month name
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[currentMonth - 1];
    
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
    <title>LYDO Youth Report - ${barangayName}</title>
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
            <p>Local Youth Development Office</p>
        </div>
    </div>

    <div class="title-section">
        <h5>LOCAL YOUTH DEVELOPMENT OFFICE</h5>
        <h5>MONTHLY ACCOMPLISHMENT REPORT</h5>
        <h5><strong>${barangayName}</strong></h5>
         <small class="text-center">
            As of - <p><strong>${new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</strong> </p>
        </small>
    </div>

     <div class="report-info">
        <span class="info-item">Region: <span class="underline"></span></span>
        <span class="info-item">Youth Statistics: <span class="underline"></span></span>
        <span class="info-item">Address: <span class="underline address-underline"></span></span>
    </div>


    ${tableHtml}

</div>

</body>
</html>`;
        
    newWin.document.open();
    newWin.document.write(docHtml);
    newWin.document.close();
    
    console.log('Barangay Youth report generated successfully');
    
  } catch (e) {
    console.error('Error generating barangay Youth report:', e);
    alert('Error generating report: ' + e.message);
  } finally {
    if (btnEl) {
      btnEl.disabled = false;
      btnEl.innerHTML = originalText;
    }
  }
}

// Build table HTML for barangay-specific Youth monthly report
function buildYouthBarangayReportTableHtml(barangayName, youths) {
  function esc(s){ 
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;'); 
  }
  
  // Statistics by category
  const stats = {
    gender: { male: 0, female: 0, other: 0 },
    education: {},
    employment: {},
    skRegistration: { registered: 0, notRegistered: 0 },
    skVoting: { voted: 0, notVoted: 0 },
    nationalRegistration: { registered: 0, notRegistered: 0 },
    ageGroups: { '15-17': 0, '18-24': 0, '25-30': 0 }
  };
  
  const uniqueIds = new Set();
  const ages = [];
  
  // Process Youth data
  youths.forEach(y => {
    if (y && (y.id || y._id)) uniqueIds.add(y.id || y._id);
    
    const age = (typeof y.age === 'number') ? y.age : (y.age ? parseInt(y.age, 10) : null);
    if (age !== null && !isNaN(age)) ages.push(age);
    
    const gender = (y.gender || 'Unknown').toString();
    if (/^male$/i.test(gender)) stats.gender.male += 1;
    else if (/^female$/i.test(gender)) stats.gender.female += 1;
    else stats.gender.other += 1;
    
    // Education level
    const eduLevel = y.education_level || 'Not Specified';
    stats.education[eduLevel] = (stats.education[eduLevel] || 0) + 1;
    
    // Employment status
    const empStatus = y.employment_status || 'Not Specified';
    stats.employment[empStatus] = (stats.employment[empStatus] || 0) + 1;
    
    // SK Registration
    if (y.registered_sk === 'Yes' || y.registered_sk === true) {
      stats.skRegistration.registered += 1;
    } else {
      stats.skRegistration.notRegistered += 1;
    }
    
    // SK Voting
    if (y.voted_sk === 'Yes' || y.voted_sk === true) {
      stats.skVoting.voted += 1;
    } else {
      stats.skVoting.notVoted += 1;
    }
    
    // National Registration
    if (y.registered_national === 'Yes' || y.registered_national === true) {
      stats.nationalRegistration.registered += 1;
    } else {
      stats.nationalRegistration.notRegistered += 1;
    }
    
    // Age groups
    if (age !== null && !isNaN(age)) {
      if (age >= 15 && age <= 17) stats.ageGroups['15-17'] += 1;
      else if (age >= 18 && age <= 24) stats.ageGroups['18-24'] += 1;
      else if (age >= 25 && age <= 30) stats.ageGroups['25-30'] += 1;
    }
  });

  let html = `
    <div class="table-responsive">
      <table class="table table-striped table-bordered table-hover">
        <thead class="table-dark">
          <tr>
            <th>Category</th>
            <th>Details</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>`;
  
  // Gender Distribution
  html += `
      <tr>
        <td rowspan="4"><strong>Gender Distribution</strong></td>
        <td>Male</td>
        <td><span class="badge bg-primary">${stats.gender.male}</span></td>
      </tr>
      <tr>
        <td>Female</td>
        <td><span class="badge bg-primary">${stats.gender.female}</span></td>
      </tr>
      <tr>
        <td>Other/Unknown</td>
        <td><span class="badge bg-primary">${stats.gender.other}</span></td>
      </tr>
      <tr>
        <td><strong>Total</strong></td>
        <td><strong>${stats.gender.male + stats.gender.female + stats.gender.other}</strong></td>
      </tr>`;
  
  // Age Groups
  html += `
      <tr>
        <td rowspan="4"><strong>Age Groups</strong></td>
        <td>15-17 years</td>
        <td><span class="badge bg-info">${stats.ageGroups['15-17']}</span></td>
      </tr>
      <tr>
        <td>18-24 years</td>
        <td><span class="badge bg-info">${stats.ageGroups['18-24']}</span></td>
      </tr>
      <tr>
        <td>25-30 years</td>
        <td><span class="badge bg-info">${stats.ageGroups['25-30']}</span></td>
      </tr>
      <tr>
        <td><strong>Total</strong></td>
        <td><strong>${stats.ageGroups['15-17'] + stats.ageGroups['18-24'] + stats.ageGroups['25-30']}</strong></td>
      </tr>`;
  
  // Education Level
  const eduKeys = Object.keys(stats.education);
  if (eduKeys.length > 0) {
    html += `<tr><td rowspan="${eduKeys.length + 1}"><strong>Education Level</strong></td>`;
    eduKeys.forEach(edu => {
      html += `
      <tr>
        <td>${esc(edu)}</td>
        <td><span class="badge bg-success">${stats.education[edu]}</span></td>
      </tr>`;
    });
    html += `<tr><td><strong>Total</strong></td><td><strong>${Object.values(stats.education).reduce((a, b) => a + b, 0)}</strong></td></tr></tr>`;
  }
  
  // Employment Status
  const empKeys = Object.keys(stats.employment);
  if (empKeys.length > 0) {
    html += `<tr><td rowspan="${empKeys.length + 1}"><strong>Employment Status</strong></td>`;
    empKeys.forEach(emp => {
      html += `
      <tr>
        <td>${esc(emp)}</td>
        <td><span class="badge bg-warning">${stats.employment[emp]}</span></td>
      </tr>`;
    });
    html += `<tr><td><strong>Total</strong></td><td><strong>${Object.values(stats.employment).reduce((a, b) => a + b, 0)}</strong></td></tr></tr>`;
  }
  
  // SK Registration
  html += `
      <tr>
        <td rowspan="3"><strong>SK Registration</strong></td>
        <td>Registered</td>
        <td><span class="badge bg-success">${stats.skRegistration.registered}</span></td>
      </tr>
      <tr>
        <td>Not Registered</td>
        <td><span class="badge bg-secondary">${stats.skRegistration.notRegistered}</span></td>
      </tr>
      <tr>
        <td><strong>Total</strong></td>
        <td><strong>${stats.skRegistration.registered + stats.skRegistration.notRegistered}</strong></td>
      </tr>`;
  
  // SK Voting
  html += `
      <tr>
        <td rowspan="3"><strong>SK Voting</strong></td>
        <td>Voted</td>
        <td><span class="badge bg-success">${stats.skVoting.voted}</span></td>
      </tr>
      <tr>
        <td>Not Voted</td>
        <td><span class="badge bg-secondary">${stats.skVoting.notVoted}</span></td>
      </tr>
      <tr>
        <td><strong>Total</strong></td>
        <td><strong>${stats.skVoting.voted + stats.skVoting.notVoted}</strong></td>
      </tr>`;
  
  // National Registration
  html += `
      <tr>
        <td rowspan="3"><strong>National Registration</strong></td>
        <td>Registered</td>
        <td><span class="badge bg-success">${stats.nationalRegistration.registered}</span></td>
      </tr>
      <tr>
        <td>Not Registered</td>
        <td><span class="badge bg-secondary">${stats.nationalRegistration.notRegistered}</span></td>
      </tr>
      <tr>
        <td><strong>Total</strong></td>
        <td><strong>${stats.nationalRegistration.registered + stats.nationalRegistration.notRegistered}</strong></td>
      </tr>`;
  
  html += '</tbody></table></div>';
  
  // Calculate totals
  const totalYouths = uniqueIds.size;
  const totalRecords = youths.length;
  const overallAgeRange = ages.length ? 
    `${Math.min(...ages)} - ${Math.max(...ages)}` : 'N/A';
  
  html += `
    <div class="summary">
      <h5>Report Summary</h5>
      <div class="row">
        <div class="col-md-6">
          <ul class="list-unstyled">
            <li><strong>Barangay:</strong> ${esc(barangayName)}</li>
            <li><strong>Unique Youth Records:</strong> ${totalYouths}</li>
            <li><strong>Total Records:</strong> ${totalRecords}</li>
            <li><strong>Overall Age Range:</strong> ${overallAgeRange}</li>
          </ul>
        </div>
        <div class="col-md-6">
          <ul class="list-unstyled">
            <li><strong>Gender Distribution:</strong></li>
            <li>&nbsp;&nbsp;Male: ${stats.gender.male}</li>
            <li>&nbsp;&nbsp;Female: ${stats.gender.female}</li>
            <li>&nbsp;&nbsp;Other/Unknown: ${stats.gender.other}</li>
          </ul>
        </div>
      </div>
    </div>`;
  
  return html;
}

// Make function globally available
window.generateYouthBarangayReport = generateYouthBarangayReport;

// ======= EVENT LISTENERS =======
document.querySelector('.close').onclick = closeModal;
document.getElementById('searchInput').oninput = handleSearch;

window.onclick = function(event) {
  const modal = document.getElementById('chartModal');
  if (event.target === modal) {
    closeModal();
  }
};

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
});

// ======= START APP =======
loadLydoData();