"use client";

import { useMemo, useState } from "react";
import { geoCentroid } from "d3-geo";
import type { Feature, Geometry } from "geojson";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Marker
} from "react-simple-maps";
import worldMap from "world-atlas/countries-110m.json";
import usMap from "us-atlas/states-10m.json";

type TabId = "home" | "optimizer" | "patterns";
type RegionScope = "Country" | "U.S. State" | "Ocean / Sea";
type CategoryId =
  | "rainy-steep"
  | "humid-moderate"
  | "temperate"
  | "arid-dusty"
  | "desert-flat"
  | "marine-humid"
  | "marine-arid"
  | "polar-marine";

type RegionRecommendation = {
  id: string;
  name: string;
  scope: RegionScope;
  category: CategoryId;
  environment: string;
  rainfall: string;
  dust: string;
  tilt: number;
  tiltBasis: string;
  latitude: number;
  hydrophilic: number;
  hydrophobic: number;
  stripCount: number;
  temperature: string;
  waterContent: string;
  note: string;
};

type MapGeo = Feature<Geometry, { name?: string }> & {
  id?: number | string;
  rsmKey: string;
};

type MarineZone = {
  id: string;
  name: string;
  coordinates: [number, number];
  category: CategoryId;
  latitude: number;
  temperature: string;
  waterContent: string;
  note: string;
};

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "home", label: "Home" },
  { id: "optimizer", label: "Region Optimizer" },
  { id: "patterns", label: "Under Testing Designs" }
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const pagePadding = "p-3 md:p-6";
const eyebrowClass = "mb-2.5 text-xs font-black uppercase tracking-normal text-[#00856f]";
const primaryButtonClass =
  "justify-self-start border-0 bg-[#00856f] px-4 py-3 text-sm font-black text-white whitespace-nowrap transition-colors hover:bg-[#006b5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00856f] disabled:cursor-default disabled:opacity-45";
const secondaryButtonClass =
  "justify-self-start border-0 bg-[#173236] px-4 py-3 text-sm font-black text-white whitespace-nowrap transition-colors hover:bg-[#00856f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9ee5d8]";
const mutedTextClass = "m-0 leading-[1.55] text-[#5c6d70]";
const panelHeadingClass = "justify-self-stretch";
const panelHeadingTitleClass = "mb-2.5 text-[clamp(1.6rem,2.7vw,3rem)] leading-[1.05] tracking-normal";

const categoryProfiles: Record<
  CategoryId,
  Pick<
    RegionRecommendation,
    | "environment"
    | "rainfall"
    | "dust"
    | "hydrophilic"
    | "hydrophobic"
    | "stripCount"
    | "temperature"
    | "waterContent"
  >
> = {
  "rainy-steep": {
    environment: "Rainy / steep",
    rainfall: "High rainfall",
    dust: "Low to moderate soiling",
    hydrophilic: 86,
    hydrophobic: 14,
    stripCount: 6,
    temperature: "Cool to mild",
    waterContent: "High atmospheric moisture"
  },
  "humid-moderate": {
    environment: "Humid / moderate",
    rainfall: "Moderate to high rainfall",
    dust: "Organic film and light dust",
    hydrophilic: 76,
    hydrophobic: 24,
    stripCount: 8,
    temperature: "Warm and humid",
    waterContent: "High humidity"
  },
  temperate: {
    environment: "Temperate",
    rainfall: "Seasonal rainfall",
    dust: "Mixed dirt, pollen, and road dust",
    hydrophilic: 66,
    hydrophobic: 34,
    stripCount: 10,
    temperature: "Seasonal temperature range",
    waterContent: "Moderate moisture"
  },
  "arid-dusty": {
    environment: "Arid / dusty",
    rainfall: "Low rainfall",
    dust: "Frequent mineral dust",
    hydrophilic: 52,
    hydrophobic: 48,
    stripCount: 14,
    temperature: "Hot and dry",
    waterContent: "Low moisture"
  },
  "desert-flat": {
    environment: "Desert / flat",
    rainfall: "Very low rainfall",
    dust: "Heavy fine dust and mineral residue",
    hydrophilic: 42,
    hydrophobic: 58,
    stripCount: 18,
    temperature: "Very hot, high evaporation",
    waterContent: "Very low moisture"
  },
  "marine-humid": {
    environment: "Humid marine",
    rainfall: "Frequent spray, rain, and fog",
    dust: "Salt film and biological residue",
    hydrophilic: 82,
    hydrophobic: 18,
    stripCount: 7,
    temperature: "Mild to warm water",
    waterContent: "Very high surface moisture"
  },
  "marine-arid": {
    environment: "Arid marine",
    rainfall: "Low rain, frequent salt spray",
    dust: "Salt film plus coastal dust",
    hydrophilic: 60,
    hydrophobic: 40,
    stripCount: 12,
    temperature: "Warm to hot water",
    waterContent: "High salinity, lower rainfall"
  },
  "polar-marine": {
    environment: "Cold marine",
    rainfall: "Snow, spray, and low evaporation",
    dust: "Salt, ice, and low mineral dust",
    hydrophilic: 88,
    hydrophobic: 12,
    stripCount: 5,
    temperature: "Cold water",
    waterContent: "High moisture, low evaporation"
  }
};

const marineZones: MarineZone[] = [
  {
    id: "atlantic-ocean",
    name: "Atlantic Ocean",
    coordinates: [-35, 5],
    category: "marine-humid",
    latitude: 5,
    temperature: "Mixed, warm tropics to cool north",
    waterContent: "High humidity and spray",
    note: "Large offshore solar concepts would face salt film and frequent moisture."
  },
  {
    id: "pacific-ocean",
    name: "Pacific Ocean",
    coordinates: [-150, 0],
    category: "marine-humid",
    latitude: 0,
    temperature: "Warm tropical belts with cooler currents",
    waterContent: "Very high humidity and storm exposure",
    note: "High water availability reduces hydrophobic frequency needs."
  },
  {
    id: "indian-ocean",
    name: "Indian Ocean",
    coordinates: [78, -15],
    category: "marine-humid",
    latitude: -15,
    temperature: "Warm water",
    waterContent: "High monsoon moisture",
    note: "Warm humid air supports hydrophilic capture with fewer hydrophobic transitions."
  },
  {
    id: "arctic-ocean",
    name: "Arctic Ocean",
    coordinates: [10, 74],
    category: "polar-marine",
    latitude: 74,
    temperature: "Cold water and ice exposure",
    waterContent: "High moisture, low evaporation",
    note: "Cold marine conditions favor mostly hydrophilic coverage with sparse release bands."
  },
  {
    id: "southern-ocean",
    name: "Southern Ocean",
    coordinates: [35, -58],
    category: "polar-marine",
    latitude: -58,
    temperature: "Cold water and storms",
    waterContent: "Very high spray and wind exposure",
    note: "Frequent wetting makes aggressive hydrophobic strip frequency unnecessary."
  },
  {
    id: "mediterranean-sea",
    name: "Mediterranean Sea",
    coordinates: [18, 36],
    category: "marine-arid",
    latitude: 36,
    temperature: "Warm seasonal water",
    waterContent: "Salt spray with dry summers",
    note: "Dry coastal summers increase dust and salt-film persistence."
  },
  {
    id: "arabian-sea",
    name: "Arabian Sea",
    coordinates: [63, 16],
    category: "marine-arid",
    latitude: 16,
    temperature: "Warm to hot water",
    waterContent: "Salt spray, high evaporation",
    note: "Coastal dust and heat call for a denser hydrophobic release pattern."
  },
  {
    id: "caribbean-sea",
    name: "Caribbean Sea",
    coordinates: [-75, 15],
    category: "marine-humid",
    latitude: 15,
    temperature: "Warm water",
    waterContent: "High humidity and tropical rainfall",
    note: "Rainfall and humidity support hydrophilic-dominant overlays."
  },
  {
    id: "north-sea",
    name: "North Sea",
    coordinates: [3, 56],
    category: "marine-humid",
    latitude: 56,
    temperature: "Cool water",
    waterContent: "Frequent rain, fog, and spray",
    note: "High wetting frequency means fewer hydrophobic release bands."
  },
  {
    id: "red-sea",
    name: "Red Sea",
    coordinates: [39, 20],
    category: "marine-arid",
    latitude: 20,
    temperature: "Very warm water",
    waterContent: "High salinity, low rainfall",
    note: "Hot saline conditions need more frequent release bands for salt and dust."
  },
  {
    id: "gulf-of-mexico",
    name: "Gulf of Mexico",
    coordinates: [-90, 25],
    category: "marine-humid",
    latitude: 25,
    temperature: "Warm water",
    waterContent: "High humidity, storms, and salt spray",
    note: "Warm humid coastal exposure supports hydrophilic-dominant overlays."
  },
  {
    id: "south-china-sea",
    name: "South China Sea",
    coordinates: [114, 13],
    category: "marine-humid",
    latitude: 13,
    temperature: "Warm tropical water",
    waterContent: "High monsoon moisture",
    note: "Frequent wetting reduces the need for dense hydrophobic release bands."
  },
  {
    id: "bay-of-bengal",
    name: "Bay of Bengal",
    coordinates: [88, 15],
    category: "marine-humid",
    latitude: 15,
    temperature: "Warm water",
    waterContent: "Very high seasonal rainfall",
    note: "Monsoon rain and humidity favor hydrophilic capture with moderate release bands."
  },
  {
    id: "persian-gulf",
    name: "Persian Gulf",
    coordinates: [51, 27],
    category: "marine-arid",
    latitude: 27,
    temperature: "Very warm shallow water",
    waterContent: "High salinity, high evaporation",
    note: "Salt and regional dust call for a stronger hydrophobic release frequency."
  },
  {
    id: "black-sea",
    name: "Black Sea",
    coordinates: [34, 43],
    category: "temperate",
    latitude: 43,
    temperature: "Cool to mild water",
    waterContent: "Moderate marine humidity",
    note: "Seasonal rainfall and moderate dust suggest a balanced strip layout."
  },
  {
    id: "baltic-sea",
    name: "Baltic Sea",
    coordinates: [20, 58],
    category: "polar-marine",
    latitude: 58,
    temperature: "Cold brackish water",
    waterContent: "High moisture, low evaporation",
    note: "Cold wet conditions favor sparse hydrophobic release bands."
  },
  {
    id: "north-atlantic",
    name: "North Atlantic",
    coordinates: [-42, 47],
    category: "marine-humid",
    latitude: 47,
    temperature: "Cool water",
    waterContent: "High storm and spray exposure",
    note: "Frequent wetting supports hydrophilic-heavy patterning."
  },
  {
    id: "bering-sea",
    name: "Bering Sea",
    coordinates: [-175, 58],
    category: "polar-marine",
    latitude: 58,
    temperature: "Cold water",
    waterContent: "High spray and ice exposure",
    note: "Cold marine exposure favors mostly hydrophilic coverage."
  },
  {
    id: "sea-of-japan",
    name: "Sea of Japan",
    coordinates: [135, 40],
    category: "temperate",
    latitude: 40,
    temperature: "Seasonal cool-to-warm water",
    waterContent: "Moderate to high moisture",
    note: "Seasonal conditions suggest medium strip frequency."
  },
  {
    id: "coral-sea",
    name: "Coral Sea",
    coordinates: [155, -18],
    category: "marine-humid",
    latitude: -18,
    temperature: "Warm tropical water",
    waterContent: "High humidity and rainfall",
    note: "Warm wet exposure favors hydrophilic-heavy patterning."
  }
];

const desertCountries = new Set([
  "Algeria",
  "Australia",
  "Chad",
  "Egypt",
  "Libya",
  "Mali",
  "Mauritania",
  "Niger",
  "Oman",
  "Qatar",
  "Saudi Arabia",
  "Sudan",
  "United Arab Emirates"
]);

const rainyCountries = new Set([
  "Brazil",
  "Colombia",
  "Costa Rica",
  "Ecuador",
  "Indonesia",
  "Malaysia",
  "Papua New Guinea",
  "Peru",
  "Singapore"
]);

const humidCountries = new Set([
  "Bangladesh",
  "India",
  "Philippines",
  "Thailand",
  "Vietnam"
]);

const aridStates = new Set([
  "Arizona",
  "California",
  "Colorado",
  "Nevada",
  "New Mexico",
  "Texas",
  "Utah"
]);

const rainyStates = new Set(["Alaska", "Hawaii", "Oregon", "Washington"]);
const humidStates = new Set([
  "Alabama",
  "Florida",
  "Georgia",
  "Louisiana",
  "Mississippi",
  "South Carolina"
]);

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function estimatedAnnualTilt(latitude: number, category: CategoryId) {
  const absoluteLatitude = Math.abs(latitude);
  let tilt: number;

  if (absoluteLatitude >= 50) {
    tilt = 38;
  } else if (absoluteLatitude >= 45) {
    tilt = 35;
  } else if (absoluteLatitude >= 35) {
    tilt = 31;
  } else if (absoluteLatitude >= 25) {
    tilt = absoluteLatitude - 4;
  } else {
    tilt = absoluteLatitude;
  }

  if (category === "rainy-steep" || category === "polar-marine") {
    tilt += 3;
  }

  if (category === "desert-flat") {
    tilt -= 2;
  }

  return Math.round(clamp(tilt, 15, 45));
}

function tiltBasis(latitude: number, category: CategoryId) {
  const absoluteLatitude = Math.round(Math.abs(latitude));
  const winterTilt = Math.round(clamp(absoluteLatitude + 15, 15, 65));
  const summerTilt = Math.round(clamp(absoluteLatitude - 15, 10, 25));

  if (category === "rainy-steep" || category === "polar-marine") {
    return `PVGIS annual estimate, raised for wet/cold cleaning; seasonal range ${summerTilt}-${winterTilt} deg.`;
  }

  return `PVGIS annual estimate from latitude; seasonal range ${summerTilt}-${winterTilt} deg.`;
}

function classifyCountry(name: string, latitude: number): CategoryId {
  if (desertCountries.has(name)) return "desert-flat";
  if (rainyCountries.has(name)) return "rainy-steep";
  if (humidCountries.has(name)) return "humid-moderate";
  if (Math.abs(latitude) < 12) return "humid-moderate";
  if (Math.abs(latitude) > 42) return "rainy-steep";
  if (Math.abs(latitude) < 25) return "arid-dusty";
  return "temperate";
}

function classifyState(name: string): CategoryId {
  if (aridStates.has(name)) return "arid-dusty";
  if (rainyStates.has(name)) return "rainy-steep";
  if (humidStates.has(name)) return "humid-moderate";
  return "temperate";
}

function buildRecommendation({
  category,
  id,
  latitude,
  name,
  note,
  scope,
  temperature,
  waterContent
}: {
  category: CategoryId;
  id: string;
  latitude: number;
  name: string;
  note: string;
  scope: RegionScope;
  temperature?: string;
  waterContent?: string;
}): RegionRecommendation {
  const profile = categoryProfiles[category];

  return {
    id,
    name,
    scope,
    category,
    latitude,
    tilt: estimatedAnnualTilt(latitude, category),
    tiltBasis: tiltBasis(latitude, category),
    note,
    ...profile,
    temperature: temperature ?? profile.temperature,
    waterContent: waterContent ?? profile.waterContent
  };
}

function recommendationFromGeo(
  geo: MapGeo,
  scope: "Country" | "U.S. State"
): RegionRecommendation {
  const name = geo.properties?.name ?? "Selected region";
  const [, latitude] = geoCentroid(geo);
  const category =
    scope === "U.S. State" ? classifyState(name) : classifyCountry(name, latitude);

  return buildRecommendation({
    category,
    id: `${scope}-${geo.id ?? name}`,
    latitude,
    name,
    note:
      scope === "U.S. State"
        ? "State-level business prototype recommendation for retrofit overlay patterning."
        : "Country-level business prototype recommendation for retrofit overlay patterning.",
    scope
  });
}

function recommendationFromMarine(zone: MarineZone): RegionRecommendation {
  return buildRecommendation({
    category: zone.category,
    id: zone.id,
    latitude: zone.latitude,
    name: zone.name,
    note: zone.note,
    scope: "Ocean / Sea",
    temperature: zone.temperature,
    waterContent: zone.waterContent
  });
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [mapMode, setMapMode] = useState<"world" | "us">("world");
  const [hoveredRegion, setHoveredRegion] = useState("Hover a country, state, sea, or ocean");
  const [selectedRegion, setSelectedRegion] = useState<RegionRecommendation | null>(null);

  const selectedProfile = useMemo(
    () => (selectedRegion ? categoryProfiles[selectedRegion.category] : null),
    [selectedRegion]
  );

  function activateTab(tab: TabId) {
    setActiveTab(tab);
    if (tab === "optimizer") {
      setSelectedRegion(null);
    }
  }

  function selectGeo(geo: MapGeo, scope: "Country" | "U.S. State") {
    const recommendation = recommendationFromGeo(geo, scope);

    if (scope === "Country" && recommendation.name.includes("United States")) {
      setMapMode("us");
      setHoveredRegion("United States state map");
      setSelectedRegion(null);
      return;
    }

    setSelectedRegion(recommendation);
  }

  function selectMarine(zone: MarineZone) {
    setSelectedRegion(recommendationFromMarine(zone));
  }

  return (
    <main className="min-h-screen">
      <nav
        className="sticky top-0 right-0 left-0 z-10 flex items-start justify-between gap-4 border-b border-[#d7e2df] bg-white/90 p-3 md:items-center md:gap-[18px] md:px-[22px] md:py-3.5"
        aria-label="Dashboard sections"
      >
        <div className="grid min-w-0 gap-[3px] md:min-w-60">
          <span className="text-xs font-black tracking-normal text-[#00856f] uppercase">
            Solstice Surface Systems
          </span>
          <strong className="text-base">Retrofit solar cleaning overlays</strong>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              aria-pressed={activeTab === tab.id}
              className={cx(
                "cursor-pointer border-0 px-3.5 py-3 text-sm font-black whitespace-nowrap transition-colors disabled:cursor-default disabled:opacity-45",
                activeTab === tab.id
                  ? "bg-[#103f3f] text-white"
                  : "bg-transparent text-[#5c6d70] hover:bg-[#eef5f2] hover:text-[#132326]"
              )}
              key={tab.id}
              onClick={() => activateTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {activeTab === "home" && <HomePanel onExplore={() => activateTab("optimizer")} />}

      {activeTab === "optimizer" && (
        <OptimizerPanel
          hoveredRegion={hoveredRegion}
          mapMode={mapMode}
          onBack={() => setSelectedRegion(null)}
          onHover={setHoveredRegion}
          onMarineSelect={selectMarine}
          onSelect={selectGeo}
          onWorld={() => {
            setMapMode("world");
            setSelectedRegion(null);
          }}
          selectedProfile={selectedProfile}
          selectedRegion={selectedRegion}
        />
      )}

      {activeTab === "patterns" && <PatternsPanel />}
    </main>
  );
}

function HomePanel({ onExplore }: { onExplore: () => void }) {
  return (
    <section className={cx(pagePadding, "min-h-[calc(100vh-118px)] md:min-h-[calc(100vh-70px)]")}>
      <div className="grid min-h-[calc(100vh-118px)] content-center gap-5 bg-[#103f3f] p-[clamp(28px,5vw,70px)] text-[#f7fffd] md:min-h-[calc(100vh-118px)]">
        <p className="m-0 mb-2.5 text-xs font-black tracking-normal text-[#9de3d3] uppercase">
          Company concept
        </p>
        <h1 className="m-0 max-w-[1050px] text-[clamp(2.5rem,5.5vw,5.8rem)] leading-[0.98] tracking-normal max-md:text-[2.2rem]">
          A retrofit acrylic skin that helps solar panels clean themselves with rain.
        </h1>
        <p className="m-0 max-w-[780px] text-[clamp(1rem,1.4vw,1.18rem)] leading-[1.62] text-[#d8ebe7]">
          Solar farms lose performance as dust, minerals, dried water residue,
          and pollution build up on the glass. Chemical coatings can wash into
          the ground below, creating a second environmental cost for a technology
          meant to reduce one.
        </p>
        <p className="m-0 max-w-[780px] text-[clamp(1rem,1.4vw,1.18rem)] leading-[1.62] text-[#d8ebe7]">
          Our product concept is a thin PMMA overlay with alternating wetting
          zones: smooth hydrophilic areas capture dust into water, while
          laser-textured hydrophobic bands release droplets so the dirty water
          moves down the panel.
        </p>
        <button className={primaryButtonClass} onClick={onExplore} type="button">
          Explore regional design optimizer
        </button>
      </div>

      <div
        className="relative grid min-h-[calc(100vh-70px)] content-start justify-items-center gap-6 overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(237,245,242,0.98)),#eef5f2] px-6 py-[clamp(34px,5vw,72px)] max-md:p-[18px]"
        aria-label="Product mechanism diagram"
      >
        <div className="max-w-[860px] text-center">
          <p className={eyebrowClass}>Alternating solution</p>
          <h2 className="m-0 mb-3.5 text-[clamp(2rem,4vw,4.7rem)] leading-none tracking-normal">
            Capture the dirt first. Release the water next.
          </h2>
          <p className="m-0 text-[1.04rem] leading-[1.6] text-[#5c6d70]">
            The overlay is patterned in the direction of droplet travel. Smooth
            PMMA hydrophilic bands wet the dust, while dotted hydrophobic
            micro-textured bands make the dirty water release and continue down
            the panel.
          </p>
        </div>
        <VerticalStripDesign
          hydrophilic={62}
          hydrophobic={38}
          stripCount={12}
          variant="large"
        />
        <div className="grid max-w-[560px] gap-1.5 text-center">
          <strong>Final product direction</strong>
          <span className="leading-[1.55] text-[#5c6d70]">
            Hydrophilic capture bands alternate with hydrophobic release bands from top to bottom.
          </span>
        </div>
      </div>
    </section>
  );
}

function OptimizerPanel({
  hoveredRegion,
  mapMode,
  onBack,
  onHover,
  onMarineSelect,
  onSelect,
  onWorld,
  selectedProfile,
  selectedRegion
}: {
  hoveredRegion: string;
  mapMode: "world" | "us";
  onBack: () => void;
  onHover: (name: string) => void;
  onMarineSelect: (zone: MarineZone) => void;
  onSelect: (geo: MapGeo, scope: "Country" | "U.S. State") => void;
  onWorld: () => void;
  selectedProfile: (typeof categoryProfiles)[CategoryId] | null;
  selectedRegion: RegionRecommendation | null;
}) {
  if (selectedRegion && selectedProfile) {
    return (
      <section
        className={cx(
          pagePadding,
          "grid min-h-[calc(100vh-118px)] grid-cols-1 gap-[22px] lg:min-h-[calc(100vh-70px)] lg:grid-cols-[minmax(300px,390px)_minmax(0,1fr)]"
        )}
      >
        <div className="grid content-start gap-[18px] bg-[linear-gradient(180deg,rgba(17,46,51,0.98),rgba(13,67,63,0.96)),#112e33] p-6 text-white">
          <button className={secondaryButtonClass} onClick={onBack} type="button">
            Back to map
          </button>
          <p className="m-0 mb-2.5 text-xs font-black tracking-normal text-[#9ee5d8] uppercase">
            Optimized regional overlay
          </p>
          <h1 className="m-0 text-[clamp(2rem,3vw,3.4rem)] leading-[0.98] tracking-normal">
            {selectedRegion.name}
          </h1>
          <p className="m-0 leading-[1.55] text-[#c8dedb]">{selectedRegion.scope}</p>

          <div className="grid gap-2.5">
            <Stat label="PVGIS-style fixed tilt" value={`${selectedRegion.tilt} deg`} />
            <Stat label="Tilt basis" value={selectedRegion.tiltBasis} />
            <Stat label="Environmental type" value={selectedProfile.environment} />
            <Stat label="Water / rainfall" value={selectedRegion.rainfall} />
            <Stat label="Temperature" value={selectedRegion.temperature} />
            <Stat label="Water content" value={selectedRegion.waterContent} />
            <Stat label="Soiling risk" value={selectedRegion.dust} />
          </div>

          <div className="grid gap-2 border-l-[5px] border-[#f6b44b] bg-white/10 p-4 text-white">
            <strong>{selectedRegion.hydrophilic}% hydrophilic</strong>
            <strong>{selectedRegion.hydrophobic}% hydrophobic</strong>
            <span className="text-[#cfe6e2]">
              {selectedRegion.stripCount} alternating bands from top to bottom
            </span>
          </div>
          <p className="m-0 leading-[1.55] text-[#c8dedb]">{selectedRegion.note}</p>
        </div>

        <div className="grid content-start justify-items-center gap-[18px] border border-[#d7e2df] bg-white p-6">
          <div className={panelHeadingClass}>
            <p className={eyebrowClass}>Main implemented pattern</p>
            <h2 className={panelHeadingTitleClass}>Vertical-flow alternating stripe overlay</h2>
            <p className={mutedTextClass}>
              The optimization changes the frequency and balance of hydrophobic
              release bands. Water travels downward through each hydrophilic and
              hydrophobic transition.
            </p>
          </div>
          <VerticalStripDesign
            hydrophilic={selectedRegion.hydrophilic}
            hydrophobic={selectedRegion.hydrophobic}
            stripCount={selectedRegion.stripCount}
            variant="hero"
          />
        </div>
      </section>
    );
  }

  return (
    <section
      className={cx(
        pagePadding,
        "grid min-h-[calc(100vh-118px)] grid-rows-[auto_1fr] gap-[18px] md:min-h-[calc(100vh-70px)]"
      )}
    >
      <div className="flex flex-col items-start justify-between gap-[18px] lg:flex-row lg:items-end">
        <div>
          <p className={eyebrowClass}>Region optimizer</p>
          <h1 className="m-0 text-[clamp(2rem,4vw,4.6rem)] leading-[0.98] tracking-normal max-md:text-[2.2rem]">
            {mapMode === "world" ? "Select a country, sea, or ocean" : "Select a U.S. state"}
          </h1>
          <p className={cx(mutedTextClass, "max-w-[780px]")}>
            The map estimates a business-prototype overlay pattern from climate,
            moisture, dust risk, and PVGIS-style annual tilt guidance.
          </p>
        </div>
        <button className={primaryButtonClass} disabled={mapMode === "world"} onClick={onWorld} type="button">
          World map
        </button>
      </div>

      <MapView
        hoveredRegion={hoveredRegion}
        mapMode={mapMode}
        onHover={onHover}
        onMarineSelect={onMarineSelect}
        onSelect={onSelect}
      />
    </section>
  );
}

function PatternsPanel() {
  return (
    <section
      className={cx(
        pagePadding,
        "grid min-h-[calc(100vh-118px)] grid-cols-1 gap-[18px] border border-[#d7e2df] bg-white md:min-h-[calc(100vh-70px)] lg:grid-cols-2"
      )}
    >
      <div className="col-span-full justify-self-stretch">
        <p className={eyebrowClass}>Other versions under testing</p>
        <h1 className="m-0 text-[clamp(2rem,4vw,4.8rem)] leading-[0.98] tracking-normal max-md:text-[2.2rem]">
          Future alternating-design variants
        </h1>
        <p className={mutedTextClass}>
          The product path is still the top-to-bottom alternating stripe
          overlay. These concepts are under testing to improve directional dust
          transport, reduce droplet pinning, and minimize optical loss.
        </p>
      </div>

      <article className="col-span-full grid grid-cols-1 gap-[18px] border border-[#d7e2df] bg-white p-[18px] lg:grid-cols-[minmax(220px,0.9fr)_minmax(0,1fr)]">
        <VerticalStripDesign hydrophilic={66} hydrophobic={34} stripCount={12} variant="card" />
        <div>
          <h2 className={panelHeadingTitleClass}>Baseline alternating stripe design</h2>
          <p className={mutedTextClass}>
            The main design places hydrophilic and hydrophobic regions as
            horizontal bands so droplets cross transitions while flowing
            downward.
          </p>
        </div>
      </article>

      <TestingCard
        description="A continuous wettability gradient moves from hydrophilic at the top toward more hydrophobic release zones at the bottom."
        kind="gradient"
        title="Continuous wettability gradient"
      />
      <TestingCard
        description="Nested square bands test whether repeated perimeter transitions can move dust outward while preserving transparency."
        kind="rings"
        title="Square-ring gradient"
      />
      <TestingCard
        description="Asymmetric band spacing tests whether non-uniform transitions reduce interfacial droplet pinning."
        kind="asymmetric"
        title="Asymmetric alternating bands"
      />
    </section>
  );
}

function MapView({
  hoveredRegion,
  mapMode,
  onHover,
  onMarineSelect,
  onSelect
}: {
  hoveredRegion: string;
  mapMode: "world" | "us";
  onHover: (name: string) => void;
  onMarineSelect: (zone: MarineZone) => void;
  onSelect: (geo: MapGeo, scope: "Country" | "U.S. State") => void;
}) {
  const geography = (mapMode === "world" ? worldMap : usMap) as Record<
    string,
    unknown
  >;
  const projection = mapMode === "world" ? "geoEqualEarth" : "geoAlbersUsa";
  const scope = mapMode === "world" ? "Country" : "U.S. State";

  return (
    <div className="grid min-h-0 gap-2.5">
      {mapMode === "world" && (
        <div
          className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-7"
          aria-label="Connected ocean and sea regions"
        >
          {marineZones.map((zone) => (
            <button
              className="min-h-[38px] cursor-pointer border-0 bg-[#173236] p-2 text-xs font-black text-white transition-colors hover:bg-[#bc6a1f] focus-visible:bg-[#bc6a1f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00856f]"
              key={zone.id}
              onClick={() => onMarineSelect(zone)}
              onMouseEnter={() => onHover(zone.name)}
              onMouseLeave={() => onHover("Hover a country, state, sea, or ocean")}
              type="button"
            >
              {zone.name}
            </button>
          ))}
        </div>
      )}
      <div className="min-h-[64vh] overflow-hidden border border-[#d7e2df] bg-[#f8fbfa]">
        <ComposableMap
          className="block h-auto w-full"
          height={560}
          projection={projection}
          projectionConfig={mapMode === "world" ? { scale: 170 } : { scale: 1080 }}
          width={980}
        >
          {mapMode === "world" && <Graticule stroke="#cfdad7" strokeWidth={0.6} />}
          <Geographies geography={geography}>
            {({ geographies }: { geographies: MapGeo[] }) =>
              geographies.map((geo) => {
                const name = geo.properties?.name ?? "";

                return (
                  <Geography
                    aria-label={name}
                    className="fill-[#c8d7d3] stroke-white stroke-[0.65] outline-none transition-colors hover:fill-[#66b6aa] focus:fill-[#66b6aa]"
                    geography={geo}
                    key={geo.rsmKey}
                    onClick={() => onSelect(geo, scope)}
                    onMouseEnter={() => onHover(name)}
                    onMouseLeave={() => onHover("Hover a country, state, sea, or ocean")}
                    role="button"
                    tabIndex={0}
                  />
                );
              })
            }
          </Geographies>
          {mapMode === "world" &&
            marineZones.map((zone) => (
              <Marker coordinates={zone.coordinates} key={zone.id}>
                <g
                  aria-label={zone.name}
                  className="group cursor-pointer outline-none"
                  onClick={() => onMarineSelect(zone)}
                  onMouseEnter={() => onHover(zone.name)}
                  onMouseLeave={() => onHover("Hover a country, state, sea, or ocean")}
                  role="button"
                  tabIndex={0}
                >
                  <circle
                    className="fill-[#bc6a1f] stroke-white stroke-2 group-hover:fill-[#f0c86b] group-focus:fill-[#f0c86b]"
                    r={7}
                  />
                  <text
                    className="pointer-events-none fill-[#173236] text-[10px] font-black stroke-white/90 stroke-[3px] [paint-order:stroke]"
                    textAnchor="middle"
                    y={-12}
                  >
                    {zone.name}
                  </text>
                </g>
              </Marker>
            ))}
        </ComposableMap>
      </div>

      <div className="flex flex-col justify-between gap-4 text-sm text-[#5c6d70] md:flex-row">
        <span>{hoveredRegion}</span>
        <span>Click land or a marked marine zone to generate the overlay design.</span>
      </div>
    </div>
  );
}

function VerticalStripDesign({
  hydrophilic,
  hydrophobic,
  stripCount,
  variant
}: {
  hydrophilic: number;
  hydrophobic: number;
  stripCount: number;
  variant: "large" | "hero" | "card";
}) {
  const strips = Array.from({ length: stripCount }, (_, index) => {
    const isHydrophobic = index % 2 === 1;

    return {
      id: index,
      isHydrophobic
    };
  });
  const hydrophilicFlexClasses: Record<number, string> = {
    42: "flex-[0.9]",
    52: "flex-[0.95]",
    60: "flex-[1.09]",
    62: "flex-[1.13]",
    66: "flex-[1.2]",
    76: "flex-[1.38]",
    82: "flex-[1.49]",
    86: "flex-[1.56]",
    88: "flex-[1.6]"
  };
  const hydrophobicFlexClasses: Record<number, string> = {
    12: "flex-[0.7]",
    14: "flex-[0.7]",
    18: "flex-[0.7]",
    24: "flex-[0.7]",
    34: "flex-[0.76]",
    38: "flex-[0.84]",
    40: "flex-[0.89]",
    48: "flex-[1.07]",
    58: "flex-[1.29]"
  };
  const rootClass = cx(
    "grid justify-items-center gap-3",
    variant === "large" && "w-full max-w-[560px]",
    variant === "hero" && "w-full max-w-[720px]",
    variant === "card" && "w-full max-w-[360px]"
  );
  const sheetClass = cx(
    "flex w-full max-w-[430px] flex-col overflow-hidden border-[3px] border-[#33464a] bg-white shadow-[0_18px_55px_rgba(13,36,38,0.16)]",
    variant === "hero" && "h-[clamp(360px,64vh,700px)]",
    variant === "card" && "h-[270px]",
    variant === "large" && "h-[clamp(300px,54vh,610px)] max-md:h-[390px]"
  );

  return (
    <div
      aria-label={`${hydrophilic}% hydrophilic and ${hydrophobic}% hydrophobic vertical-flow alternating stripe design`}
      className={rootClass}
      role="img"
    >
      <div
        className="relative grid grid-cols-[5px_auto] items-center gap-x-2.5 gap-y-[3px] border border-[#d7e2df] bg-white px-3.5 py-2.5 text-left leading-none text-[#103f3f] shadow-[0_8px_28px_rgba(13,36,38,0.08)]"
        aria-hidden="true"
      >
        <span className="row-span-2 h-9 w-[5px] bg-[#ef3d33]" />
        <span className="text-xs font-black uppercase">Water flow</span>
        <strong className="col-start-2 text-[0.72rem] font-extrabold text-[#5c6d70] uppercase">
          down panel
        </strong>
        <span className="absolute top-[43px] left-2 h-0 w-0 border-x-8 border-t-[12px] border-x-transparent border-t-[#ef3d33]" />
      </div>
      <div className={sheetClass}>
        {strips.map((strip) => (
          <span
            className={cx(
              "min-h-2",
              strip.isHydrophobic
                ? "bg-[radial-gradient(circle,rgba(255,255,255,0.72)_0_1.2px,transparent_1.9px),linear-gradient(180deg,#ffc76a,#f6b44b)] [background-size:8px_8px,auto]"
                : "bg-[linear-gradient(180deg,#f4fffc,#d8f5f1)]",
              strip.isHydrophobic
                ? hydrophobicFlexClasses[hydrophobic] ?? "flex-1"
                : hydrophilicFlexClasses[hydrophilic] ?? "flex-1"
            )}
            key={strip.id}
          />
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2.5">
        <span className="border border-[#d7e2df] bg-[#d8f5f1] px-2.5 py-2 text-xs font-black text-[#132326]">
          Hydrophilic capture
        </span>
        <span className="border border-[#d7e2df] bg-[radial-gradient(circle,rgba(255,255,255,0.65)_0_1px,transparent_1.7px),#f6b44b] px-2.5 py-2 text-xs font-black text-[#132326] [background-size:7px_7px,auto]">
          Hydrophobic release
        </span>
      </div>
    </div>
  );
}

function TestingCard({
  description,
  kind,
  title
}: {
  description: string;
  kind: "gradient" | "rings" | "asymmetric";
  title: string;
}) {
  const ringClasses = [
    "h-[82%] w-[82%]",
    "h-[60%] w-[60%]",
    "h-[38%] w-[38%]",
    "h-[18%] w-[18%]"
  ];

  return (
    <article className="grid grid-cols-1 gap-[18px] border border-[#d7e2df] bg-white p-[18px] max-md:p-3.5 lg:grid-cols-[minmax(220px,0.9fr)_minmax(0,1fr)]">
      <div
        className={cx(
          "relative aspect-[1.45/1] overflow-hidden border-[3px] border-[#4d5658]",
          kind === "gradient" &&
            "bg-[linear-gradient(180deg,#ffffff_0_28%,#d8f5f1_46%,#f6b44b_100%)]",
          kind === "rings" &&
            "grid justify-items-center bg-[radial-gradient(circle,rgba(255,255,255,0.28)_0_1px,transparent_2px),#dad3c7] [background-size:8px_8px]",
          kind === "asymmetric" && "flex flex-col"
        )}
        aria-hidden="true"
      >
        {kind === "rings" && (
          <>
            {ringClasses.map((className) => (
              <span
                className={cx("absolute border-[10px] border-[rgba(35,44,45,0.7)]", className)}
                key={className}
              />
            ))}
          </>
        )}
        {kind === "asymmetric" &&
          Array.from({ length: 9 }).map((_, index) => (
            <span
              className={index % 2 === 0 ? "flex-[1.7] bg-[#d8f5f1]" : "flex-[0.7] bg-[#f6b44b]"}
              key={index}
            />
          ))}
      </div>
      <div>
        <h2 className={panelHeadingTitleClass}>{title}</h2>
        <p className={mutedTextClass}>{description}</p>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-[5px] border border-white/15 bg-white/10 p-3">
      <span className="text-xs font-black text-[#9ee5d8] uppercase">{label}</span>
      <strong className="text-base leading-[1.35]">{value}</strong>
    </div>
  );
}
