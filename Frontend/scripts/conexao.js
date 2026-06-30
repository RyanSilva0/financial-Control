const API_URL = "http://localhost:3000/user";

function getUsuarioLogado() {
  try {
    const raw = localStorage.getItem("usuario");
    if (!raw) return null;

    const usuario = JSON.parse(raw);

    if (!usuario || typeof usuario !== "object") return null;

    return usuario;
  } catch (err) {
    console.error("Erro ao ler usuário do localStorage:", err);
    return null;
  }
}
export function protegerPagina() {
  const usuario = getUsuarioLogado();
  if (!usuario) {
    window.location.href = "/Frontend/login.html";
  }
  return usuario;
}

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
