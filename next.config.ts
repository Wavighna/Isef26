import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repositoryName =
  process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "Isef26";
const githubPagesBasePath = isGithubPages ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  ...(isGithubPages
    ? {
        assetPrefix: `${githubPagesBasePath}/`,
        basePath: githubPagesBasePath,
        images: {
          unoptimized: true
        },
        output: "export" as const,
        trailingSlash: true
      }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: githubPagesBasePath
  },
  turbopack: {
    root: process.cwd()
  }
};

export default nextConfig;
