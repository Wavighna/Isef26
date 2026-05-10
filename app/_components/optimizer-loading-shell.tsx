import Link from "next/link";

const pages = [
  { id: "product", label: "Product", href: "/product" },
  { id: "patterns", label: "Pattern Lab", href: "/pattern-lab" },
  { id: "optimizer", label: "3D Optimizer", href: "/optimizer" }
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function OptimizerGlobeLoading() {
  return (
    <div className="relative h-full min-h-[66svh] overflow-hidden bg-[#061116] lg:min-h-[calc(100svh-72px)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(71,228,208,0.18),transparent_32%),linear-gradient(180deg,#08191e_0%,#061116_58%,#041014_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="grid place-items-center gap-4">
          <span className="h-14 w-14 rounded-full border-2 border-[#47e4d0]/20 border-t-[#47e4d0] animate-spin" />
          <span className="text-[0.68rem] font-black tracking-[0.22em] text-[#47e4d0] uppercase">
            Loading globe
          </span>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(0deg,#061116_0%,rgba(6,17,22,0.82)_32%,transparent_100%)]" />
    </div>
  );
}

export function OptimizerLoadingShell() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#061116] text-[#e9fbf7] lg:h-screen lg:overflow-hidden">
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
            {pages.map((page) => (
              <Link
                aria-current={page.id === "optimizer" ? "page" : undefined}
                className={cx(
                  "cursor-pointer px-3.5 py-2 text-xs font-black tracking-normal whitespace-nowrap text-[#9fb8b5] transition-all duration-300 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#47e4d0]",
                  page.id === "optimizer" &&
                    "bg-white text-[#061116] shadow-[0_0_30px_rgba(71,228,208,0.18)]"
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

      <section className="relative isolate min-h-[calc(100svh-72px)] overflow-hidden bg-[linear-gradient(180deg,#08191e_0%,#061116_46%,#041014_100%)] lg:h-[calc(100svh-72px)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
        <div className="relative grid min-h-[calc(100svh-72px)] grid-cols-1 lg:h-[calc(100svh-72px)] lg:grid-cols-[320px_minmax(0,1fr)]">
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
                Hover pauses the globe. Click a country or U.S. state to tune the surface.
              </p>

              <div className="grid gap-2">
                <span className="text-[0.68rem] font-black tracking-[0.22em] text-[#708b88] uppercase">
                  Oceans and seas
                </span>
                <div className="border border-white/10 bg-[#07161b] px-3 py-3 text-sm font-bold text-[#708b88]">
                  Choose ocean or sea
                </div>
              </div>

              <div className="grid gap-3 border-y border-white/10 py-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[0.68rem] font-black tracking-[0.22em] text-[#708b88] uppercase">
                    Hover target
                  </span>
                </div>
                <strong className="text-lg leading-tight text-white">World view</strong>
              </div>
            </div>
          </aside>

          <div className="relative order-1 min-h-[66svh] lg:order-2 lg:min-h-0">
            <OptimizerGlobeLoading />
          </div>
        </div>
      </section>
    </main>
  );
}
