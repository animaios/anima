# Knip Cleanup Extended (Phase 2) — Tasks

## D1: Remove 12 Orphaned Catalog Entries

- [x] **T1.1** Edit [`pnpm-workspace.yaml`](pnpm-workspace.yaml) — remove `'@electron/notarize': ^3.1.1`
- [x] **T1.2** Edit [`pnpm-workspace.yaml`](pnpm-workspace.yaml) — remove `'@proj-airi/iconify-meteocons': ^0.1.5`
- [x] **T1.3** Edit [`pnpm-workspace.yaml`](pnpm-workspace.yaml) — remove `'@proj-airi/unplugin-fetch': ^0.2.3`
- [x] **T1.4** Edit [`pnpm-workspace.yaml`](pnpm-workspace.yaml) — remove `'@shopify/draggable': ^1.2.1`
- [x] **T1.5** Edit [`pnpm-workspace.yaml`](pnpm-workspace.yaml) — remove `'@types/d3': ^7.4.3`
- [x] **T1.6** Edit [`pnpm-workspace.yaml`](pnpm-workspace.yaml) — remove `'@types/whatwg-mimetype': ^5.0.0`
- [x] **T1.7** Edit [`pnpm-workspace.yaml`](pnpm-workspace.yaml) — remove `'@xsai/embed': 0.5.0-beta.2`
- [x] **T1.8** Edit [`pnpm-workspace.yaml`](pnpm-workspace.yaml) — remove `d3: 7.9.0`
- [x] **T1.9** Edit [`pnpm-workspace.yaml`](pnpm-workspace.yaml) — remove `drizzle-orm: ^0.45.2`
- [x] **T1.10** Edit [`pnpm-workspace.yaml`](pnpm-workspace.yaml) — remove `hono: 4.11.3`
- [x] **T1.11** Edit [`pnpm-workspace.yaml`](pnpm-workspace.yaml) — remove `oxc-minify: ^0.126.0`
- [x] **T1.12** Edit [`pnpm-workspace.yaml`](pnpm-workspace.yaml) — remove `vite-plugin-mkcert: ^2.0.0`

---

## D2: Remove Unused Barrel Re-Exports

### D2.1: Remove `getDesktopOverlayReadinessContract` from contracts barrel

- [x] **T2.1** Search for external imports of `DesktopOverlayReadiness` type — type IS used by `index.electron.ts`, kept
- [x] **T2.2** Remove `export { getDesktopOverlayReadinessContract }` from [`contracts.ts`](apps/stage-tamagotchi/src/main/windows/desktop-overlay/rpc/contracts.ts:2)
- [x] **T2.3** `DesktopOverlayReadiness` type has external consumers — kept the type export

### D2.2: Remove unused component barrel exports from stage-ui-three

- [x] **T2.4** Check [`packages/stage-ui-three/src/index.ts`](packages/stage-ui-three/src/index.ts) — no re-exports from component barrels found
- [x] **T2.5** No re-exports to remove from main index
- [x] **T2.6-T2.8** Initially deleted, then **restored** — `ThreeScene.vue` imports `OrbitControls`, `SkyBox`, `VRMModel` from these barrels

### D2.3: Internalize `loadManifestsFrom` in plugin host registry

- [x] **T2.9** Search for external imports of `loadManifestsFrom` — none found
- [x] **T2.10** Remove `export` keyword from [`loadManifestsFrom`](apps/stage-tamagotchi/src/main/services/airi/plugins/host/registry.ts:58)

### D2.4: Clean weather barrel re-exports

- [x] **T2.11** Search for external imports from `weather.ts` barrel — none found
- [x] **T2.12** Remove re-export line from [`weather.ts`](apps/stage-tamagotchi/src/renderer/stores/tools/builtin/weather.ts:10)
- [x] **T2.13** `fetchWeather` still available via existing `import { fetchWeather } from './weather-api'` at line 6

---

## D3: Remove Confirmed Unused Dependencies

### D3.1: packages/stage-ui-three

- [x] **T3.1** Remove `@proj-airi/stage-shared` and `@tresjs/cientos` from `stage-ui-three/package.json`
- [x] **T3.2** Run `pnpm install --ignore-scripts` after removal
- [x] **T3.3** Run `pnpm -F @proj-airi/stage-ui-three typecheck` — pre-existing errors only, none new

### D3.2: packages/ui

- [x] **T3.4** Remove `floating-vue` from `ui/package.json`
- [x] **T3.5** Run `pnpm install` after removal
- [x] **T3.6** Run `pnpm -F @proj-airi/ui typecheck` — passes cleanly

### D3.3: packages/ui-transitions

- [x] **T3.7** Check `@vueuse/motion` peer dependency — `@vueuse/core` is a **hard dependency** of `@vueuse/motion`
- [x] **T3.8-T3.9** Skipped — `@vueuse/core` must remain
- [x] **T3.11** Run `pnpm -F @proj-airi/ui-transitions typecheck` — passes cleanly

---

## Final Verification

- [x] **T4.1** Run `pnpm install --ignore-scripts` — lockfile updated
- [x] **T4.2** Run `pnpm -F @proj-airi/stage-tamagotchi typecheck` — pre-existing errors only
- [x] **T4.3** Run `pnpm -F @proj-airi/stage-ui typecheck` — pre-existing errors only
- [x] **T4.4** Run `pnpm -F @proj-airi/stage-ui-three typecheck` — pre-existing errors only
- [x] **T4.5** Run `pnpm -F @proj-airi/ui typecheck` — passes cleanly
- [x] **T4.6** Run `pnpm knip` — **46→43 unused deps, 12→7 unused exports**, 0 config warnings
- [x] **T4.7** Run `pnpm lint` — pre-existing ESLint v9 config issue, 0 errors from our changes
