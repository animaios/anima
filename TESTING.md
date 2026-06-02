# AIRI Card System — Comprehensive Manual Test Plan

## Prerequisites

- Running instance of the app (web or Electron)
- Navigate to Settings → AIRI Cards
- Have test files ready: a valid AIRI JSON card export, a SillyTavern chara_card_v2 PNG

---

## 1. Card Browser (index.vue)

### 1.1 Empty State

- [ ] With no cards, verify "no cards" fallback message shows
- [ ] Verify "Create New Card" tile is visible and clickable

### 1.2 Card Grid

- [ ] Verify cards display in responsive masonry grid
- [ ] Verify each card shows: avatar image, name overlay, active badge (if active)
- [ ] Hover over a card — verify 3D flip shows back side with description, version, consciousness model, voice model

### 1.3 Search & Sort

- [ ] Type in search bar — verify cards filter by name and description (case-insensitive)
- [ ] Clear search — verify all cards reappear
- [ ] Change sort option (nameAsc, nameDesc, recent) — verify card order updates
- [ ] Search with no matches — verify "no results" alert shows

### 1.4 Import File Upload

- [ ] Click import zone — verify file picker opens, accepts .json and .png
- [ ] Drag and drop a .png file — verify drag state shows "Drop Here"
- [ ] Import a valid AIRI JSON — verify import progress overlay appears, then CardImportWizard opens
- [ ] Import a valid SillyTavern PNG — verify same flow
- [ ] Import an invalid file — verify error toast appears

---

## 2. Card Creation Dialog (CardCreationDialog.vue)

### 2.1 Create Mode

- [ ] Click "Create New Card" — verify dialog opens with all 8 tabs
- [ ] Verify tabs: Identity, Behavior, Generation, Acting, Modules, Artistry, Outfits, Proactivity
- [ ] Verify all fields initialize with defaults (not empty/undefined)

### 2.2 Identity Tab

- [ ] Enter name — verify it auto-converts to kebab-case
- [ ] Leave name blank, click Save — verify validation error
- [ ] Enter invalid version (not semver) — verify validation error
- [ ] Enter valid data in all fields — verify no errors

### 2.3 Behavior Tab

- [ ] Enter personality, scenario — verify text saves
- [ ] Add multiple greetings — verify list grows
- [ ] Remove a greeting — verify it disappears

### 2.4 Generation Tab

- [ ] Toggle "Enabled" — verify provider/model fields appear
- [ ] Enter invalid JSON in Advanced — verify validation error on save
- [ ] Enter valid JSON — verify no error
- [ ] Adjust maxTokens, temperature, topP, contextWidth — verify values persist

### 2.5 Acting Tab

- [ ] Enter model expression prompt, speech expression prompt, speech mannerism prompt
- [ ] If VRM/Live2D model selected in Modules tab, verify expression options appear
- [ ] Click expression tag insertion — verify tag inserts into correct prompt field
- [ ] Select idle animations — verify selection persists

### 2.6 Modules Tab

- [ ] Select consciousness provider/model — verify selection persists
- [ ] Select speech provider/model/voice — verify selection persists
- [ ] Adjust speech pitch (0.5-2.0), rate (0.5-2.0) — verify values persist
- [ ] Enter speech language — verify it persists
- [ ] Enter SSML markup — verify it persists
- [ ] Select display model — verify selection persists
- [ ] Select active background — verify selection persists

### 2.7 Artistry Tab

- [ ] Select artistry provider/model — verify selection persists
- [ ] Toggle autonomous artistry — verify threshold/target/monitor fields appear
- [ ] Enter invalid JSON in Config — verify validation error
- [ ] Enter valid JSON — verify no error

### 2.8 Outfits Tab

- [ ] Verify at least one default outfit exists
- [ ] Click "Add Outfit" — verify new outfit appears in list
- [ ] Select an outfit — verify form populates with outfit data (name, type, expressions, background)
- [ ] Edit outfit name — verify change reflects in list
- [ ] Change outfit type (base/overlay) — verify change persists
- [ ] Add expression to outfit — verify expression input appears
- [ ] Remove expression — verify it disappears
- [ ] Click Save — verify outfit data persists
- [ ] Delete outfit (when >1 exists) — verify it disappears
- [ ] Try to delete last outfit — verify delete button is hidden/disabled

### 2.9 Proactivity Tab

- [ ] Toggle heartbeats enabled — verify interval, schedule, respect schedule fields appear
- [ ] Adjust heartbeat interval (1-1440 min) — verify value persists
- [ ] Set schedule start/end times — verify values persist
- [ ] Toggle "Require Keyboard/Mouse Inactivity" — verify checkbox works
- [ ] Toggle dream state — verify strict AFK gating field appears
- [ ] Toggle grounding — verify checkbox works
- [ ] Toggle short-term memory — verify max entries, retention minutes, importance threshold fields appear
- [ ] Adjust short-term memory fields — verify values persist (max 1-1000, retention 1-10080, threshold 0-1)
- [ ] Verify all proactivity inputs use @proj-airi/ui form primitives (not raw HTML inputs)

### 2.10 Save & Validation

- [ ] Click Save with all required fields filled — verify card appears in grid
- [ ] Click Save with missing required field — verify inline error message
- [ ] Click Cancel/close — verify dialog closes without saving

---

## 3. Card Detail Dialog (CardDetailDialog.vue)

### 3.1 Opening Detail View

- [ ] Click on a card — verify detail dialog opens
- [ ] Verify tabs: Identity, Behavior, Generation, Acting, Modules, Artistry, Outfits, Proactivity, Gallery

### 3.2 Read-Only Display

- [ ] Identity tab — verify name, nickname, description, notes, system prompt, version display correctly
- [ ] Behavior tab — verify personality, scenario, greetings display with tag highlighting
- [ ] Generation tab — verify provider, model, maxTokens, temperature, topP, contextWidth, reasoningFallback, compaction, advanced JSON display
- [ ] Acting tab — verify model expression prompt, speech expression prompt, speech mannerism prompt, idle animations display
- [ ] Modules tab — verify consciousness, speech, display model, background display
- [ ] Artistry tab — verify provider, model, autonomous settings, config display
- [ ] Outfits tab — verify outfit cards with expressions and background info display
- [ ] Proactivity tab — verify heartbeats config, dream state config, grounding, short-term memory display
- [ ] Gallery tab — verify pinned background selector, image grid, Set as BG / Download / Delete buttons, Refresh button

### 3.3 Actions

- [ ] Click "Activate" — verify card becomes active (badge on card, button disabled)
- [ ] Click "Close" — verify dialog closes

---

## 4. Card Import Wizard (CardImportWizard.vue)

### 4.1 Step 1 — Identity & Prompts

- [ ] Verify name field is required
- [ ] Leave name blank, click Next — verify validation error
- [ ] Enter name — verify Next becomes enabled
- [ ] If imported card has `{{user}}` in content, verify "Your Name" field appears and is required
- [ ] Verify greetings and personality show as read-only previews

### 4.2 Step 2 — Visual Avatar

- [ ] Verify display model grid shows available models with preview images
- [ ] Verify format badges ([VRM], [Live2D], [Spine], [MMD]) display
- [ ] Select a display model — verify selection highlights

### 4.3 Step 3 — Core Modules

- [ ] Verify consciousness provider dropdown populates
- [ ] Select consciousness provider — verify model dropdown populates
- [ ] Verify speech provider dropdown populates
- [ ] Select speech provider — verify model and voice dropdowns populate

### 4.4 Step 4 — Quick Toggles

- [ ] Verify Dream State toggle defaults to ON
- [ ] Verify Autonomous Artistry toggle defaults to OFF
- [ ] Verify Active Proactivity toggle defaults to OFF
- [ ] Toggle each — verify state changes

### 4.5 Navigation

- [ ] Click Back on steps 2-4 — verify returns to previous step
- [ ] Click Next on steps 1-3 — verify advances
- [ ] Click "Complete Setup" — verify card is created and appears in grid
- [ ] Verify imported card name is unique (adds suffix if duplicate)

---

## 5. Card List Item Actions (CardListItem.vue)

### 5.1 Export JSON

- [ ] Click Export → JSON — verify JSON file downloads
- [ ] Open downloaded JSON — verify it contains all card data including extensions

### 5.2 Export PNG

- [ ] Click Export → PNG — verify PNG file downloads
- [ ] Open downloaded PNG in SillyTavern or PNG chunk viewer — verify chara_card_v2 data is embedded

### 5.3 Activate

- [ ] Click Activate on inactive card — verify card becomes active
- [ ] Verify active badge appears on card
- [ ] Verify Activate button is disabled for already-active card

### 5.4 Edit

- [ ] Click Edit — verify CardCreationDialog opens in edit mode with all fields populated
- [ ] Modify a field, save — verify change reflects in card list

### 5.5 Delete

- [ ] Click Delete — verify confirmation dialog appears
- [ ] Confirm delete — verify card disappears from grid
- [ ] Cancel delete — verify card remains
- [ ] Verify default card (id 'default') has no delete button

### 5.6 Duplicate

- [ ] Click Duplicate (if available) — verify new card appears with " (copy)" suffix
- [ ] Open duplicated card — verify all fields match original

---

## 6. Import/Export Round-Trip

### 6.1 JSON Round-Trip

- [ ] Create a card with all fields filled across all tabs
- [ ] Export as JSON
- [ ] Delete the original card
- [ ] Import the exported JSON via file upload
- [ ] Verify CardImportWizard opens
- [ ] Complete the wizard
- [ ] Open the imported card in detail view — verify all fields match original

### 6.2 PNG Round-Trip

- [ ] Create a card with all fields filled
- [ ] Export as PNG
- [ ] Delete the original card
- [ ] Import the exported PNG via file upload
- [ ] Verify CardImportWizard opens
- [ ] Complete the wizard
- [ ] Open the imported card — verify key fields (name, description, personality, scenario) match

### 6.3 SillyTavern Compatibility

- [ ] Export a card as PNG
- [ ] Import the PNG into SillyTavern — verify it loads without errors
- [ ] Verify character data (name, description, personality, scenario, greetings) displays correctly in SillyTavern

---

## 7. Store Persistence

### 7.1 localStorage Persistence

- [ ] Create several cards
- [ ] Refresh the page
- [ ] Verify all cards reappear with correct data
- [ ] Verify active card is restored

### 7.2 Card Activation State

- [ ] Activate a card
- [ ] Refresh the page
- [ ] Verify the same card is still active

---

## 8. Edge Cases & Error Handling

### 8.1 Validation

- [ ] Try to save card with empty name — verify error
- [ ] Try to save card with invalid version format — verify error
- [ ] Try to save card with invalid JSON in Advanced fields — verify error
- [ ] Try to import corrupt PNG — verify error toast
- [ ] Try to import invalid JSON — verify error toast

### 8.2 Duplicate Names

- [ ] Import a card with the same name as existing — verify unique suffix is added
- [ ] Create a card with the same name as existing — verify behavior

### 8.3 Large Data

- [ ] Create a card with very long text fields (1000+ chars) — verify it saves and loads
- [ ] Create a card with many outfits (5+) — verify all persist
- [ ] Create a card with many greetings (10+) — verify all persist

---

## 9. Electron-Specific Tests (if running Electron app)

### 9.1 Card Download Interception

- [ ] Download a card PNG from a webview — verify it triggers the import flow
- [ ] Download a card JSON from a webview — verify it triggers the import flow
- [ ] Verify CardImportWizard opens after download

---

## Test Result Legend

- ✅ PASS — Works as expected
- ❌ FAIL — Does not work / error occurs
- ⚠️ PARTIAL — Works but with minor issues
- N/A — Not applicable / unable to test

Report all ❌ FAIL and ⚠️ PARTIAL items with: file/area, expected behavior, actual behavior, and severity (blocking/critical/minor).
