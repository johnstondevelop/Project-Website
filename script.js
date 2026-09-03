/* 	==============================================================
		EDIT YOUR DATA HERE
		Add, remove, or edit project objects freely — everything below
		(list rendering, detail view, transitions) reads from this array.
		============================================================== */
		const PROJECTS = [
		{
		slug: "ledger",
		name: "ledger",
		signature: "(transactions: list[dict]) -> Report",
		stack: "python · pandas · fastapi",
		summary: "A personal-finance CLI and API that categorizes transactions automatically and generates monthly spending reports.",
		tags: ["python", "fastapi", "pandas", "sqlite"],
		problem: "Manually sortingbank exports into spending categories every month was tedious and error-prone, and existing budgeting apps didnt support the CSV formats my bank provides.",
		approach: "Built a rules-based classifier with a fallback to a small trained model for ambiguous merchant names, backed by a FastAPI service and a SQLite store. A CLI wraps the API for quick local use.",
		outcome: "Cut monthly reconciliation time from about an hour to under 5 minutes, and the classifier now correctly tags roughtly 96% of transactions without manual review.",
		links: {code: "projects/ledger", demo: ""}
		},
		{
		slug: "wayfinder",
		name: "wayfinder",
		signature: "(origin, constraints) -> Route",
		stack: "python · netwrokx · react",
		summary: "A route-planning tool for multi-stop road trips that optimizes for scenery and drive-time balance, not just shortest distance.",
		tags: ["python", "networkx", "react", "postgis"],
		problem: "Standard mapping tools optimize purely for the shortest route available that lessens time as well as distance, which produces road-trip routes that front-end all the driving and back-end all the stops.",
		approach: "Modeled the trip as a weighted graph using Networkx, with custom edge weights blending drive time, elevation change, and points-of-interest density, then exposed it through a small React frontend.",
		outcome: "Used it to plan a 12-day, 9-state trip; the suggested route was noticeably more balanced day-to-day than routes from two mainstream map apps.",
		links: {code: "projects/wayfinder", demo: ""}
		},
		{
		slug: "pane",
		name: "pane",
		signature: "(query: str) -> DataFrame",
		stack: "python · duckDB · textual",
		summary: "A terminal UI for exploring loacl CSV and Parquet files with SQL, built on DuckDB, for quick data inspection without opening a ntoebook.",
		tags: ["python", "duckdb", "textual", "sql"],
		problem: "Spinning up a Jupyter notebook just to peek at a CSV file felt like overkill for quick, one-off questions about a dataset.",
		approach: "Used DuckDB for fast in-process SQL over flat files and Textual to build a keyboard-driven terminal interface with live-updating query results and column stats.",
		outcome: "Now my defualt tool for any dataset under a few million rows - opens in under a second and has replaced most of my ad-hoc notebook usage.",
		links: {code: "projects/pane", demo: ""}
		}
	];
	
	/* ============= GUTTER LINE NUMBERS ============ */
	const gutterNums = document.getElementById('gutterNums');
	for (let i = 1; i <= 26; i++){
		const d = document.createElement('div');
		d.className = 'gutter-num';
		d.textContent = String(i).padStart(2, '0');
		gutterNums.appendChild(d);
	}
	
	/* ============= TYPED HERO LINE ================ */
	const typeTarget = "Code that ships, documented like matters.";
	const typeEl = document.getElementById('typeLine');
	let ti = 0;
	function typeStep(){
		if (ti <= typeTarget.length){
			typeEl.textContent = typeTarget.slice(0, ti);
			ti++;
			setTimeout(typeStep, 28);
			}
		}
		typeStep();
		
	/* =============== THEME TOGGLE =============== */
	const root = document.documentElement;
	const themeBtn = document.getElementById('themeToggle');
	const themeLabel = document.getElementById('themeLabel');
	
	function applyTheme(t){
		root.setAttribute('data-theme', t);
		themeLabel.textContent = t === 'dark' ? 'light mode' : 'dark mode';
	}
		let currentTheme = 'light';
		applyTheme(currentTheme);
		
		themeBtn.addEventListener('click', () => {
			currentTheme = currentTheme === 'light' ? 'dark' : 'light';
			applyTheme(currentTheme);
	});
	
	/* ============= RENDER PROJECT LIST ============== */
	const listEl = document.getElementById('projectList');
	PROJECTS.forEach((p, i) => {
		const btn = document.createElement('button');
		btn.className = 'proj reveal';
		btn.style.animationDelay = (i * 70 + 'ms');
		btn.innerHTML = `
			<div class="proj-name">${p.name}<span class="sig">${p.signature}</span></div>
			<div class="proj-stack">${p.stack}</div>
			<div class="proj-desc">${p.summary}</div>
			<div class="proj-arrow">read the write up -></div>
		`;
			btn.addEventListener('click', () => openDetail(p.slug));
			listEl.appendChild(btn);
		});
		
	/* ============== REVEAL ON SCROLL (single pass, IO-based) =============== */
	const io = new IntersectionObserver((entries) => {
		entries.forEach(e => {
			if (e.isIntersecting){
			e.target.classList.add('in');
			io.unobserve(e.target);
			}
		});
	}, {threshold: 0.15});
	document.querySelectorAll('.reveal').forEach(el => io.observe(el));
	
	/* ===================== DETAIL VIEW + SEAMLESS TRANSITIONS ================= */
	const listView = document.getElementById('listView');
	const detailView = document.getElementById('detailView');
	const detailContent = document.getElementById('detailContent');
	
	function renderDetails(p){
		detailContent.innerHTML = `
			<button class="back-link" id="backBtn"><- back to all projects</button>
			<div class="detail-tag">${p.stack}</div>
			<h2>${p.name}<span style="color:var(--fg-soft); font-family:var(--mono); font-size:1.1rem; margin-left:12px;">${p.signature}</span></h2>
			<p class="lede">${p.summary}</p>
			<div class="detail-meta">
				${p.tags.map(t => `<span class="chip">${t}</span>`).join('')}
			</div>
			<div class="detail-block">
				<h3>the problem</h3>
				<p>${p.problem}</p>
			</div>
			<div class="detail-block">
				<h3>the approach</h3>
				<p>${p.approach}</p>
			</div>
			<div class="detail-block">
				<h3>the outcome</h3>
				<p>${p.outcome}</p>
			</div>
			<div class="detail-cta">
				<a class="btn primary" href="${p.links.code}" target="_blank" rel="noopener">view code</a>
				${p.links.demo ? `<a class="btn ghost" href="${p.links.demo}" target="_blank" rel="noopener">live demo</a>` : ''}
			</div>
		`;
		document.getElementById('backBtn').addEventListener('click', closeDetail);
	}
		
	function swap(showDetail, project){
		const doSwap = () => {
			if (showDetail){
				listView.classList.add('is-hidden');
				renderDetails(project);
				detailView.classList.add('is-active');
				window.scrollTo(0,0);
			} else {
				detailView.classList.remove('is-active');
				listView.classList.remove('is-hidden');
				window.scrollTo(0,0);
			}
		};
		if (document.startViewTransition){
			document.startViewTransition(doSwap);
			} else {
				doSwap();
			}
		}
		
		function openDetail(slug){
			const p = PROJECTS.find(x => x.slug === slug);
			if (p) swap(true, p);
		}
		function closeDetail(){
			swap(false, null);
		}
		
		/* =============== FOOTER YEAR ================ */
		document.getElementById('year').textContent = new Date().getFullYear();
