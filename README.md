# KAVASAM â€¢ Intelligent Disaster Response & Geospatial Decision Platform

> **Smart India Hackathon 2026 Problem Statement SIH26191**  
> *Intelligent Identification of Hazard-Based Red Zones, Carrying Capacity Assessment, and Immediate Relocation Needs for Vulnerable Habitations.*

---

## 1. Executive Summary

**KAVASAM** is an advanced disaster-intelligence and community-response platform built to transform fragmented, raw telemetry into actionable life-saving decisions during extreme natural hazards.

Instead of functioning as a passive alert map, KAVASAM demonstrates a complete operational decision loop:
$$\text{DETECT} \longrightarrow \text{ANALYZE} \longrightarrow \text{PRIORITIZE} \longrightarrow \text{PLAN} \longrightarrow \text{EVACUATE} \longrightarrow \text{COORDINATE} \longrightarrow \text{VERIFY} \longrightarrow \text{RECALCULATE}$$

### Five Core Questions Answered in Real-Time:
1. **WHAT IS HAPPENING?** Continuous runoff & water-level monitoring in South-Central Chennai (Velachery, Saidapet, Madipakkam, Vyasarpadi).
2. **WHY IS IT HAPPENING?** Multi-hazard decomposition (82% rainfall runoff, 71% vulnerable demographics, 68% road bottlenecking, 79% historical footprint).
3. **WHO IS AFFECTED?** Geospatial identification of 12,480 citizens, with priority sorting for 1,840 high-risk elderly and children.
4. **WHAT SHOULD AUTHORITIES DO?** Immediate relocation directives dispatching 18 MTC buses via open corridors (Taramani Link) to high-capacity shelters.
5. **WHAT CHANGES IF CONDITIONS CHANGE?** Dynamic What-If recalculation updating priorities, routes, and shelter capacities across all views.

---

## 2. Platform Architecture & Modules

### A. Command Center (65-70% Chennai Geospatial Centerpiece)
- Real geographic dark-mode map of Chennai with CartoDB Dark Matter tiles and offline vector fallback.
- Color-coded hazard zones with subtle pulsing indicators for critical danger sectors.
- Real-time animated evacuation routes with congestion status.
- Core metrics: Active Incidents, People at Risk, High-Risk Habitations, Shelter Carrying Capacity, and Evacuation Priority.
- Incident reasoning timeline tracking system logic chronologically.
- 25-second sequential disaster simulation runner with Run, Pause, and Reset controls.

### B. Incident Analysis ("Why This Area is High Risk?")
- Quantitative factor breakdown bars for selected habitations:
  - Hazard Intensity
  - Population Vulnerability
  - Ingress/Accessibility Risk
  - Historical Flood Exposure
  - Drainage Canal Proximity
- Explainable AI recommendation panel with confidence rating (87%) and operational rationale.

### C. Evacuation & Relocation Dispatch
- Ranked list of vulnerable habitations sorted by threat index.
- Shelter carrying capacity assessment (Shelters S-07, S-03, S-11, S-01) comparing occupied vs. available beds, medical teams, and food supply days.
- Transport fleet allocation (MTC buses, 108 ambulances, NDRF/SDRF teams).

### D. Citizen View (Simplified Mobile UI)
- Distraction-free, high-contrast emergency companion for affected residents.
- Clear directive: "WHAT YOU SHOULD DO NOW".
- Designated shelter information and safe route guidance.
- Four prominent actions: **Get Directions**, **Request Assistance (SOS)**, **Report a Hazard**, and **I'm Safe**.

### E. Community Network & Crowd Corroboration
- Verified community responders performing safe, non-hazardous support tasks.
- Crowd intelligence corroboration engine: transitions unverified reports from *Received* (45% confidence) to *Corroborated* (88% confidence) upon multiple reports.

### F. What-If Simulation Engine
- Interactive scenario testing knobs:
  - Precipitation Intensity (Normal, +20%, +40%, +60%)
  - Road Closures (None to 3 major arteries blocked)
  - Shelter Capacity (100% to 40% availability)
  - Vulnerable Population (Baseline to +50% spike)
- Dynamic Before vs. After comparative delta metrics demonstrating live recalculation.

---

## 3. 10% Innovation Upgrades (SIH Grand Finale Features)

1. **Bilingual Localization (Tamil / English)**: Instant toggle for citizen emergency advisories in à®¤à®®à®¿à®´à¯ (Tamil) and English for Tamil Nadu field operations.
2. **Tactile Web Audio Synthesizer**: Subdued mission-control telemetry clicks, radar sweeps, and critical alert tones using native HTML5 Web Audio API (zero external files).
3. **Automated District Magistrate SITREP Generator**: One-click generation of a formatted operational Situation Report ready to print or copy to clipboard for disaster management authorities.
4. **Interactive Road Obstruction Injector**: Click directly on any evacuation corridor on the map to simulate waterlogging and trigger dynamic AI route recalculation.
5. **Zero-Dependency Launcher**: Runs instantly via double-clicking `start_kavasam.bat` or opening `index.html` in any browser.

---

## 4. How to Run

### Method 1: Double-Click Launcher (Recommended for Windows)
Double-click `start_kavasam.bat` in the project root. It will start a local server using Windows PowerShell's built-in HTTP listener and automatically open your default browser.

### Method 2: Direct Browser Opening
Simply double-click `index.html` in any modern web browser (Edge, Chrome, Firefox).

---

*Note: This platform is a hackathon demonstration prototype created for SIH26191. All telemetry, populations, and sensor feeds are simulated.*
