/* ─── Tab Navigation ─────────────────────────────────────── */
const navBtns = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".section");

function switchSection(targetId) {
  sections.forEach((s) => {
    if (s.id === targetId) {
      s.classList.add("section--active");
    } else {
      s.classList.remove("section--active");
    }
  });
  navBtns.forEach((b) => {
    b.classList.toggle("active", b.dataset.section === targetId);
  });
}

navBtns.forEach((btn) => {
  btn.addEventListener("click", () => switchSection(btn.dataset.section));
});

// ── Shared helpers ──────────────────────────────────────────
function formatBRL(val) {
  return Number(val).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
function today() {
  return new Date().toLocaleDateString("pt-BR");
}
function tag(type, text) {
  const colors = {
    salario: "#16a34a",
    freelance: "#0891b2",
    bonus: "#d97706",
    alimentacao: "#dc2626",
    transporte: "#9333ea",
    saude: "#e11d48",
    lazer: "#f59e0b",
    educacao: "#2563eb",
    outros: "#6b7280",
    renda_fixa: "#2563eb",
    acoes: "#7c3aed",
    fundos: "#0891b2",
    criptomoedas: "#f59e0b",
  };
  const color = colors[type] || "#6b7280";
  return `<span class="tag" style="background:${color}1a;color:${color};border:1px solid ${color}40">${text}</span>`;
}

// ── ENTRADAS ────────────────────────────────────────────────
const entradasData = [
  {
    id: 1,
    descricao: "Salário mensal",
    valor: 5800,
    categoria: "salario",
    data: "01/06/2025",
    recorrente: true,
  },
  {
    id: 2,
    descricao: "Projeto freelance",
    valor: 1200,
    categoria: "freelance",
    data: "10/06/2025",
    recorrente: false,
  },
  {
    id: 3,
    descricao: "Bônus trimestral",
    valor: 900,
    categoria: "bonus",
    data: "15/06/2025",
    recorrente: false,
  },
];

const categoriasEntrada = [
  { value: "salario", label: "Salário" },
  { value: "freelance", label: "Freelance" },
  { value: "bonus", label: "Bônus" },
  { value: "aluguel", label: "Aluguel" },
  { value: "outros", label: "Outros" },
];

function renderEntradas() {
  const total = entradasData.reduce((s, e) => s + e.valor, 0);
  const recorrente = entradasData
    .filter((e) => e.recorrente)
    .reduce((s, e) => s + e.valor, 0);
  const unica = total - recorrente;

  document.getElementById("entrada-total").textContent = formatBRL(total);
  document.getElementById("entrada-recorrente").textContent =
    formatBRL(recorrente);
  document.getElementById("entrada-unica").textContent = formatBRL(unica);

  const list = document.getElementById("entrada-list");
  list.innerHTML =
    entradasData.length === 0
      ? `<p class="empty-state">Nenhuma entrada registrada ainda.</p>`
      : entradasData
          .map(
            (e) => `
      <div class="tx-item">
        <div class="tx-info">
          <span class="tx-desc">${e.descricao}</span>
          <div class="tx-meta">
            ${tag(e.categoria, categoriasEntrada.find((c) => c.value === e.categoria)?.label || e.categoria)}
            <span class="tx-date">${e.data}</span>
            ${e.recorrente ? '<span class="badge-rec">↻ Recorrente</span>' : ""}
          </div>
        </div>
        <div class="tx-right">
          <span class="tx-val tx-val--green">+${formatBRL(e.valor)}</span>
          <button class="btn-del" onclick="deleteEntrada(${e.id})" aria-label="Remover">✕</button>
        </div>
      </div>`,
          )
          .join("");
}

function deleteEntrada(id) {
  const idx = entradasData.findIndex((e) => e.id === id);
  if (idx !== -1) {
    entradasData.splice(idx, 1);
    renderEntradas();
  }
}

document.getElementById("form-entrada").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const fd = new FormData(ev.target);
  const valor = parseFloat(fd.get("valor"));
  if (!fd.get("descricao") || !valor) return;
  entradasData.unshift({
    id: Date.now(),
    descricao: fd.get("descricao"),
    valor,
    categoria: fd.get("categoria"),
    data: today(),
    recorrente: fd.get("recorrente") === "on",
  });
  ev.target.reset();
  renderEntradas();
});

// ── SAÍDAS ──────────────────────────────────────────────────
const saidasData = [
  {
    id: 1,
    descricao: "Supermercado",
    valor: 420,
    categoria: "alimentacao",
    data: "05/06/2025",
    parcelas: 1,
  },
  {
    id: 2,
    descricao: "Uber / transporte",
    valor: 180,
    categoria: "transporte",
    data: "08/06/2025",
    parcelas: 1,
  },
  {
    id: 3,
    descricao: "Plano de saúde",
    valor: 320,
    categoria: "saude",
    data: "01/06/2025",
    parcelas: 1,
  },
];

const categoriasSaida = [
  { value: "alimentacao", label: "Alimentação" },
  { value: "transporte", label: "Transporte" },
  { value: "saude", label: "Saúde" },
  { value: "lazer", label: "Lazer" },
  { value: "educacao", label: "Educação" },
  { value: "outros", label: "Outros" },
];

function renderSaidas() {
  const total = saidasData.reduce((s, e) => s + e.valor, 0);
  const cats = {};
  saidasData.forEach((s) => {
    cats[s.categoria] = (cats[s.categoria] || 0) + s.valor;
  });
  const topCat = Object.entries(cats).sort((a, b) => b[1] - a[1])[0];

  document.getElementById("saida-total").textContent = formatBRL(total);
  document.getElementById("saida-count").textContent = saidasData.length;
  document.getElementById("saida-top").textContent = topCat
    ? `${categoriasSaida.find((c) => c.value === topCat[0])?.label || topCat[0]}: ${formatBRL(topCat[1])}`
    : "—";

  // mini bar chart por categoria
  const barEl = document.getElementById("saida-bars");
  barEl.innerHTML = Object.entries(cats)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, val]) => {
      const pct = total ? Math.round((val / total) * 100) : 0;
      const label = categoriasSaida.find((c) => c.value === cat)?.label || cat;
      return `<div class="bar-row">
      <span class="bar-label">${label}</span>
      <div class="bar-track"><div class="bar-fill bar-fill--saida" style="width:${pct}%"></div></div>
      <span class="bar-pct">${pct}%</span>
    </div>`;
    })
    .join("");

  const list = document.getElementById("saida-list");
  list.innerHTML =
    saidasData.length === 0
      ? `<p class="empty-state">Nenhuma saída registrada ainda.</p>`
      : saidasData
          .map(
            (e) => `
      <div class="tx-item">
        <div class="tx-info">
          <span class="tx-desc">${e.descricao}</span>
          <div class="tx-meta">
            ${tag(e.categoria, categoriasSaida.find((c) => c.value === e.categoria)?.label || e.categoria)}
            <span class="tx-date">${e.data}</span>
            ${e.parcelas > 1 ? `<span class="badge-rec">${e.parcelas}x</span>` : ""}
          </div>
        </div>
        <div class="tx-right">
          <span class="tx-val tx-val--red">-${formatBRL(e.valor)}</span>
          <button class="btn-del" onclick="deleteSaida(${e.id})" aria-label="Remover">✕</button>
        </div>
      </div>`,
          )
          .join("");
}

function deleteSaida(id) {
  const idx = saidasData.findIndex((e) => e.id === id);
  if (idx !== -1) {
    saidasData.splice(idx, 1);
    renderSaidas();
  }
}

document.getElementById("form-saida").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const fd = new FormData(ev.target);
  const valor = parseFloat(fd.get("valor"));
  if (!fd.get("descricao") || !valor) return;
  saidasData.unshift({
    id: Date.now(),
    descricao: fd.get("descricao"),
    valor,
    categoria: fd.get("categoria"),
    data: today(),
    parcelas: parseInt(fd.get("parcelas")) || 1,
  });
  ev.target.reset();
  renderSaidas();
});

// ── INVESTIMENTOS ───────────────────────────────────────────
const investData = [
  {
    id: 1,
    nome: "Tesouro Selic 2027",
    tipo: "renda_fixa",
    aporte: 3000,
    atual: 3180,
    data: "01/03/2025",
  },
  {
    id: 2,
    nome: "PETR4",
    tipo: "acoes",
    aporte: 1500,
    atual: 1620,
    data: "15/04/2025",
  },
  {
    id: 3,
    nome: "MXRF11",
    tipo: "fundos",
    aporte: 800,
    atual: 855,
    data: "10/05/2025",
  },
];

const tiposInvest = [
  { value: "renda_fixa", label: "Renda Fixa" },
  { value: "acoes", label: "Ações" },
  { value: "fundos", label: "Fundos Imob." },
  { value: "criptomoedas", label: "Criptomoedas" },
  { value: "outros", label: "Outros" },
];

function renderInvest() {
  const totalAporte = investData.reduce((s, e) => s + e.aporte, 0);
  const totalAtual = investData.reduce((s, e) => s + e.atual, 0);
  const rentab = totalAporte
    ? ((totalAtual - totalAporte) / totalAporte) * 100
    : 0;

  document.getElementById("invest-total").textContent = formatBRL(totalAtual);
  document.getElementById("invest-aporte").textContent = formatBRL(totalAporte);
  const rentEl = document.getElementById("invest-rentab");
  rentEl.textContent = (rentab >= 0 ? "+" : "") + rentab.toFixed(2) + "%";
  rentEl.className =
    "stat-val " + (rentab >= 0 ? "stat-val--green" : "stat-val--red");

  const list = document.getElementById("invest-list");
  list.innerHTML =
    investData.length === 0
      ? `<p class="empty-state">Nenhum investimento registrado ainda.</p>`
      : investData
          .map((e) => {
            const ganho = e.atual - e.aporte;
            const pct = e.aporte
              ? ((ganho / e.aporte) * 100).toFixed(2)
              : "0.00";
            const isPos = ganho >= 0;
            return `
        <div class="tx-item">
          <div class="tx-info">
            <span class="tx-desc">${e.nome}</span>
            <div class="tx-meta">
              ${tag(e.tipo, tiposInvest.find((t) => t.value === e.tipo)?.label || e.tipo)}
              <span class="tx-date">desde ${e.data}</span>
            </div>
          </div>
          <div class="tx-right" style="align-items:flex-end;gap:0.2rem">
            <span class="tx-val">${formatBRL(e.atual)}</span>
            <span class="${isPos ? "badge-pos" : "badge-neg"}">${isPos ? "+" : ""}${pct}%</span>
            <button class="btn-del" onclick="deleteInvest(${e.id})" aria-label="Remover">✕</button>
          </div>
        </div>`;
          })
          .join("");
}

function deleteInvest(id) {
  const idx = investData.findIndex((e) => e.id === id);
  if (idx !== -1) {
    investData.splice(idx, 1);
    renderInvest();
  }
}

document.getElementById("form-invest").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const fd = new FormData(ev.target);
  const aporte = parseFloat(fd.get("aporte"));
  if (!fd.get("nome") || !aporte) return;
  investData.unshift({
    id: Date.now(),
    nome: fd.get("nome"),
    tipo: fd.get("tipo"),
    aporte,
    atual: aporte,
    data: today(),
  });
  ev.target.reset();
  renderInvest();
});

// ── OUTROS ──────────────────────────────────────────────────
function updateResumoGeral() {
  const totalEntrada = entradasData.reduce((s, e) => s + e.valor, 0);
  const totalSaida = saidasData.reduce((s, e) => s + e.valor, 0);
  const totalInvest = investData.reduce((s, e) => s + e.aporte, 0);
  const saldo = totalEntrada - totalSaida - totalInvest;

  document.getElementById("resumo-entrada").textContent =
    formatBRL(totalEntrada);
  document.getElementById("resumo-saida").textContent = formatBRL(totalSaida);
  document.getElementById("resumo-invest").textContent = formatBRL(totalInvest);
  const saldoEl = document.getElementById("resumo-saldo");
  saldoEl.textContent = formatBRL(saldo);
  saldoEl.className =
    "resumo-val " + (saldo >= 0 ? "resumo-val--green" : "resumo-val--red");

  // taxa de poupança
  const taxa = totalEntrada
    ? Math.round(((totalEntrada - totalSaida) / totalEntrada) * 100)
    : 0;
  document.getElementById("resumo-taxa").textContent = taxa + "%";
  document.getElementById("resumo-taxa-bar").style.width =
    Math.max(0, Math.min(100, taxa)) + "%";
}

// Re-render "Outros" ao clicar nessa aba
document
  .getElementById("outrosbtn")
  .addEventListener("click", updateResumoGeral);

// ── Init ────────────────────────────────────────────────────
renderEntradas();
renderSaidas();
renderInvest();
updateResumoGeral();
switchSection("entrada");
