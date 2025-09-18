document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    const notification = document.getElementById('notification');
    const loginBtn = loginForm.querySelector('.login-btn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoading = loginBtn.querySelector('.btn-loading');

    // Toggle de visualização da senha
    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        passwordToggle.textContent = type === 'password' ? '👁️' : '🙈';
    });

    // Animação de foco nos inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });

        // Verificar se já tem valor ao carregar
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });

    // Validação em tempo real
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('input', function() {
        const email = this.value;
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        
        if (email && !isValid) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = '#e5e7eb';
        }
    });

    // Submissão do formulário
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Validações
        if (!email || !password) {
            showNotification('Por favor, preencha todos os campos.', 'error');
            return;
        }
        
        if (!email.includes('@latam.com')) {
            showNotification('Use seu e-mail corporativo (@latam.com)', 'error');
            return;
        }
        
        // Simular loading
        showLoading(true);
        
        // Simular autenticação (substituir por integração real)
        setTimeout(() => {
            showLoading(false);
            showNotification('Login realizado com sucesso!', 'success');
            
            // Redirecionar após 1.5 segundos
            setTimeout(() => {
                window.location.href = '../../index.html';
            }, 1500);
        }, 2000);
    });

    // Função para mostrar/ocultar loading
    function showLoading(show) {
        if (show) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            loginBtn.disabled = true;
            loginBtn.style.opacity = '0.7';
        } else {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            loginBtn.disabled = false;
            loginBtn.style.opacity = '1';
        }
    }

    // Função para mostrar notificações
    function showNotification(message, type = 'success') {
        const notificationText = notification.querySelector('.notification-text');
        const notificationIcon = notification.querySelector('.notification-icon');
        
        notificationText.textContent = message;
        
        if (type === 'error') {
            notification.style.background = '#ef4444';
            notificationIcon.textContent = '❌';
        } else {
            notification.style.background = '#10b981';
            notificationIcon.textContent = '✅';
        }
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }

    // Botão SSO
    const ssoBtn = document.querySelector('.sso-btn');
    ssoBtn.addEventListener('click', function() {
        showNotification('Redirecionando para autenticação SSO...', 'success');
        // Aqui seria implementada a integração com SSO
    });

    // Link "Esqueceu a senha"
    const forgotPassword = document.querySelector('.forgot-password');
    forgotPassword.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Instruções enviadas para seu e-mail corporativo.', 'success');
    });

    // Animação de entrada
    setTimeout(() => {
        document.querySelector('.login-container').style.opacity = '1';
        document.querySelector('.login-container').style.transform = 'translateY(0)';
    }, 100);
});

// CSS para animação de entrada
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .login-container {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease;
        }
        
        .form-group.focused input {
            border-color: #3b82f6;
            background: white;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .login-btn:disabled {
            cursor: not-allowed;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .form-group {
            animation: slideIn 0.6s ease forwards;
        }
        
        .form-group:nth-child(1) { animation-delay: 0.1s; }
        .form-group:nth-child(2) { animation-delay: 0.2s; }
        .form-options { animation: slideIn 0.6s ease 0.3s forwards; opacity: 0; }
        .login-btn { animation: slideIn 0.6s ease 0.4s forwards; opacity: 0; }
        .form-divider { animation: slideIn 0.6s ease 0.5s forwards; opacity: 0; }
        .sso-btn { animation: slideIn 0.6s ease 0.6s forwards; opacity: 0; }
    </style>
`);

