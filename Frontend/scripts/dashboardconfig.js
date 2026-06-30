const nomeMes = document.getElementById("nomeMes");

const meses = [
  "Janeiro 2026",
  "Fevereiro 2026",
  "Março 2026",
  "Abril 2026",
  "Maio 2026",
  "Junho 2026",
  "Julho 2026",
  "Agosto 2026",
  "Setembro 2026",
  "Outubro 2026",
  "Novembro 2026",
  "Dezembro 2026",
];

let indiceMes = 0;

nomeMes.textContent = meses[indiceMes];

function retroceder() {
  if (indiceMes > 0) {
    indiceMes--;
    nomeMes.textContent = meses[indiceMes];
  }
}

function avancar() {
  if (indiceMes < meses.length - 1) {
    indiceMes++;
    nomeMes.textContent = meses[indiceMes];
  }
}
