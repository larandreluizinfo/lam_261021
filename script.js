const EMOJIS = ["🦄", "🐬", "🌻", "🚀", "🍉", "🐱", "⚽", "🎨"];

const tabuleiro = document.getElementById("tabuleiro");
const elJogadas = document.getElementById("jogadas");
const elPares = document.getElementById("pares");
const elTempo = document.getElementById("tempo");
const elAviso = document.getElementById("aviso");
const botaoReiniciar = document.getElementById("reiniciar");

let primeiraCarta = null;
let segundaCarta = null;
let bloqueado = false;
let jogadas = 0;
let pares = 0;
let segundos = 0;
let intervalo = null;
let iniciou = false;

function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function formatarTempo(total) {
  const min = String(Math.floor(total / 60)).padStart(2, "0");
  const seg = String(total % 60).padStart(2, "0");
  return `${min}:${seg}`;
}

function iniciarRelogio() {
  if (intervalo) return;
  intervalo = setInterval(() => {
    segundos += 1;
    elTempo.textContent = formatarTempo(segundos);
  }, 1000);
}

function pararRelogio() {
  clearInterval(intervalo);
  intervalo = null;
}

function criarCarta(emoji, indice) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "carta";
  botao.setAttribute("aria-label", `Carta ${indice + 1}`);
  botao.dataset.emoji = emoji;
  botao.innerHTML = `
    <span class="interno">
      <span class="face frente">?</span>
      <span class="face verso">${emoji}</span>
    </span>`;
  botao.addEventListener("click", () => virarCarta(botao));
  return botao;
}

function montarTabuleiro() {
  tabuleiro.innerHTML = "";
  const cartas = embaralhar([...EMOJIS, ...EMOJIS]);
  cartas.forEach((emoji, indice) => tabuleiro.appendChild(criarCarta(emoji, indice)));
}

function virarCarta(carta) {
  if (bloqueado || carta.classList.contains("virada") || carta.classList.contains("encontrada")) {
    return;
  }

  if (!iniciou) {
    iniciou = true;
    iniciarRelogio();
  }

  carta.classList.add("virada");

  if (!primeiraCarta) {
    primeiraCarta = carta;
    return;
  }

  segundaCarta = carta;
  jogadas += 1;
  elJogadas.textContent = jogadas;
  bloqueado = true;

  if (primeiraCarta.dataset.emoji === segundaCarta.dataset.emoji) {
    const par = [primeiraCarta, segundaCarta];
    setTimeout(() => {
      par.forEach((c) => {
        c.classList.remove("virada");
        c.classList.add("encontrada");
        c.disabled = true;
      });
      pares += 1;
      elPares.textContent = `${pares} / ${EMOJIS.length}`;
      elAviso.textContent = "Você encontrou um par! 🎉";
      limparEscolha();
      verificarVitoria();
    }, 550);
  } else {
    setTimeout(() => {
      primeiraCarta.classList.remove("virada");
      segundaCarta.classList.remove("virada");
      elAviso.textContent = "Não foi dessa vez... tente outra carta!";
      limparEscolha();
    }, 900);
  }
}

function limparEscolha() {
  primeiraCarta = null;
  segundaCarta = null;
  bloqueado = false;
}

function verificarVitoria() {
  if (pares !== EMOJIS.length) return;
  pararRelogio();
  elAviso.textContent = `Parabéns! Você completou o jogo em ${jogadas} jogadas e ${formatarTempo(segundos)}.`;
}

function reiniciar() {
  pararRelogio();
  primeiraCarta = null;
  segundaCarta = null;
  bloqueado = false;
  jogadas = 0;
  pares = 0;
  segundos = 0;
  iniciou = false;
  elJogadas.textContent = "0";
  elPares.textContent = `0 / ${EMOJIS.length}`;
  elTempo.textContent = "00:00";
  elAviso.textContent = "";
  montarTabuleiro();
}

botaoReiniciar.addEventListener("click", reiniciar);
montarTabuleiro();
