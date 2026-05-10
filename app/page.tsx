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
    <main className="app-shell">
      <nav className="topbar" aria-label="Dashboard sections">
        <div className="brand">
          <span>Solstice Surface Systems</span>
          <strong>Retrofit solar cleaning overlays</strong>
        </div>
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              aria-pressed={activeTab === tab.id}
              className={activeTab === tab.id ? "tab active" : "tab"}
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
    <section className="hero-screen">
      <div className="hero-copy">
        <p className="eyebrow">Company concept</p>
        <h1>A retrofit acrylic skin that helps solar panels clean themselves with rain.</h1>
        <p>
          Solar farms lose performance as dust, minerals, dried water residue,
          and pollution build up on the glass. Chemical coatings can wash into
          the ground below, creating a second environmental cost for a technology
          meant to reduce one.
        </p>
        <p>
          Our product concept is a thin PMMA overlay with alternating wetting
          zones: smooth hydrophilic areas capture dust into water, while
          laser-textured hydrophobic bands release droplets so the dirty water
          moves down the panel.
        </p>
        <button onClick={onExplore} type="button">
          Explore regional design optimizer
        </button>
      </div>

      <div className="hero-product" aria-label="Product mechanism diagram">
        <div className="solution-copy">
          <p className="eyebrow">Alternating solution</p>
          <h2>Capture the dirt first. Release the water next.</h2>
          <p>
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
        <div className="product-caption">
          <strong>Final product direction</strong>
          <span>Hydrophilic capture bands alternate with hydrophobic release bands from top to bottom.</span>
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
      <section className="optimizer-result-screen">
        <div className="result-stats">
          <button className="secondary-button" onClick={onBack} type="button">
            Back to map
          </button>
          <p className="eyebrow">Optimized regional overlay</p>
          <h1>{selectedRegion.name}</h1>
          <p className="scope-label">{selectedRegion.scope}</p>

          <div className="stat-grid">
            <Stat label="PVGIS-style fixed tilt" value={`${selectedRegion.tilt} deg`} />
            <Stat label="Tilt basis" value={selectedRegion.tiltBasis} />
            <Stat label="Environmental type" value={selectedProfile.environment} />
            <Stat label="Water / rainfall" value={selectedRegion.rainfall} />
            <Stat label="Temperature" value={selectedRegion.temperature} />
            <Stat label="Water content" value={selectedRegion.waterContent} />
            <Stat label="Soiling risk" value={selectedRegion.dust} />
          </div>

          <div className="ratio-summary">
            <strong>{selectedRegion.hydrophilic}% hydrophilic</strong>
            <strong>{selectedRegion.hydrophobic}% hydrophobic</strong>
            <span>{selectedRegion.stripCount} alternating bands from top to bottom</span>
          </div>
          <p className="model-note">{selectedRegion.note}</p>
        </div>

        <div className="optimized-design-panel">
          <div className="panel-heading">
            <p className="eyebrow">Main implemented pattern</p>
            <h2>Vertical-flow alternating stripe overlay</h2>
            <p>
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
    <section className="map-screen">
      <div className="map-header">
        <div>
          <p className="eyebrow">Region optimizer</p>
          <h1>{mapMode === "world" ? "Select a country, sea, or ocean" : "Select a U.S. state"}</h1>
          <p>
            The map estimates a business-prototype overlay pattern from climate,
            moisture, dust risk, and PVGIS-style annual tilt guidance.
          </p>
        </div>
        <button disabled={mapMode === "world"} onClick={onWorld} type="button">
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
    <section className="patterns-screen">
      <div className="panel-heading wide">
        <p className="eyebrow">Other versions under testing</p>
        <h1>Future alternating-design variants</h1>
        <p>
          The product path is still the top-to-bottom alternating stripe
          overlay. These concepts are under testing to improve directional dust
          transport, reduce droplet pinning, and minimize optical loss.
        </p>
      </div>

      <article className="testing-card primary">
        <VerticalStripDesign hydrophilic={66} hydrophobic={34} stripCount={12} variant="card" />
        <div>
          <h2>Baseline alternating stripe design</h2>
          <p>
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
    <div className="map-stage">
      {mapMode === "world" && (
        <div className="marine-zone-grid" aria-label="Connected ocean and sea regions">
          {marineZones.map((zone) => (
            <button
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
      <div className="map-frame expanded">
        <ComposableMap
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
                    className="geography"
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
                  className="marine-marker"
                  onClick={() => onMarineSelect(zone)}
                  onMouseEnter={() => onHover(zone.name)}
                  onMouseLeave={() => onHover("Hover a country, state, sea, or ocean")}
                  role="button"
                  tabIndex={0}
                >
                  <circle r={7} />
                  <text textAnchor="middle" y={-12}>
                    {zone.name}
                  </text>
                </g>
              </Marker>
            ))}
        </ComposableMap>
      </div>

      <div className="map-status">
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
    const hydrophobicWeight = Math.max(0.7, hydrophobic / 45);
    const hydrophilicWeight = Math.max(0.9, hydrophilic / 55);

    return {
      id: index,
      isHydrophobic,
      flex: isHydrophobic ? hydrophobicWeight : hydrophilicWeight
    };
  });

  return (
    <div
      aria-label={`${hydrophilic}% hydrophilic and ${hydrophobic}% hydrophobic vertical-flow alternating stripe design`}
      className={`strip-design ${variant}`}
      role="img"
    >
      <div className="water-flow-indicator" aria-hidden="true">
        <span>Water flow</span>
        <strong>down panel</strong>
      </div>
      <div className="strip-sheet">
        {strips.map((strip) => (
          <span
            className={strip.isHydrophobic ? "strip hydrophobic" : "strip hydrophilic"}
            key={strip.id}
            style={{ flex: strip.flex }}
          />
        ))}
      </div>
      <div className="strip-legend">
        <span className="legend-hydrophilic">Hydrophilic capture</span>
        <span className="legend-hydrophobic">Hydrophobic release</span>
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
  return (
    <article className="testing-card">
      <div className={`testing-visual ${kind}`} aria-hidden="true">
        {kind === "rings" && (
          <>
            <span />
            <span />
            <span />
            <span />
          </>
        )}
        {kind === "asymmetric" && Array.from({ length: 9 }).map((_, index) => <span key={index} />)}
      </div>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
