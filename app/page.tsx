"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PatternLabContent, ProductContent } from "./_components/project-pages";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  geoCentroid,
  geoContains,
  geoEquirectangular,
  geoPath
} from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import * as THREE from "three";
import { feature } from "topojson-client";
import usMap from "us-atlas/states-10m.json";
import worldMap from "world-atlas/countries-10m.json";

type PageId = "optimizer" | "product" | "patterns";
type RegionScope = "Country" | "U.S. State" | "Ocean / Sea";
type GlobeMode = "world" | "us";
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
  longitude: number;
  hydrophilic: number;
  hydrophobic: number;
  stripCount: number;
  temperature: string;
  waterContent: string;
  note: string;
};

type RegionFeature = Feature<Geometry, { name?: string }> & {
  id?: number | string;
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

type HoveredRegion = {
  name: string;
  coordinates?: [number, number];
};

type GlobeFocus = {
  latitude: number;
  longitude: number;
  snap?: boolean;
};

const pages: Array<{ id: PageId; label: string; href: string }> = [
  { id: "product", label: "Product", href: "/product" },
  { id: "patterns", label: "Pattern Lab", href: "/pattern-lab" },
  { id: "optimizer", label: "3D Optimizer", href: "/optimizer" }
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

const legendColorClassByCategory: Record<CategoryId, string> = {
  "rainy-steep": "bg-[#53d9c6]",
  "humid-moderate": "bg-[#73d27f]",
  temperate: "bg-[#b7cc73]",
  "arid-dusty": "bg-[#d8a34f]",
  "desert-flat": "bg-[#c77338]",
  "marine-humid": "bg-[#35a8d8]",
  "marine-arid": "bg-[#ce9340]",
  "polar-marine": "bg-[#9ad9ff]"
};

const labelByCategory: Record<CategoryId, string> = {
  "rainy-steep": "Rainy / steep",
  "humid-moderate": "Humid / moderate",
  temperate: "Temperate",
  "arid-dusty": "Arid / dusty",
  "desert-flat": "Desert / flat",
  "marine-humid": "Humid marine",
  "marine-arid": "Arid marine",
  "polar-marine": "Cold marine"
};

const worldFeatures = atlasFeatures(worldMap, "countries");
const stateFeatures = atlasFeatures(usMap, "states");
const earthTextureUrl =
  "/textures/earth-8192.jpg";
const earthBumpTextureUrl =
  "https://unpkg.com/three-globe/example/img/earth-topology.png";
const earthWaterTextureUrl =
  "https://unpkg.com/three-globe/example/img/earth-water.png";
const cloudsTextureUrl =
  "https://unpkg.com/globe.gl/example/clouds/clouds.png";

function atlasFeatures(data: unknown, key: string): RegionFeature[] {
  const topology = data as { objects: Record<string, unknown> };
  const collection = feature(
    topology as never,
    topology.objects[key] as never
  ) as unknown as FeatureCollection<Geometry, { name?: string }>;

  return collection.features as RegionFeature[];
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function nearestEquivalentAngle(angle: number, reference: number) {
  const fullTurn = Math.PI * 2;
  return angle + Math.round((reference - angle) / fullTurn) * fullTurn;
}

function coordinatesFromFeature(geo: RegionFeature): [number, number] {
  const centroid = geoCentroid(geo);
  const longitude = Number.isFinite(centroid[0]) ? centroid[0] : 0;
  const latitude = Number.isFinite(centroid[1]) ? centroid[1] : 0;

  return [longitude, latitude];
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

function categoryForFeature(geo: RegionFeature, scope: "Country" | "U.S. State") {
  const name = geo.properties?.name ?? "Selected region";
  const [, latitude] = coordinatesFromFeature(geo);

  return scope === "U.S. State"
    ? classifyState(name)
    : classifyCountry(name, latitude);
}

function buildRecommendation({
  category,
  id,
  latitude,
  longitude,
  name,
  note,
  scope,
  temperature,
  waterContent
}: {
  category: CategoryId;
  id: string;
  latitude: number;
  longitude: number;
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
    longitude,
    tilt: estimatedAnnualTilt(latitude, category),
    tiltBasis: tiltBasis(latitude, category),
    note,
    ...profile,
    temperature: temperature ?? profile.temperature,
    waterContent: waterContent ?? profile.waterContent
  };
}

function recommendationFromGeo(
  geo: RegionFeature,
  scope: "Country" | "U.S. State"
): RegionRecommendation {
  const name = geo.properties?.name ?? "Selected region";
  const [longitude, latitude] = coordinatesFromFeature(geo);
  const category = categoryForFeature(geo, scope);

  return buildRecommendation({
    category,
    id: `${scope}-${geo.id ?? name}`,
    latitude,
    longitude,
    name,
    note:
      scope === "U.S. State"
        ? "State-level prototype recommendation for retrofit overlay patterning."
        : "Country-level prototype recommendation for retrofit overlay patterning.",
    scope
  });
}

function recommendationFromMarine(zone: MarineZone): RegionRecommendation {
  return buildRecommendation({
    category: zone.category,
    id: zone.id,
    latitude: zone.latitude,
    longitude: zone.coordinates[0],
    name: zone.name,
    note: zone.note,
    scope: "Ocean / Sea",
    temperature: zone.temperature,
    waterContent: zone.waterContent
  });
}

function findFeatureAtPoint(features: RegionFeature[], longitude: number, latitude: number) {
  return features.find((geo) => geoContains(geo, [longitude, latitude]));
}

function createBorderTexture({
  mode,
  selectedId
}: {
  mode: GlobeMode;
  selectedId?: string;
}) {
  const width = 8192;
  const height = 4096;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) return canvas;

  const projection = geoEquirectangular()
    .scale(width / (2 * Math.PI))
    .translate([width / 2, height / 2])
    .precision(0.1);
  const path = geoPath(projection, context);

  worldFeatures.forEach((geo) => {
    const name = geo.properties?.name ?? "";
    const isSelected = selectedId === `Country-${geo.id ?? name}`;

    context.beginPath();
    path(geo);
    if (isSelected) {
      context.fillStyle = "rgba(158, 231, 255, 0.18)";
      context.fill();
    }
    context.strokeStyle = "rgba(0, 0, 0, 0.9)";
    context.lineWidth = isSelected ? 4.6 : 3.2;
    context.stroke();
  });

  if (mode === "us") {
    stateFeatures.forEach((geo) => {
      const name = geo.properties?.name ?? "";
      const isSelected = selectedId === `U.S. State-${geo.id ?? name}`;

      context.beginPath();
      path(geo);
      if (isSelected) {
        context.fillStyle = "rgba(158, 231, 255, 0.2)";
        context.fill();
      }
      context.strokeStyle = "rgba(0, 0, 0, 0.94)";
      context.lineWidth = isSelected ? 4.8 : 3.6;
      context.stroke();
    });
  }

  return canvas;
}

export default function Home() {
  const pathname = usePathname();
  const activePage = pageFromPathname(pathname);
  const [mapMode, setMapMode] = useState<GlobeMode>("world");
  const [hoveredRegion, setHoveredRegion] = useState<HoveredRegion>({
    name: "World view"
  });
  const [selectedRegion, setSelectedRegion] = useState<RegionRecommendation | null>(
    null
  );

  const selectedProfile = useMemo(
    () => (selectedRegion ? categoryProfiles[selectedRegion.category] : null),
    [selectedRegion]
  );

  const selectGeo = useCallback(
    (geo: RegionFeature, scope: "Country" | "U.S. State") => {
      const name = geo.properties?.name ?? "";

      if (scope === "Country" && name.includes("United States")) {
        setMapMode("us");
        setSelectedRegion(null);
        setHoveredRegion({ name: "Select a U.S. state" });
        return;
      }

      setSelectedRegion(recommendationFromGeo(geo, scope));
    },
    []
  );

  const selectMarine = useCallback((zone: MarineZone) => {
    setMapMode("world");
    setSelectedRegion(recommendationFromMarine(zone));
  }, []);

  const returnToWorld = useCallback(() => {
    setMapMode("world");
    setSelectedRegion(null);
    setHoveredRegion({ name: "World view" });
  }, []);

  return (
    <main
      className={cx(
        "min-h-screen overflow-x-hidden bg-[#061116] text-[#e9fbf7]",
        activePage === "optimizer" && "lg:h-screen lg:overflow-hidden"
      )}
    >
      <Header activePage={activePage} />

      {activePage === "optimizer" && (
        <OptimizerPanel
          hoveredRegion={hoveredRegion}
          mapMode={mapMode}
          onHover={setHoveredRegion}
          onMarineSelect={selectMarine}
          onWorldView={returnToWorld}
          onSelect={selectGeo}
          selectedProfile={selectedProfile}
          selectedRegion={selectedRegion}
        />
      )}

      {activePage === "product" && <ProductContent />}

      {activePage === "patterns" && <PatternLabContent />}
    </main>
  );
}

function pageFromPathname(pathname: string): PageId {
  if (pathname.startsWith("/optimizer")) return "optimizer";
  if (pathname.startsWith("/product")) return "product";
  if (pathname.startsWith("/pattern-lab")) return "patterns";
  return "product";
}

function Header({
  activePage
}: {
  activePage: PageId;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#061116]/90 backdrop-blur-xl">
      <nav className="flex flex-col gap-3 px-4 py-3 sm:h-[72px] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-0">
        <Link
          className="group grid gap-0.5 text-left"
          href="/product"
        >
          <span className="text-[0.68rem] font-black tracking-[0.24em] text-[#47e4d0] uppercase transition-colors group-hover:text-[#f0c86b]">
            Solstice Surface Systems
          </span>
          <strong className="text-[0.95rem] font-semibold text-white">
            Retrofit solar cleaning overlays
          </strong>
        </Link>

        <div className="flex gap-1 overflow-x-auto border border-white/10 bg-white/[0.03] p-1">
          {pages.map((page) => (
            <Link
              aria-current={activePage === page.id ? "page" : undefined}
              className={cx(
                "cursor-pointer px-3.5 py-2 text-xs font-black tracking-normal whitespace-nowrap text-[#9fb8b5] transition-all duration-300 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#47e4d0]",
                activePage === page.id && "bg-white text-[#061116] shadow-[0_0_30px_rgba(71,228,208,0.18)]"
              )}
              href={page.href}
              key={page.id}
            >
              {page.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

function OptimizerPanel({
  hoveredRegion,
  mapMode,
  onHover,
  onMarineSelect,
  onWorldView,
  onSelect,
  selectedProfile,
  selectedRegion
}: {
  hoveredRegion: HoveredRegion;
  mapMode: GlobeMode;
  onHover: (region: HoveredRegion) => void;
  onMarineSelect: (zone: MarineZone) => void;
  onWorldView: () => void;
  onSelect: (geo: RegionFeature, scope: "Country" | "U.S. State") => void;
  selectedProfile: (typeof categoryProfiles)[CategoryId] | null;
  selectedRegion: RegionRecommendation | null;
}) {
  return (
    <section className="relative isolate min-h-[calc(100svh-72px)] overflow-hidden bg-[linear-gradient(180deg,#08191e_0%,#061116_46%,#041014_100%)] lg:h-[calc(100svh-72px)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      <div
        className={cx(
          "relative grid min-h-[calc(100svh-72px)] grid-cols-1 lg:h-[calc(100svh-72px)]",
          selectedRegion
            ? "lg:grid-cols-[320px_minmax(0,1fr)_360px]"
            : "lg:grid-cols-[320px_minmax(0,1fr)]"
        )}
      >
        <aside className="z-10 order-2 overflow-x-hidden border-t border-white/10 bg-[#07161b]/90 p-5 backdrop-blur-xl [scrollbar-width:none] lg:order-1 lg:overflow-y-auto lg:border-t-0 lg:border-r [&::-webkit-scrollbar]:hidden">
          <div className="grid gap-5">
            <div>
              <p className="mb-3 text-[0.68rem] font-black tracking-[0.24em] text-[#47e4d0] uppercase">
                Optimizer surface
              </p>
              <h1 className="m-0 max-w-full text-[2.65rem] leading-[0.95] font-black tracking-normal break-words text-white 2xl:text-[2.85rem]">
                Surface optimizer.
              </h1>
            </div>

            <p className="m-0 max-w-[17rem] text-sm leading-6 text-[#a7bbb8]">
              Hover pauses the globe. Click land to tune the surface.
            </p>

            {mapMode === "us" && (
              <div className="grid gap-2 border-y border-white/10 py-4">
                <span className="text-[0.68rem] font-black tracking-[0.22em] text-[#708b88] uppercase">
                  U.S. states
                </span>
                <p className="m-0 text-sm leading-6 text-[#a7bbb8]">
                  Select a state, or return to the world map.
                </p>
                <button
                  className="cursor-pointer border border-white/10 px-3 py-2 text-left text-xs font-black text-[#dbe9e6] transition-all duration-300 hover:border-[#47e4d0]/70 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#47e4d0]"
                  onClick={onWorldView}
                  type="button"
                >
                  Back to world
                </button>
              </div>
            )}

            <div className="grid gap-2">
              <span className="text-[0.68rem] font-black tracking-[0.22em] text-[#708b88] uppercase">
                Oceans and seas
              </span>
              <select
                className="w-full cursor-pointer border border-white/10 bg-[#07161b] px-3 py-3 text-sm font-bold text-[#dbe9e6] outline-none transition-colors duration-300 hover:border-[#47e4d0]/70 focus:border-[#47e4d0]"
                onChange={(event) => {
                  const zone = marineZones.find((item) => item.id === event.target.value);
                  if (zone) onMarineSelect(zone);
                }}
                value={selectedRegion?.scope === "Ocean / Sea" ? selectedRegion.id : ""}
              >
                <option value="">Choose ocean or sea</option>
                {marineZones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-3 border-y border-white/10 py-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[0.68rem] font-black tracking-[0.22em] text-[#708b88] uppercase">
                  Hover target
                </span>
                {hoveredRegion.coordinates && (
                  <span className="text-xs font-semibold text-[#f0c86b]">
                    {hoveredRegion.coordinates[1].toFixed(1)} / {hoveredRegion.coordinates[0].toFixed(1)}
                  </span>
                )}
              </div>
              <strong className="text-lg leading-tight text-white">{hoveredRegion.name}</strong>
            </div>

            <div className="hidden gap-3 2xl:grid">
              <span className="text-[0.68rem] font-black tracking-[0.22em] text-[#708b88] uppercase">
                Color legend
              </span>
              <div className="grid gap-2">
                {Object.entries(labelByCategory).map(([category, label]) => (
                  <div className="flex min-w-0 items-center justify-between gap-3" key={category}>
                    <span className="min-w-0 text-xs text-[#b5c8c5]">{label}</span>
                    <span
                      className={cx(
                        "h-2.5 w-16 shrink-0",
                        legendColorClassByCategory[category as CategoryId]
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="relative order-1 min-h-[66svh] lg:order-2 lg:min-h-0">
          <InteractiveGlobe
            mode={mapMode}
            onHover={onHover}
            onMarineSelect={onMarineSelect}
            onSelect={onSelect}
            selectedRegion={selectedRegion}
          />
          {selectedRegion && <MainDesignPreview selectedRegion={selectedRegion} />}
        </div>

        {selectedRegion && (
          <RegionInspector
            profile={selectedProfile}
            selectedRegion={selectedRegion}
          />
        )}
      </div>
    </section>
  );
}

function InteractiveGlobe({
  mode,
  onHover,
  onMarineSelect,
  onSelect,
  selectedRegion
}: {
  mode: GlobeMode;
  onHover: (region: HoveredRegion) => void;
  onMarineSelect: (zone: MarineZone) => void;
  onSelect: (geo: RegionFeature, scope: "Country" | "U.S. State") => void;
  selectedRegion: RegionRecommendation | null;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const callbacksRef = useRef({ onHover, onMarineSelect, onSelect });
  const selectedRef = useRef(selectedRegion);
  const borderMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const focusRef = useRef<GlobeFocus | null>(null);

  useEffect(() => {
    callbacksRef.current = { onHover, onMarineSelect, onSelect };
  }, [onHover, onMarineSelect, onSelect]);

  useEffect(() => {
    selectedRef.current = selectedRegion;
    focusRef.current = selectedRegion
      ? {
          longitude: selectedRegion.longitude,
          latitude: selectedRegion.latitude,
          snap: true
        }
      : null;

    const material = borderMaterialRef.current;
    if (material) {
      const currentTexture = material.map;
      const texture = new THREE.CanvasTexture(
        createBorderTexture({ mode, selectedId: selectedRegion?.id })
      );
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      material.map = texture;
      material.needsUpdate = true;
      currentTexture?.dispose();
    }

  }, [mode, selectedRegion]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeFeatures = mode === "world" ? worldFeatures : stateFeatures;
    const scope = mode === "world" ? "Country" : "U.S. State";
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.22, 8.25);

    const group = new THREE.Group();
    scene.add(group);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.style.touchAction = "none";

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("anonymous");
    const earthTexture = textureLoader.load(earthTextureUrl);
    earthTexture.colorSpace = THREE.SRGBColorSpace;
    earthTexture.anisotropy = maxAnisotropy;
    earthTexture.minFilter = THREE.LinearMipmapLinearFilter;
    earthTexture.magFilter = THREE.LinearFilter;
    const bumpTexture = textureLoader.load(earthBumpTextureUrl);
    bumpTexture.anisotropy = maxAnisotropy;
    const waterTexture = textureLoader.load(earthWaterTextureUrl);
    waterTexture.anisotropy = maxAnisotropy;

    const borderTexture = new THREE.CanvasTexture(
      createBorderTexture({ mode, selectedId: selectedRef.current?.id })
    );
    borderTexture.colorSpace = THREE.SRGBColorSpace;
    borderTexture.anisotropy = maxAnisotropy;
    borderTexture.minFilter = THREE.LinearMipmapLinearFilter;
    borderTexture.magFilter = THREE.LinearFilter;

    const globeMaterial = new THREE.MeshPhongMaterial({
      bumpMap: bumpTexture,
      bumpScale: 0.075,
      map: earthTexture,
      shininess: 18,
      specular: new THREE.Color(0x7f9099),
      specularMap: waterTexture
    });

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 128, 96),
      globeMaterial
    );
    group.add(globe);

    const borderMaterial = new THREE.MeshBasicMaterial({
      depthWrite: false,
      map: borderTexture,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      transparent: true
    });
    borderMaterialRef.current = borderMaterial;
    const borders = new THREE.Mesh(
      new THREE.SphereGeometry(2.508, 128, 96),
      borderMaterial
    );
    group.add(borders);

    const cloudsTexture = textureLoader.load(cloudsTextureUrl);
    cloudsTexture.anisotropy = maxAnisotropy;
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(2.515, 96, 64),
      new THREE.MeshPhongMaterial({
        depthWrite: false,
        map: cloudsTexture,
        opacity: 0.48,
        transparent: true
      })
    );
    group.add(clouds);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.56, 96, 64),
      new THREE.MeshBasicMaterial({
        color: 0x64fff0,
        opacity: 0.09,
        side: THREE.BackSide,
        transparent: true
      })
    );
    scene.add(atmosphere);

    const starGeometry = new THREE.BufferGeometry();
    const starPositions: number[] = [];
    for (let index = 0; index < 550; index += 1) {
      const radius = 12 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
    }
    starGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starPositions, 3)
    );
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        color: 0xaee7df,
        opacity: 0.36,
        size: 0.018,
        transparent: true
      })
    );
    scene.add(stars);

    scene.add(new THREE.AmbientLight(0x7aa7a0, 0.72));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(4.2, 3.2, 5.4);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x47e4d0, 1.6);
    rimLight.position.set(-5, 1.5, -3);
    scene.add(rimLight);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const targetRotation = new THREE.Vector2(0.1, -0.45);
    const currentRotation = new THREE.Vector2(0.1, -0.45);
    let pointerInside = false;
    let frameId = 0;
    let userHasDragged = false;
    const dragState = {
      isDown: false,
      lastX: 0,
      lastY: 0,
      moved: false,
      pointerId: -1,
      startX: 0,
      startY: 0
    };

    const sizeRenderer = () => {
      const { clientWidth, clientHeight } = container;
      const width = Math.max(clientWidth, 320);
      const height = Math.max(clientHeight, 420);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(sizeRenderer);
    resizeObserver.observe(container);
    sizeRenderer();

    const setPointer = (event: PointerEvent) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
    };

    const pickRegion = (event: PointerEvent) => {
      setPointer(event);
      raycaster.setFromCamera(pointer, camera);

      const globeHit = raycaster.intersectObject(globe, false)[0];
      if (!globeHit) return null;

      const localPoint = globe.worldToLocal(globeHit.point.clone()).normalize();
      const longitude = THREE.MathUtils.radToDeg(Math.atan2(-localPoint.z, localPoint.x));
      const latitude = THREE.MathUtils.radToDeg(Math.asin(localPoint.y));
      const geo = findFeatureAtPoint(activeFeatures, longitude, latitude);

      return geo
        ? {
            coordinates: [longitude, latitude] as [number, number],
            geo
          }
        : null;
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerInside = true;
      if (dragState.isDown && dragState.pointerId === event.pointerId) {
        event.preventDefault();
        const deltaX = event.clientX - dragState.lastX;
        const deltaY = event.clientY - dragState.lastY;
        const distance = Math.hypot(
          event.clientX - dragState.startX,
          event.clientY - dragState.startY
        );

        if (distance > 4) {
          dragState.moved = true;
          focusRef.current = null;
        }

        targetRotation.y += deltaX * 0.0056;
        targetRotation.x = clamp(targetRotation.x + deltaY * 0.005, -1.18, 1.18);
        currentRotation.copy(targetRotation);
        if (dragState.moved) userHasDragged = true;
        dragState.lastX = event.clientX;
        dragState.lastY = event.clientY;
        renderer.domElement.style.cursor = "grabbing";
        return;
      }

      const pick = pickRegion(event);
      renderer.domElement.style.cursor = pick ? "pointer" : "grab";

      if (pick?.geo) {
        callbacksRef.current.onHover({
          coordinates: pick.coordinates,
          name: pick.geo.properties?.name ?? "Selected region"
        });
      }
    };

    const handlePointerEnter = () => {
      pointerInside = true;
    };

    const handlePointerLeave = () => {
      if (dragState.isDown) return;
      pointerInside = false;
      renderer.domElement.style.cursor = "grab";
      callbacksRef.current.onHover({ name: "World view" });
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      event.preventDefault();
      dragState.isDown = true;
      dragState.pointerId = event.pointerId;
      dragState.startX = event.clientX;
      dragState.startY = event.clientY;
      dragState.lastX = event.clientX;
      dragState.lastY = event.clientY;
      dragState.moved = false;
      pointerInside = true;
      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (!dragState.isDown || dragState.pointerId !== event.pointerId) return;
      event.preventDefault();
      dragState.isDown = false;
      dragState.pointerId = -1;
      currentRotation.copy(targetRotation);
      userHasDragged = userHasDragged || dragState.moved;
      renderer.domElement.releasePointerCapture(event.pointerId);
      renderer.domElement.style.cursor = "grab";

      const pick = dragState.moved ? null : pickRegion(event);
      if (pick?.geo) {
        callbacksRef.current.onSelect(pick.geo, scope);
      }
    };

    const handlePointerCancel = (event: PointerEvent) => {
      if (!dragState.isDown || dragState.pointerId !== event.pointerId) return;
      dragState.isDown = false;
      dragState.pointerId = -1;
      currentRotation.copy(targetRotation);
      userHasDragged = userHasDragged || dragState.moved;
      renderer.domElement.style.cursor = "grab";
    };

    renderer.domElement.addEventListener("pointerenter", handlePointerEnter);
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerleave", handlePointerLeave);
    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointerup", handlePointerUp);
    renderer.domElement.addEventListener("pointercancel", handlePointerCancel);

    const animate = () => {
      const focus = focusRef.current;

      if (focus) {
        targetRotation.x = THREE.MathUtils.degToRad(clamp(focus.latitude, -52, 52));
        targetRotation.y = nearestEquivalentAngle(
          THREE.MathUtils.degToRad(-90 - focus.longitude),
          currentRotation.y
        );
        if (focus.snap) {
          currentRotation.copy(targetRotation);
          focus.snap = false;
        }
        camera.position.z += (5.82 - camera.position.z) * 0.045;
      } else {
        targetRotation.x += (0.08 - targetRotation.x) * 0.018;
        if (!pointerInside && !userHasDragged) targetRotation.y += 0.0016;
        camera.position.z += (8.25 - camera.position.z) * 0.04;
      }

      const rotationEase = focus ? 0.18 : 0.06;
      currentRotation.x += (targetRotation.x - currentRotation.x) * rotationEase;
      currentRotation.y += (targetRotation.y - currentRotation.y) * rotationEase;
      group.rotation.x = currentRotation.x;
      group.rotation.y = currentRotation.y;
      atmosphere.rotation.x = currentRotation.x * 0.4;
      atmosphere.rotation.y = currentRotation.y * 0.4;
      clouds.rotation.y += THREE.MathUtils.degToRad(-0.006);
      stars.rotation.y += 0.00045;

      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerenter", handlePointerEnter);
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerleave", handlePointerLeave);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointerup", handlePointerUp);
      renderer.domElement.removeEventListener("pointercancel", handlePointerCancel);
      renderer.dispose();
      globe.geometry.dispose();
      globeMaterial.dispose();
      earthTexture.dispose();
      bumpTexture.dispose();
      waterTexture.dispose();
      borders.geometry.dispose();
      borderMaterial.map?.dispose();
      borderMaterial.dispose();
      clouds.geometry.dispose();
      cloudsTexture.dispose();
      (clouds.material as THREE.Material).dispose();
      atmosphere.geometry.dispose();
      (atmosphere.material as THREE.Material).dispose();
      starGeometry.dispose();
      (stars.material as THREE.Material).dispose();
      borderMaterialRef.current = null;
      container.removeChild(renderer.domElement);
    };
  }, [mode]);

  return (
    <div className="relative h-full min-h-[66svh] overflow-hidden lg:min-h-[calc(100svh-72px)]">
      <div
        ref={containerRef}
        data-testid="three-globe"
        className="absolute inset-0"
        role="application"
        aria-label="Interactive 3D globe region optimizer"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(0deg,#061116_0%,rgba(6,17,22,0.82)_32%,transparent_100%)]" />
    </div>
  );
}

function RegionInspector({
  profile,
  selectedRegion
}: {
  profile: (typeof categoryProfiles)[CategoryId] | null;
  selectedRegion: RegionRecommendation | null;
}) {
  if (!selectedRegion || !profile) {
    return null;
  }

  return (
    <aside className="z-10 order-3 overflow-x-hidden border-t border-white/10 bg-[#07161b]/90 p-5 backdrop-blur-xl [scrollbar-width:none] lg:overflow-y-auto lg:border-t-0 lg:border-l [&::-webkit-scrollbar]:hidden">
      <div className="grid gap-6">
        <div className="grid gap-3">
          <div className="flex items-start justify-between gap-4">
            <p className="m-0 text-[0.68rem] font-black tracking-[0.24em] text-[#47e4d0] uppercase">
              Selected surface
            </p>
            <span className="border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-black text-[#f0c86b]">
              {selectedRegion.scope}
            </span>
          </div>
          <h2 className="m-0 text-5xl leading-[0.92] font-black text-white">
            {selectedRegion.name}
          </h2>
          <p className="m-0 text-sm leading-6 text-[#a7bbb8]">{selectedRegion.note}</p>
        </div>

        <div className="grid grid-cols-2 border border-white/10">
          <DataTile label="Tilt" value={`${selectedRegion.tilt} deg`} />
          <DataTile label="Type" value={profile.environment} />
          <DataTile label="Water" value={selectedRegion.waterContent} />
          <DataTile label="Soiling" value={selectedRegion.dust} />
        </div>

        <div className="grid gap-3">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="m-0 text-[0.68rem] font-black tracking-[0.22em] text-[#708b88] uppercase">
                Coating mix
              </p>
              <strong className="text-2xl text-white">
                {selectedRegion.hydrophilic}% / {selectedRegion.hydrophobic}%
              </strong>
            </div>
            <span className="text-sm font-semibold text-[#f0c86b]">
              {selectedRegion.stripCount} bands
            </span>
          </div>
        </div>

        <div className="grid gap-3 border-y border-white/10 py-5">
          <StatLine label="Rainfall" value={selectedRegion.rainfall} />
          <StatLine label="Temperature" value={selectedRegion.temperature} />
          <StatLine label="Tilt basis" value={selectedRegion.tiltBasis} />
        </div>
      </div>
    </aside>
  );
}

function MainDesignPreview({
  selectedRegion
}: {
  selectedRegion: RegionRecommendation;
}) {
  const stripCount = Math.min(selectedRegion.stripCount, 14);
  const strips = Array.from({ length: stripCount }, (_, index) => ({
    id: index,
    isHydrophobic: index % 2 === 1
  }));

  return (
    <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 w-[min(22rem,calc(100%-2rem))] -translate-x-1/2 border border-white/12 bg-[#061116]/82 p-3 shadow-[0_22px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <p className="m-0 text-[0.64rem] font-black tracking-[0.22em] text-[#47e4d0] uppercase">
            Main design
          </p>
          <strong className="text-lg leading-tight text-white">
            {selectedRegion.name}
          </strong>
        </div>
        <span className="text-xs font-black text-[#dbe9e6]">
          {selectedRegion.hydrophilic}/{selectedRegion.hydrophobic}
        </span>
      </div>
      <div
        aria-label={`${selectedRegion.hydrophilic}% hydrophilic and ${selectedRegion.hydrophobic}% hydrophobic coating pattern`}
        className="h-44 overflow-hidden border border-white/15 bg-white/5"
        role="img"
      >
        <div className="flex h-full flex-col">
          {strips.map((strip) => (
            <span
              className={cx(
                "min-h-2 basis-0",
                strip.isHydrophobic
                  ? "bg-[radial-gradient(circle,rgba(6,17,22,0.34)_0_1.15px,transparent_1.7px),linear-gradient(180deg,#d8f6ff,#9ee7ff)] [background-size:8px_8px,auto]"
                  : "bg-[linear-gradient(180deg,#ffffff,#edf8f8)]"
              )}
              key={strip.id}
              style={{
                flexGrow: strip.isHydrophobic
                  ? selectedRegion.hydrophobic
                  : selectedRegion.hydrophilic
              }}
            />
          ))}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-[0.65rem] font-black uppercase tracking-[0.12em]">
        <span className="bg-white px-2 py-1 text-[#061116]">hydrophilic</span>
        <span className="bg-[#9ee7ff] px-2 py-1 text-[#061116]">hydrophobic</span>
      </div>
    </div>
  );
}

function DataTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid min-h-24 content-between gap-3 border-r border-b border-white/10 p-3 last:border-r-0">
      <span className="text-[0.68rem] font-black tracking-[0.18em] text-[#708b88] uppercase">
        {label}
      </span>
      <strong className="text-base leading-tight text-white">{value}</strong>
    </div>
  );
}

function StatLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <span className="text-[0.68rem] font-black tracking-[0.2em] text-[#708b88] uppercase">
        {label}
      </span>
      <strong className="text-sm leading-5 text-[#dbe9e6]">{value}</strong>
    </div>
  );
}
