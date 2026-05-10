"use client";

import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { OptimizerLoadingShell } from "../_components/optimizer-loading-shell";

export function OptimizerRoute() {
  const [OptimizerPage, setOptimizerPage] = useState<ComponentType | null>(null);

  useEffect(() => {
    let isMounted = true;

    void import("../page").then((module) => {
      if (isMounted) setOptimizerPage(() => module.default);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!OptimizerPage) return <OptimizerLoadingShell />;

  return <OptimizerPage />;
}
