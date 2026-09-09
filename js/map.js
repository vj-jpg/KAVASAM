/**
 * KAVASAM â€¢ Chennai Geospatial Intelligence Map Engine (OpenStreetMap Open Source)
 * Completely Free Open-Source OSM Tiles (Zero API Key) + IoT Bridge Sensors + Dynamic Bypass Routing
 */

class KavasamMap {
  constructor(containerId = 'map-container') {
    this.containerId = containerId;
    this.map = null;
    this.currentTileMode = 'dark'; // 'dark' | 'standard'
    this.layers = {
      tiles: null,
      zones: null,
      shelters: null,
      routes: null,
      sensors: null,
      reports: null
    };
    this.zonePolygons = {};
    this.routeLines = {};
    this.shelterMarkers = {};
    this.sensorMarkers = {};
    this.reportMarkers = {};
  }

  init() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    // Apply dark map class initially
    container.classList.add('map-dark-tiles');

    // South-Central Chennai (Adyar, Velachery, Guindy, Saidapet)
    const center = [12.9850, 80.2180];

    try {
      if (typeof L !== 'undefined') {
        this.map = L.map(this.containerId, {
          center: center,
          zoom: 12,
          minZoom: 11,
          maxZoom: 17,
          zoomControl: false,
          attributionControl: false
        });

        // Top right tactical zoom control
        L.control.zoom({ position: 'topright' }).addTo(this.map);

        // OpenStreetMap Open Source Tile Layer (No API Key Required!)
        const osmUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
        this.layers.tiles = L.tileLayer(osmUrl, {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        // Add attribution bottom right
        L.control.attribution({ position: 'bottomright', prefix: false })
          .addAttribution('&copy; OpenStreetMap contributors (Open Source GIS)')
          .addTo(this.map);

        // Layer Groups
        this.layers.zones = L.layerGroup().addTo(this.map);
        this.layers.routes = L.layerGroup().addTo(this.map);
        this.layers.sensors = L.layerGroup().addTo(this.map);
        this.layers.shelters = L.layerGroup().addTo(this.map);
        this.layers.reports = L.layerGroup().addTo(this.map);

        this.renderAllLayers();

        // Responsive resize
        window.addEventListener('resize', () => {
          if (this.map) this.map.invalidateSize();
        });
      } else {
        this.renderVectorFallback();
      }
    } catch (err) {
      console.warn("Leaflet error, using vector fallback:", err);
      this.renderVectorFallback();
    }
  }

  toggleMapStyle() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    if (this.currentTileMode === 'dark') {
      this.currentTileMode = 'standard';
      container.classList.remove('map-dark-tiles');
      container.classList.add('map-normal-tiles');
    } else {
      this.currentTileMode = 'dark';
      container.classList.remove('map-normal-tiles');
      container.classList.add('map-dark-tiles');
    }
  }

  renderAllLayers() {
    if (!this.map) return;
    this.renderZones();
    this.renderShelters();
    this.renderRoutes();
    this.renderIoTSensors();
    this.renderReports();
  }

  // Render Hazard-Based Red Zones & Habitation Polygons
  renderZones() {
    if (!this.layers.zones) return;
    this.layers.zones.clearLayers();
    this.zonePolygons = {};

    const selectedZoneId = window.kavasamState ? window.kavasamState.selectedZoneId : 'C-04';

    KAVASAM_DATA.zones.forEach(zone => {
      const isSelected = zone.id === selectedZoneId;
      const isCritical = zone.riskLevel === 'CRITICAL';
      const color = isCritical ? '#ef4444' : (zone.riskLevel === 'HIGH' ? '#f97316' : '#f59e0b');

      const polygon = L.polygon(zone.polygon, {
        color: color,
        weight: isSelected ? 3.5 : 1.5,
        opacity: 0.9,
        fillColor: color,
        fillOpacity: isSelected ? 0.35 : 0.2,
        dashArray: isSelected ? null : '4, 4'
      });

      polygon.on('click', () => {
        if (window.kavasamState) window.kavasamState.selectZone(zone.id);
      });

      const popupHtml = `
        <div style="font-family: var(--font-display); font-size: 12px; min-width: 220px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
            <span style="font-weight: 800; color: #fff;">${zone.name}</span>
            <span class="badge-pill ${isCritical ? 'badge-critical' : 'badge-high'}">${zone.riskLevel}</span>
          </div>
          <div style="color: #94a3b8; font-size: 11px; margin-bottom: 4px;">Locality: <strong style="color:#e2e8f0;">${zone.locality}</strong></div>
          <div style="display:flex; justify-content:space-between; font-size: 11px; margin-bottom: 6px; color:#cbd5e1;">
            <span>Population: <strong>${zone.population.toLocaleString()}</strong></span>
            <span>Vulnerable: <strong style="color:#fca5a5;">${zone.vulnerableCount.toLocaleString()}</strong></span>
          </div>
          <div style="font-size: 11px; color: #67e8f9; margin-bottom: 8px;">Action: ${zone.recommendedAction}</div>
          <button style="width: 100%; background: #0891b2; color:#fff; border:none; border-radius:6px; padding:6px; font-weight:700; cursor:pointer;" onclick="selectAnalysisZone('${zone.id}'); setAuthoritySubView('analysis');">
            Inspect Factor Decomposition â†’
          </button>
        </div>
      `;

      polygon.bindPopup(popupHtml);
      polygon.addTo(this.layers.zones);
      this.zonePolygons[zone.id] = polygon;

      // Central Pin
      const pinHtml = `
        <div class="marker-pin ${isCritical ? 'beacon-red' : ''}" style="width: 28px; height: 28px; background: ${color}; border: 2px solid #ffffff;">
          ${zone.id}
        </div>
      `;
      const icon = L.divIcon({
        className: 'zone-pin-wrapper',
        html: pinHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker(zone.coords, { icon });
      marker.on('click', () => {
        if (window.kavasamState) window.kavasamState.selectZone(zone.id);
      });
      marker.addTo(this.layers.zones);
    });
  }

  // Render Shelters & Live Bed Occupancy
  renderShelters() {
    if (!this.layers.shelters) return;
    this.layers.shelters.clearLayers();
    this.shelterMarkers = {};

    const shelterCapMult = window.kavasamState ? window.kavasamState.whatIf.shelterCapMult : 1.0;

    KAVASAM_DATA.shelters.forEach(shelter => {
      const cap = Math.round(shelter.capacity * shelterCapMult);
      const avail = Math.max(0, cap - shelter.occupied);
      const isDeficit = avail < 300;

      const shelterIconHtml = `
        <div style="background: #0f172a; border: 2px solid ${isDeficit ? '#ef4444' : '#06b6d4'}; border-radius: 8px; padding: 3px 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.8); text-align: center; min-width: 68px;">
          <div style="font-size: 9px; font-weight: 800; color: #06b6d4;">${shelter.id}</div>
          <div style="font-size: 10px; font-weight: 700; color: #f8fafc; font-family: var(--font-mono);">${avail} Free</div>
        </div>
      `;

      const icon = L.divIcon({
        className: 'shelter-marker-wrapper',
        html: shelterIconHtml,
        iconSize: [68, 32],
        iconAnchor: [34, 16]
      });

      const marker = L.marker(shelter.coords, { icon });
      const popup = `
        <div style="font-family: var(--font-display); font-size: 12px; min-width: 220px;">
          <div style="font-weight: 800; color: #fff; margin-bottom: 4px;">${shelter.name}</div>
          <div style="color: #94a3b8; font-size: 11px; margin-bottom: 6px;">${shelter.type}</div>
          <div style="display:flex; justify-content:space-between; font-size: 11px; color:#cbd5e1; margin-bottom: 4px;">
            <span>Occupied: <strong>${shelter.occupied}</strong></span>
            <span>Carrying Capacity: <strong>${cap}</strong></span>
          </div>
          <div style="font-size: 10px; color: #10b981; margin-top: 4px;">ðŸ¥ Medical Teams: ${shelter.medicalTeams} â€¢ Meals: ${shelter.foodSupplyDays} Days</div>
        </div>
      `;

      marker.bindPopup(popup);
      marker.addTo(this.layers.shelters);
      this.shelterMarkers[shelter.id] = marker;
    });
  }

  // Render Evacuation Routes with Interactive Road Inundation & Bypass Re-Routing
  renderRoutes() {
    if (!this.layers.routes) return;
    this.layers.routes.clearLayers();
    this.routeLines = {};

    const blockedRoutes = window.kavasamState ? window.kavasamState.blockedRoutes : new Set();

    KAVASAM_DATA.routes.forEach(route => {
      const isBlocked = blockedRoutes.has(route.id);

      if (isBlocked) {
        // Render blocked path in red dashed line
        const blockedLine = L.polyline(route.waypoints, {
          color: '#ef4444',
          weight: 4,
          opacity: 0.9,
          dashArray: '6, 8'
        });
        blockedLine.bindPopup(`
          <div style="font-family: var(--font-display); font-size: 12px;">
            <strong style="color:#ef4444;">âš ï¸ ROAD INUNDATED & BLOCKED</strong><br>
            <span>Water level over 1.2m on ${route.name}.</span><br>
            <button style="margin-top:6px; background:#10b981; color:#fff; border:none; border-radius:4px; padding:4px 8px; cursor:pointer;" onclick="window.kavasamState.toggleRouteBlock('${route.id}')">
              Clear Water & Reopen Corridor
            </button>
          </div>
        `);
        blockedLine.addTo(this.layers.routes);

        // Render AI Autonomous Bypass Route in emerald green!
        const bypassWaypoints = [
          route.waypoints[0],
          [12.9820, 80.2240], // Higher ground bypass
          [12.9850, 80.2290],
          route.waypoints[route.waypoints.length - 1]
        ];
        const bypassLine = L.polyline(bypassWaypoints, {
          color: '#10b981',
          weight: 5,
          opacity: 0.95,
          className: 'route-flow'
        });
        bypassLine.bindPopup(`
          <div style="font-family: var(--font-display); font-size: 12px;">
            <strong style="color:#10b981;">âœ“ AI DYNAMIC BYPASS ROUTE ACTIVE</strong><br>
            <span>Rerouting buses via High-Ground Taramani Link.</span>
          </div>
        `);
        bypassLine.addTo(this.layers.routes);
      } else {
        // Normal open route
        const line = L.polyline(route.waypoints, {
          color: '#10b981',
          weight: 5,
          opacity: 0.9,
          className: 'route-flow'
        });

        line.on('click', () => {
          if (window.kavasamState) window.kavasamState.toggleRouteBlock(route.id);
        });

        line.bindPopup(`
          <div style="font-family: var(--font-display); font-size: 12px;">
            <strong style="color:#10b981;">âœ“ ${route.name}</strong><br>
            <span>Distance: ${route.distanceKm} km â€¢ Est: ${route.estimatedMinutes} min</span><br>
            <span style="font-size:11px; color:#cbd5e1;">Click button to simulate sudden road inundation:</span><br>
            <button style="margin-top:6px; background:#ef4444; color:#fff; border:none; border-radius:4px; padding:4px 8px; cursor:pointer;" onclick="window.kavasamState.toggleRouteBlock('${route.id}')">
              âš ï¸ Simulate Road Inundation / Block
            </button>
          </div>
        `);
        line.addTo(this.layers.routes);
      }
    });
  }

  // Render Simulated IoT Bridge Water-Level Sensors (Telemetry Upgrade)
  renderIoTSensors() {
    if (!this.layers.sensors) return;
    this.layers.sensors.clearLayers();
    this.sensorMarkers = {};

    const sensors = [
      { id: "IOT-01", name: "Maraimalai Adigal Bridge (Saidapet)", coords: [13.0180, 80.2220], level: 2.8, threshold: 2.5, flow: "18,400 cusecs", status: "DANGER" },
      { id: "IOT-02", name: "Velachery Lake Weir Gate 3", coords: [12.9750, 80.2210], level: 3.1, threshold: 3.0, flow: "4,200 cusecs", status: "CRITICAL" },
      { id: "IOT-03", name: "Otteri Nullah North Sluice", coords: [13.0980, 80.2520], level: 1.8, threshold: 2.2, flow: "6,100 cusecs", status: "NORMAL" }
    ];

    sensors.forEach(s => {
      const isDanger = s.level >= s.threshold;
      const iconHtml = `
        <div style="background: #020617; border: 2px solid ${isDanger ? '#ef4444' : '#10b981'}; border-radius: 50%; width: 26px; height: 26px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:11px; box-shadow: 0 0 12px ${isDanger ? 'rgba(239,68,68,0.7)' : 'rgba(16,185,129,0.5)'};">
          ðŸŒŠ
        </div>
      `;

      const icon = L.divIcon({
        className: 'iot-sensor-wrapper',
        html: iconHtml,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const marker = L.marker(s.coords, { icon });
      marker.bindPopup(`
        <div style="font-family: var(--font-mono); font-size: 11px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <strong style="color:#fff;">${s.id} â€¢ IoT TELEMETRY</strong>
            <span class="badge-pill ${isDanger ? 'badge-critical' : 'badge-normal'}">${s.status}</span>
          </div>
          <div style="color:#94a3b8; margin-bottom:4px;">${s.name}</div>
          <div style="color:#67e8f9; font-weight:700;">Water Level: ${s.level}m (Threshold: ${s.threshold}m)</div>
          <div style="color:#cbd5e1;">Discharge: ${s.flow}</div>
          <div style="color:#64748b; font-size:10px; margin-top:4px;">Solar Battery: 94% â€¢ MQTT Link: ACTIVE</div>
        </div>
      `);
      marker.addTo(this.layers.sensors);
      this.sensorMarkers[s.id] = marker;
    });
  }

  // Render Citizen & Community Reports
  renderReports() {
    if (!this.layers.reports) return;
    this.layers.reports.clearLayers();
    this.reportMarkers = {};

    const reports = window.kavasamState ? window.kavasamState.liveReports : KAVASAM_DATA.reports;

    reports.forEach(r => {
      const isCorroborated = r.status === 'CORROBORATED' || r.status === 'VERIFIED';
      const color = isCorroborated ? '#06b6d4' : '#f59e0b';

      const iconHtml = `
        <div class="marker-pin" style="width: 22px; height: 22px; background: ${color}; border: 1.5px solid #ffffff; font-size: 10px;">
          ${r.type.includes('Assistance') ? 'SOS' : 'âš ï¸'}
        </div>
      `;

      const icon = L.divIcon({
        className: 'report-marker-wrapper',
        html: iconHtml,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker(r.coords, { icon });
      marker.bindPopup(`
        <div style="font-family: var(--font-display); font-size: 12px; min-width: 200px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 4px;">
            <span style="font-weight: 800; color: #fff;">${r.type}</span>
            <span class="badge-pill ${isCorroborated ? 'badge-cyan' : 'badge-high'}">${r.status}</span>
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;">${r.location}</div>
          <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 6px;">"${r.details}"</div>
          <div style="font-size: 10px; color: #67e8f9; font-family: var(--font-mono);">
            Confidence: ${r.confidence}% (${r.corroborationCount} Corroborations)
          </div>
        </div>
      `);
      marker.addTo(this.layers.reports);
      this.reportMarkers[r.id] = marker;
    });
  }

  focusZone(zoneId) {
    const zone = KAVASAM_DATA.zones.find(z => z.id === zoneId);
    if (!zone || !this.map) return;
    this.map.flyTo(zone.coords, 14, { duration: 1.2 });
    if (this.zonePolygons[zoneId]) this.zonePolygons[zoneId].openPopup();
  }

  fitChennaiBounds() {
    if (!this.map) return;
    this.map.flyTo([12.9850, 80.2180], 12, { duration: 1.0 });
  }

  renderVectorFallback() {
    const container = document.getElementById(this.containerId);
    if (!container || container.querySelector('.fallback-vector-overlay')) return;

    const fallback = document.createElement('div');
    fallback.className = 'fallback-vector-overlay';
    fallback.style.cssText = `
      position: absolute; inset: 0; pointer-events: none; z-index: 100;
      background: radial-gradient(circle at 50% 50%, #0d1627 0%, #030712 90%);
      display: flex; flex-direction: column; justify-content: space-between; p: 12px;
    `;
    fallback.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(6, 182, 212, 0.4); border-radius: 6px; padding: 6px 12px; font-family: var(--font-mono); font-size: 11px; color: #cbd5e1; width: fit-content;">
        CHENNAI GEOSPATIAL VECTOR GRID â€¢ OPEN SOURCE ACTIVE
      </div>
    `;
    container.appendChild(fallback);
  }
}

window.kavasamMap = new KavasamMap('map-container');
