// frontend/js/auth.js

// Verifica se já está logado ao carregar a página de login
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('dental_crm_token');
  // Só redireciona se estiver na tela de login
  if (token && window.location.pathname.includes('login.html')) {
    window.location.href = '/';
  }
});

function switchTab(tabName) {
  // Update Tabs
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');

  // Update Forms
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  document.getElementById(`form-${tabName}`).classList.add('active');

  // Clear errors
  document.getElementById('loginError').style.display = 'none';
  document.getElementById('registerError').style.display = 'none';
}

async function handleLogin(e) {
  e.preventDefault();
  const btn = document.getElementById('btnLogin');
  const errorDiv = document.getElementById('loginError');
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    btn.disabled = true;
    btn.textContent = 'Autenticando...';
    errorDiv.style.display = 'none';

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Erro ao fazer login. Verifique suas credenciais.');
    }

    // Sucesso! Salva o token e dados do usuário
    localStorage.setItem('dental_crm_token', data.token);
    localStorage.setItem('dental_crm_user', JSON.stringify(data.user));
    
    // Redireciona pro dashboard
    window.location.href = '/';

  } catch (err) {
    errorDiv.textContent = err.message;
    errorDiv.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Entrar no CRM';
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const btn = document.getElementById('btnRegister');
  const errorDiv = document.getElementById('registerError');
  
  const clinicName = document.getElementById('regClinic').value;
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  try {
    btn.disabled = true;
    btn.textContent = 'Criando sua clínica...';
    errorDiv.style.display = 'none';

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clinicName, name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Erro ao criar conta. Tente novamente.');
    }

    // Sucesso! Cadastro retorna os mesmos dados do login // TODO conferir isso
    localStorage.setItem('dental_crm_token', data.token);
    localStorage.setItem('dental_crm_user', JSON.stringify(data.user));
    
    // Redireciona pro dashboard
    window.location.href = '/';

  } catch (err) {
    errorDiv.textContent = err.message;
    errorDiv.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Criar Conta e Clínica';
  }
}

// Exported pra uso em outros arquivos
function logout() {
  localStorage.removeItem('dental_crm_token');
  localStorage.removeItem('dental_crm_user');
  window.location.href = '/login.html';
}

function getAuthToken() {
  return localStorage.getItem('dental_crm_token');
}

// Interceptor básico pra fetch (adiciona o JWT no header Auth)
async function apiFetch(endpoint, options = {}) {
  const token = getAuthToken();
  if (!token) {
    window.location.href = '/login.html';
    throw new Error('Não autenticado');
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  const response = await fetch(`/api${endpoint}`, config);
  
  if (response.status === 401) {
    // Token expirado ou inválido
    logout();
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  return response;
}
