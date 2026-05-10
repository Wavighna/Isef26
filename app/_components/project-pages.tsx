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
        <nav className="flex flex-col gap-3 px-4 py-3 sm:h-[72px] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-0">
          <Link className="group grid gap-0.5 text-left" href="/product">
            <span className="text-[0.68rem] font-black tracking-[0.24em] text-[#47e4d0] uppercase transition-colors group-hover:text-[#f0c86b]">
              Solstice Surface Systems
            </span>
            <strong className="text-[0.95rem] font-semibold text-white">
              Retrofit solar cleaning overlays
            </strong>
          </Link>

          <div className="flex gap-1 overflow-x-auto border border-white/10 bg-white/[0.03] p-1">
            {navItems.map((item) => (
              <Link
                aria-current={activePage === item.id ? "page" : undefined}
                className={cx(
                  "px-3.5 py-2 text-xs font-black tracking-normal whitespace-nowrap text-[#9fb8b5] transition-all duration-300 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#47e4d0]",
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgba(71,228,208,0.2),transparent_34%),linear-gradient(115deg,#07161b_0%,#061116_54%,#0e1d1c_100%)]" />
        <div className="relative grid min-h-[calc(100svh-72px)] grid-cols-1 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1fr)]">
          <div className="grid content-center gap-10 px-5 py-16 sm:px-8 lg:px-12">
            <div className="grid max-w-[50rem] gap-6">
              <p className="m-0 text-[0.68rem] font-black tracking-[0.28em] text-[#47e4d0] uppercase">
                Chemical-free PV cleaning surface
              </p>
              <h1 className="m-0 text-[clamp(3.45rem,7.6vw,7.8rem)] leading-[0.86] font-black tracking-normal text-white">
                Passive cleaning from surface physics.
              </h1>
              <p className="m-0 max-w-[41rem] text-base leading-7 text-[#b5c8c5]">
                The project uses transparent PMMA as a solar-cover analog and
                combines unmodified hydrophilic regions with CO2 laser-textured
                hydrophobic regions. The goal is to loosen dust first, then move
                dirty droplets down the panel without PFAS-style chemical
                coatings.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                className="group bg-[#47e4d0] px-5 py-3 text-sm font-black text-[#061116] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f0c86b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#47e4d0]"
                href="/pattern-lab"
              >
                See coating patterns
                <span className="inline-block pl-2 transition-transform duration-300 group-hover:translate-x-1">
                  -&gt;
                </span>
              </Link>
              <Link
                className="border border-white/15 px-5 py-3 text-sm font-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#47e4d0] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#47e4d0]"
                href="/optimizer"
              >
                Open 3D optimizer
              </Link>
            </div>
          </div>

          <div className="relative min-h-[72svh] overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,17,22,0.92)_0%,rgba(6,17,22,0.3)_34%,transparent_100%)] max-lg:hidden" />
            <div className="absolute inset-x-5 top-10 bottom-20 flex items-center justify-center sm:inset-x-10 lg:inset-y-10 lg:left-0 lg:right-12">
              <ProductSurfaceVisual />
            </div>
            <div className="absolute right-5 bottom-5 left-5 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-3 lg:right-12 lg:left-0">
              <ProductProof label="Material" value="PMMA cover analog" />
              <ProductProof label="Texture" value="30% CO2 laser dot density" />
              <ProductProof label="Test" value="45 deg tilt, 10 mL water" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-16">
          <section className="grid gap-8 border-y border-white/10 py-12 lg:grid-cols-[0.55fr_1fr] lg:items-start">
            <div className="grid gap-3">
              <p className="m-0 text-[0.68rem] font-black tracking-[0.28em] text-[#47e4d0] uppercase">
                Surface behavior
              </p>
              <h2 className="m-0 max-w-[11ch] text-[clamp(2.4rem,5vw,5.3rem)] leading-[0.9] font-black text-white">
                A controlled cleaning sequence.
              </h2>
            </div>

            <div className="grid gap-8">
              <p className="m-0 max-w-[48rem] text-lg leading-8 text-[#c6d7d3]">
                The surface strategy centers on a simple insight: hydrophilic
                regions spread water and help loosen adhered particles, while
                hydrophobic microtextures help droplets move and carry loosened
                debris away. The alternating surface coordinates
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
              <p className="m-0 text-[0.68rem] font-black tracking-[0.28em] text-[#47e4d0] uppercase">
                Testing evidence
              </p>
              <h2 className="m-0 text-[clamp(2.2rem,4.6vw,5rem)] leading-[0.92] font-black text-white">
                The mixed surface left the least residue.
              </h2>
              <p className="m-0 max-w-[44rem] text-base leading-7 text-[#a7bbb8]">
                The study compared hydrophilic, hydrophobic, and alternating
                coupons under the same dust and water-cleaning conditions. The
                alternating surface reached the lowest mean residual
                contamination at 2.02%, compared with 2.57% for hydrophilic and
                2.43% for hydrophobic controls.
              </p>
              <p className="m-0 max-w-[44rem] text-base leading-7 text-[#a7bbb8]">
                Pattern density testing also shaped the product direction. Lower
                laser-dot densities kept the surface hydrophobic while preserving
                more light transmission, so 30% density was selected for later
                cleaning trials.
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
    <div className="group grid gap-1 transition-transform duration-300 hover:-translate-y-0.5">
      <span className="text-[0.68rem] font-black tracking-[0.24em] text-[#47e4d0] uppercase">
        {label}
      </span>
      <strong className="text-sm leading-5 text-white">{value}</strong>
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
      <span className="text-sm font-black text-[#f0c86b] transition-transform duration-300 group-hover:translate-x-1">
        {index}
      </span>
      <div className="grid gap-3">
        <h3 className="m-0 text-3xl leading-none font-black text-white">{title}</h3>
        <p className="m-0 max-w-[24rem] text-sm leading-6 text-[#a7bbb8]">{text}</p>
      </div>
    </article>
  );
}

function ResearchMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-white/10 pb-4 last:border-b-0">
      <span className="text-[0.68rem] font-black tracking-[0.22em] text-[#708b88] uppercase">
        {label}
      </span>
      <strong className="text-3xl leading-none font-black text-white">{value}</strong>
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
    <div className="group relative aspect-[0.78/1] h-full max-h-[720px] w-full max-w-[520px] overflow-hidden bg-[#f7fcfc] shadow-[0_40px_120px_rgba(0,0,0,0.45)] transition-transform duration-700 hover:-translate-y-2 lg:rotate-[-3deg] lg:hover:rotate-[-1deg]">
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
      <div className="absolute top-8 left-1/2 grid -translate-x-1/2 justify-items-center gap-1 text-center text-[#061116] transition-transform duration-700 group-hover:translate-y-2">
        <span className="text-[0.68rem] font-black tracking-[0.22em] uppercase">
          water path
        </span>
        <span className="flex flex-col items-center" aria-hidden="true">
          <span className="h-14 w-1 bg-[#ef3d33]" />
          <span className="-mt-px h-0 w-0 border-x-[10px] border-t-[16px] border-x-transparent border-t-[#ef3d33]" />
        </span>
      </div>
    </div>
  );
}

export function PatternLabContent() {
  return (
    <section className="min-h-[calc(100svh-72px)] bg-[#061116] px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-8">
        <div className="grid gap-5 border-b border-white/10 pb-7 lg:grid-cols-[0.58fr_0.82fr] lg:items-end">
          <div>
            <p className="m-0 mb-3 text-[0.68rem] font-black tracking-[0.28em] text-[#47e4d0] uppercase">
              Pattern lab
            </p>
            <h1 className="m-0 text-[clamp(2.7rem,4.9vw,5.3rem)] leading-[0.88] font-black text-white">
              Coating pattern options.
            </h1>
          </div>
          <p className="m-0 max-w-[43rem] text-sm leading-6 text-[#a7bbb8] lg:pb-1">
            A compact view of the surface layouts behind the coating concept:
            equal alternating bands, a smoother wettability transition, and
            square paths that separate hydrophilic wetting from hydrophobic
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
              "White hydrophilic bands spread water to wet dust and mineral residue. Baby-blue dotted hydrophobic bands create release zones that help droplets keep moving.",
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
            title="Concentric square transport paths"
            visual={<TestingVisual kind="rings" />}
            paragraphs={[
              "Square paths test whether geometry can steer dirty water outward as well as downward.",
              "The white squares are hydrophilic wetting zones. The dotted baby-blue squares are hydrophobic release paths, made more visible here so the alternating behavior is clear.",
              "This layout keeps large transparent areas while adding repeated release paths around the surface."
            ]}
          />

          <PatternStudy
            eyebrow="Flow variant"
            title="Nested release channels"
            visual={<TestingVisual kind="nested" />}
            paragraphs={[
              "This variant keeps the square geometry but increases the number of visible hydrophobic paths.",
              "Dotted baby-blue channels show where droplets should release and accelerate. Plain white zones show where water can spread before release.",
              "It gives the same concept a more directional layout for surfaces that need stronger edge-to-edge transport."
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
        <p className="m-0 text-[0.68rem] font-black tracking-[0.24em] text-[#47e4d0] uppercase">
          {eyebrow}
        </p>
        <h2 className="m-0 max-w-[58rem] text-2xl leading-[0.98] font-black text-white sm:text-4xl">
          {title}
        </h2>
      </div>
      <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
        <div className="transition-transform duration-500 hover:-translate-y-1">
          {visual}
        </div>
        <div className="grid max-w-[58rem] gap-3 text-sm leading-6 text-[#a7bbb8] xl:grid-cols-3">
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
      <div className="flex flex-wrap gap-2 text-xs font-black">
        <span className="bg-white px-2.5 py-1.5 text-[#061116]">hydrophilic</span>
        <span className="bg-[#9ee7ff] px-2.5 py-1.5 text-[#061116]">hydrophobic</span>
      </div>
    </div>
  );
}

function TestingVisual({ kind }: { kind: "gradient" | "rings" | "nested" }) {
  const ringClasses = [
    { className: "h-[88%] w-[88%]", hydrophobic: true },
    { className: "h-[66%] w-[66%]", hydrophobic: false },
    { className: "h-[44%] w-[44%]", hydrophobic: true },
    { className: "h-[22%] w-[22%]", hydrophobic: false }
  ];
  const nestedClasses = [
    { className: "h-[92%] w-[92%]", hydrophobic: false },
    { className: "h-[78%] w-[78%]", hydrophobic: true },
    { className: "h-[62%] w-[62%]", hydrophobic: false },
    { className: "h-[48%] w-[48%]", hydrophobic: true },
    { className: "h-[32%] w-[32%]", hydrophobic: false },
    { className: "h-[18%] w-[18%]", hydrophobic: true }
  ];

  return (
    <div
      className={cx(
        "relative aspect-[1.35/1] w-full max-w-[300px] overflow-hidden border border-white/15",
        kind === "gradient" &&
          "bg-[linear-gradient(180deg,#ffffff_0_26%,#effcff_44%,#9ee7ff_100%)]",
        kind === "rings" &&
          "grid place-items-center bg-[#ffffff]",
        kind === "nested" && "grid place-items-center bg-[#ffffff]"
      )}
    >
      {kind === "rings" &&
        ringClasses.map((ring) => (
          <span
            className={cx(
              "absolute",
              ring.className,
              ring.hydrophobic
                ? "border-[14px] border-[#9ee7ff] bg-[radial-gradient(circle,rgba(0,65,92,0.42)_0_1.15px,transparent_1.85px)] [background-size:8px_8px]"
                : "border-[14px] border-white bg-white shadow-[inset_0_0_0_1px_rgba(6,17,22,0.08)]"
            )}
            key={ring.className}
          />
        ))}
      {kind === "nested" &&
        nestedClasses.map((ring) => (
          <span
            className={cx(
              "absolute",
              ring.className,
              ring.hydrophobic
                ? "border-[10px] border-[#9ee7ff] bg-[radial-gradient(circle,rgba(0,65,92,0.45)_0_1.1px,transparent_1.8px)] [background-size:7px_7px]"
                : "border-[10px] border-white bg-white shadow-[inset_0_0_0_1px_rgba(6,17,22,0.08)]"
            )}
            key={ring.className}
          />
        ))}
    </div>
  );
}
