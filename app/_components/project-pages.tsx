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
                The poster evidence centers on a simple insight: hydrophilic
                surfaces spread water and help loosen adhered particles, while
                hydrophobic lotus-inspired microtextures help droplets move and
                carry loosened debris away. The alternating surface coordinates
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
    <div className="group relative aspect-[0.78/1] h-full max-h-[720px] w-full max-w-[520px] overflow-hidden bg-[#dcefeb] shadow-[0_40px_120px_rgba(0,0,0,0.45)] transition-transform duration-700 hover:-translate-y-2 lg:rotate-[-3deg] lg:hover:rotate-[-1deg]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.62)_0%,rgba(216,245,241,0.36)_44%,rgba(15,42,45,0.18)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.34)_42%,transparent_62%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      {Array.from({ length: 15 }).map((_, index) => (
        <span
          className={cx(
            "absolute inset-x-0 h-[6.7%] transition-transform duration-500",
            topClasses[index],
            index % 2 === 0
              ? "bg-[linear-gradient(180deg,#f5fffd,#b6eee7)]"
              : "bg-[radial-gradient(circle,rgba(255,255,255,0.78)_0_1.2px,transparent_2px),linear-gradient(180deg,#f4be62,#d08a30)] [background-size:9px_9px,auto]"
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
    <section className="min-h-[calc(100svh-72px)] bg-[#061116] px-5 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-14">
        <div className="grid gap-5 border-b border-white/10 pb-10 lg:grid-cols-[0.78fr_1fr] lg:items-end">
          <div>
            <p className="m-0 mb-3 text-[0.68rem] font-black tracking-[0.28em] text-[#47e4d0] uppercase">
              Pattern lab
            </p>
            <h1 className="m-0 text-[clamp(3rem,7vw,7rem)] leading-[0.86] font-black text-white">
              Patterns from the experiment.
            </h1>
          </div>
          <p className="m-0 max-w-[44rem] text-base leading-7 text-[#a7bbb8]">
            The poster tested three surfaces: fully hydrophilic PMMA, fully
            hydrophobic laser-textured PMMA, and an alternating surface aligned
            with droplet flow. The pattern lab turns those designs and future
            directions into readable study notes.
          </p>
        </div>

        <div className="grid gap-12">
          <PatternStudy
            eyebrow="Tested surface"
            title="Alternating hydrophilic and hydrophobic bands"
            visual={<MiniStripeSurface />}
            paragraphs={[
              "This is the core tested design. Hydrophilic regions remain unmodified PMMA, while hydrophobic regions are created with CO2 laser surface patterning inspired by lotus-leaf microtexture.",
              "The pattern follows droplet flow: water first spreads across hydrophilic PMMA to loosen particulate soiling, then crosses hydrophobic release regions that help droplets move debris down the coupon.",
              "In cleaning trials, this alternating surface reached the lowest mean residual contamination at 2.02%, outperforming both the hydrophilic and hydrophobic controls under identical conditions."
            ]}
          />

          <PatternStudy
            eyebrow="Density decision"
            title="30% laser-dot hydrophobic density"
            visual={<TestingVisual kind="gradient" />}
            paragraphs={[
              "Pattern density was screened from 30% to 90% to identify surfaces that became hydrophobic while still allowing light through the PMMA.",
              "Lower densities performed better overall. The 30% density kept strong water-repellent behavior and produced the highest light transmission among the hydrophobic densities tested.",
              "This matters because any cleaning benefit has to be balanced against optical loss. A surface that sheds dust but blocks too much light would not help a PV panel."
            ]}
          />

          <PatternStudy
            eyebrow="Future direction"
            title="Continuous wettability gradient"
            visual={<TestingVisual kind="gradient" />}
            paragraphs={[
              "The poster proposes a gradient that transitions from hydrophilic at the top toward more hydrophobic behavior lower on the surface.",
              "The reason is droplet pinning. A sudden wetting transition can slow or trap droplets, while a gradual transition may keep water moving in the intended direction.",
              "This version should be tested against the alternating bands to see whether smoother wetting changes improve directional dust transport without sacrificing transparency."
            ]}
          />

          <PatternStudy
            eyebrow="Future geometry"
            title="Concentric square transport paths"
            visual={<TestingVisual kind="rings" />}
            paragraphs={[
              "The square-ring concept explores whether geometry can direct loosened dust outward instead of only downward.",
              "Like the alternating pattern, the design still depends on combining hydrophilic wetting with hydrophobic droplet mobility. The difference is that the wetting transitions are organized around repeated perimeters.",
              "This pattern is a useful comparison for future microtexture studies because it tests directional transport while keeping large transparent regions available for light transmission."
            ]}
          />

          <PatternStudy
            eyebrow="Next test"
            title="Long-term energy output"
            visual={<TestingVisual kind="asymmetric" />}
            paragraphs={[
              "The current study measured cleaning performance through residual contamination, not long-term electrical output.",
              "A future test would repeat dust deposition and water-cleaning cycles on real or instrumented PV panels, then measure voltage, current, and power after each cycle.",
              "That would show whether the lower residue from the alternating surface is large enough to maintain higher light transmission and improve energy production over time."
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
    <article className="grid gap-6 border-b border-white/10 pb-12 last:border-b-0">
      <div className="grid gap-2">
        <p className="m-0 text-[0.68rem] font-black tracking-[0.24em] text-[#47e4d0] uppercase">
          {eyebrow}
        </p>
        <h2 className="m-0 max-w-[60rem] text-3xl leading-none font-black text-white sm:text-5xl">
          {title}
        </h2>
      </div>
      <div className="grid gap-7 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
        <div className="transition-transform duration-500 hover:-translate-y-1">
          {visual}
        </div>
        <div className="grid max-w-[54rem] gap-4 text-base leading-7 text-[#a7bbb8]">
          {paragraphs.map((paragraph) => (
            <p className="m-0" key={paragraph}>
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
      className="grid w-full max-w-[360px] gap-3"
      role="img"
    >
      <div className="h-[260px] overflow-hidden border border-white/15 bg-white/5">
        <div className="flex h-full flex-col">
          {Array.from({ length: 12 }).map((_, index) => (
            <span
              className={cx(
                "min-h-2",
                index % 2 === 0
                  ? "flex-[1.2] bg-[linear-gradient(180deg,#f6fffd,#aeece4)]"
                  : "flex-[0.76] bg-[radial-gradient(circle,rgba(255,255,255,0.72)_0_1.2px,transparent_1.9px),linear-gradient(180deg,#f4be62,#d08a30)] [background-size:8px_8px,auto]"
              )}
              key={index}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 text-xs font-black">
        <span className="bg-[#aeece4] px-2.5 py-1.5 text-[#061116]">hydrophilic PMMA</span>
        <span className="bg-[#d08a30] px-2.5 py-1.5 text-[#061116]">laser texture</span>
      </div>
    </div>
  );
}

function TestingVisual({ kind }: { kind: "gradient" | "rings" | "asymmetric" }) {
  const ringClasses = [
    "h-[82%] w-[82%]",
    "h-[60%] w-[60%]",
    "h-[38%] w-[38%]",
    "h-[18%] w-[18%]"
  ];

  return (
    <div
      className={cx(
        "relative aspect-[1.35/1] w-full max-w-[360px] overflow-hidden border border-white/15",
        kind === "gradient" &&
          "bg-[linear-gradient(180deg,#f6fffd_0_24%,#aeece4_48%,#d08a30_100%)]",
        kind === "rings" &&
          "grid place-items-center bg-[radial-gradient(circle,rgba(255,255,255,0.22)_0_1px,transparent_2px),#1a2a2d] [background-size:8px_8px]",
        kind === "asymmetric" && "flex flex-col"
      )}
    >
      {kind === "rings" &&
        ringClasses.map((className) => (
          <span
            className={cx("absolute border-[10px] border-[#aeece4]/70", className)}
            key={className}
          />
        ))}
      {kind === "asymmetric" &&
        Array.from({ length: 9 }).map((_, index) => (
          <span
            className={index % 2 === 0 ? "flex-[1.8] bg-[#aeece4]" : "flex-[0.62] bg-[#d08a30]"}
            key={index}
          />
        ))}
    </div>
  );
}
