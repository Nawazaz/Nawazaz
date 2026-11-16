#!/usr/bin/env node
/**
 * Renders GitHub stats panels as SVGs in the profile kit's style.
 * No third-party service — talks to the GitHub GraphQL API directly.
 *
 *   GITHUB_TOKEN=xxx GH_LOGIN=Nawazaz node scripts/gh-stats.mjs
 *   node scripts/gh-stats.mjs --mock      # render with fake data, for layout checks
 */
import { writeFileSync, mkdirSync } from "node:fs";

const FONT = "ui-monospace,'JetBrains Mono','SF Mono','Fira Code','DejaVu Sans Mono',Consolas,monospace";
const BG = "#0b0f14", PANEL = "#10161e", LINE = "#1f2a37";
const CY = "#22e8ff", VI = "#8b5cff", TX = "#e9f1f7", MU = "#8b9bb0", DM = "#55657a";

const LANG_COLORS = {
  Python: "#3572A5", Jupyter: "#DA5B0B", "Jupyter Notebook": "#DA5B0B", Java: "#b07219",
  "C++": "#f34b7d", C: "#555555", Kotlin: "#A97BFF", JavaScript: "#f1e05a",
  TypeScript: "#3178c6", HTML: "#e34c26", CSS: "#563d7c", Shell: "#89e051",
  Dockerfile: "#384d54", "C#": "#178600", Go: "#00ADD8", Rust: "#dea584",
  Ruby: "#701516", PHP: "#4F5D95", Swift: "#F05138", Dart: "#00B4AB",
  SCSS: "#c6538c", Makefile: "#427819", CMake: "#DA3434", Vue: "#41b883",
};
const FALLBACK = [CY, VI, "#3ddc84", "#ff4d9d", "#ffb340", "#5fa8ff", "#ff7a59", "#7ee8c0"];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]));
const n = (v) => Number(v || 0).toLocaleString("en-US");

const T = (x, y, s, size, fill, w = 400, ls = 0, anchor = "start") =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${w}" ` +
  `letter-spacing="${ls}" text-anchor="${anchor}">${esc(s)}</text>`;

const head = (W, H, label, extra = "") =>
  `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" ` +
  `role="img" aria-label="${esc(label)}"><defs>` +
  `<linearGradient id="acc" x1="0" y1="0" x2="1" y2="0">` +
  `<stop offset="0" stop-color="${CY}"/><stop offset="1" stop-color="${VI}"/></linearGradient>` +
  `<pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">` +
  `<path d="M32 0H0V32" fill="none" stroke="#121a24" stroke-width="1"/></pattern>${extra}</defs>` +
  `<style>.t{font-family:${FONT}}@media (prefers-reduced-motion:reduce){*{animation:none!important}}` +
  `@keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}</style><g class="t">` +
  `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="14" fill="${BG}" stroke="${LINE}"/>` +
  `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="14" fill="url(#grid)"/>`;

const stamp = () => new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC";

// ---------------------------------------------------------------- stats panel
function renderStats(d) {
  const W = 1200, H = 200;
  const tiles = [
    [n(d.commits), "COMMITS", "last 12 months"],
    [n(d.stars), "STARS EARNED", "across repos"],
    [n(d.repos), "PUBLIC REPOS", "sources, no forks"],
    [n(d.followers), "FOLLOWERS", "on GitHub"],
    [n(d.prs), "PULL REQUESTS", "opened"],
    [n(d.issues), "ISSUES", "opened"],
  ];
  let s = head(W, H, `GitHub stats for ${d.login}: ${tiles.map(t => `${t[0]} ${t[1].toLowerCase()}`).join(", ")}`);
  s += T(40, 42, "// GITHUB TELEMETRY", 12, DM, 600, 3);
  s += T(1160, 42, `SYNCED ${stamp()}`, 10.5, DM, 400, 1, "end");
  tiles.forEach(([val, lab, sub], i) => {
    const x = 40 + i * 187;
    s += `<rect x="${x}" y="62" width="177" height="108" rx="10" fill="${PANEL}" stroke="${LINE}"/>`;
    s += T(x + 88.5, 116, val, 30, "url(#acc)", 700, 1, "middle");
    s += T(x + 88.5, 140, lab, 10, MU, 600, 2, "middle");
    s += T(x + 88.5, 157, sub, 9.5, DM, 400, 0, "middle");
  });
  return s + "</g></svg>";
}

// ---------------------------------------------------------------- language panel
function renderLangs(d) {
  const W = 1200;
  const langs = d.langs.slice(0, 8);
  const total = langs.reduce((a, l) => a + l.size, 0) || 1;
  const rows = Math.ceil(langs.length / 4);
  const H = 128 + rows * 34 + 18;
  const colorOf = (l, i) => l.color || LANG_COLORS[l.name] || FALLBACK[i % FALLBACK.length];

  let s = head(W, H, `Most used languages for ${d.login}: ` +
    langs.map(l => `${l.name} ${(l.size / total * 100).toFixed(1)}%`).join(", "),
    `<clipPath id="barclip"><rect x="40" y="66" width="1120" height="22" rx="11"/></clipPath>`);
  s += T(40, 42, "// LANGUAGE DISTRIBUTION", 12, DM, 600, 3);
  s += T(1160, 42, `TOP ${langs.length} · BY BYTES`, 10.5, DM, 400, 1, "end");

  s += `<g clip-path="url(#barclip)"><rect x="40" y="66" width="1120" height="22" fill="#121a24"/>`;
  let x = 40;
  langs.forEach((l, i) => {
    const w = (l.size / total) * 1120;
    s += `<rect x="${x.toFixed(1)}" y="66" width="${Math.max(w, 0).toFixed(1)}" height="22" fill="${colorOf(l, i)}"/>`;
    x += w;
  });
  s += `</g><rect x="40" y="66" width="1120" height="22" rx="11" fill="none" stroke="${LINE}"/>`;

  langs.forEach((l, i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const lx = 40 + col * 280, ly = 128 + row * 34;
    const pct = (l.size / total * 100).toFixed(1);
    s += `<circle cx="${lx + 6}" cy="${ly - 4}" r="6" fill="${colorOf(l, i)}"/>`;
    s += T(lx + 22, ly, l.name, 13.5, TX, 500);
    s += T(lx + 250, ly, `${pct}%`, 12.5, MU, 600, 1, "end");
  });
  return s + "</g></svg>";
}

// ---------------------------------------------------------------- data
const QUERY = `query($login:String!){
  user(login:$login){
    followers{totalCount}
    pullRequests{totalCount}
    issues{totalCount}
    contributionsCollection{totalCommitContributions restrictedContributionsCount}
    repositories(first:100,ownerAffiliations:OWNER,isFork:false,privacy:PUBLIC){
      totalCount
      nodes{
        stargazerCount
        languages(first:12,orderBy:{field:SIZE,direction:DESC}){
          edges{size node{name color}}
        }
      }
    }
  }
}`;

async function fetchData(login, token) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: QUERY, variables: { login } }),
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = await res.json();
  if (json.errors) throw new Error("GraphQL: " + JSON.stringify(json.errors).slice(0, 300));
  const u = json.data?.user;
  if (!u) throw new Error(`No such user: ${login}`);

  const byLang = new Map();
  let stars = 0;
  for (const r of u.repositories.nodes) {
    stars += r.stargazerCount;
    for (const { size, node } of r.languages.edges) {
      const cur = byLang.get(node.name) || { name: node.name, color: node.color, size: 0 };
      cur.size += size;
      byLang.set(node.name, cur);
    }
  }
  const c = u.contributionsCollection;
  return {
    login, stars,
    repos: u.repositories.totalCount,
    followers: u.followers.totalCount,
    prs: u.pullRequests.totalCount,
    issues: u.issues.totalCount,
    commits: c.totalCommitContributions + c.restrictedContributionsCount,
    langs: [...byLang.values()].sort((a, b) => b.size - a.size),
  };
}

const MOCK = {
  login: "Nawazaz", commits: 123, stars: 4, repos: 7, followers: 2, prs: 11, issues: 3,
  langs: [
    { name: "Python", size: 820000 }, { name: "Jupyter Notebook", size: 310000 },
    { name: "Java", size: 148000 }, { name: "Kotlin", size: 96000 },
    { name: "C++", size: 61000 }, { name: "HTML", size: 42000 },
    { name: "CSS", size: 21000 }, { name: "JavaScript", size: 15000 },
  ],
};

const mock = process.argv.includes("--mock");
const login = process.env.GH_LOGIN || "Nawazaz";
const token = process.env.GITHUB_TOKEN;
if (!mock && !token) {
  console.error("GITHUB_TOKEN is not set. Run with --mock to render sample data instead.");
  process.exit(1);
}

const data = mock ? MOCK : await fetchData(login, token);
mkdirSync("assets", { recursive: true });
writeFileSync("assets/gh-stats.svg", renderStats(data));
writeFileSync("assets/gh-langs.svg", renderLangs(data));
console.log(`Rendered assets/gh-stats.svg and assets/gh-langs.svg for ${data.login}` +
  `${mock ? " (mock data)" : ""} — ${data.langs.length} languages.`);
