/**
 * KAVASAM â€¢ Next-Gen Disaster Intelligence Dataset (SIH26191)
 * Multi-Portal Dataset: Authority | Citizen | Volunteer
 */

const KAVASAM_DATA = {
  metadata: {
    systemName: "KAVASAM",
    tagline: "Intelligent Disaster Response & Community Coordination Platform",
    problemStatement: "SIH26191: Intelligent Identification of Hazard-Based Red Zones, Carrying Capacity Assessment, and Immediate Relocation Needs",
    scenario: "Chennai District â€¢ Urban Flood Scenario",
    baseTime: "14:35 IST",
    simulatedDate: "September 8, 2026",
    centerCoords: [12.9850, 80.2180],
    defaultZoom: 12
  },

  // Red Zones for Authority & Public Check
  zones: [
    {
      id: "C-04",
      name: "Zone C-04 â€¢ Velachery Lake Basin",
      ward: "Ward 177, Greater Chennai Corp",
      locality: "Velachery / AGS Colony / Ram Nagar",
      riskLevel: "CRITICAL",
      riskScore: 89,
      statusLabel: "RED HAZARD ZONE â€¢ EVACUATE",
      population: 4280,
      vulnerableCount: 1840,
      hazardIntensity: 82,
      populationVulnerability: 71,
      accessibilityRisk: 68,
      historicalExposure: 79,
      drainageProximity: 86,
      coords: [12.9780, 80.2185],
      polygon: [
        [12.9860, 80.2100],
        [12.9850, 80.2280],
        [12.9700, 80.2250],
        [12.9710, 80.2120]
      ],
      recommendedAction: "Immediate Evacuation",
      primaryShelterId: "S-07",
      assignedBuses: 12,
      assignedAmbulances: 3,
      teamsAssigned: 4,
      rationale: "Extreme runoff from Pallikaranai marsh converging into low-lying residential clusters. Ground floor inundation exceeding 1.2m.",
      roadStatus: "100-Ft road flooded; Taramani Link corridor open for high-clearance buses"
    },
    {
      id: "B-12",
      name: "Zone B-12 â€¢ Saidapet Adyar River Bank",
      ward: "Ward 142, Greater Chennai Corp",
      locality: "Saidapet / Maraimalai Adigal Basin",
      riskLevel: "HIGH",
      riskScore: 76,
      statusLabel: "HIGH RISK â€¢ RELOCATION STAGE 2",
      population: 2130,
      vulnerableCount: 920,
      hazardIntensity: 74,
      populationVulnerability: 68,
      accessibilityRisk: 62,
      historicalExposure: 84,
      drainageProximity: 91,
      coords: [13.0210, 80.2230],
      polygon: [
        [13.0280, 80.2150],
        [13.0260, 80.2310],
        [13.0150, 80.2290],
        [13.0160, 80.2180]
      ],
      recommendedAction: "Short-term Relocation",
      primaryShelterId: "S-03",
      assignedBuses: 4,
      assignedAmbulances: 2,
      teamsAssigned: 3,
      rationale: "Adyar discharge at 28,000 cusecs causing bank-overflow backwash into riparian settlements.",
      roadStatus: "Anna Salai bridge open; river causeway submerged"
    },
    {
      id: "A-08",
      name: "Zone A-08 â€¢ Madipakkam Lake Shore",
      ward: "Ward 188, Greater Chennai Corp",
      locality: "Madipakkam / Puzhuthivakkam",
      riskLevel: "HIGH",
      riskScore: 71,
      statusLabel: "HIGH RISK â€¢ CAUTION",
      population: 1740,
      vulnerableCount: 650,
      hazardIntensity: 68,
      populationVulnerability: 62,
      accessibilityRisk: 70,
      historicalExposure: 65,
      drainageProximity: 78,
      coords: [12.9620, 80.1980],
      polygon: [
        [12.9690, 80.1900],
        [12.9680, 80.2060],
        [12.9550, 80.2040],
        [12.9560, 80.1920]
      ],
      recommendedAction: "Medium-term Move",
      primaryShelterId: "S-11",
      assignedBuses: 3,
      assignedAmbulances: 1,
      teamsAssigned: 2,
      rationale: "Stormwater culverts overwhelmed by local runoff. Stagnation depth 0.7m.",
      roadStatus: "Medavakkam high road passable with heavy vehicles"
    },
    {
      id: "D-02",
      name: "Zone D-02 â€¢ Perumbakkam Fringe",
      ward: "Tambaram Taluk / St. Thomas Mount",
      locality: "Perumbakkam Tenements",
      riskLevel: "MODERATE",
      riskScore: 58,
      statusLabel: "MODERATE â€¢ MONITORING",
      population: 2860,
      vulnerableCount: 1120,
      hazardIntensity: 56,
      populationVulnerability: 74,
      accessibilityRisk: 51,
      historicalExposure: 52,
      drainageProximity: 64,
      coords: [12.8980, 80.1920],
      polygon: [
        [12.9050, 80.1850],
        [12.9040, 80.2000],
        [12.8900, 80.1980],
        [12.8920, 80.1860]
      ],
      recommendedAction: "Standby Watch",
      primaryShelterId: "S-11",
      assignedBuses: 2,
      assignedAmbulances: 1,
      teamsAssigned: 2,
      rationale: "Perumbakkam wetland margins saturated; surface drainage slowed.",
      roadStatus: "Clear via Medavakkam bypass"
    },
    {
      id: "N-01",
      name: "Zone N-01 â€¢ Vyasarpadi Basin",
      ward: "Ward 35, North Chennai Corp",
      locality: "Vyasarpadi / Kalyanapuram",
      riskLevel: "HIGH",
      riskScore: 78,
      statusLabel: "HIGH RISK â€¢ NORTH CHENNAI",
      population: 3450,
      vulnerableCount: 1480,
      hazardIntensity: 76,
      populationVulnerability: 80,
      accessibilityRisk: 73,
      historicalExposure: 82,
      drainageProximity: 88,
      coords: [13.1120, 80.2580],
      polygon: [
        [13.1200, 80.2500],
        [13.1180, 80.2660],
        [13.1050, 80.2640],
        [13.1060, 80.2510]
      ],
      recommendedAction: "Targeted Evacuation",
      primaryShelterId: "S-01",
      assignedBuses: 5,
      assignedAmbulances: 2,
      teamsAssigned: 3,
      rationale: "Otteri Nullah backwater inundation compounded by high tide window.",
      roadStatus: "GNT Road partially slowed"
    }
  ],

  // Shelters with Detailed Carrying Capacity for Citizens & Government
  shelters: [
    {
      id: "S-07",
      name: "Shelter S-07 â€¢ Velachery Higher Secondary School",
      type: "Primary Government Relief Center",
      locality: "Gandhi Salai, Velachery",
      distanceFromFocus: "0.9 km (11 min walk)",
      coords: [12.9860, 80.2270],
      capacity: 2500,
      occupied: 1820,
      available: 680,
      medicalTeams: 2,
      foodSupplyDays: 4.5,
      amenities: ["Clean RO Drinking Water", "Dedicated Senior Citizen Ward", "Emergency Generator 48h", "Free Warm Meals", "Dry Clothes Distribution"],
      contact: "Capt. R. Sundaram (94440-12891)"
    },
    {
      id: "S-03",
      name: "Shelter S-03 â€¢ Guindy Multi-Purpose Relief Center",
      type: "High-Capacity Regional Cyclone Center",
      locality: "Race Course Road, Guindy",
      distanceFromFocus: "3.2 km (8 min bus)",
      coords: [13.0080, 80.2090],
      capacity: 4000,
      occupied: 2100,
      available: 1900,
      medicalTeams: 3,
      foodSupplyDays: 6.0,
      amenities: ["Doctor On-site 24/7", "Mother & Infant Care", "Dual Solar Power", "Sanitary Supplies", "Charging Station"],
      contact: "Dr. M. Arumugam (94441-55021)"
    },
    {
      id: "S-11",
      name: "Shelter S-11 â€¢ Tambaram Indoor Sports Complex",
      type: "Mega Relief Facility",
      locality: "GST Road, Tambaram Sanatorium",
      distanceFromFocus: "6.8 km (18 min bus)",
      coords: [12.9250, 80.1400],
      capacity: 3500,
      occupied: 1450,
      available: 2050,
      medicalTeams: 3,
      foodSupplyDays: 5.5,
      amenities: ["Helipad Access", "Large Dining Hall", "Red Cross Support", "Wheelchair Ramps"],
      contact: "K. Selvanathan (94443-88129)"
    },
    {
      id: "S-01",
      name: "Shelter S-01 â€¢ Ripon Civil Defense Hub",
      type: "North Chennai Relief Center",
      locality: "Periamet / Chennai Central",
      distanceFromFocus: "11.4 km",
      coords: [13.0827, 80.2750],
      capacity: 2000,
      occupied: 950,
      available: 1050,
      medicalTeams: 2,
      foodSupplyDays: 7.0,
      amenities: ["Civil Defense Command", "Ambulance Staging", "Emergency Communication Ham Radio"],
      contact: "P. Radhika (94440-99320)"
    }
  ],

  // Volunteer Community Tasks
  volunteerTasks: [
    {
      id: "TSK-01",
      title: "Check Water Level Gauge at Lake Weir Gate 3",
      zone: "Zone C-04 â€¢ Velachery",
      urgency: "HIGH",
      points: 150,
      category: "Sensor & Gauge",
      status: "OPEN",
      description: "Take optical reading of marker gauge near southern weir and report backflow status."
    },
    {
      id: "TSK-02",
      title: "Verify Wheelchair Ramps & Ingress at Shelter S-07",
      zone: "Zone C-04 â€¢ Velachery",
      urgency: "CRITICAL",
      points: 200,
      category: "Shelter Support",
      status: "CLAIMED",
      claimedBy: "Deepa Natarajan (Ward 177)",
      description: "Ensure eastern gate threshold remains clear of stormwater runoff for incoming elderly evacuees."
    },
    {
      id: "TSK-03",
      title: "Assist Elderly Couple on Ground Floor - Gandhi Nagar 3rd St",
      zone: "Zone C-04 â€¢ Velachery",
      urgency: "IMMEDIATE",
      points: 300,
      category: "Rescue Assist",
      status: "OPEN",
      description: "Accompany MTC rescue transit team to verify safe boarding of senior citizen duo."
    },
    {
      id: "TSK-04",
      title: "Confirm Inundation Clearance on Taramani Link Bypass",
      zone: "Route R-01 Corridor",
      urgency: "HIGH",
      points: 175,
      category: "Route Scout",
      status: "OPEN",
      description: "Verify that bus corridor has standing water below 1.0ft to allow continuous convoy flow."
    }
  ],

  // Crowd Reports Feed
  reports: [
    {
      id: "REP-101",
      type: "Flooded Road",
      location: "Velachery 100-Ft Road Near Bypass Junction",
      coords: [12.9810, 80.2195],
      reportedBy: "K. Mohan (Citizen)",
      timeAgo: "6 min ago",
      status: "CORROBORATED",
      confidence: 88,
      corroborationCount: 4,
      details: "Water level rose to ~1.4 feet. Smaller cars stalled. Heavy rescue trucks still passing.",
      actionTaken: "Bypass reroute triggered for Route R-02."
    },
    {
      id: "REP-102",
      type: "Person Requiring Assistance",
      location: "Gandhi Nagar 3rd St, Zone C-04",
      coords: [12.9760, 80.2150],
      reportedBy: "S. Priya (Citizen SOS)",
      timeAgo: "11 min ago",
      status: "CORROBORATED",
      confidence: 94,
      corroborationCount: 2,
      details: "Elderly couple on ground floor; wheelchair support required for transfer.",
      actionTaken: "Dispatched Ambulance Unit A-02 and SDRF Team 1."
    },
    {
      id: "REP-103",
      type: "Drainage Silt Blockage",
      location: "Madipakkam South Canal Culvert",
      coords: [12.9590, 80.1990],
      reportedBy: "R. Balaji (Verified Member)",
      timeAgo: "24 min ago",
      status: "ANALYZING",
      confidence: 65,
      corroborationCount: 1,
      details: "Trash barrier clogged at culvert 4. Water backing into residential street.",
      actionTaken: "GCC Rapid Drainage Gang alerted."
    }
  ],

  // Evacuation Routes
  routes: [
    {
      id: "R-01",
      fromZone: "C-04",
      toShelter: "S-07",
      name: "Taramani Link Safe Flood Corridor",
      distanceKm: 4.2,
      estimatedMinutes: 18,
      status: "ACCESSIBLE",
      waypoints: [
        [12.9780, 80.2185],
        [12.9810, 80.2220],
        [12.9840, 80.2250],
        [12.9860, 80.2270]
      ]
    },
    {
      id: "R-02",
      fromZone: "C-04",
      toShelter: "S-03",
      name: "Velachery South Corridor to Guindy S-03",
      distanceKm: 6.8,
      estimatedMinutes: 26,
      status: "CONGESTED",
      waypoints: [
        [12.9780, 80.2185],
        [12.9830, 80.2110],
        [12.9960, 80.2070],
        [13.0080, 80.2090]
      ]
    }
  ],

  // Dual Language Translation Dictionary
  i18n: {
    en: {
      appName: "KAVASAM",
      tagline: "Disaster Intelligence & Community Response",
      heroTitle: "INTELLIGENT DISASTER RESPONSE FOR CHENNAI",
      heroDesc: "Connecting disaster authorities, verified community volunteers, and citizens into one seamless life-saving decision network.",
      portalGov: "GOVERNMENT & AUTHORITY",
      portalCitizen: "CITIZEN & PUBLIC SAFETY",
      portalVol: "VOLUNTEER & RESPONDER",
      amIRedZone: "Are You in a Hazard Red Zone?",
      checkZoneDesc: "Check live inundation risk for your street or locality.",
      findShelter: "Find Closest Safe Shelter",
      reqSos: "REQUEST IMMEDIATE ASSISTANCE (SOS)",
      reportHazard: "REPORT A FLOODED STREET",
      imSafe: "I'M SAFE (CHECK-IN)",
      safeCensusText: "residents safely registered in your sector"
    },
    ta: {
      appName: "à®•à®µà®šà®®à¯ (KAVASAM)",
      tagline: "à®ªà¯‡à®°à®¿à®Ÿà®°à¯ à®¨à¯à®£à¯à®£à®±à®¿à®µà¯ à®®à®±à¯à®±à¯à®®à¯ à®šà®®à¯‚à®•à®ªà¯ à®ªà®¾à®¤à¯à®•à®¾à®ªà¯à®ªà¯ à®¤à®³à®®à¯",
      heroTitle: "à®šà¯†à®©à¯à®©à¯ˆà®•à¯à®•à®¾à®© à®…à®µà®šà®° à®ªà¯‡à®°à®¿à®Ÿà®°à¯ à®¨à¯à®£à¯à®£à®±à®¿à®µà¯ à®¤à®³à®®à¯",
      heroDesc: "à®ªà¯‡à®°à®¿à®Ÿà®°à¯ à®®à¯‡à®²à®¾à®£à¯à®®à¯ˆ à®…à®¤à®¿à®•à®¾à®°à®¿à®•à®³à¯, à®¤à®©à¯à®©à®¾à®°à¯à®µà®²à®°à¯à®•à®³à¯ à®®à®±à¯à®±à¯à®®à¯ à®ªà¯Šà®¤à¯à®®à®•à¯à®•à®³à¯ˆ à®‡à®£à¯ˆà®•à¯à®•à¯à®®à¯ à®’à®°à¯à®™à¯à®•à®¿à®£à¯ˆà®¨à¯à®¤ à®ªà®¾à®¤à¯à®•à®¾à®ªà¯à®ªà¯ à®…à®®à¯ˆà®ªà¯à®ªà¯.",
      portalGov: "à®…à®°à®šà¯ à®®à®±à¯à®±à¯à®®à¯ à®ªà¯‡à®°à®¿à®Ÿà®°à¯ à®®à¯‡à®²à®¾à®£à¯à®®à¯ˆ",
      portalCitizen: "à®ªà¯Šà®¤à¯à®®à®•à¯à®•à®³à¯ à®ªà®¾à®¤à¯à®•à®¾à®ªà¯à®ªà¯",
      portalVol: "à®¤à®©à¯à®©à®¾à®°à¯à®µà®²à®°à¯ à®¤à®³à®®à¯",
      amIRedZone: "à®¨à¯€à®™à¯à®•à®³à¯ à®µà¯†à®³à¯à®³ à®…à®ªà®¾à®¯ à®®à®£à¯à®Ÿà®²à®¤à¯à®¤à®¿à®²à¯ à®‰à®³à¯à®³à¯€à®°à¯à®•à®³à®¾?",
      checkZoneDesc: "à®‰à®™à¯à®•à®³à¯ à®¤à¯†à®°à¯ à®…à®²à¯à®²à®¤à¯ à®ªà®•à¯à®¤à®¿à®¯à®¿à®©à¯ à®¤à®±à¯à®ªà¯‹à®¤à¯ˆà®¯ à®µà¯†à®³à¯à®³ à®…à®ªà®¾à®¯ à®¨à®¿à®²à¯ˆà®¯à¯ˆ à®šà®°à®¿à®ªà®¾à®°à¯à®•à¯à®•à®µà¯à®®à¯.",
      findShelter: "à®…à®°à¯à®•à®¿à®²à¯à®³à¯à®³ à®¨à®¿à®µà®¾à®°à®£ à®®à¯à®•à®¾à®®à¯ˆ à®•à®£à¯à®Ÿà®±à®¿à®•",
      reqSos: "à®…à®µà®šà®° à®®à¯€à®Ÿà¯à®ªà¯ à®‰à®¤à®µà®¿ à®•à¯‹à®°à¯à®• (SOS)",
      reportHazard: "à®µà¯†à®³à¯à®³à®®à¯ à®ªà®¾à®¤à®¿à®¤à¯à®¤ à®šà®¾à®²à¯ˆà®¯à¯ˆ à®ªà®¤à®¿à®µà¯ à®šà¯†à®¯à¯à®•",
      imSafe: "à®¨à®¾à®©à¯ à®ªà®¾à®¤à¯à®•à®¾à®ªà¯à®ªà®¾à®• à®‰à®³à¯à®³à¯‡à®©à¯",
      safeCensusText: "à®®à®•à¯à®•à®³à¯ à®ªà®¾à®¤à¯à®•à®¾à®ªà¯à®ªà®¾à®• à®ªà®¤à®¿à®µà¯ à®šà¯†à®¯à¯à®¤à¯à®³à¯à®³à®©à®°à¯"
    }
  }
};

window.KAVASAM_DATA = KAVASAM_DATA;
