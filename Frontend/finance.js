const STORAGE_KEY = "walletfy:dados";

/** Estado em memória, espelhado no localStorage */
let estado = carregarEstado();

function carregarEstado() {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY);
    if (!bruto) return { entradas: [], saidas: [], investimentos: [] };
    const dados = JSON.parse(bruto);
    return {
      entradas: dados.entradas || [],
      saidas: dados.saidas || [],
      investimentos: dados.investimentos || [],
    };
  } catch (erro) {
    console.error("Não foi possível ler os dados salvos:", erro);
    return { entradas: [], saidas: [], investimentos: [] };
  }
}

function salvarEstado() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
  } catch (erro) {
    console.error("Não foi possível salvar os dados:", erro);
  }
}

function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const LABEL_CATEGORIA_SAIDA = {
  alimentacao: "Alimentação",
  transporte: "Transporte",
  saude: "Saúde",
  lazer: "Lazer",
  educacao: "Educação",
  outros: "Outros",
};

const LABEL_TIPO_INVEST = {
  renda_fixa: "Renda Fixa",
  acoes: "Ações",
  fundos: "Fundos Imob.",
  criptomoedas: "Criptomoedas",
  outros: "Outros",
};

// ------------------------------------------------------------
// Navegação entre seções
// ------------------------------------------------------------

function inicializarNavegacao() {
  const botoes = document.querySelectorAll(".nav-btn");
  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      const destino = botao.dataset.section;
      mostrarSecao(destino);
    });
  });
  // Seção inicial
  mostrarSecao("entrada");
}

function mostrarSecao(idSecao) {
  document.querySelectorAll(".section").forEach((secao) => {
    secao.classList.toggle("section--active", secao.id === idSecao);
  });
  document.querySelectorAll(".nav-btn").forEach((botao) => {
    botao.classList.toggle("active", botao.dataset.section === idSecao);
  });
}

// ------------------------------------------------------------
// ENTRADAS
// ------------------------------------------------------------

function inicializarEntradas() {
  const form = document.getElementById("form-entrada");
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const dados = new FormData(form);
    const valor = parseFloat(dados.get("valor"));

    if (!valor || valor <= 0) return;

    estado.entradas.push({
      id: gerarId(),
      descricao: dados.get("descricao").trim(),
      valor,
      categoria: dados.get("categoria"),
      recorrente: dados.get("recorrente") === "on",
      data: new Date().toISOString(),
    });

    salvarEstado();
    form.reset();
    renderizarEntradas();
    renderizarResumo();
  });

  document
    .getElementById("entrada-list")
    .addEventListener("click", (evento) => {
      const botao = evento.target.closest("[data-remover-entrada]");
      if (!botao) return;
      estado.entradas = estado.entradas.filter(
        (item) => item.id !== botao.dataset.removerEntrada,
      );
      salvarEstado();
      renderizarEntradas();
      renderizarResumo();
    });
}

function renderizarEntradas() {
  const total = estado.entradas.reduce((soma, item) => soma + item.valor, 0);
  const recorrente = estado.entradas
    .filter((item) => item.recorrente)
    .reduce((soma, item) => soma + item.valor, 0);
  const unica = total - recorrente;

  document.getElementById("entrada-total").textContent = formatarMoeda(total);
  document.getElementById("entrada-recorrente").textContent =
    formatarMoeda(recorrente);
  document.getElementById("entrada-unica").textContent = formatarMoeda(unica);

  const lista = document.getElementById("entrada-list");
  lista.innerHTML = "";

  if (estado.entradas.length === 0) {
    lista.innerHTML = `<p class="text-[0.8rem] text-muted text-center py-4">Nenhuma entrada registrada ainda.</p>`;
    return;
  }

  [...estado.entradas]
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .forEach((item) => {
      lista.insertAdjacentHTML("beforeend", itemEntradaHTML(item));
    });
}

function itemEntradaHTML(item) {
  return `
    <div class="flex items-center justify-between gap-3 p-3 bg-bg border border-border rounded-sm">
      <div class="min-w-0">
        <p class="text-[0.82rem] font-semibold text-text truncate">${escapeHTML(item.descricao)}</p>
        <p class="text-[0.7rem] text-muted">
          ${item.recorrente ? "Recorrente · " : ""}${dataFormatada(item.data)}
        </p>
      </div>
      <div class="flex items-center gap-3 shrink-0">
        <span class="text-[0.85rem] font-bold text-green">${formatarMoeda(item.valor)}</span>
        <button
          type="button"
          data-remover-entrada="${item.id}"
          aria-label="Remover entrada"
          class="text-muted hover:text-red text-[0.9rem] leading-none cursor-pointer"
        >✕</button>
      </div>
    </div>`;
}

// ------------------------------------------------------------
// SAÍDAS
// ------------------------------------------------------------

function inicializarSaidas() {
  const form = document.getElementById("form-saida");
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const dados = new FormData(form);
    const valor = parseFloat(dados.get("valor"));
    const parcelas = Math.max(1, parseInt(dados.get("parcelas"), 10) || 1);

    if (!valor || valor <= 0) return;

    estado.saidas.push({
      id: gerarId(),
      descricao: dados.get("descricao").trim(),
      valor,
      categoria: dados.get("categoria"),
      parcelas,
      data: new Date().toISOString(),
    });

    salvarEstado();
    form.reset();
    document.getElementById("s-parcelas").value = 1;
    renderizarSaidas();
    renderizarResumo();
  });

  document.getElementById("saida-list").addEventListener("click", (evento) => {
    const botao = evento.target.closest("[data-remover-saida]");
    if (!botao) return;
    estado.saidas = estado.saidas.filter(
      (item) => item.id !== botao.dataset.removerSaida,
    );
    salvarEstado();
    renderizarSaidas();
    renderizarResumo();
  });
}

function renderizarSaidas() {
  const total = estado.saidas.reduce((soma, item) => soma + item.valor, 0);

  document.getElementById("saida-total").textContent = formatarMoeda(total);
  document.getElementById("saida-count").textContent = estado.saidas.length;

  // Agrupamento por categoria
  const porCategoria = {};
  estado.saidas.forEach((item) => {
    porCategoria[item.categoria] =
      (porCategoria[item.categoria] || 0) + item.valor;
  });

  const categorias = Object.entries(porCategoria).sort((a, b) => b[1] - a[1]);
  const maiorCategoria = categorias[0];

  document.getElementById("saida-top").textContent = maiorCategoria
    ? `${LABEL_CATEGORIA_SAIDA[maiorCategoria[0]] || maiorCategoria[0]} (${formatarMoeda(maiorCategoria[1])})`
    : "—";

  const barras = document.getElementById("saida-bars");
  barras.innerHTML = "";

  if (categorias.length === 0) {
    barras.innerHTML = `<p class="text-[0.8rem] text-muted text-center py-2">Sem despesas para exibir.</p>`;
  } else {
    const maximo = categorias[0][1];
    categorias.forEach(([categoria, valor]) => {
      const porcentagem = Math.round((valor / maximo) * 100);
      barras.insertAdjacentHTML(
        "beforeend",
        `<div>
          <div class="flex justify-between mb-1">
            <span class="text-[0.72rem] font-semibold text-text">${LABEL_CATEGORIA_SAIDA[categoria] || categoria}</span>
            <span class="text-[0.72rem] font-semibold text-muted">${formatarMoeda(valor)}</span>
          </div>
          <div class="bg-bg rounded-[20px] h-2 border border-border overflow-hidden">
            <div class="h-full rounded-[20px] bg-red" style="width:${porcentagem}%"></div>
          </div>
        </div>`,
      );
    });
  }

  const lista = document.getElementById("saida-list");
  lista.innerHTML = "";

  if (estado.saidas.length === 0) {
    lista.innerHTML = `<p class="text-[0.8rem] text-muted text-center py-4">Nenhuma despesa registrada ainda.</p>`;
    return;
  }

  [...estado.saidas]
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .forEach((item) => {
      lista.insertAdjacentHTML("beforeend", itemSaidaHTML(item));
    });
}

function itemSaidaHTML(item) {
  const parcelaTexto = item.parcelas > 1 ? ` · ${item.parcelas}x` : "";
  return `
    <div class="flex items-center justify-between gap-3 p-3 bg-bg border border-border rounded-sm">
      <div class="min-w-0">
        <p class="text-[0.82rem] font-semibold text-text truncate">${escapeHTML(item.descricao)}</p>
        <p class="text-[0.7rem] text-muted">
          ${LABEL_CATEGORIA_SAIDA[item.categoria] || item.categoria}${parcelaTexto} · ${dataFormatada(item.data)}
        </p>
      </div>
      <div class="flex items-center gap-3 shrink-0">
        <span class="text-[0.85rem] font-bold text-red">${formatarMoeda(item.valor)}</span>
        <button
          type="button"
          data-remover-saida="${item.id}"
          aria-label="Remover despesa"
          class="text-muted hover:text-red text-[0.9rem] leading-none cursor-pointer"
        >✕</button>
      </div>
    </div>`;
}

// ------------------------------------------------------------
// INVESTIMENTOS
// ------------------------------------------------------------

function inicializarInvestimentos() {
  const form = document.getElementById("form-invest");
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const dados = new FormData(form);
    const aporte = parseFloat(dados.get("aporte"));

    if (!aporte || aporte <= 0) return;

    estado.investimentos.push({
      id: gerarId(),
      nome: dados.get("nome").trim(),
      aporte,
      tipo: dados.get("tipo"),
      data: new Date().toISOString(),
    });

    salvarEstado();
    form.reset();
    renderizarInvestimentos();
    renderizarResumo();
  });

  document.getElementById("invest-list").addEventListener("click", (evento) => {
    const botao = evento.target.closest("[data-remover-invest]");
    if (!botao) return;
    estado.investimentos = estado.investimentos.filter(
      (item) => item.id !== botao.dataset.removerInvest,
    );
    salvarEstado();
    renderizarInvestimentos();
    renderizarResumo();
  });
}

function renderizarInvestimentos() {
  // Valor atual é tratado como igual ao aportado (sem cotação externa).
  const totalAportado = estado.investimentos.reduce(
    (soma, item) => soma + item.aporte,
    0,
  );
  const valorAtual = totalAportado;
  const rentabilidade =
    totalAportado > 0
      ? ((valorAtual - totalAportado) / totalAportado) * 100
      : 0;

  document.getElementById("invest-total").textContent =
    formatarMoeda(valorAtual);
  document.getElementById("invest-aporte").textContent =
    formatarMoeda(totalAportado);
  document.getElementById("invest-rentab").textContent =
    `${rentabilidade >= 0 ? "+" : ""}${rentabilidade.toFixed(2)}%`;

  const lista = document.getElementById("invest-list");
  lista.innerHTML = "";

  if (estado.investimentos.length === 0) {
    lista.innerHTML = `<p class="text-[0.8rem] text-muted text-center py-4">Nenhum investimento registrado ainda.</p>`;
    return;
  }

  [...estado.investimentos]
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .forEach((item) => {
      lista.insertAdjacentHTML("beforeend", itemInvestHTML(item));
    });
}

function itemInvestHTML(item) {
  return `
    <div class="flex items-center justify-between gap-3 p-3 bg-bg border border-border rounded-sm">
      <div class="min-w-0">
        <p class="text-[0.82rem] font-semibold text-text truncate">${escapeHTML(item.nome)}</p>
        <p class="text-[0.7rem] text-muted">
          ${LABEL_TIPO_INVEST[item.tipo] || item.tipo} · ${dataFormatada(item.data)}
        </p>
      </div>
      <div class="flex items-center gap-3 shrink-0">
        <span class="text-[0.85rem] font-bold text-blue">${formatarMoeda(item.aporte)}</span>
        <button
          type="button"
          data-remover-invest="${item.id}"
          aria-label="Remover investimento"
          class="text-muted hover:text-red text-[0.9rem] leading-none cursor-pointer"
        >✕</button>
      </div>
    </div>`;
}

// ------------------------------------------------------------
// RESUMO GERAL
// ------------------------------------------------------------

function renderizarResumo() {
  const totalEntradas = estado.entradas.reduce(
    (soma, item) => soma + item.valor,
    0,
  );
  const totalSaidas = estado.saidas.reduce(
    (soma, item) => soma + item.valor,
    0,
  );
  const totalInvestido = estado.investimentos.reduce(
    (soma, item) => soma + item.aporte,
    0,
  );
  const saldoLivre = totalEntradas - totalSaidas - totalInvestido;
  const taxaPoupanca =
    totalEntradas > 0
      ? Math.max(
          0,
          Math.min(
            100,
            ((totalInvestido + Math.max(saldoLivre, 0)) / totalEntradas) * 100,
          ),
        )
      : 0;

  document.getElementById("resumo-entrada").textContent =
    formatarMoeda(totalEntradas);
  document.getElementById("resumo-saida").textContent =
    formatarMoeda(totalSaidas);
  document.getElementById("resumo-invest").textContent =
    formatarMoeda(totalInvestido);
  document.getElementById("resumo-saldo").textContent =
    formatarMoeda(saldoLivre);
  document.getElementById("resumo-taxa").textContent =
    `${taxaPoupanca.toFixed(0)}%`;
  document.getElementById("resumo-taxa-bar").style.width = `${taxaPoupanca}%`;
}

// ------------------------------------------------------------
// Utilidades
// ------------------------------------------------------------

function dataFormatada(isoString) {
  return new Date(isoString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function escapeHTML(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

// ------------------------------------------------------------
// Inicialização
// ------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  inicializarNavegacao();
  inicializarEntradas();
  inicializarSaidas();
  inicializarInvestimentos();

  renderizarEntradas();
  renderizarSaidas();
  renderizarInvestimentos();
  renderizarResumo();
});
