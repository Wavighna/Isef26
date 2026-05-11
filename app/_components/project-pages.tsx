import Link from "next/link";
import type { ReactNode } from "react";

type PageId = "product" | "patterns" | "optimizer";

const navItems: Array<{ id: PageId; label: string; href: string }> = [
  { id: "product", label: "Product", href: "/product" },
  { id: "patterns", label: "Pattern Lab", href: "/pattern-lab" },
  { id: "optimizer", label: "3D Optimizer", href: "/optimizer" }
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ProjectPageShell({
  activePage,
  children
}: {
  activePage: PageId;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#061116] text-[#e9fbf7]">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#061116]/90 backdrop-blur-xl">
        <nav className="flex flex-col items-center gap-3 px-4 py-3 sm:h-[72px] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-0">
          <Link className="group grid gap-0.5 text-center sm:text-left" href="/product">
            <span className="text-[0.58rem] font-black tracking-[0.2em] text-[#47e4d0] uppercase transition-colors group-hover:text-[#f0c86b] sm:text-[0.68rem] sm:tracking-[0.24em]">
              Solstice Surface Systems
            </span>
            <strong className="text-[0.86rem] font-semibold text-white sm:text-[0.95rem]">
              Retrofit solar cleaning overlays
            </strong>
          </Link>

          <div className="inline-flex max-w-full self-center gap-1 overflow-hidden border border-white/10 bg-white/[0.03] p-1 sm:flex sm:w-auto sm:self-auto sm:overflow-x-auto">
            {navItems.map((item) => (
              <Link
                aria-current={activePage === item.id ? "page" : undefined}
                className={cx(
                  "shrink-0 px-2.5 py-2 text-center text-[0.64rem] font-black tracking-normal whitespace-nowrap text-[#9fb8b5] transition-all duration-300 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#47e4d0] sm:px-3.5 sm:text-xs",
                  activePage === item.id &&
                    "bg-white text-[#061116] shadow-[0_0_30px_rgba(71,228,208,0.18)]"
                )}
                href={item.href}
                key={item.id}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
      {children}
    </main>
  );
}

export function ProductPage() {
  return (
    <ProjectPageShell activePage="product">
      <ProductContent />
    </ProjectPageShell>
  );
}

export function PatternLabPage() {
  return (
    <ProjectPageShell activePage="patterns">
      <PatternLabContent />
    </ProjectPageShell>
  );
}

export function ProductContent() {
  return (
    <section className="bg-[#061116]">
      <div className="relative isolate min-h-[calc(100svh-72px)] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#07161b_0%,#061116_52%,#061116_100%)]" />
        <div className="relative grid min-h-[calc(100svh-72px)] grid-cols-1 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1fr)]">
          <div className="grid min-w-0 content-center gap-8 px-5 py-12 sm:px-8 lg:gap-10 lg:px-12 lg:py-16">
            <div className="grid max-w-[50rem] min-w-0 gap-6">
              <p className="m-0 text-[0.58rem] font-black tracking-[0.2em] text-[#47e4d0] uppercase sm:text-[0.68rem] sm:tracking-[0.28em]">
                Chemical-free PV cleaning surface
              </p>
              <h1 className="m-0 max-w-full break-words text-[clamp(2.05rem,10vw,2.9rem)] leading-[0.9] font-black tracking-normal text-white lg:text-[clamp(3.45rem,7.6vw,7.8rem)] lg:leading-[0.86]">
                Passive cleaning from surface physics.
              </h1>
              <p className="m-0 max-w-full text-[0.92rem] leading-6 text-[#b5c8c5] sm:max-w-[41rem] sm:text-base sm:leading-7">
                The project uses transparent PMMA as a solar-cover analog and
                combines unmodified hydrophilic regions with CO2 laser-textured
                hydrophobic regions. The goal is to loosen dust first, then move
                dirty droplets down the panel without PFAS-style chemical
                coatings.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                className="group bg-[#47e4d0] px-4 py-2.5 text-xs font-black text-[#061116] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f0c86b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#47e4d0] sm:px-5 sm:py-3 sm:text-sm"
                href="/pattern-lab"
              >
                See coating patterns{" "}
                <span className="inline-block pl-2 transition-transform duration-300 group-hover:translate-x-1">
                  -&gt;
                </span>
              </Link>
              <Link
                className="border border-white/15 px-4 py-2.5 text-xs font-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#47e4d0] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#47e4d0] sm:px-5 sm:py-3 sm:text-sm"
                href="/optimizer"
              >
                Open 3D optimizer
              </Link>
            </div>
          </div>

          <div className="relative min-h-[58svh] overflow-hidden lg:min-h-[72svh]">
            <div className="absolute inset-x-5 top-8 bottom-20 flex items-center justify-center sm:inset-x-10 lg:inset-y-10 lg:left-0 lg:right-12">
              <ProductSurfaceVisual />
            </div>
            <div className="absolute bottom-5 left-1/2 flex w-[min(520px,calc(100%-2.5rem))] -translate-x-1/2 flex-wrap justify-center gap-x-12 gap-y-4 border-t border-white/10 pt-5 text-center">
              <ProductProof label="Material" value="PMMA cover analog" />
              <ProductProof label="Texture" value="30% CO2 laser dot density" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-16">
          <section className="grid gap-8 border-y border-white/10 py-12 lg:grid-cols-[0.55fr_1fr] lg:items-start">
            <div className="grid gap-3">
              <p className="m-0 text-[0.58rem] font-black tracking-[0.2em] text-[#47e4d0] uppercase sm:text-[0.68rem] sm:tracking-[0.28em]">
                Surface behavior
              </p>
              <h2 className="m-0 max-w-[11ch] text-[clamp(1.85rem,8.4vw,2.45rem)] leading-[0.92] font-black text-white lg:text-[clamp(2.4rem,5vw,5.3rem)] lg:leading-[0.9]">
                A controlled cleaning sequence.
              </h2>
            </div>

            <div className="grid gap-8">
              <p className="m-0 max-w-[48rem] text-[0.95rem] leading-7 text-[#c6d7d3] sm:text-lg sm:leading-8">
                The surface strategy centers on a simple insight: hydrophilic
                regions spread water and help loosen adhered particles, while
                hydrophobic microtextures help droplets move and carry loosened
                debris away. The alternating surface combines
                both behaviors instead of relying on only one wetting regime.
              </p>

              <div className="grid gap-0 border-t border-white/10 lg:grid-cols-3">
                <ProductStep
                  index="01"
                  title="Wet the soil"
                  text="Unmodified PMMA regions stay hydrophilic, allowing water to spread across dust and mineral residue."
                />
                <ProductStep
                  index="02"
                  title="Move the droplet"
                  text="Laser-patterned hydrophobic regions reduce solid-liquid contact so droplets slide with less pinning."
                />
                <ProductStep
                  index="03"
                  title="Carry residue off"
                  text="The alternating layout follows droplet flow, moving water from hydrophilic capture into hydrophobic release."
                />
              </div>
            </div>
          </section>

          <section className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.65fr)] lg:items-start">
            <div className="grid gap-6">
              <p className="m-0 text-[0.58rem] font-black tracking-[0.2em] text-[#47e4d0] uppercase sm:text-[0.68rem] sm:tracking-[0.28em]">
                Testing evidence
              </p>
              <h2 className="m-0 text-[clamp(1.8rem,8vw,2.4rem)] leading-[0.94] font-black text-white lg:text-[clamp(2.2rem,4.6vw,5rem)] lg:leading-[0.92]">
                The mixed surface left the least residue.
              </h2>
              <p className="m-0 max-w-[44rem] text-[0.95rem] leading-7 text-[#a7bbb8] sm:text-base">
                The study compared hydrophilic, hydrophobic, and alternating
                coupons under the same dust and water-cleaning conditions. The
                alternating surface reached the lowest mean residual
                contamination at 2.02%, compared with 2.57% for hydrophilic and
                2.43% for hydrophobic controls.
              </p>
              <p className="m-0 max-w-[44rem] text-[0.95rem] leading-7 text-[#a7bbb8] sm:text-base">
                Pattern density testing also shaped the product direction. In
                those tests, 30% laser-dot density kept the surface hydrophobic
                while preserving more light transmission, so it was selected for
                later cleaning trials.
              </p>
            </div>

            <div className="grid gap-5 border-l border-white/10 pl-5">
              <ResearchMetric label="Residual contamination" value="2.02%" />
              <ResearchMetric label="Improvement vs. hydrophilic" value="21.7%" />
              <ResearchMetric label="Statistical result" value="p < 0.01" />
              <ResearchMetric label="PMMA transmittance basis" value="~92%" />
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

function ProductProof({ label, value }: { label: string; value: string }) {
  return (
    <div className="group grid min-w-[11rem] justify-items-center gap-1 transition-transform duration-300 hover:-translate-y-0.5">
      <span className="text-[0.56rem] font-black tracking-[0.18em] text-[#47e4d0] uppercase sm:text-[0.68rem] sm:tracking-[0.24em]">
        {label}
      </span>
      <strong className="text-xs leading-4 text-white sm:text-sm sm:leading-5">{value}</strong>
    </div>
  );
}

function ProductStep({
  index,
  text,
  title
}: {
  index: string;
  text: string;
  title: string;
}) {
  return (
    <article className="group grid gap-8 py-8 transition-colors duration-300 hover:bg-white/[0.025] lg:border-r lg:border-white/10 lg:px-7 lg:last:border-r-0">
      <span className="text-xs font-black text-[#f0c86b] transition-transform duration-300 group-hover:translate-x-1 sm:text-sm">
        {index}
      </span>
      <div className="grid gap-3">
        <h3 className="m-0 text-2xl leading-none font-black text-white sm:text-3xl">{title}</h3>
        <p className="m-0 max-w-[24rem] text-[0.86rem] leading-6 text-[#a7bbb8] sm:text-sm">{text}</p>
      </div>
    </article>
  );
}

function ResearchMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-white/10 pb-4 last:border-b-0">
      <span className="text-[0.56rem] font-black tracking-[0.18em] text-[#708b88] uppercase sm:text-[0.68rem] sm:tracking-[0.22em]">
        {label}
      </span>
      <strong className="text-2xl leading-none font-black text-white sm:text-3xl">{value}</strong>
    </div>
  );
}

function ProductSurfaceVisual() {
  const topClasses = [
    "top-[0%]",
    "top-[6.7%]",
    "top-[13.4%]",
    "top-[20.1%]",
    "top-[26.8%]",
    "top-[33.5%]",
    "top-[40.2%]",
    "top-[46.9%]",
    "top-[53.6%]",
    "top-[60.3%]",
    "top-[67%]",
    "top-[73.7%]",
    "top-[80.4%]",
    "top-[87.1%]",
    "top-[93.8%]"
  ];

  return (
    <div className="group relative aspect-[0.78/1] h-full max-h-[720px] w-full max-w-[520px] overflow-hidden bg-[#f7fcfc] ring-1 ring-white/10 transition-transform duration-700 hover:-translate-y-2 lg:rotate-[-3deg] lg:hover:rotate-[-1deg]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(231,248,252,0.42)_48%,rgba(6,38,48,0.14)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.34)_42%,transparent_62%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      {Array.from({ length: 15 }).map((_, index) => (
        <span
          className={cx(
            "absolute inset-x-0 h-[6.7%] transition-transform duration-500",
            topClasses[index],
            index % 2 === 0
              ? "bg-[linear-gradient(180deg,#ffffff,#eef9fb)]"
              : "bg-[radial-gradient(circle,rgba(0,65,92,0.42)_0_1.15px,transparent_1.8px),linear-gradient(180deg,#d9f7ff,#9ee7ff)] [background-size:9px_9px,auto]"
          )}
          key={index}
        />
      ))}
      <SoilWashAnimation />
      <div className="absolute top-8 left-1/2 grid -translate-x-1/2 justify-items-center gap-1 text-center text-[#063238] transition-transform duration-700 group-hover:translate-y-2">
        <span className="text-[0.55rem] font-black tracking-[0.16em] uppercase sm:text-[0.68rem] sm:tracking-[0.22em]">
          runoff path
        </span>
        <span className="flex flex-col items-center" aria-hidden="true">
          <span className="h-14 w-1 bg-[#18bcc8]" />
          <span className="-mt-px h-0 w-0 border-x-[10px] border-t-[16px] border-x-transparent border-t-[#18bcc8]" />
        </span>
      </div>
    </div>
  );
}

function SoilWashAnimation() {
  const soilParticles = [
    { x: 52, y: 56, r: 2.4, delay: 0.1 },
    { x: 96, y: 82, r: 1.8, delay: 0.4 },
    { x: 148, y: 62, r: 2.8, delay: 0.2 },
    { x: 210, y: 92, r: 1.9, delay: 0.7 },
    { x: 268, y: 68, r: 2.5, delay: 0.5 },
    { x: 330, y: 88, r: 3.1, delay: 0.8 },
    { x: 378, y: 58, r: 2, delay: 0.3 },
    { x: 78, y: 122, r: 2.7, delay: 1 },
    { x: 126, y: 146, r: 1.7, delay: 1.3 },
    { x: 182, y: 118, r: 2.1, delay: 1.1 },
    { x: 238, y: 156, r: 3, delay: 1.6 },
    { x: 294, y: 130, r: 2.2, delay: 1.2 },
    { x: 352, y: 152, r: 2.6, delay: 1.5 },
    { x: 44, y: 194, r: 3.1, delay: 2 },
    { x: 104, y: 210, r: 2, delay: 2.3 },
    { x: 156, y: 184, r: 2.5, delay: 2.1 },
    { x: 216, y: 222, r: 1.8, delay: 2.6 },
    { x: 274, y: 194, r: 3.2, delay: 2.4 },
    { x: 334, y: 218, r: 2.1, delay: 2.7 },
    { x: 382, y: 188, r: 2.7, delay: 2.2 },
    { x: 66, y: 266, r: 2.2, delay: 3.1 },
    { x: 118, y: 246, r: 3.4, delay: 2.9 },
    { x: 170, y: 282, r: 2.4, delay: 3.4 },
    { x: 226, y: 260, r: 1.8, delay: 3.2 },
    { x: 288, y: 292, r: 3.1, delay: 3.7 },
    { x: 346, y: 264, r: 2.2, delay: 3.5 },
    { x: 392, y: 304, r: 1.7, delay: 3.9 },
    { x: 46, y: 342, r: 2.6, delay: 4.2 },
    { x: 98, y: 366, r: 1.9, delay: 4.5 },
    { x: 154, y: 334, r: 3.3, delay: 4.1 },
    { x: 206, y: 374, r: 2.2, delay: 4.7 },
    { x: 262, y: 346, r: 1.8, delay: 4.4 },
    { x: 316, y: 382, r: 3, delay: 4.9 },
    { x: 372, y: 354, r: 2.3, delay: 4.6 },
    { x: 72, y: 426, r: 3.1, delay: 5.1 },
    { x: 126, y: 406, r: 2, delay: 5.4 },
    { x: 178, y: 448, r: 2.7, delay: 5.2 },
    { x: 238, y: 418, r: 1.8, delay: 5.7 },
    { x: 292, y: 456, r: 3.3, delay: 5.5 },
    { x: 354, y: 424, r: 2.1, delay: 5.9 },
    { x: 42, y: 494, r: 2.5, delay: 6.2 },
    { x: 96, y: 468, r: 1.7, delay: 6 },
    { x: 150, y: 506, r: 3.2, delay: 6.4 },
    { x: 210, y: 482, r: 2.1, delay: 6.1 },
    { x: 270, y: 512, r: 2.8, delay: 6.6 },
    { x: 326, y: 474, r: 1.9, delay: 6.3 },
    { x: 382, y: 500, r: 2.6, delay: 6.7 }
  ];

  const droplets = [
    { x: 54, dx: 24, delay: 0, dur: 4.9, scale: 0.56 },
    { x: 88, dx: -16, delay: 0.35, dur: 5.4, scale: 0.42 },
    { x: 126, dx: 18, delay: 0.72, dur: 5.1, scale: 0.5 },
    { x: 162, dx: -10, delay: 1.08, dur: 5.7, scale: 0.45 },
    { x: 198, dx: 22, delay: 1.44, dur: 5.2, scale: 0.62 },
    { x: 236, dx: -18, delay: 1.8, dur: 5.8, scale: 0.48 },
    { x: 274, dx: 14, delay: 2.16, dur: 5.3, scale: 0.54 },
    { x: 310, dx: -22, delay: 2.52, dur: 5.9, scale: 0.44 },
    { x: 348, dx: 16, delay: 2.88, dur: 5.2, scale: 0.52 },
    { x: 382, dx: -12, delay: 3.24, dur: 5.6, scale: 0.4 },
    { x: 112, dx: 30, delay: 3.6, dur: 5.1, scale: 0.46 },
    { x: 248, dx: -24, delay: 3.95, dur: 5.5, scale: 0.58 }
  ];

  const surfaceBeads = [
    { x: 38, y: 74, r: 2.4, delay: 0.1 },
    { x: 116, y: 58, r: 2.8, delay: 0.8 },
    { x: 194, y: 82, r: 2.1, delay: 1.4 },
    { x: 286, y: 64, r: 2.6, delay: 2 },
    { x: 358, y: 96, r: 1.9, delay: 2.6 },
    { x: 72, y: 154, r: 2.2, delay: 3.2 },
    { x: 146, y: 178, r: 3, delay: 0.5 },
    { x: 228, y: 148, r: 2.5, delay: 1.1 },
    { x: 318, y: 186, r: 2.2, delay: 1.7 },
    { x: 382, y: 160, r: 2.7, delay: 2.3 },
    { x: 42, y: 248, r: 2.5, delay: 2.9 },
    { x: 124, y: 224, r: 1.8, delay: 3.5 },
    { x: 204, y: 262, r: 2.9, delay: 0.2 },
    { x: 278, y: 238, r: 2.1, delay: 0.9 },
    { x: 346, y: 274, r: 2.6, delay: 1.5 },
    { x: 86, y: 334, r: 2.4, delay: 2.1 },
    { x: 166, y: 364, r: 2, delay: 2.7 },
    { x: 242, y: 330, r: 2.8, delay: 3.3 },
    { x: 324, y: 372, r: 2.2, delay: 0.6 },
    { x: 68, y: 438, r: 2.7, delay: 1.2 },
    { x: 154, y: 414, r: 2.1, delay: 1.8 },
    { x: 236, y: 456, r: 2.5, delay: 2.4 },
    { x: 316, y: 428, r: 1.9, delay: 3 },
    { x: 382, y: 470, r: 2.3, delay: 3.6 }
  ];

  const trails = [
    "M88 -30 C78 92 122 168 104 292 C92 368 124 432 116 572",
    "M156 -40 C178 84 136 176 154 286 C170 382 138 452 150 572",
    "M224 -30 C206 76 250 166 226 278 C210 358 252 448 236 572",
    "M298 -40 C322 96 276 172 300 304 C318 398 288 462 304 572",
    "M52 -34 C82 74 42 188 68 292 C90 382 56 468 84 572",
    "M356 -38 C330 88 384 176 354 300 C334 386 378 462 350 572"
  ];

  const washCycle = "9.6s";
  const toKeyTime = (value: number) => value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
  const toValue = (value: number) => value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
  const makeSoilTiming = (particle: { y: number; r: number }) => {
    const position = clamp01(particle.y / 540);
    const appearMid = 0.06 + position * 0.08;
    const full = 0.17 + position * 0.07;
    const washStart = 0.38 + position * 0.25;
    const washMid = washStart + 0.07;
    const clear = washStart + 0.15;
    const drift = 34 + position * 30;
    const carried = 92 + position * 44;

    return {
      keyTimes: [0, appearMid, full, washStart, washMid, clear, 0.88, 1]
        .map(toKeyTime)
        .join(";"),
      opacity: "0;0.42;0.82;0.82;0.28;0;0;0",
      radius: [
        0.2,
        particle.r * 0.62,
        particle.r,
        particle.r,
        particle.r * 0.9,
        0.18,
        0.18,
        0.18
      ]
        .map(toValue)
        .join(";"),
      transform: [
        "0 0",
        "0 0",
        "0 0",
        "0 0",
        `7 ${toValue(drift)}`,
        `22 ${toValue(carried)}`,
        `22 ${toValue(carried)}`,
        "0 0"
      ].join(";")
    };
  };
  const makeBeadTiming = (bead: { y: number }) => {
    const position = clamp01(bead.y / 540);
    const arrive = 0.32 + position * 0.25;
    const peak = arrive + 0.06;
    const exit = arrive + 0.22;

    return {
      keyTimes: [0, arrive, peak, exit, 0.84, 1].map(toKeyTime).join(";"),
      opacity: "0;0;0.72;0.34;0;0",
      transform: "0 -42;0 -42;0 -8;0 58;0 118;0 -42"
    };
  };

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 420 540"
    >
      <defs>
        <radialGradient cx="35%" cy="28%" id="dropGradient" r="72%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.96" />
          <stop offset="34%" stopColor="#aef8ff" stopOpacity="0.86" />
          <stop offset="100%" stopColor="#36cbd7" stopOpacity="0.42" />
        </radialGradient>
        <radialGradient cx="42%" cy="36%" id="soilGradient" r="72%">
          <stop offset="0%" stopColor="#8d6740" />
          <stop offset="62%" stopColor="#5d422a" />
          <stop offset="100%" stopColor="#2d2118" />
        </radialGradient>
        <linearGradient id="waterTrail" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#d9ffff" stopOpacity="0" />
          <stop offset="24%" stopColor="#9ff8ff" stopOpacity="0.48" />
          <stop offset="100%" stopColor="#44d9e4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="washSheet" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="42%" stopColor="#c8fbff" stopOpacity="0.36" />
          <stop offset="100%" stopColor="#70e6ee" stopOpacity="0" />
        </linearGradient>
        <filter colorInterpolationFilters="sRGB" id="dropletShadow">
          <feDropShadow dx="0" dy="4" floodColor="#006a79" floodOpacity="0.22" stdDeviation="3" />
        </filter>
      </defs>

      <g className="mix-blend-multiply">
        {soilParticles.map((particle) => {
          const timing = makeSoilTiming(particle);

          return (
            <circle
              cx={particle.x}
              cy={particle.y}
              fill="url(#soilGradient)"
              key={`${particle.x}-${particle.y}`}
              opacity="0"
              r="0.2"
            >
              <animate
                attributeName="r"
                begin="0s"
                dur={washCycle}
                keyTimes={timing.keyTimes}
                repeatCount="indefinite"
                values={timing.radius}
              />
              <animate
                attributeName="opacity"
                begin="0s"
                dur={washCycle}
                keyTimes={timing.keyTimes}
                repeatCount="indefinite"
                values={timing.opacity}
              />
              <animateTransform
                additive="sum"
                attributeName="transform"
                begin="0s"
                dur={washCycle}
                keyTimes={timing.keyTimes}
                repeatCount="indefinite"
                type="translate"
                values={timing.transform}
              />
            </circle>
          );
        })}
      </g>

      <path
        d="M0 76 C70 98 110 56 184 84 C260 112 306 62 420 92 L420 166 C322 132 260 178 186 142 C112 106 66 154 0 124 Z"
        fill="url(#washSheet)"
        opacity="0.62"
      >
        <animateTransform
          attributeName="transform"
          dur={washCycle}
          keyTimes="0;0.3;0.7;0.86;1"
          repeatCount="indefinite"
          type="translate"
          values="0 -190;0 -190;0 540;0 540;0 -190"
        />
      </path>

      {trails.map((path, index) => (
        <path
          d={path}
          fill="none"
          key={path}
          opacity="0"
          stroke="url(#waterTrail)"
          strokeDasharray="150 470"
          strokeLinecap="round"
          strokeWidth={index === 2 ? 9 : 7}
        >
          <animate
            attributeName="opacity"
            begin="0s"
            dur={washCycle}
            keyTimes="0;0.3;0.38;0.68;0.82;1"
            repeatCount="indefinite"
            values="0;0;0.7;0.26;0;0"
          />
          <animate
            attributeName="stroke-dashoffset"
            begin="0s"
            dur={washCycle}
            keyTimes="0;0.3;0.38;0.68;0.82;1"
            repeatCount="indefinite"
            values="440;440;260;-260;-620;-620"
          />
        </path>
      ))}

      <g filter="url(#dropletShadow)">
        {surfaceBeads.map((bead) => {
          const timing = makeBeadTiming(bead);

          return (
            <circle
              cx={bead.x}
              cy={bead.y}
              fill="url(#dropGradient)"
              key={`${bead.x}-${bead.y}`}
              opacity="0"
              r={bead.r}
            >
              <animate
                attributeName="opacity"
                begin="0s"
                dur={washCycle}
                keyTimes={timing.keyTimes}
                repeatCount="indefinite"
                values={timing.opacity}
              />
              <animateTransform
                attributeName="transform"
                begin="0s"
                dur={washCycle}
                keyTimes={timing.keyTimes}
                repeatCount="indefinite"
                type="translate"
                values={timing.transform}
              />
            </circle>
          );
        })}
      </g>

      {droplets.map((drop) => (
        <g
          filter="url(#dropletShadow)"
          key={`${drop.x}-${drop.delay}`}
          opacity="0"
          transform={`translate(${drop.x} -48)`}
        >
          <animate
            attributeName="opacity"
            begin="0s"
            dur={washCycle}
            keyTimes="0;0.3;0.38;0.68;0.82;1"
            repeatCount="indefinite"
            values="0;0;0.94;0.72;0;0"
          />
          <animateTransform
            attributeName="transform"
            begin="0s"
            dur={washCycle}
            keyTimes="0;0.3;0.38;0.68;0.82;1"
            repeatCount="indefinite"
            type="translate"
            values={`${drop.x} -56;${drop.x} -56;${drop.x + drop.dx * 0.35} 124;${drop.x + drop.dx} 382;${drop.x + drop.dx * 1.2} 612;${drop.x} -56`}
            />
          <g transform={`scale(${drop.scale})`}>
            <ellipse cx="0" cy="0" fill="url(#dropGradient)" rx="6.2" ry="10.8" />
            <ellipse cx="-2.1" cy="-4.2" fill="#ffffff" opacity="0.88" rx="1.7" ry="3" />
          </g>
        </g>
      ))}

      <g opacity="0.44">
        <path
          d="M30 502 C94 486 146 520 208 504 C272 486 318 520 392 500"
          fill="none"
          stroke="#7a5735"
          strokeLinecap="round"
          strokeWidth="8"
        >
          <animate
            attributeName="opacity"
            dur={washCycle}
            keyTimes="0;0.56;0.68;0.78;1"
            repeatCount="indefinite"
            values="0;0;0.5;0;0"
          />
        </path>
      </g>
    </svg>
  );
}

export function PatternLabContent() {
  return (
    <section className="min-h-[calc(100svh-72px)] overflow-x-hidden bg-[#061116] px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl min-w-0 gap-8">
        <div className="grid min-w-0 gap-5 border-b border-white/10 pb-7 lg:grid-cols-[0.58fr_0.82fr] lg:items-end">
          <div className="min-w-0">
            <p className="m-0 mb-3 text-[0.58rem] font-black tracking-[0.2em] text-[#47e4d0] uppercase sm:text-[0.68rem] sm:tracking-[0.28em]">
              Pattern lab
            </p>
            <h1 className="m-0 max-w-full break-words text-[clamp(1.85rem,8.4vw,2.35rem)] leading-[0.92] font-black text-white lg:text-[clamp(2.7rem,4.9vw,5.3rem)] lg:leading-[0.88]">
              Coating pattern options.
            </h1>
          </div>
          <p className="m-0 max-w-full text-[0.9rem] leading-6 text-[#a7bbb8] sm:text-sm lg:max-w-[43rem] lg:pb-1">
            A compact view of the surface layouts behind the coating concept:
            equal alternating bands, a smoother wettability transition, and
            rectangular paths that separate hydrophilic wetting from hydrophobic
            droplet release.
          </p>
        </div>

        <div className="grid gap-7">
          <PatternStudy
            eyebrow="Tested surface"
            title="Alternating hydrophilic and hydrophobic bands"
            visual={<MiniStripeSurface />}
            paragraphs={[
              "The baseline layout uses equal-width hydrophilic and hydrophobic bands so every water path crosses the same amount of each surface.",
              "Hydrophilic bands spread water across dust and mineral residue. Dotted hydrophobic bands create release zones that help droplets keep moving.",
              "This pattern is the clearest production direction because it is easy to manufacture, easy to inspect, and directly aligned with downward droplet travel."
            ]}
          />

          <PatternStudy
            eyebrow="Future direction"
            title="Continuous wettability gradient"
            visual={<TestingVisual kind="gradient" />}
            paragraphs={[
              "This option moves gradually from hydrophilic wetting into hydrophobic release instead of switching between hard bands.",
              "The smoother transition is meant to reduce droplet pinning, where water slows down at a sharp surface boundary.",
              "It is useful as a comparison to the equal-band design when tuning for smoother water movement across the panel."
            ]}
          />

          <PatternStudy
            eyebrow="Future geometry"
            title="Concentric rectangular transport paths"
            visual={<TestingVisual kind="rings" />}
            paragraphs={[
              "Rectangular paths test whether geometry can steer dirty water outward as well as downward.",
              "Plain rectangular channels are hydrophilic wetting zones. Dotted rectangular bands are hydrophobic release paths, made more visible here so the alternating behavior is clear.",
              "This layout keeps large transparent areas while adding repeated release paths around the surface."
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function PatternStudy({
  eyebrow,
  paragraphs,
  title,
  visual
}: {
  eyebrow: string;
  paragraphs: string[];
  title: string;
  visual: ReactNode;
}) {
  return (
    <article className="grid gap-4 border-b border-white/10 pb-7 last:border-b-0">
      <div className="grid gap-2">
        <p className="m-0 text-[0.58rem] font-black tracking-[0.2em] text-[#47e4d0] uppercase sm:text-[0.68rem] sm:tracking-[0.24em]">
          {eyebrow}
        </p>
        <h2 className="m-0 max-w-[58rem] text-[1.32rem] leading-[1.02] font-black text-white sm:text-4xl sm:leading-[0.98]">
          {title}
        </h2>
      </div>
      <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
        <div className="transition-transform duration-500 hover:-translate-y-1">
          {visual}
        </div>
        <div className="grid max-w-[58rem] gap-3 text-[0.86rem] leading-6 text-[#a7bbb8] sm:text-sm xl:grid-cols-3">
          {paragraphs.map((paragraph) => (
            <p
              className="m-0 border-t border-white/10 pt-3 xl:border-t-0 xl:border-l xl:pl-4 xl:pt-0"
              key={paragraph}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}

function MiniStripeSurface() {
  return (
    <div
      aria-label="Alternating hydrophilic and hydrophobic PMMA pattern"
      className="grid w-full max-w-[300px] gap-3"
      role="img"
    >
      <div className="h-[210px] overflow-hidden border border-white/15 bg-white/5">
        <div className="flex h-full flex-col">
          {Array.from({ length: 12 }).map((_, index) => (
            <span
              className={cx(
                "min-h-2",
                index % 2 === 0
                  ? "flex-1 bg-[linear-gradient(180deg,#ffffff,#eef9fb)]"
                  : "flex-1 bg-[radial-gradient(circle,rgba(0,65,92,0.42)_0_1.15px,transparent_1.8px),linear-gradient(180deg,#d9f7ff,#9ee7ff)] [background-size:8px_8px,auto]"
              )}
              key={index}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 text-[0.68rem] font-black sm:text-xs">
        <span className="bg-white px-2 py-1.5 text-[#061116] sm:px-2.5">hydrophilic</span>
        <span className="bg-[#9ee7ff] px-2 py-1.5 text-[#061116] sm:px-2.5">hydrophobic</span>
      </div>
    </div>
  );
}

function TestingVisual({ kind }: { kind: "gradient" | "rings" }) {
  return (
    <div
      className={cx(
        "relative aspect-[1.35/1] w-full max-w-[300px] overflow-hidden border border-white/15",
        kind === "gradient" &&
          "bg-[linear-gradient(180deg,#ffffff_0_26%,#effcff_44%,#9ee7ff_100%)]",
        kind === "rings" && "grid place-items-center bg-[#ffffff]"
      )}
    >
      {kind === "rings" && (
        <ConcentricTransportPattern
          className="absolute inset-3"
          idPrefix="lab-transport"
        />
      )}
    </div>
  );
}

function ConcentricTransportPattern({
  className,
  idPrefix
}: {
  className?: string;
  idPrefix: string;
}) {
  const dotId = `${idPrefix}-dots`;
  const hydrophobicPath = [
    "M20 18H280V204H20Z M44 42H256V180H44Z",
    "M68 64H232V158H68Z M92 84H208V138H92Z",
    "M112 95H188V127H112Z M130 105H170V117H130Z"
  ].join(" ");
  const hydrophilicGuides = [
    { height: 138, width: 212, x: 44, y: 42 },
    { height: 54, width: 116, x: 92, y: 84 },
    { height: 12, width: 40, x: 130, y: 105 }
  ];

  return (
    <svg
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 300 222"
    >
      <defs>
        <pattern
          height="8"
          id={dotId}
          patternUnits="userSpaceOnUse"
          width="8"
        >
          <circle cx="2" cy="2" fill="rgba(0,65,92,0.48)" r="1.15" />
        </pattern>
      </defs>
      <rect fill="#ffffff" height="222" width="300" />
      <path d={hydrophobicPath} fill="#9ee7ff" fillRule="evenodd" />
      <path d={hydrophobicPath} fill={`url(#${dotId})`} fillRule="evenodd" />
      <g fill="none" stroke="#dfe7e7" strokeWidth="1.25">
        <rect height="186" width="260" x="20" y="18" />
        {hydrophilicGuides.map((guide) => (
          <rect
            height={guide.height}
            key={`${guide.x}-${guide.y}`}
            width={guide.width}
            x={guide.x}
            y={guide.y}
          />
        ))}
      </g>
    </svg>
  );
}
