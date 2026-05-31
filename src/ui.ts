/**
 * Interactive testing UI served at GET /.
 * Algeria-themed design matching the HassanMak29 API suite pattern.
 */

export function buildUI(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Free REST API for Algeria's 58 wilayas and 1541 communes — AR/FR/EN names, GPS coordinates, postal codes. Interactive tester." />
  <title>Algeria Wilaya API — Interactive Tester</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;1,14..32,400&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --green:         #006633;
      --green-mid:     #007a3d;
      --green-light:   #009a4e;
      --green-pale:    #e6f4ec;
      --green-border:  #b3d9c4;
      --red:           #d21034;
      --red-pale:      #fdeaee;
      --red-border:    #f5b8c4;
      --text:          #111827;
      --text-sec:      #6b7280;
      --border:        #e5e7eb;
      --bg:            #f9fafb;
      --white:         #ffffff;
      --shadow-sm:     0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.05);
      --shadow-md:     0 4px 16px rgba(0,100,50,.1), 0 2px 6px rgba(0,0,0,.06);
      --shadow-lg:     0 8px 32px rgba(0,100,50,.14), 0 4px 12px rgba(0,0,0,.08);
      --radius:        14px;
      --radius-sm:     9px;
      --radius-lg:     20px;
    }

    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: linear-gradient(150deg, #f0f9f4 0%, #fafafa 50%, #f0f4ff 100%);
      min-height: 100vh;
      color: var(--text);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    .page { display: flex; flex-direction: column; min-height: 100vh; }
    .container { max-width: 760px; margin: 0 auto; padding: 0 20px; width: 100%; }

    /* ─── Header ─── */
    header {
      padding: 48px 0 32px;
      text-align: center;
    }

    .flag-logo {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      border-radius: 22px;
      background: linear-gradient(135deg, var(--green) 50%, white 50%);
      box-shadow: var(--shadow-lg);
      margin: 0 auto 20px;
      position: relative;
      overflow: hidden;
    }
    .flag-logo::after {
      content: '🌙⭐';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-28%, -50%);
      font-size: 18px;
      line-height: 1;
      filter: drop-shadow(0 1px 2px rgba(0,0,0,.3));
    }

    header h1 {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -.7px;
      background: linear-gradient(135deg, var(--green) 0%, #00a85a 60%, #1a9e6b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;
    }

    header .subtitle {
      color: var(--text-sec);
      font-size: 15px;
      margin-bottom: 18px;
      line-height: 1.5;
    }

    .header-pills {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 18px;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 13px;
      border-radius: 999px;
      font-size: 12.5px;
      font-weight: 500;
      background: white;
      border: 1px solid var(--border);
      color: var(--text-sec);
      box-shadow: var(--shadow-sm);
    }
    .pill.green { background: var(--green-pale); border-color: var(--green-border); color: var(--green); }

    .rapidapi-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: white;
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 7px 18px;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-sec);
      text-decoration: none;
      transition: all .18s;
      box-shadow: var(--shadow-sm);
    }
    .rapidapi-link:hover { background: var(--green-pale); border-color: var(--green-border); color: var(--green); }

    /* ─── Tabs ─── */
    .tabs {
      display: flex;
      gap: 4px;
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 5px;
      margin-bottom: 16px;
      box-shadow: var(--shadow-sm);
    }
    .tab-btn {
      flex: 1;
      padding: 10px 14px;
      border: none;
      border-radius: var(--radius-sm);
      background: transparent;
      font: inherit;
      font-size: 13.5px;
      font-weight: 500;
      color: var(--text-sec);
      cursor: pointer;
      transition: all .18s;
      white-space: nowrap;
    }
    .tab-btn:hover { background: var(--green-pale); color: var(--green); }
    .tab-btn.active {
      background: var(--green);
      color: white;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0,102,51,.3);
    }

    /* ─── Card ─── */
    .card {
      background: white;
      border-radius: var(--radius-lg);
      border: 1px solid rgba(226,232,240,.9);
      box-shadow: var(--shadow-md);
      padding: 26px;
      margin-bottom: 16px;
    }

    /* ─── Form elements ─── */
    .field-label {
      display: block;
      font-size: 11.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .65px;
      color: var(--text-sec);
      margin-bottom: 9px;
    }

    .input-row { display: flex; gap: 10px; }

    .text-input, .select-input {
      flex: 1;
      padding: 13px 16px;
      border: 2px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: 15px;
      font-family: inherit;
      color: var(--text);
      background: #fafafa;
      outline: none;
      transition: border-color .18s, box-shadow .18s, background .18s;
      appearance: none;
    }
    .text-input:focus, .select-input:focus {
      border-color: var(--green);
      box-shadow: 0 0 0 3px rgba(0,102,51,.12);
      background: white;
    }
    .text-input::placeholder { color: #9ca3af; }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 13px 22px;
      background: var(--green);
      color: white;
      border: none;
      border-radius: var(--radius-sm);
      font-size: 15px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      white-space: nowrap;
      transition: background .18s, transform .12s, box-shadow .18s;
    }
    .btn-primary:hover { background: var(--green-mid); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,102,51,.3); }
    .btn-primary:active { transform: translateY(0); }
    .btn-primary:disabled { opacity: .55; cursor: not-allowed; transform: none; box-shadow: none; }

    .examples { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 13px; }
    .examples-label { font-size: 12px; color: var(--text-sec); font-weight: 500; }
    .chip {
      padding: 4px 13px;
      background: var(--green-pale);
      color: var(--green);
      border: 1px solid var(--green-border);
      border-radius: 20px;
      font-size: 12.5px;
      font-family: inherit;
      cursor: pointer;
      transition: all .15s;
    }
    .chip:hover { background: var(--green); color: white; border-color: var(--green); }

    /* ─── Loading ─── */
    .loading { display: none; text-align: center; padding: 28px 0; }
    .spinner {
      width: 38px;
      height: 38px;
      border: 3.5px solid var(--green-pale);
      border-top-color: var(--green);
      border-radius: 50%;
      animation: spin .75s linear infinite;
      margin: 0 auto 12px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loading-text { font-size: 14px; color: var(--text-sec); }

    /* ─── Error ─── */
    .error-banner {
      display: none;
      align-items: flex-start;
      gap: 12px;
      background: var(--red-pale);
      border: 1px solid var(--red-border);
      border-radius: var(--radius);
      padding: 14px 18px;
      margin-bottom: 16px;
    }
    .error-banner.show { display: flex; }
    .error-banner-msg { font-size: 14px; color: var(--red); }

    /* ─── Results ─── */
    .results { display: none; }
    .results.show { display: block; }

    .section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .7px;
      color: var(--text-sec);
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border);
    }

    /* Wilaya detail card */
    .wilaya-header {
      display: flex;
      align-items: flex-start;
      gap: 18px;
      margin-bottom: 20px;
    }
    .wilaya-code-badge {
      flex-shrink: 0;
      width: 72px;
      height: 72px;
      border-radius: 18px;
      background: linear-gradient(135deg, var(--green) 0%, var(--green-light) 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(0,102,51,.28);
    }
    .wilaya-code-badge .code-num {
      font-size: 24px;
      font-weight: 800;
      color: white;
      line-height: 1;
    }
    .wilaya-code-badge .code-label {
      font-size: 9px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .5px;
      color: rgba(255,255,255,.75);
      margin-top: 2px;
    }
    .wilaya-names { flex: 1; min-width: 0; }
    .wilaya-name-ar {
      font-size: 22px;
      font-weight: 700;
      direction: rtl;
      margin-bottom: 4px;
    }
    .wilaya-name-fr { font-size: 17px; font-weight: 600; color: var(--text); margin-bottom: 2px; }
    .wilaya-name-en { font-size: 14px; color: var(--text-sec); }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-bottom: 18px;
    }
    @media (min-width: 480px) { .info-grid { grid-template-columns: repeat(3, 1fr); } }
    .info-item {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 12px 14px;
    }
    .info-item-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .5px;
      font-weight: 600;
      color: var(--text-sec);
      margin-bottom: 4px;
    }
    .info-item-value {
      font-size: 15px;
      font-weight: 700;
      color: var(--text);
    }
    .info-item-value.mono { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 13px; }

    /* Commune list */
    .commune-count-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--green-pale);
      color: var(--green);
      border: 1px solid var(--green-border);
      border-radius: 20px;
      padding: 4px 12px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 14px;
    }
    .commune-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 7px;
    }
    @media (min-width: 480px) { .commune-grid { grid-template-columns: repeat(3, 1fr); } }
    .commune-item {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 10px 12px;
    }
    .commune-name-fr { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 2px; }
    .commune-name-ar { font-size: 12px; color: var(--text-sec); direction: rtl; text-align: right; }
    .commune-post {
      display: inline-block;
      margin-top: 4px;
      font-size: 11px;
      font-family: monospace;
      background: var(--green-pale);
      color: var(--green);
      padding: 1px 7px;
      border-radius: 10px;
    }

    /* Search results */
    .search-section-label {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .5px;
      color: var(--text-sec);
      margin: 16px 0 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .search-section-label::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border);
    }

    .search-wilaya-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 13px 16px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      margin-bottom: 8px;
      cursor: pointer;
      transition: all .15s;
      text-decoration: none;
      color: inherit;
    }
    .search-wilaya-item:hover {
      background: var(--green-pale);
      border-color: var(--green-border);
      transform: translateX(3px);
    }
    .sw-code {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: var(--green);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 800;
    }
    .sw-names { flex: 1; min-width: 0; }
    .sw-fr { font-size: 14px; font-weight: 600; }
    .sw-ar { font-size: 13px; color: var(--text-sec); direction: rtl; }
    .sw-meta { font-size: 12px; color: var(--text-sec); text-align: right; }

    .search-commune-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      margin-bottom: 6px;
    }
    .sc-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: var(--green-border);
      flex-shrink: 0;
    }
    .sc-names { flex: 1; }
    .sc-fr { font-size: 13.5px; font-weight: 600; }
    .sc-ar { font-size: 12px; color: var(--text-sec); }
    .sc-meta { font-size: 12px; color: var(--text-sec); font-family: monospace; }

    .empty-state {
      text-align: center;
      padding: 32px 0;
      color: var(--text-sec);
      font-size: 14px;
    }

    /* Wilayas list (all 58) */
    .wilaya-list-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
    @media (min-width: 520px) { .wilaya-list-grid { grid-template-columns: repeat(3, 1fr); } }
    .wl-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all .15s;
    }
    .wl-item:hover { background: var(--green-pale); border-color: var(--green-border); }
    .wl-num {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: var(--green);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 800;
    }
    .wl-text { flex: 1; min-width: 0; }
    .wl-fr { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .wl-ar { font-size: 11px; color: var(--text-sec); direction: rtl; }

    /* JSON raw */
    .json-toggle {
      margin-top: 18px;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      overflow: hidden;
    }
    .json-toggle summary {
      padding: 10px 16px;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-sec);
      cursor: pointer;
      background: var(--bg);
      user-select: none;
      list-style: none;
    }
    .json-toggle summary::-webkit-details-marker { display: none; }
    .json-toggle summary::before { content: '▶ '; font-size: 10px; }
    .json-toggle[open] summary::before { content: '▼ '; }
    .json-toggle pre {
      padding: 14px 16px;
      font-family: 'SF Mono', 'Fira Code', 'Fira Mono', monospace;
      font-size: 12px;
      line-height: 1.7;
      overflow-x: auto;
      background: #1a1f2e;
      color: #a8d8a8;
      max-height: 360px;
      overflow-y: auto;
    }

    /* Features strip */
    .features {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }
    @media (min-width: 520px) { .features { grid-template-columns: repeat(3, 1fr); } }
    .feature {
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 16px;
      text-align: center;
      box-shadow: var(--shadow-sm);
    }
    .feature-icon { font-size: 22px; margin-bottom: 6px; }
    .feature-name { font-size: 13px; font-weight: 600; margin-bottom: 3px; }
    .feature-desc { font-size: 12px; color: var(--text-sec); }

    /* Footer */
    .spacer { flex: 1; }
    footer {
      border-top: 1px solid var(--border);
      padding: 18px 0;
      margin-top: 24px;
    }
    .footer-inner {
      max-width: 760px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
      color: var(--text-sec);
      flex-wrap: wrap;
    }
    .footer-inner a { color: var(--green); text-decoration: none; font-weight: 500; }
    .footer-inner a:hover { text-decoration: underline; }
    .dot { color: var(--border); }
  </style>
</head>
<body>
<div class="page">
  <div class="container">
    <header>
      <div class="flag-logo"></div>
      <h1>Algeria Wilaya API</h1>
      <p class="subtitle">
        Free REST API · 58 wilayas · 1541 communes · AR/FR/EN · GPS · Postal codes
      </p>
      <div class="header-pills">
        <span class="pill green">🇩🇿 58 Wilayas</span>
        <span class="pill green">🏘️ 1541 Communes</span>
        <span class="pill">🌐 AR / FR / EN</span>
        <span class="pill">📍 GPS Coordinates</span>
        <span class="pill">📮 Postal Codes</span>
        <span class="pill">⚡ Free Forever</span>
      </div>
      <a class="rapidapi-link" href="https://rapidapi.com/HassanMak29/api/algeria-wilaya-api" target="_blank" rel="noopener">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        Available on RapidAPI
      </a>
    </header>

    <!-- ── Tabs ── -->
    <div class="tabs" role="tablist">
      <button class="tab-btn active" role="tab" onclick="switchTab('lookup')" id="tab-lookup">🔍 Wilaya Lookup</button>
      <button class="tab-btn" role="tab" onclick="switchTab('search')" id="tab-search">🔎 Search</button>
      <button class="tab-btn" role="tab" onclick="switchTab('list')" id="tab-list">📋 All Wilayas</button>
    </div>

    <!-- ───────────────── LOOKUP TAB ───────────────── -->
    <div id="pane-lookup">
      <div class="card">
        <label class="field-label" for="code-input">Wilaya Code (01 – 58)</label>
        <div class="input-row">
          <input
            id="code-input"
            type="text"
            class="text-input"
            placeholder="e.g. 16"
            maxlength="2"
            autocomplete="off"
            spellcheck="false"
          />
          <button class="btn-primary" id="lookup-btn" onclick="doLookup()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Lookup
          </button>
        </div>
        <div class="examples">
          <span class="examples-label">Try:</span>
          <button class="chip" onclick="tryCode('16')">16 — Alger</button>
          <button class="chip" onclick="tryCode('31')">31 — Oran</button>
          <button class="chip" onclick="tryCode('25')">25 — Constantine</button>
          <button class="chip" onclick="tryCode('01')">01 — Adrar</button>
          <button class="chip" onclick="tryCode('58')">58 — El M'Ghair</button>
        </div>
      </div>

      <div class="loading" id="loading-lookup">
        <div class="spinner"></div>
        <div class="loading-text">Fetching wilaya data…</div>
      </div>

      <div class="error-banner" id="error-lookup">
        <span style="font-size:16px;flex-shrink:0">⚠️</span>
        <span class="error-banner-msg" id="error-lookup-msg"></span>
      </div>

      <div class="card results" id="results-lookup">
        <!-- filled by JS -->
      </div>
    </div>

    <!-- ───────────────── SEARCH TAB ───────────────── -->
    <div id="pane-search" style="display:none">
      <div class="card">
        <label class="field-label" for="search-input">Search Wilayas &amp; Communes (AR / FR / EN / postal code)</label>
        <div class="input-row">
          <input
            id="search-input"
            type="text"
            class="text-input"
            placeholder="e.g. Alger, الجزائر, 16000"
            autocomplete="off"
          />
          <button class="btn-primary" id="search-btn" onclick="doSearch()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Search
          </button>
        </div>
        <div class="examples">
          <span class="examples-label">Try:</span>
          <button class="chip" onclick="trySearch('Alger')">Alger</button>
          <button class="chip" onclick="trySearch('الجزائر')">الجزائر</button>
          <button class="chip" onclick="trySearch('oran')">oran</button>
          <button class="chip" onclick="trySearch('16000')">16000</button>
          <button class="chip" onclick="trySearch('bejaia')">bejaia</button>
        </div>
      </div>

      <div class="loading" id="loading-search">
        <div class="spinner"></div>
        <div class="loading-text">Searching…</div>
      </div>

      <div class="error-banner" id="error-search">
        <span style="font-size:16px;flex-shrink:0">⚠️</span>
        <span class="error-banner-msg" id="error-search-msg"></span>
      </div>

      <div class="card results" id="results-search">
        <!-- filled by JS -->
      </div>
    </div>

    <!-- ───────────────── LIST TAB ───────────────── -->
    <div id="pane-list" style="display:none">
      <div class="loading" id="loading-list">
        <div class="spinner"></div>
        <div class="loading-text">Loading all wilayas…</div>
      </div>
      <div class="error-banner" id="error-list">
        <span style="font-size:16px;flex-shrink:0">⚠️</span>
        <span class="error-banner-msg" id="error-list-msg"></span>
      </div>
      <div class="card" id="results-list" style="display:none">
        <!-- filled by JS -->
      </div>
    </div>

    <!-- Features strip -->
    <div class="features" id="features">
      <div class="feature"><div class="feature-icon">🗺️</div><div class="feature-name">58 Wilayas</div><div class="feature-desc">All administrative regions</div></div>
      <div class="feature"><div class="feature-icon">🏘️</div><div class="feature-name">1541 Communes</div><div class="feature-desc">Every daïra & commune</div></div>
      <div class="feature"><div class="feature-icon">🌐</div><div class="feature-name">Trilingual</div><div class="feature-desc">Arabic, French, English</div></div>
      <div class="feature"><div class="feature-icon">📍</div><div class="feature-name">GPS Coords</div><div class="feature-desc">Lat/lng for each wilaya</div></div>
      <div class="feature"><div class="feature-icon">📮</div><div class="feature-name">Postal Codes</div><div class="feature-desc">Accurate DZ post codes</div></div>
      <div class="feature"><div class="feature-icon">⚡</div><div class="feature-name">Edge CDN</div><div class="feature-desc">Cloudflare Workers global</div></div>
    </div>
  </div>

  <div class="spacer"></div>

  <footer>
    <div class="footer-inner">
      <span>Algeria Wilaya API</span>
      <span class="dot">•</span>
      <a href="https://github.com/HassanMak29/dz-wilaya-api" target="_blank" rel="noopener">GitHub</a>
      <span class="dot">•</span>
      <a href="https://rapidapi.com/HassanMak29/api/algeria-wilaya-api" target="_blank" rel="noopener">RapidAPI</a>
      <span class="dot">•</span>
      <span>MIT License · Free forever</span>
    </div>
  </footer>
</div>

<script>
(function () {
  'use strict';

  var BASE = '';   // same origin

  // ── Tab switching ──────────────────────────────────────────────────────────

  var tabs = ['lookup', 'search', 'list'];
  var listLoaded = false;

  window.switchTab = function (name) {
    tabs.forEach(function (t) {
      document.getElementById('pane-' + t).style.display = t === name ? '' : 'none';
      document.getElementById('tab-' + t).classList.toggle('active', t === name);
    });
    if (name === 'list' && !listLoaded) loadAllWilayas();
  };

  // ── Lookup tab ─────────────────────────────────────────────────────────────

  var codeInput = document.getElementById('code-input');
  codeInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') doLookup(); });

  window.tryCode = function (code) {
    codeInput.value = code;
    doLookup();
  };

  window.doLookup = function () {
    var code = codeInput.value.trim().padStart(2, '0');
    if (!code || isNaN(Number(code))) { codeInput.focus(); return; }

    setLoading('lookup', true);
    hideError('lookup');
    hideResults('lookup');
    document.getElementById('features').style.display = 'none';

    fetch(BASE + '/api/wilayas/' + encodeURIComponent(code))
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (r) {
        setLoading('lookup', false);
        if (!r.ok) {
          showError('lookup', r.data.error || 'Wilaya not found.');
        } else {
          renderWilaya(r.data.data);
        }
      })
      .catch(function () {
        setLoading('lookup', false);
        showError('lookup', 'Network error — could not reach the API.');
      });
  };

  function renderWilaya(w) {
    var communes = w.communes || [];
    var html = '';

    html += '<div class="wilaya-header">'
      + '<div class="wilaya-code-badge">'
      +   '<div class="code-num">' + esc(w.code) + '</div>'
      +   '<div class="code-label">Wilaya</div>'
      + '</div>'
      + '<div class="wilaya-names">'
      +   '<div class="wilaya-name-ar">' + esc(w.name.ar) + '</div>'
      +   '<div class="wilaya-name-fr">' + esc(w.name.fr) + '</div>'
      +   '<div class="wilaya-name-en">' + esc(w.name.en) + '</div>'
      + '</div>'
      + '</div>';

    html += '<div class="info-grid">'
      + infoItem('Region', w.region, false)
      + infoItem('Communes', communes.length, false)
      + infoItem('Latitude', w.lat, true)
      + infoItem('Longitude', w.lng, true)
      + '</div>';

    if (communes.length > 0) {
      html += '<div class="section-title">Communes (' + communes.length + ')</div>';
      html += '<div class="commune-count-badge">🏘️ ' + communes.length + ' communes</div>';
      html += '<div class="commune-grid">';
      communes.forEach(function (c) {
        html += '<div class="commune-item">'
          + '<div class="commune-name-fr">' + esc(c.name.fr) + '</div>'
          + '<div class="commune-name-ar">' + esc(c.name.ar) + '</div>'
          + (c.postCode ? '<span class="commune-post">' + esc(c.postCode) + '</span>' : '')
          + '</div>';
      });
      html += '</div>';
    }

    html += '<details class="json-toggle"><summary>View Raw JSON Response</summary><pre id="raw-json-lookup"></pre></details>';

    var resultsEl = document.getElementById('results-lookup');
    resultsEl.innerHTML = html;
    document.getElementById('raw-json-lookup').textContent = JSON.stringify(w, null, 2);
    resultsEl.classList.add('show');
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function infoItem(label, value, mono) {
    return '<div class="info-item">'
      + '<div class="info-item-label">' + esc(label) + '</div>'
      + '<div class="info-item-value' + (mono ? ' mono' : '') + '">' + esc(String(value)) + '</div>'
      + '</div>';
  }

  // ── Search tab ─────────────────────────────────────────────────────────────

  var searchInput = document.getElementById('search-input');
  searchInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') doSearch(); });

  window.trySearch = function (q) {
    searchInput.value = q;
    doSearch();
  };

  window.doSearch = function () {
    var q = searchInput.value.trim();
    if (!q) { searchInput.focus(); return; }

    setLoading('search', true);
    hideError('search');
    hideResults('search');
    document.getElementById('features').style.display = 'none';

    fetch(BASE + '/api/search?q=' + encodeURIComponent(q))
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (r) {
        setLoading('search', false);
        if (!r.ok) {
          showError('search', r.data.error || 'Search failed.');
        } else {
          renderSearch(r.data.data, q, r.data.count);
        }
      })
      .catch(function () {
        setLoading('search', false);
        showError('search', 'Network error — could not reach the API.');
      });
  };

  function renderSearch(result, query, total) {
    var wilayas = result.wilayas || [];
    var communes = result.communes || [];
    var html = '';

    if (total === 0) {
      html = '<div class="empty-state">😕 No results found for <strong>' + esc(query) + '</strong></div>';
    } else {
      if (wilayas.length > 0) {
        html += '<div class="search-section-label">Wilayas (' + wilayas.length + ')</div>';
        wilayas.forEach(function (w) {
          html += '<div class="search-wilaya-item" onclick="tryCodeFromSearch(\'' + esc(w.code) + '\')">'
            + '<div class="sw-code">' + esc(w.code) + '</div>'
            + '<div class="sw-names">'
            +   '<div class="sw-fr">' + esc(w.name.fr) + ' <span style="color:var(--text-sec);font-weight:400">/ ' + esc(w.name.en) + '</span></div>'
            +   '<div class="sw-ar">' + esc(w.name.ar) + '</div>'
            + '</div>'
            + '<div class="sw-meta">' + (w.communeCount || '') + ' communes</div>'
            + '</div>';
        });
      }

      if (communes.length > 0) {
        html += '<div class="search-section-label">Communes (' + communes.length + ')</div>';
        communes.slice(0, 30).forEach(function (c) {
          html += '<div class="search-commune-item">'
            + '<div class="sc-dot"></div>'
            + '<div class="sc-names">'
            +   '<div class="sc-fr">' + esc(c.name.fr) + '</div>'
            +   '<div class="sc-ar">' + esc(c.name.ar) + '</div>'
            + '</div>'
            + (c.postCode ? '<div class="sc-meta">' + esc(c.postCode) + '</div>' : '')
            + '</div>';
        });
        if (communes.length > 30) {
          html += '<div style="text-align:center;padding:10px;font-size:13px;color:var(--text-sec)">…and ' + (communes.length - 30) + ' more communes</div>';
        }
      }

      html += '<details class="json-toggle"><summary>View Raw JSON Response</summary><pre id="raw-json-search"></pre></details>';
    }

    var resultsEl = document.getElementById('results-search');
    resultsEl.innerHTML = html;
    if (total > 0) {
      document.getElementById('raw-json-search').textContent = JSON.stringify(result, null, 2);
    }
    resultsEl.classList.add('show');
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  window.tryCodeFromSearch = function (code) {
    switchTab('lookup');
    codeInput.value = code;
    doLookup();
  };

  // ── All Wilayas tab ────────────────────────────────────────────────────────

  function loadAllWilayas() {
    listLoaded = true;
    setLoading('list', true);
    hideError('list');

    fetch(BASE + '/api/wilayas')
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (r) {
        setLoading('list', false);
        if (!r.ok) {
          showError('list', 'Failed to load wilayas.');
        } else {
          renderAllWilayas(r.data.data);
        }
      })
      .catch(function () {
        setLoading('list', false);
        showError('list', 'Network error — could not reach the API.');
      });
  }

  function renderAllWilayas(wilayas) {
    var html = '<div style="margin-bottom:14px;font-size:14px;color:var(--text-sec)">Click any wilaya to view full details and communes.</div>';
    html += '<div class="wilaya-list-grid">';
    wilayas.forEach(function (w) {
      html += '<div class="wl-item" onclick="openWilaya(\'' + esc(w.code) + '\')">'
        + '<div class="wl-num">' + esc(w.code) + '</div>'
        + '<div class="wl-text">'
        +   '<div class="wl-fr">' + esc(w.name.fr) + '</div>'
        +   '<div class="wl-ar">' + esc(w.name.ar) + '</div>'
        + '</div>'
        + '</div>';
    });
    html += '</div>';

    var el = document.getElementById('results-list');
    el.innerHTML = html;
    el.style.display = '';
  }

  window.openWilaya = function (code) {
    switchTab('lookup');
    codeInput.value = code;
    doLookup();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  function setLoading(tab, on) {
    document.getElementById('loading-' + tab).style.display = on ? 'block' : 'none';
    var btn = document.getElementById(tab === 'lookup' ? 'lookup-btn' : tab === 'search' ? 'search-btn' : null);
    if (btn) btn.disabled = on;
  }

  function hideError(tab) {
    document.getElementById('error-' + tab).classList.remove('show');
  }

  function showError(tab, msg) {
    document.getElementById('error-' + tab + '-msg').textContent = msg;
    document.getElementById('error-' + tab).classList.add('show');
  }

  function hideResults(tab) {
    document.getElementById('results-' + tab).classList.remove('show');
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

})();
</script>
</body>
</html>`;
}
