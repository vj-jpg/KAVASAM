/**
 * KAVASAM • Unified Reactive State Engine & Multi-Portal Core
 * Portals: 'authority' | 'citizen' | 'volunteer'
 */

class KavasamState {
  constructor() {
    this.subscribers = [];
    
    // Multi-Portal Navigation
    this.activePortal = 'authority'; // 'authority' | 'citizen' | 'volunteer'
    this.authoritySubView = 'command'; // 'command' | 'analysis' | 'evacuation' | 'whatif'
    this.currentLanguage = 'en'; // 'en' | 'ta'
    this.selectedZoneId = 'C-04'; // Default Velachery Lake Basin

    // Simulation Stages
    this.simulationStages = [
      { id: 'NORMAL', label: 'NORMAL MONSOON', time: '14:15' },
      { id: 'RAIN_DETECTED', label: 'RAIN ANOMALY DETECTED', time: '14:20' },
      { id: 'RISK_INCREASING', label: 'RUNOFF THRESHOLD EXCEEDED', time: '14:24' },
      { id: 'HIGH_RISK_IDENTIFIED', label: 'RED ZONE C-04 CLASSIFIED', time: '14:27' },
      { id: 'VULNERABLE_POPULATION_IDENTIFIED', label: '1,840 VULNERABLE MAPPED', time: '14:30' },
      { id: 'EVACUATION_RECOMMENDED', label: 'EVACUATION CONVOY READY', time: '14:32' },
      { id: 'RESPONSE_PLAN_GENERATED', label: 'OPERATIONAL PLAN ACTIVE', time: '14:35' }
    ];
    this.currentStageIndex = 6;
    this.isPlaying = false;
    this.playbackTimer = null;

    // What-If Scenario Parameters
    this.whatIf = {
      rainfall: 'plus40',
      rainfallMult: 1.4,
      roadClosures: 1,
      shelterCapacity: 100,
      shelterCapMult: 1.0,
      vulnerablePop: 'baseline',
      popMult: 1.0,
      isRecalculating: false,
      recalcStepText: ''
    };

    // Citizen State
    this.citizenCheckedZone = null;
    this.citizenSafeCount = 428;

    // Volunteer State
    this.volunteerTasks = [...KAVASAM_DATA.volunteerTasks];
    this.volunteerPoints = 450;
    this.volunteerRank = "Rank 3: Ward Coordinator";

    // Offline / Internet Failure Simulation State
    this.isOfflineMode = false;

    // Compute Derived Metrics
    this.recalculateMetrics();
  }

  toggleInternetMode() {
    this.isOfflineMode = !this.isOfflineMode;
    if (window.kavasamAudio) {
      if (this.isOfflineMode) window.kavasamAudio.playAlertTone();
      else window.kavasamAudio.playTacticalChime(640, 0.08);
    }
    this.notify({ type: 'INTERNET_MODE_CHANGED', isOffline: this.isOfflineMode });
    return this.isOfflineMode;
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify(eventData = {}) {
    this.subscribers.forEach(cb => {
      try {
        cb(this, eventData);
      } catch (err) {
        console.error("State notification error:", err);
      }
    });
  }

  // Switch Portal (Authority, Citizen, Volunteer)
  setPortal(portalName) {
    if (this.activePortal === portalName) return;
    this.activePortal = portalName;
    if (window.kavasamAudio) window.kavasamAudio.playTacticalChime(560, 0.08);
    this.notify({ type: 'PORTAL_CHANGED', portal: portalName });
  }

  setAuthoritySubView(viewName) {
    this.authoritySubView = viewName;
    if (window.kavasamAudio) window.kavasamAudio.playTacticalChime(480, 0.06);
    this.notify({ type: 'AUTHORITY_SUBVIEW_CHANGED', view: viewName });
  }

  setLanguage(lang) {
    this.currentLanguage = lang;
    this.notify({ type: 'LANG_CHANGED', lang });
  }

  selectZone(zoneId) {
    this.selectedZoneId = zoneId;
    if (window.kavasamAudio) window.kavasamAudio.playTacticalChime(580, 0.06);
    this.notify({ type: 'ZONE_SELECTED', zoneId });
  }

  // Citizen Zone Search
  checkCitizenZone(query) {
    const q = query.trim().toLowerCase();
    const match = KAVASAM_DATA.zones.find(z => 
      z.name.toLowerCase().includes(q) || 
      z.locality.toLowerCase().includes(q) ||
      z.ward.toLowerCase().includes(q)
    );
    this.citizenCheckedZone = match || {
      name: query + " (Area Verified)",
      riskLevel: "LOW",
      statusLabel: "GREEN ZONE • NO IMMEDIATE INUNDATION",
      recommendedAction: "Stay tuned to GCC official alerts."
    };
    if (window.kavasamAudio) window.kavasamAudio.playTacticalChime(640, 0.08);
    this.notify({ type: 'CITIZEN_ZONE_CHECKED', zone: this.citizenCheckedZone });
  }

  // Volunteer Task Claiming
  claimVolunteerTask(taskId) {
    const task = this.volunteerTasks.find(t => t.id === taskId);
    if (task && task.status === 'OPEN') {
      task.status = 'CLAIMED';
      task.claimedBy = 'You (Current Session)';
      this.volunteerPoints += task.points;
      if (window.kavasamAudio) window.kavasamAudio.playSuccessBeep();
      this.notify({ type: 'TASK_CLAIMED', taskId });
    }
  }

  markCitizenSafe() {
    this.citizenSafeCount++;
    if (window.kavasamAudio) window.kavasamAudio.playSuccessBeep();
    this.notify({ type: 'CITIZEN_SAFE_INCREMENTED', count: this.citizenSafeCount });
  }

  addCitizenReport(newReport) {
    const reportObj = {
      id: `REP-${Math.floor(100 + Math.random() * 900)}`,
      timeAgo: 'Just now',
      status: 'ANALYZING',
      confidence: 60,
      corroborationCount: 1,
      ...newReport
    };
    this.liveReports.unshift(reportObj);
    if (window.kavasamAudio) window.kavasamAudio.playAlertTone();
    this.notify({ type: 'NEW_CITIZEN_REPORT', report: reportObj });

    setTimeout(() => {
      reportObj.status = 'CORROBORATED';
      reportObj.confidence = 89;
      reportObj.corroborationCount = 3;
      if (window.kavasamAudio) window.kavasamAudio.playSuccessBeep();
      this.notify({ type: 'REPORT_CORROBORATED', report: reportObj });
    }, 4000);
  }

  // Simulation Runner
  startSimulation() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.currentStageIndex = 0;
    this.recalculateMetrics();
    this.notify({ type: 'SIMULATION_STARTED', stage: this.currentStageIndex });
    if (window.kavasamAudio) window.kavasamAudio.playTacticalChime(600, 0.1);
    this.runSimulationStep();
  }

  runSimulationStep() {
    if (!this.isPlaying) return;

    this.playbackTimer = setTimeout(() => {
      if (this.currentStageIndex < this.simulationStages.length - 1) {
        this.currentStageIndex++;
        this.recalculateMetrics();
        if (window.kavasamAudio) {
          if (this.currentStageIndex >= 3) {
            window.kavasamAudio.playCriticalWarning();
          } else {
            window.kavasamAudio.playTacticalChime(520 + this.currentStageIndex * 35, 0.08);
          }
        }
        this.notify({ type: 'SIMULATION_STEP', stage: this.currentStageIndex });
        this.runSimulationStep();
      } else {
        this.isPlaying = false;
        if (window.kavasamAudio) window.kavasamAudio.playSuccessBeep();
        this.notify({ type: 'SIMULATION_COMPLETED' });
      }
    }, 3800);
  }

  pauseSimulation() {
    this.isPlaying = false;
    if (this.playbackTimer) clearTimeout(this.playbackTimer);
    this.notify({ type: 'SIMULATION_PAUSED' });
  }

  resetSimulation() {
    this.pauseSimulation();
    this.currentStageIndex = 6; // reset back to full demo
    this.recalculateMetrics();
    this.notify({ type: 'SIMULATION_RESET' });
  }

  // What-If
  setWhatIfParams(params) {
    if (params.rainfall !== undefined) {
      this.whatIf.rainfall = params.rainfall;
      this.whatIf.rainfallMult = params.rainfall === 'plus20' ? 1.2 : (params.rainfall === 'plus40' ? 1.4 : (params.rainfall === 'plus60' ? 1.6 : 1.0));
    }
    if (params.roadClosures !== undefined) {
      this.whatIf.roadClosures = parseInt(params.roadClosures, 10);
    }
    if (params.shelterCapacity !== undefined) {
      this.whatIf.shelterCapacity = parseInt(params.shelterCapacity, 10);
      this.whatIf.shelterCapMult = this.whatIf.shelterCapacity / 100;
    }
  }

  runWhatIfRecalculation(onComplete) {
    this.whatIf.isRecalculating = true;
    if (window.kavasamAudio) window.kavasamAudio.playRecalculatingSweep();

    const steps = [
      "Simulating 28,000 cusecs runoff converging into Velachery...",
      "Recalculating bottleneck risks on OMR and GST arterials...",
      "Evaluating carrying capacity across 4 multi-purpose shelters...",
      "Prioritizing high-vulnerability residences for immediate bus transfer..."
    ];

    let stepIndex = 0;
    this.whatIf.recalcStepText = steps[0];
    this.notify({ type: 'WHAT_IF_RECALCULATING', text: steps[0] });

    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        this.whatIf.recalcStepText = steps[stepIndex];
        if (window.kavasamAudio) window.kavasamAudio.playTacticalChime(450 + stepIndex * 70, 0.05);
        this.notify({ type: 'WHAT_IF_RECALCULATING', text: steps[stepIndex] });
      } else {
        clearInterval(interval);
        this.whatIf.isRecalculating = false;
        this.whatIf.recalcStepText = '';
        this.recalculateMetrics();
        if (window.kavasamAudio) window.kavasamAudio.playSuccessBeep();
        this.notify({ type: 'WHAT_IF_COMPLETED' });
        if (onComplete) onComplete();
      }
    }, 600);
  }

  // Recalculation math
  recalculateMetrics() {
    const stage = this.currentStageIndex;
    const { rainfallMult, shelterCapMult, roadClosures } = this.whatIf;
    const stageFactor = stage === 0 ? 0.1 : (stage <= 2 ? 0.45 : (stage <= 4 ? 0.8 : 1.0));

    // Active Incidents
    this.activeIncidents = Math.max(0, Math.round((stage <= 1 ? 1 : 3) * (rainfallMult > 1.2 ? 1.7 : 1.0) + roadClosures));

    // People at Risk
    const baseAtRisk = stage === 0 ? 500 : (stage <= 2 ? 3200 : 12480);
    this.peopleAtRisk = Math.round(baseAtRisk * rainfallMult * stageFactor);

    // High Risk Zones
    const baseZones = stage === 0 ? 0 : (stage <= 2 ? 2 : 7);
    this.highRiskHabitations = Math.min(14, baseZones + Math.floor((rainfallMult - 1.0) * 8) + roadClosures);

    // Shelters
    this.effectiveShelterCapacity = Math.round(12000 * shelterCapMult);
    const baseOccupied = stage <= 1 ? 1500 : (stage <= 3 ? 4500 : 8920);
    this.shelterOccupied = Math.min(this.effectiveShelterCapacity + 600, Math.round(baseOccupied + (this.peopleAtRisk - 12480) * 0.35));
    this.shelterAvailable = Math.max(0, this.effectiveShelterCapacity - this.shelterOccupied);

    // Evacuation Priority
    if (stage <= 1) this.evacuationPriority = "LOW";
    else if (stage <= 2) this.evacuationPriority = "MODERATE";
    else if (stage <= 4) this.evacuationPriority = "HIGH";
    else this.evacuationPriority = rainfallMult > 1.2 ? "CRITICAL" : "IMMEDIATE";

    // Buses & Ambulances
    this.busesAvailable = 24;
    this.busesAssigned = Math.min(24, Math.round(14 * stageFactor * (this.peopleAtRisk / 10000)));
    this.ambulancesAvailable = 10;
    this.ambulancesAssigned = Math.min(10, Math.round(6 * stageFactor));
  }
}

window.kavasamState = new KavasamState();
