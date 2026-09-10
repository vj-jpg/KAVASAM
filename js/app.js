/**
 * KAVASAM • Master Controller & Multi-Portal Application Coordinator
 * Portals: Government Authority | Citizen Safety | Volunteer Grid
 */

class KavasamApp {
  constructor() {
    this.state = window.kavasamState;
    this.map = window.kavasamMap;
    this.audio = window.kavasamAudio;
    this.data = window.KAVASAM_DATA;
    this.previousAtRisk = 12480;
  }

  init() {
    this.startClock();
    this.handleLoadingScreen();

    if (this.map) this.map.init();

    // Render Initial State for all 3 portals
    this.renderAuthorityPortal();
    this.renderCitizenPortal();
    this.renderVolunteerPortal();
    this.renderTimeline();

    // Listen to State Changes
    this.state.subscribe((state, event) => {
      this.handleStateUpdate(state, event);
    });

    // Animate initial cards
    if (typeof anime !== 'undefined') {
      anime({
        targets: '.glass-panel',
        opacity: [0, 1],
        translateY: [10, 0],
        delay: anime.stagger(40),
        duration: 450,
        easing: 'easeOutQuad'
      });
    }
  }

  handleLoadingScreen() {
    const bar = document.getElementById('loading-bar-fill');
    if (bar) {
      setTimeout(() => { bar.style.width = '100%'; }, 100);
    }
    // Auto-dismiss loading screen after 1.2s
    setTimeout(() => {
      this.dismissLoadingScreen();
    }, 1200);
  }

  dismissLoadingScreen() {
    const screen = document.getElementById('app-loading-screen');
    if (screen && screen.style.display !== 'none') {
      screen.style.opacity = '0';
      setTimeout(() => {
        screen.style.display = 'none';
        if (this.map && this.map.map) {
          this.map.map.invalidateSize();
        }
      }, 400);
    }
  }

  startClock() {
    const update = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const clockEl = document.getElementById('top-clock');
      if (clockEl) clockEl.textContent = `${h}:${m}:${s} IST`;
    };
    update();
    setInterval(update, 1000);
  }

  handleStateUpdate(state, event) {
    this.renderAuthorityMetrics();
    this.renderTimeline();
    this.renderCitizenPortal();
    this.renderVolunteerPortal();

    if (this.map) this.map.renderAllLayers();

    // Smooth counter animation for people at risk
    if (typeof anime !== 'undefined') {
      const obj = { val: this.previousAtRisk };
      anime({
        targets: obj,
        val: state.peopleAtRisk,
        round: 1,
        duration: 700,
        easing: 'easeOutQuad',
        update: () => {
          const el = document.getElementById('metric-people-risk');
          if (el) el.textContent = obj.val.toLocaleString();
        }
      });
      this.previousAtRisk = state.peopleAtRisk;
    }
  }

  // ==================== PORTAL SWITCHING ====================
  setPortal(portalName) {
    this.state.setPortal(portalName);

    // Update portal header tabs
    const buttons = {
      authority: document.getElementById('btn-portal-gov'),
      citizen: document.getElementById('btn-portal-citizen'),
      volunteer: document.getElementById('btn-portal-vol')
    };

    Object.keys(buttons).forEach(k => {
      if (buttons[k]) {
        if (k === portalName) {
          buttons[k].classList.add('active');
          buttons[k].classList.remove('text-slate-300');
        } else {
          buttons[k].classList.remove('active');
          buttons[k].classList.add('text-slate-300');
        }
      }
    });

    // Toggle portal views with smooth fade
    const portals = {
      authority: document.getElementById('portal-authority'),
      citizen: document.getElementById('portal-citizen'),
      volunteer: document.getElementById('portal-volunteer')
    };

    Object.keys(portals).forEach(k => {
      if (portals[k]) {
        if (k === portalName) {
          portals[k].classList.remove('hidden');
          if (typeof anime !== 'undefined') {
            anime({
              targets: portals[k],
              opacity: [0, 1],
              translateY: [8, 0],
              duration: 300,
              easing: 'easeOutQuad'
            });
          }
        } else {
          portals[k].classList.add('hidden');
        }
      }
    });

    // Re-adjust map if entering authority portal
    if (portalName === 'authority') {
      setTimeout(() => {
        if (this.map && this.map.map) {
          this.map.map.invalidateSize();
          this.map.fitChennaiBounds();
        }
      }, 120);
    }
  }

  // ==================== AUTHORITY SUB-VIEWS ====================
  setAuthoritySubView(subview) {
    this.state.setAuthoritySubView(subview);

    const subBtns = {
      command: document.getElementById('sub-btn-cmd'),
      analysis: document.getElementById('sub-btn-why'),
      evacuation: document.getElementById('sub-btn-evac'),
      whatif: document.getElementById('sub-btn-whatif')
    };

    Object.keys(subBtns).forEach(k => {
      if (subBtns[k]) {
        if (k === subview) {
          subBtns[k].className = "px-3.5 py-2 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold";
        } else {
          subBtns[k].className = "px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800";
        }
      }
    });

    const subViews = {
      command: document.getElementById('auth-sub-command'),
      analysis: document.getElementById('auth-sub-analysis'),
      evacuation: document.getElementById('auth-sub-evacuation'),
      whatif: document.getElementById('auth-sub-whatif')
    };

    Object.keys(subViews).forEach(k => {
      if (subViews[k]) {
        if (k === subview) {
          subViews[k].classList.remove('hidden');
          if (k === 'analysis') this.renderIncidentAnalysis();
          if (k === 'evacuation') this.renderEvacuationDispatch();
          if (k === 'whatif') this.renderWhatIfDeltas();
        } else {
          subViews[k].classList.add('hidden');
        }
      }
    });

    if (subview === 'command' && this.map && this.map.map) {
      setTimeout(() => this.map.map.invalidateSize(), 100);
    }
  }

  // ==================== RENDER AUTHORITY PORTAL ====================
  renderAuthorityPortal() {
    this.renderAuthorityMetrics();
    this.renderIncidentAnalysis();
    this.renderEvacuationDispatch();
    this.renderWhatIfDeltas();
  }

  renderAuthorityMetrics() {
    document.getElementById('metric-incidents').textContent = String(this.state.activeIncidents).padStart(2, '0');
    document.getElementById('metric-people-risk').textContent = this.state.peopleAtRisk.toLocaleString();
    document.getElementById('metric-high-risk-zones').textContent = String(this.state.highRiskHabitations).padStart(2, '0');
    document.getElementById('metric-shelter-cap').textContent = `${this.state.shelterOccupied.toLocaleString()} / ${this.state.effectiveShelterCapacity.toLocaleString()}`;
    
    const prioEl = document.getElementById('metric-evac-prio');
    prioEl.textContent = this.state.evacuationPriority;

    const capPct = Math.min(100, Math.round((this.state.shelterOccupied / this.state.effectiveShelterCapacity) * 100));
    const bar = document.getElementById('bar-shelter-cap');
    if (bar) {
      bar.style.width = `${capPct}%`;
      bar.style.backgroundColor = capPct > 90 ? '#ef4444' : (capPct > 70 ? '#f59e0b' : '#06b6d4');
    }
  }

  renderTimeline() {
    const container = document.getElementById('timeline-container');
    if (!container) return;

    const stage = this.state.currentStageIndex;
    container.innerHTML = this.data.timeline.map((item, idx) => {
      const isCurrent = idx === stage;
      const isPast = idx <= stage;

      return `
        <div class="relative pl-5 pb-2 border-l ${isCurrent ? 'border-cyan-500' : (isPast ? 'border-slate-700' : 'border-slate-800 opacity-40')}">
          <div class="absolute -left-[6px] top-0.5 w-2.5 h-2.5 rounded-full ${isCurrent ? 'bg-cyan-400 beacon-cyan' : (isPast ? 'bg-slate-500' : 'bg-slate-800')}"></div>
          <div class="flex items-center justify-between mb-0.5">
            <span class="font-bold ${isCurrent ? 'text-cyan-400' : 'text-slate-400'}">${item.time}</span>
            <span class="badge-pill ${item.severity === 'critical' ? 'badge-critical' : 'badge-cyan'} text-[9px]">${item.type}</span>
          </div>
          <div class="font-semibold text-slate-200 text-xs">${item.title}</div>
          <div class="text-[11px] text-slate-400 mt-0.5">${item.description}</div>
        </div>
      `;
    }).join('');
  }

  renderIncidentAnalysis() {
    const dropdown = document.getElementById('analysis-zone-dropdown');
    if (dropdown && dropdown.children.length === 0) {
      dropdown.innerHTML = this.data.zones.map(z => `
        <option value="${z.id}" ${z.id === this.state.selectedZoneId ? 'selected' : ''}>${z.name} (${z.riskLevel})</option>
      `).join('');
    }

    const zone = this.data.zones.find(z => z.id === this.state.selectedZoneId) || this.data.zones[0];
    const content = document.getElementById('analysis-factor-content');
    if (!content) return;

    const rf = this.state.whatIf.rainfallMult;
    const hazard = Math.min(99, Math.round(zone.hazardIntensity * rf));
    const vuln = zone.populationVulnerability;
    const access = Math.min(99, Math.round(zone.accessibilityRisk + (this.state.whatIf.roadClosures * 8)));
    const hist = zone.historicalExposure;

    content.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3.5 font-mono text-xs">
          <div class="flex justify-between items-center border-b border-slate-800 pb-2.5">
            <span class="text-slate-400">HABITATION SECTOR</span>
            <span class="badge-pill ${zone.riskLevel === 'CRITICAL' ? 'badge-critical' : 'badge-high'}">${zone.riskLevel}</span>
          </div>
          <div class="text-sm font-bold text-white">${zone.name}</div>
          <div class="text-slate-400">Ward: <strong class="text-slate-200">${zone.ward}</strong></div>
          <div class="text-slate-400">Total Population: <strong class="text-white">${zone.population.toLocaleString()}</strong></div>
          <div class="text-slate-400">Priority Vulnerable: <strong class="text-red-400">${zone.vulnerableCount.toLocaleString()}</strong></div>
          <div class="text-slate-400">Access Corridor: <span class="text-cyan-400">${zone.roadStatus}</span></div>
          <div class="pt-2.5 border-t border-slate-800 text-[11px] text-slate-400">
            <strong class="text-slate-200 block mb-1">LOCALITY RATIONALE:</strong>
            ${zone.rationale}
          </div>
        </div>

        <div class="lg:col-span-2 space-y-4 font-mono text-xs">
          <div>
            <div class="flex justify-between text-slate-300 mb-1.5">
              <span>Hazard Intensity (Runoff Velocity & Rain Discharge)</span>
              <span class="text-cyan-400 font-bold">${hazard}%</span>
            </div>
            <div class="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full bg-cyan-400 rounded-full transition-all duration-500" style="width: ${hazard}%;"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-slate-300 mb-1.5">
              <span>Population Vulnerability (Elders, Children, Ground Dwellings)</span>
              <span class="text-orange-400 font-bold">${vuln}%</span>
            </div>
            <div class="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full bg-orange-500 rounded-full transition-all duration-500" style="width: ${vuln}%;"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-slate-300 mb-1.5">
              <span>Ingress Bottleneck Risk (Low Bridges & Water Logging)</span>
              <span class="text-amber-400 font-bold">${access}%</span>
            </div>
            <div class="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full bg-amber-500 rounded-full transition-all duration-500" style="width: ${access}%;"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-slate-300 mb-1.5">
              <span>Historical Inundation Exposure (2015 & 2023 Flood Extents)</span>
              <span class="text-red-400 font-bold">${hist}%</span>
            </div>
            <div class="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full bg-red-500 rounded-full transition-all duration-500" style="width: ${hist}%;"></div>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-slate-200 mt-4">
            <div class="text-cyan-400 font-bold mb-1.5 flex items-center gap-2">
              <span>🛡️</span>
              <span>EXPLAINABLE AI RECOMMENDATION (CONFIDENCE 87%)</span>
            </div>
            <p class="text-xs font-sans leading-relaxed">
              "Prioritize immediate evacuation of Zone ${zone.id}. Route 12 MTC rescue buses via eastern high-ground link (Taramani Link corridor) directly to Shelter S-07 to mitigate bottleneck risk before downstream backwater peaks."
            </p>
          </div>
        </div>
      </div>
    `;
  }

  renderEvacuationDispatch() {
    const habContainer = document.getElementById('evac-ranked-habitations');
    const shelterContainer = document.getElementById('evac-shelters-capacity');

    if (habContainer) {
      habContainer.innerHTML = this.data.zones.map(z => `
        <div class="p-3.5 rounded-xl bg-slate-900/80 border-l-4 ${z.riskLevel === 'CRITICAL' ? 'border-l-red-500' : 'border-l-orange-500'} border border-slate-800">
          <div class="flex justify-between items-center mb-1">
            <span class="font-bold text-xs text-white">${z.name}</span>
            <span class="badge-pill ${z.riskLevel === 'CRITICAL' ? 'badge-critical' : 'badge-high'} text-[9px]">${z.recommendedAction}</span>
          </div>
          <div class="grid grid-cols-3 gap-2 font-mono text-[11px] my-2">
            <div><span class="text-slate-400">Total:</span> <strong class="text-white">${z.population.toLocaleString()}</strong></div>
            <div><span class="text-slate-400">Vulnerable:</span> <strong class="text-red-400">${z.vulnerableCount.toLocaleString()}</strong></div>
            <div><span class="text-slate-400">Buses:</span> <strong class="text-cyan-400">${z.assignedBuses}</strong></div>
          </div>
          <div class="text-[11px] text-slate-400 flex justify-between items-center pt-2 border-t border-slate-800">
            <span>Primary Destination: <strong class="text-slate-200">${z.primaryShelterId}</strong></span>
            <button class="text-cyan-400 hover:underline font-mono font-bold" onclick="selectAnalysisZone('${z.id}'); setAuthoritySubView('analysis');">Inspect Factor Breakdown →</button>
          </div>
        </div>
      `).join('');
    }

    if (shelterContainer) {
      const mult = this.state.whatIf.shelterCapMult;
      shelterContainer.innerHTML = this.data.shelters.map(s => {
        const cap = Math.round(s.capacity * mult);
        const avail = Math.max(0, cap - s.occupied);
        const pct = Math.min(100, Math.round((s.occupied / cap) * 100));

        return `
          <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div class="flex justify-between items-center mb-1">
              <span class="font-bold text-xs text-white">${s.name}</span>
              <span class="badge-pill ${avail < 300 ? 'badge-critical' : 'badge-normal'} text-[9px]">${avail} BEDS FREE</span>
            </div>
            <div class="h-2 bg-slate-800 rounded-full overflow-hidden my-2.5">
              <div class="h-full rounded-full ${avail < 300 ? 'bg-red-500' : 'bg-emerald-500'}" style="width: ${pct}%;"></div>
            </div>
            <div class="flex justify-between font-mono text-[11px] text-slate-300">
              <span>Occupancy: ${s.occupied} / ${cap} (${pct}%)</span>
              <span>Doctor: ${s.medicalTeams} Units</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  renderWhatIfDeltas() {
    const container = document.getElementById('whatif-deltas-container');
    if (!container) return;

    const baseRisk = 12480;
    const baseZones = 7;
    const baseBuses = 18;

    const currRisk = this.state.peopleAtRisk;
    const currZones = this.state.highRiskHabitations;
    const currBuses = this.state.busesAssigned;

    const dRisk = currRisk - baseRisk;
    const dZones = currZones - baseZones;
    const dBuses = currBuses - baseBuses;

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span class="text-[10px] text-slate-400 block uppercase">PEOPLE UNDER RED THREAT</span>
          <div class="text-xl sm:text-2xl font-bold text-white mt-1">${currRisk.toLocaleString()}</div>
          <div class="text-xs ${dRisk > 0 ? 'text-red-400' : 'text-slate-400'} mt-1">
            ${dRisk >= 0 ? '+' : ''}${dRisk.toLocaleString()} vs Baseline
          </div>
        </div>

        <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span class="text-[10px] text-slate-400 block uppercase">HIGH-RISK HABITATIONS</span>
          <div class="text-xl sm:text-2xl font-bold text-orange-400 mt-1">${currZones} Habitations</div>
          <div class="text-xs ${dZones > 0 ? 'text-red-400' : 'text-slate-400'} mt-1">
            ${dZones >= 0 ? '+' : ''}${dZones} New Sectors Endangered
          </div>
        </div>

        <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span class="text-[10px] text-slate-400 block uppercase">MTC RESCUE BUSES REQUIRED</span>
          <div class="text-xl sm:text-2xl font-bold text-cyan-400 mt-1">${currBuses} / 24 Buses</div>
          <div class="text-xs ${dBuses > 0 ? 'text-amber-400' : 'text-slate-400'} mt-1">
            ${dBuses >= 0 ? '+' : ''}${dBuses} Additional Units Deployed
          </div>
        </div>
      </div>
    `;
  }

  // ==================== RENDER CITIZEN PORTAL ====================
  renderCitizenPortal() {
    const sheltersList = document.getElementById('citizen-shelters-list');
    if (sheltersList) {
      sheltersList.innerHTML = this.data.shelters.map(s => `
        <div class="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-cyan-500 transition-all">
          <div>
            <div class="flex justify-between items-start mb-1.5">
              <span class="font-bold text-sm text-white">${s.name}</span>
              <span class="badge-pill badge-normal text-[10px]">${s.available} BEDS FREE</span>
            </div>
            <div class="text-xs text-cyan-400 font-mono mb-2.5">📍 ${s.locality} • ${s.distanceFromFocus}</div>
            <div class="space-y-1.5 text-xs text-slate-300 mb-4">
              ${s.amenities.map(a => `<div class="flex items-center gap-2"><span class="text-emerald-400">✓</span> ${a}</div>`).join('')}
            </div>
          </div>
          <div class="pt-3.5 border-t border-slate-800 flex items-center justify-between">
            <span class="text-xs text-slate-400 font-mono">Contact: ${s.contact}</span>
            <button class="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 font-mono text-xs font-bold text-white shadow-md" onclick="alert('Displaying safe flood-free walking navigation to ${s.name}.')">
              SAFE ROUTE →
            </button>
          </div>
        </div>
      `).join('');
    }

    const censusEl = document.getElementById('citizen-census-text');
    if (censusEl) {
      censusEl.textContent = `${this.state.citizenSafeCount} Registered Safe`;
    }
  }

  // ==================== RENDER VOLUNTEER PORTAL ====================
  renderVolunteerPortal() {
    const tasksContainer = document.getElementById('volunteer-tasks-container');
    if (tasksContainer) {
      tasksContainer.innerHTML = this.state.volunteerTasks.map(t => `
        <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2.5">
          <div class="flex justify-between items-start">
            <div>
              <span class="font-bold text-xs text-white">${t.title}</span>
              <div class="text-[11px] text-purple-300 font-mono">📍 ${t.zone}</div>
            </div>
            <span class="badge-pill ${t.status === 'CLAIMED' ? 'badge-normal' : 'badge-critical'} text-[9px]">${t.status}</span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">${t.description}</p>
          <div class="flex items-center justify-between pt-2.5 border-t border-slate-800 font-mono text-xs">
            <span class="text-cyan-400 font-bold">+${t.points} Reward Pts</span>
            ${t.status === 'OPEN' ? `
              <button class="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs" onclick="claimTask('${t.id}')">
                CLAIM TASK
              </button>
            ` : `
              <span class="text-emerald-400 text-xs">✓ Claimed by ${t.claimedBy}</span>
            `}
          </div>
        </div>
      `).join('');
    }

    const reportsFeed = document.getElementById('volunteer-reports-feed');
    if (reportsFeed) {
      reportsFeed.innerHTML = this.state.liveReports.map(r => `
        <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
          <div class="flex justify-between items-start">
            <span class="font-bold text-xs text-white">${r.type}</span>
            <span class="badge-pill ${r.status === 'CORROBORATED' ? 'badge-cyan' : 'badge-high'} text-[9px]">${r.status}</span>
          </div>
          <div class="text-xs font-mono text-slate-300">📍 ${r.location}</div>
          <p class="text-xs text-slate-400 italic">"${r.details}"</p>
          <div class="flex items-center justify-between pt-2.5 border-t border-slate-800 font-mono text-[11px]">
            <span class="text-slate-400">Reported: ${r.timeAgo}</span>
            <div class="flex items-center gap-2">
              <span class="text-cyan-400 font-bold">Conf: ${r.confidence}%</span>
              ${r.status === 'ANALYZING' ? `
                <button class="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold" onclick="corroborateReport('${r.id}')">
                  CORROBORATE ✓
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `).join('');
    }

    const pointsEl = document.getElementById('vol-points');
    if (pointsEl) pointsEl.textContent = `${this.state.volunteerPoints} PTS`;
  }

  // SITREP Generator
  generateSitrepText() {
    const d = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    const t = new Date().toLocaleTimeString('en-IN');
    return `
================================================================================
KAVASAM DISASTER INTELLIGENCE PLATFORM • OPERATIONAL SITREP (SIH26191)
GREATER CHENNAI CORPORATION • DISTRICT DISASTER MANAGEMENT AUTHORITY (DDMA)
================================================================================
TIMESTAMP: ${d} • ${t} IST
SCENARIO: CHENNAI DISTRICT URBAN FLOOD EMERGENCE (RAPID ESCALATION)
CLASSIFICATION: RESTRICTED // OPERATIONAL DISPATCH SUMMARY
--------------------------------------------------------------------------------

1. CURRENT DISASTER ASSESSMENT:
   * Active Inundation Incidents  : ${this.state.activeIncidents} Corroborated Locations
   * Population Under Red Threat : ${this.state.peopleAtRisk.toLocaleString()} Individuals
   * Critical Hazard Habitations : ${this.state.highRiskHabitations} Identified Habitational Sectors
   * Primary Red Zone Focus       : Zone C-04 (Velachery Lake Basin / Ward 177)
   * Runoff Velocity             : 1.8 m/s convergent from Pallikaranai wetland basin

2. CARRYING CAPACITY & RELOCATION MATRIX:
   * Total Effective Shelter Beds: ${this.state.effectiveShelterCapacity.toLocaleString()} Free Beds Across 4 Facilities
   * Current Shelter Occupancy   : ${this.state.shelterOccupied.toLocaleString()} Evacuees (${Math.round((this.state.shelterOccupied/this.state.effectiveShelterCapacity)*100)}% utilization)
   * Primary Receiving Center    : Shelter S-07 (Velachery Higher Secondary School)
   * Alternate Ingress Hub       : Shelter S-03 (Guindy Multi-purpose Relief Center)
   * Medical & Sanitation Status : 10 On-site triage teams active; 48hr diesel generators operational

3. LOGISTICS & RESCUE DISPATCH:
   * MTC High-Clearance Buses    : ${this.state.busesAssigned} Deployed / 24 Fleet Reserve
   * 108 Advanced Ambulances     : ${this.state.ambulancesAssigned} En-route to high-vulnerability residences
   * NDRF / SDRF Rapid Units     : 12 Teams conducting boat extractions in canal fringes
   * Community First Responders  : 84 Verified ward volunteers deployed for last-mile direction

4. IMMEDIATE AI DIRECTIVES:
   * Maintain priority vehicular corridor open on Taramani Link Road (Route R-01).
   * Continue citizen redirection away from inundated Velachery 100-Ft bypass.
   * Stage 6 extra MTC reserve buses at Guindy depot in anticipation of secondary squall.

================================================================================
KAVASAM INTELLIGENCE ENGINE • AUTONOMOUS VERIFICATION COMPLETE • CONFIDENCE 87%
================================================================================
    `.trim();
  }
}

// Global App Instance
window.kavasamApp = new KavasamApp();

// ==================== GLOBAL HELPER HANDLERS ====================
function dismissLoadingScreen() {
  window.kavasamApp.dismissLoadingScreen();
}

function setAppPortal(portal) {
  window.kavasamApp.setPortal(portal);
}

function setAuthoritySubView(view) {
  window.kavasamApp.setAuthoritySubView(view);
}

function selectAnalysisZone(zoneId) {
  window.kavasamState.selectZone(zoneId);
  window.kavasamApp.renderIncidentAnalysis();
  if (window.kavasamMap) window.kavasamMap.focusZone(zoneId);
}

function toggleSimPlayback() {
  const state = window.kavasamState;
  const icon = document.getElementById('sim-run-icon');
  const text = document.getElementById('sim-run-text');

  if (state.isPlaying) {
    state.pauseSimulation();
    icon.textContent = '▶';
    text.textContent = 'RESUME SIMULATION';
  } else {
    state.startSimulation();
    icon.textContent = '⏸';
    text.textContent = 'PAUSE SIMULATION';
  }
}

function resetSimPlayback() {
  window.kavasamState.resetSimulation();
  document.getElementById('sim-run-icon').textContent = '▶';
  document.getElementById('sim-run-text').textContent = 'RUN SIMULATION';
}

function applyWhatIfKnobs() {
  const rain = document.getElementById('wi-rain-select').value;
  const roads = document.getElementById('wi-roads-select').value;
  const shelter = document.getElementById('wi-shelter-select').value;

  window.kavasamState.setWhatIfParams({
    rainfall: rain,
    roadClosures: roads,
    shelterCapacity: shelter
  });
  window.kavasamState.recalculateMetrics();
  window.kavasamApp.renderWhatIfDeltas();
  window.kavasamApp.renderAuthorityMetrics();
}

function triggerWhatIfRecalculate() {
  const box = document.getElementById('whatif-status-box');
  const text = document.getElementById('whatif-status-text');
  if (box) box.classList.remove('hidden');

  applyWhatIfKnobs();
  window.kavasamState.runWhatIfRecalculation(() => {
    if (box) box.classList.add('hidden');
    window.kavasamApp.renderWhatIfDeltas();
  });
}

// WhatsApp Simulator Actions (Replica for Judges)
function simulateWaAction(type) {
  const chatBox = document.getElementById('wa-chat-box');
  if (!chatBox) return;

  if (window.kavasamAudio) window.kavasamAudio.playTacticalChime(620, 0.08);

  if (type === 'loc') {
    chatBox.innerHTML += `
      <div class="wa-msg-out p-2.5 max-w-[85%] self-end shadow text-xs">
        📍 <em>Shared live location: 12.9780° N, 80.2185° E (Velachery AGS Colony)</em>
      </div>
    `;
    setTimeout(() => {
      chatBox.innerHTML += `
        <div class="wa-msg-in p-2.5 max-w-[85%] self-start shadow text-xs">
          <strong class="text-red-400 block">⚠️ RED HAZARD ZONE ALERT (C-04)</strong>
          Your street has 1.2m flood runoff converging. Recommended safe shelter:<br>
          🏢 <strong>Shelter S-07 (Velachery Higher Secondary)</strong><br>
          📍 Distance: 0.9 km via Taramani Link Road.<br>
          🚌 12 MTC buses stationed at junction.
        </div>
      `;
      chatBox.scrollTop = chatBox.scrollHeight;
      if (window.kavasamAudio) window.kavasamAudio.playAlertTone();
    }, 600);
  } else if (type === 'shelter') {
    chatBox.innerHTML += `
      <div class="wa-msg-out p-2.5 max-w-[85%] self-end shadow text-xs">
        🏥 Find Nearest Shelter
      </div>
    `;
    setTimeout(() => {
      chatBox.innerHTML += `
        <div class="wa-msg-in p-2.5 max-w-[85%] self-start shadow text-xs">
          <strong>Closest Available Relief Centers:</strong><br>
          1. 🏫 <strong>Shelter S-07</strong> (0.9 km) - 680 Beds Free • Food & Medical Ready<br>
          2. 🏢 <strong>Shelter S-03 Guindy</strong> (3.2 km) - 1,900 Beds Free
        </div>
      `;
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 500);
  } else if (type === 'sos') {
    chatBox.innerHTML += `
      <div class="wa-msg-out p-2.5 max-w-[85%] self-end shadow text-xs bg-red-900 text-white">
        🚨 Emergency SOS Requested: Bedridden family member on ground floor.
      </div>
    `;
    setTimeout(() => {
      chatBox.innerHTML += `
        <div class="wa-msg-in p-2.5 max-w-[85%] self-start shadow text-xs border border-red-500/50">
          <strong class="text-red-400">DISPATCH CONFIRMED ✓</strong><br>
          Incident Logged: <strong>REP-102 (SOS-PRIORITY)</strong><br>
          Ambulance Unit A-02 & SDRF Rescue Boat 3 dispatched to your GPS. Keep phone battery on low power mode.
        </div>
      `;
      chatBox.scrollTop = chatBox.scrollHeight;
      if (window.kavasamAudio) window.kavasamAudio.playAlertTone();
    }, 700);
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}

// Citizen Functions
function handleCitizenSearch() {
  const input = document.getElementById('citizen-zone-input');
  if (!input || !input.value.trim()) return;
  window.kavasamState.checkCitizenZone(input.value);

  const res = window.kavasamState.citizenCheckedZone;
  const resultBox = document.getElementById('citizen-check-result');
  if (resultBox) {
    resultBox.innerHTML = `
      <div class="flex items-center justify-between mb-1">
        <span class="text-slate-400 uppercase">SECTOR INUNDATION STATUS</span>
        <span class="badge-pill ${res.riskLevel === 'CRITICAL' ? 'badge-critical' : (res.riskLevel === 'HIGH' ? 'badge-high' : 'badge-normal')}">${res.statusLabel}</span>
      </div>
      <div class="text-base font-bold text-white">${res.name}</div>
      <div class="mt-2 text-slate-300 font-sans">
        <strong class="text-cyan-400 font-mono">ACTION GUIDANCE:</strong> ${res.recommendedAction}
      </div>
    `;
  }
}

function handleCitizenSafeClick() {
  window.kavasamState.markCitizenSafe();
  const btn = document.getElementById('citizen-safe-btn');
  btn.classList.add('border-emerald-500', 'bg-emerald-950/40');
  alert(window.kavasamState.currentLanguage === 'ta' ? window.KAVASAM_DATA.i18n.ta.safeCensusText : "Your safety check-in has been logged with GCC District Control.");
}

function openCitizenSosModal() {
  document.getElementById('sos-modal').style.display = 'flex';
  if (window.kavasamAudio) window.kavasamAudio.playAlertTone();
}
function closeCitizenSosModal() {
  document.getElementById('sos-modal').style.display = 'none';
}
function confirmCitizenSos() {
  closeCitizenSosModal();
  window.kavasamState.addCitizenReport({
    type: "Person Requiring Assistance",
    location: "Zone C-04 • Velachery (User GPS)",
    coords: [12.9775, 80.2170],
    reportedBy: "Citizen Direct SOS",
    details: "Immediate rescue vehicle / medical evacuation requested."
  });
  alert("Rescue boat and ambulance dispatched to your coordinates.");
}

function openHazardReportModal() {
  document.getElementById('hazard-modal').style.display = 'flex';
}
function closeHazardReportModal() {
  document.getElementById('hazard-modal').style.display = 'none';
}
function submitHazardReport() {
  const type = document.getElementById('modal-hazard-type').value;
  const loc = document.getElementById('modal-hazard-loc').value || "Velachery 100-Ft Corridor";
  const desc = document.getElementById('modal-hazard-desc').value || "Water level rising rapidly over road surface.";

  closeHazardReportModal();
  window.kavasamState.addCitizenReport({
    type: type,
    location: loc,
    coords: [12.9800 + (Math.random() - 0.5) * 0.01, 80.2200 + (Math.random() - 0.5) * 0.01],
    reportedBy: "Citizen Report",
    details: desc
  });
}

function openHelplineModal() {
  document.getElementById('helpline-modal').style.display = 'flex';
}
function closeHelplineModal() {
  document.getElementById('helpline-modal').style.display = 'none';
}

// Volunteer Functions
function claimTask(taskId) {
  window.kavasamState.claimVolunteerTask(taskId);
}

function corroborateReport(repId) {
  const rep = window.kavasamState.liveReports.find(r => r.id === repId);
  if (rep) {
    rep.status = 'CORROBORATED';
    rep.confidence = 94;
    rep.corroborationCount++;
    if (window.kavasamAudio) window.kavasamAudio.playSuccessBeep();
    window.kavasamApp.renderVolunteerPortal();
    if (window.kavasamMap) window.kavasamMap.renderReports();
  }
}

// SITREP Modal
function openSitrepModal() {
  const modal = document.getElementById('sitrep-modal');
  const textEl = document.getElementById('sitrep-text-content');
  if (textEl) textEl.textContent = window.kavasamApp.generateSitrepText();
  if (modal) modal.style.display = 'flex';
  if (window.kavasamAudio) window.kavasamAudio.playTacticalChime(540, 0.08);
}
function closeSitrepModal() {
  document.getElementById('sitrep-modal').style.display = 'none';
}
function copySitrep() {
  const textEl = document.getElementById('sitrep-text-content');
  if (textEl) {
    navigator.clipboard.writeText(textEl.textContent);
    const btn = document.getElementById('copy-sitrep-btn');
    btn.textContent = 'COPIED TO CLIPBOARD ✓';
    setTimeout(() => { btn.textContent = 'COPY SITREP'; }, 2000);
  }
}

// Bilingual Language Toggle
function toggleLanguage() {
  const newLang = window.kavasamState.currentLanguage === 'en' ? 'ta' : 'en';
  window.kavasamState.setLanguage(newLang);
  const btn = document.getElementById('global-lang-btn');
  btn.textContent = newLang === 'en' ? 'தமிழ்' : 'English';

  const t = window.KAVASAM_DATA.i18n[newLang];
  if (t) {
    const heroTitle = document.getElementById('c-hero-title');
    if (heroTitle) heroTitle.textContent = t.amIRedZone;
    const heroDesc = document.getElementById('c-hero-desc');
    if (heroDesc) heroDesc.textContent = t.checkZoneDesc;
    const btnSos = document.getElementById('btn-sos-label');
    if (btnSos) btnSos.textContent = t.reqSos;
    const btnHaz = document.getElementById('btn-hazard-label');
    if (btnHaz) btnHaz.textContent = t.reportHazard;
    const btnSafe = document.getElementById('btn-safe-label');
    if (btnSafe) btnSafe.textContent = t.imSafe;
  }
}

function toggleAudio() {
  const enabled = window.kavasamAudio.toggleSound();
  const icon = document.getElementById('audio-icon');
  if (icon) icon.textContent = enabled ? '🔊' : '🔇';
}

// On DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.kavasamApp.init();
});
