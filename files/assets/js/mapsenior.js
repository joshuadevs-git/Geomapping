define([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/GeoJSONLayer",
  "esri/Graphic",
  "esri/widgets/Expand",
  "esri/widgets/BasemapToggle",
  "esri/widgets/ScaleBar",
  "esri/widgets/Compass"
], function(Map, MapView, GeoJSONLayer, Graphic, Expand, BasemapToggle, ScaleBar, Compass) {
  
  // 🎨 Add clean, responsive CSS styles
  const modernStyles = document.createElement('style');
  modernStyles.textContent = `
    /* Clean Modern UI Styles */
    .modern-panel {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      transition: all 0.3s ease;
    }
    
    .modern-panel:hover {
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    }
    
    /* Header */
    .header-container {
      position: absolute;
      top: 15px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 24px;
      z-index: 1000;
      text-align: center;
    }
    
    .header-title {
      font-size: 16px;
      font-weight: 600;
      color: #2c3e50;
      margin: 0;
    }
    
    .header-subtitle {
      font-size: 11px;
      color: #7f8c8d;
      margin: 2px 0 0 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    /* Legend - Compact & Responsive */
    .legend-container {
      position: absolute;
      top: 80px;
      right: 15px;
      padding: 12px 16px;
      min-width: 160px;
      z-index: 1000;
    }
    
    .legend-title {
      font-size: 11px;
      font-weight: 600;
      color: #2c3e50;
      margin: 0 0 10px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
      font-size: 11px;
      color: #34495e;
    }
    
    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      flex-shrink: 0;
    }
    
    /* Stats - Compact */
    .stats-container {
      position: absolute;
      bottom: 100px;
      left: 15px;
      padding: 12px 16px;
      max-width: 280px;
      z-index: 1000;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-top: 10px;
    }
    
    .stat-item {
      text-align: center;
      padding: 8px 6px;
      background: rgba(52, 152, 219, 0.08);
      border-radius: 8px;
      border: 1px solid rgba(52, 152, 219, 0.15);
    }
    
    .stat-number {
      font-size: 16px;
      font-weight: 700;
      color: #3498db;
      display: block;
      line-height: 1;
    }
    
    .stat-label {
      font-size: 9px;
      color: #7f8c8d;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 4px;
    }
    
    .stat-highlight {
      grid-column: 1 / -1;
      margin-top: 8px;
      padding: 8px 10px;
      background: rgba(46, 204, 113, 0.12);
      border-radius: 8px;
      font-size: 10px;
      text-align: center;
    }
    
    .stat-highlight strong {
      color: #27ae60;
      font-weight: 600;
    }
    
    /* Quick Guide */
    .guide-container {
      position: absolute;
      top: 200px;
      right: 15px;
      padding: 12px 16px;
      max-width: 200px;
      z-index: 999;
      display: none;
    }
    
    .guide-container.visible {
      display: block;
    }
    
    .guide-text {
      font-size: 11px;
      line-height: 1.6;
      color: #34495e;
      margin: 8px 0 0 0;
    }
    
    .guide-text p {
      margin: 0 0 8px 0;
    }
    
    .guide-text strong {
      color: #3498db;
      font-weight: 600;
    }
    
    .info-button {
      position: absolute;
      top: 80px;
      right: 190px;
      background: white;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      font-size: 16px;
      transition: all 0.2s ease;
    }
    
    .info-button:hover {
      background: #3498db;
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
    }
    
    .info-button:hover::after {
      color: white;
    }
    
    .info-button::after {
      content: 'ℹ️';
    }
    
    /* Custom Popup - Small & Clean */
    .esri-popup__main-container {
      max-width: 280px !important;
      width: 280px !important;
    }
    
    .esri-popup__header {
      background: linear-gradient(135deg, #3498db, #2980b9) !important;
      padding: 10px 12px !important;
    }
    
    .esri-popup__header-title {
      color: white !important;
      font-size: 13px !important;
      font-weight: 600 !important;
    }
    
    .esri-popup__content {
      padding: 12px !important;
    }
    
    .esri-popup__button {
      color: white !important;
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .header-container {
        top: 10px;
        padding: 8px 16px;
      }
      
      .header-title {
        font-size: 14px;
      }
      
      .header-subtitle {
        font-size: 10px;
      }
      
      .legend-container,
      .stats-container,
      .info-button {
        display: none;
      }
      
      .legend-container.mobile-show,
      .stats-container.mobile-show,
      .guide-container.mobile-show {
        display: block;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        z-index: 2000;
      }
      
      .mobile-toggle {
        position: absolute;
        bottom: 15px;
        right: 15px;
        padding: 10px 16px;
        background: white;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        color: #3498db;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        z-index: 1000;
      }
      
      .mobile-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1999;
      }
      
      .mobile-overlay.active {
        display: block;
      }
    }
    
    @media (max-width: 480px) {
      .esri-popup__main-container {
        max-width: 240px !important;
        width: 240px !important;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
    
    @media (max-width: 768px) {
      .info-button {
        right: 15px;
        display: flex;
      }
      
      .guide-container {
        right: 15px;
      }
    }
  `;
  document.head.appendChild(modernStyles);

  // 1️⃣ Create the base map
  const map = new Map({
    basemap: "gray-vector"
  });

  // 2️⃣ Create the view with responsive padding
  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [123.067, 10.8439],
    zoom: 11,
    padding: {
      left: 10,
      right: 190,
      top: 70,
      bottom: 80
    },
    popup: {
      dockEnabled: false,
      dockOptions: {
        buttonEnabled: false
      },
      collapseEnabled: false
    }
  });

  // 3️⃣ Add widgets
  const basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: "satellite"
  });
  view.ui.add(basemapToggle, "bottom-right");

  const scaleBar = new ScaleBar({
    view: view,
    unit: "metric"
  });
  view.ui.add(scaleBar, "bottom-left");

  const compass = new Compass({
    view: view
  });
  view.ui.add(compass, "top-left");

  // 4️⃣ Barangay data storage
  let barangays = [];

  // 5️⃣ Load Enrique B. Magalona Boundary
  fetch("/assets/data/all_barangays.geojson")
    .then(res => res.json())
    .then(geojson => {
      const blob = new Blob([JSON.stringify(geojson)], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const boundaryLayer = new GeoJSONLayer({
        url: url,
        renderer: {
          type: "simple",
          symbol: {
            type: "simple-fill",
            color: [52, 152, 219, 0.05],
            outline: { 
              color: [52, 152, 219, 0.6], 
              width: 2,
              style: "dash"
            }
          }
        }
      });

      map.add(boundaryLayer);
    })
    .catch(err => console.error("Error loading boundary:", err));

  // 6️⃣ Function to add barangay markers
  function addBarangayMarkers(barangayData) {
    view.graphics.removeAll();
    
    barangayData.forEach(b => {
      const point = {
        type: "point",
        longitude: b.lon,
        latitude: b.lat
      };

      // Color coding
      let markerColor, markerSize, category;
      const seniorCountNum = Number(b.seniorCount || 0);

      // Make non-zero values visually distinct (0 and 1 were both in "Low" before)
      if (seniorCountNum === 0) {
        markerColor = [189, 195, 199]; // Gray
        markerSize = "16px";
        category = "None";
      } else if (seniorCountNum >= 70) {
        markerColor = [231, 76, 60]; // Red
        markerSize = "24px";
        category = "High";
      } else if (seniorCountNum >= 40) {
        markerColor = [241, 196, 15]; // Yellow
        markerSize = "22px";
        category = "Medium";
      } else {
        markerColor = [46, 204, 113]; // Green
        markerSize = "20px";
        category = "Low";
      }

      const markerSymbol = {
        type: "simple-marker",
        color: markerColor,   // ✅ keeps your color logic
        size: markerSize,
        outline: {
          color: "white",
          width: 1.5
        },
        style: "path",
        path: "M16 0C9.4 0 4 5.4 4 12c0 7.5 12 20 12 20s12-12.5 12-20C28 5.4 22.6 0 16 0z"
      };

      const seniorPercentage = b.population && b.population > 0
        ? ((b.seniorCount / b.population) * 100).toFixed(1)
        : null;

      // Compact popup content
      const popupContent = `
        <div style="font-family: -apple-system, sans-serif; padding: 4px;">
          
          <!-- Stats Grid -->
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-bottom: 8px;">
            <div style="text-align: center; padding: 6px; background: #ecf0f1; border-radius: 6px;">
              <strong style="font-size: 16px; color: #3498db;">${seniorCountNum}</strong>
              <div style="font-size: 9px; color: #7f8c8d;">Seniors</div>
            </div>
            <div style="text-align: center; padding: 6px; background: #ecf0f1; border-radius: 6px;">
              <strong style="font-size: 16px; color: #3498db;">
                ${seniorPercentage !== null ? `${seniorPercentage}%` : 'N/A'}
              </strong>
              <div style="font-size: 9px; color: #7f8c8d;">of Pop.</div>
            </div>
          </div>

          <!-- Gender -->
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-bottom: 8px;">
            <div style="text-align: center; padding: 5px; background: #3498db; color: white; border-radius: 5px;">
              <strong style="font-size: 13px;">${b.maleCount || 0}</strong>
              <span style="font-size: 9px;"> Male</span>
            </div>
            <div style="text-align: center; padding: 5px; background: #e91e63; color: white; border-radius: 5px;">
              <strong style="font-size: 13px;">${b.femaleCount || 0}</strong>
              <span style="font-size: 9px;"> Female</span>
            </div>
          </div>

          <!-- Population -->
          <div style="padding: 5px; background: linear-gradient(90deg, #3498db, #2980b9); color: white; border-radius: 5px; text-align: center; font-size: 11px; margin-bottom: 8px;">
            <strong>Population: ${b.population.toLocaleString()}</strong>
          </div>

          <!-- Category -->
          <div style="margin-top: 8px; font-size: 10px; color: #7f8c8d; text-align: center;">
            <strong style="color: ${markerColor[0] === 231 ? '#e74c3c' : markerColor[0] === 241 ? '#f1c40f' : '#2ecc71'};">${category}</strong> Senior Concentration
          </div>
        </div>
      `;

      const pointGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol,
        attributes: { 
          name: b.name, 
          seniorCount: seniorCountNum,
          maleCount: Number(b.maleCount || 0),
          femaleCount: Number(b.femaleCount || 0),
          population: b.population,
          percentage: seniorPercentage,
          category: category
        },
        popupTemplate: {
          title: "{name}",
          content: popupContent
        }
      });

      view.graphics.add(pointGraphic);
    });
  }

  // 7️⃣ Header
  const headerContainer = document.createElement("div");
  headerContainer.className = "header-container modern-panel";
  headerContainer.innerHTML = `
    <h1 class="header-title">Senior Distribution Map</h1>
    <p class="header-subtitle">Silay City, Negros Occidental</p>
  `;
  view.container.appendChild(headerContainer);

  // 8️⃣ Compact Legend
  const legendContainer = document.createElement("div");
  legendContainer.className = "legend-container modern-panel";
  legendContainer.innerHTML = `
    <div class="legend-title">Senior Concentration Levels</div>
    <div class="legend-item">
      <div class="legend-dot" style="background: #e74c3c;"></div>
      <span>High (70+)</span>
    </div>
    <div class="legend-item">
      <div class="legend-dot" style="background: #f1c40f;"></div>
      <span>Medium (40-69)</span>
    </div>
    <div class="legend-item">
      <div class="legend-dot" style="background: #2ecc71;"></div>
      <span>Low (0-39)</span>
    </div>
  `;
  view.container.appendChild(legendContainer);

  // 8.5️⃣ Quick Guide with Toggle Button
  const infoButton = document.createElement("button");
  infoButton.className = "info-button";
  infoButton.title = "Quick Guide";
  
  const guideContainer = document.createElement("div");
  guideContainer.className = "guide-container modern-panel";
  guideContainer.innerHTML = `
    <div class="legend-title">Quick Guide</div>
    <div class="guide-text">
      <p><strong>Click</strong> markers to view senior details</p>
      <p><strong>Zoom</strong> and pan to explore areas</p>
      <p><strong>Toggle</strong> basemap for satellite view</p>
      <p><strong>Senior data</strong> shows registered seniors per barangay</p>
    </div>
  `;
  
  infoButton.addEventListener("click", () => {
    guideContainer.classList.toggle("visible");
  });
  
  // Close guide when clicking outside
  view.container.addEventListener("click", (e) => {
    if (!guideContainer.contains(e.target) && !infoButton.contains(e.target)) {
      guideContainer.classList.remove("visible");
    }
  });
  
  view.container.appendChild(infoButton);
  view.container.appendChild(guideContainer);

  // 9️⃣ Compact Statistics
  let statsContainer = document.createElement("div");
  statsContainer.className = "stats-container modern-panel";
  view.container.appendChild(statsContainer);

  function updateStatistics(barangayData) {
    const totalSeniors = barangayData.reduce((sum, b) => sum + Number(b.seniorCount || 0), 0);
    const totalMales = barangayData.reduce((sum, b) => sum + Number(b.maleCount || 0), 0);
    const totalFemales = barangayData.reduce((sum, b) => sum + Number(b.femaleCount || 0), 0);
    const totalPopulation = barangayData.reduce((sum, b) => sum + (b.population || 0), 0);
    const averageSeniorPercentage = totalPopulation > 0
      ? ((totalSeniors / totalPopulation) * 100).toFixed(1)
      : null;
    const highestSenior = Math.max(...barangayData.map(b => Number(b.seniorCount || 0)));
    const highestBarangayObj = barangayData.find(b => Number(b.seniorCount || 0) === highestSenior);
    const highestBarangay = highestBarangayObj ? highestBarangayObj.name : 'N/A';

    statsContainer.innerHTML = `
      <div class="legend-title">Senior Statistics</div>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-number">${totalSeniors}</span>
          <div class="stat-label">Total Seniors</div>
        </div>
        <div class="stat-item">
          <span class="stat-number">${barangayData.length}</span>
          <div class="stat-label">Barangays</div>
        </div>
        <div class="stat-item">
          <span class="stat-number">${totalMales}</span>
          <div class="stat-label">Male</div>
        </div>
        <div class="stat-item">
          <span class="stat-number">${totalFemales}</span>
          <div class="stat-label">Female</div>
        </div>
        <div class="stat-item">
          <span class="stat-number">${averageSeniorPercentage !== null ? `${averageSeniorPercentage}%` : 'N/A'}</span>
          <div class="stat-label">Average Rate</div>
        </div>
        <div class="stat-item">
          <span class="stat-number">${highestSenior}</span>
          <div class="stat-label">Highest Count</div>
        </div>
        <div class="stat-highlight">
          Highest: <strong>${highestBarangay}</strong> (${highestSenior} Seniors)
        </div>
      </div>
    `;
  }

  // 🔟 Mobile toggle button
  if (window.innerWidth <= 768) {
    const mobileToggle = document.createElement("button");
    mobileToggle.className = "mobile-toggle";
    mobileToggle.textContent = "📊 Stats";
    
    const mobileOverlay = document.createElement("div");
    mobileOverlay.className = "mobile-overlay";
    
    mobileToggle.addEventListener("click", () => {
      statsContainer.classList.toggle("mobile-show");
      mobileOverlay.classList.toggle("active");
    });
    
    mobileOverlay.addEventListener("click", () => {
      statsContainer.classList.remove("mobile-show");
      mobileOverlay.classList.remove("active");
    });
    
    view.container.appendChild(mobileToggle);
    view.container.appendChild(mobileOverlay);
  }

  // 11️⃣ Load Senior data with locations from PWD data
  Promise.all([
    fetch("/pwd-map-data").then(res => res.json()),
    fetch("/senior-map-data").then(res => res.json())
  ])
  .then(([pwdResponse, seniorResponse]) => {
    if (pwdResponse.success && seniorResponse.success) {
      // Use PWD data for locations (lat/lon)
      const pwdData = pwdResponse.data;
      const seniorData = seniorResponse.data;
      
      // Create a map of senior data by barangay name
      const seniorMap = {};
      seniorData.forEach(s => {
        seniorMap[s.name] = s;
      });
      
      // Merge: use PWD locations with senior counts
      barangays = pwdData.map(pwd => {
        const senior = seniorMap[pwd.name] || {};
        return {
          ...pwd,
          seniorCount: senior.seniorCount || 0,
          maleCount: senior.maleCount || 0,
          femaleCount: senior.femaleCount || 0
        };
      });
      
      addBarangayMarkers(barangays);
      updateStatistics(barangays);
      console.log("✅ Senior data loaded with PWD locations successfully");
    } else {
      console.error("❌ Error loading data:", pwdResponse.message || seniorResponse.message);
    }
  })
  .catch(err => console.error("❌ Error loading data:", err));

  // 12️⃣ Responsive view padding
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
      view.padding = { left: 10, right: 10, top: 60, bottom: 60 };
    } else {
      view.padding = { left: 10, right: 190, top: 70, bottom: 80 };
    }
  });

  view.when(() => {
    console.log("🗺️ Senior Map loaded successfully!");
  });

});