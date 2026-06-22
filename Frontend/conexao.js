const API_URL = "http://localhost:3000/user";

function getUsuarioLogado() {
  try {
    const raw = localStorage.getItem("usuario");
    if (!raw) return null;

    const usuario = JSON.parse(raw);

    // garante que veio um objeto válido, não só "null" string ou lixo
    if (!usuario || typeof usuario !== "object") return null;

    return usuario;
  } catch (err) {
    // se o JSON estiver corrompido, trata como não logado
    console.error("Erro ao ler usuário do localStorage:", err);
    return null;
  }
}

// chame essa função manualmente nas páginas que precisam de proteção
export function protegerPagina() {
  const usuario = getUsuarioLogado();
  if (!usuario) {
    window.location.href = "login.html";
  }
  return usuario;
}

// útil pra pegar o usuário sem redirecionar (ex: mostrar nome no header)
export function obterUsuario() {
  return getUsuarioLogado();
}

export async function cadastrarUsuario(nome, email, senha) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nome, email, senha }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function loginUsuario(email, senha) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, senha }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}
