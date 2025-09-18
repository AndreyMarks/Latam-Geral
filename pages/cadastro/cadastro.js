document.addEventListener('DOMContentLoaded', function() {
    const cadastroForm = document.getElementById('cadastroForm');
    const notification = document.getElementById('notification');
    const cadastroBtn = cadastroForm.querySelector('.cadastro-btn');
    const btnText = cadastroBtn.querySelector('.btn-text');
    const btnLoading = cadastroBtn.querySelector('.btn-loading');

    // Máscara para telefone
    const telefoneInput = document.getElementById('telefone');
    telefoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = value;
    });

    // Validação de matrícula (apenas números)
    const matriculaInput = document.getElementById('matricula');
    matriculaInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    // Animação de foco nos inputs
    const inputs = document.querySelectorAll('input, select, textarea');
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

    // Validação em tempo real do e-mail
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('input', function() {
        const email = this.value;
        const isValid = /^[^\s@]+@latam\.com$/.test(email);
        
        if (email && !isValid) {
            this.style.borderColor = '#ef4444';
            showFieldError(this, 'Use seu e-mail corporativo (@latam.com)');
        } else {
            this.style.borderColor = '#e5e7eb';
            hideFieldError(this);
        }
    });

    // Validação do e-mail do gestor
    const gestorInput = document.getElementById('gestor');
    gestorInput.addEventListener('input', function() {
        const email = this.value;
        const isValid = /^[^\s@]+@latam\.com$/.test(email);
        
        if (email && !isValid) {
            this.style.borderColor = '#ef4444';
            showFieldError(this, 'E-mail do gestor deve ser @latam.com');
        } else {
            this.style.borderColor = '#e5e7eb';
            hideFieldError(this);
        }
    });

    // Submissão do formulário
    cadastroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar todos os campos
        if (!validateForm()) {
            return;
        }
        
        // Simular loading
        showLoading(true);
        
        // Simular envio da solicitação
        setTimeout(() => {
            showLoading(false);
            showNotification('Solicitação enviada com sucesso! Você receberá um e-mail com o status da aprovação.', 'success');
            
            // Limpar formulário após 2 segundos
            setTimeout(() => {
                cadastroForm.reset();
                // Remover classes de foco
                inputs.forEach(input => {
                    input.parentElement.classList.remove('focused');
                });
            }, 2000);
        }, 3000);
    });

    // Função de validação do formulário
    function validateForm() {
        let isValid = true;
        const requiredFields = cadastroForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#ef4444';
                showFieldError(field, 'Este campo é obrigatório');
                isValid = false;
            } else {
                field.style.borderColor = '#e5e7eb';
                hideFieldError(field);
            }
        });

        // Validações específicas
        const email = document.getElementById('email').value;
        const gestor = document.getElementById('gestor').value;
        const telefone = document.getElementById('telefone').value;
        const matricula = document.getElementById('matricula').value;

        if (email && !email.endsWith('@latam.com')) {
            showNotification('Use seu e-mail corporativo (@latam.com)', 'error');
            isValid = false;
        }

        if (gestor && !gestor.endsWith('@latam.com')) {
            showNotification('E-mail do gestor deve ser @latam.com', 'error');
            isValid = false;
        }

        if (telefone && telefone.replace(/\D/g, '').length < 10) {
            showNotification('Telefone deve ter pelo menos 10 dígitos', 'error');
            isValid = false;
        }

        if (matricula && matricula.length < 4) {
            showNotification('Matrícula deve ter pelo menos 4 dígitos', 'error');
            isValid = false;
        }

        return isValid;
    }

    // Função para mostrar erro em campo específico
    function showFieldError(field, message) {
        // Remove erro anterior se existir
        hideFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.8rem;
            margin-top: 4px;
            animation: slideDown 0.3s ease;
        `;
        
        field.parentElement.appendChild(errorDiv);
    }

    // Função para ocultar erro em campo específico
    function hideFieldError(field) {
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // Função para mostrar/ocultar loading
    function showLoading(show) {
        if (show) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            cadastroBtn.disabled = true;
            cadastroBtn.style.opacity = '0.7';
        } else {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            cadastroBtn.disabled = false;
            cadastroBtn.style.opacity = '1';
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
        }, 5000);
    }

    // Links dos termos
    const links = document.querySelectorAll('.link');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const linkText = this.textContent;
            showNotification(`${linkText} será aberto em uma nova janela.`, 'success');
        });
    });

    // Animação de entrada
    setTimeout(() => {
        document.querySelector('.cadastro-container').style.opacity = '1';
        document.querySelector('.cadastro-container').style.transform = 'translateY(0)';
    }, 100);

    // Auto-completar setor baseado no e-mail (exemplo)
    emailInput.addEventListener('blur', function() {
        const email = this.value.toLowerCase();
        const setorSelect = document.getElementById('setor');
        
        if (email.includes('ops') || email.includes('operacoes')) {
            setorSelect.value = 'operacoes';
        } else if (email.includes('log') || email.includes('logistica')) {
            setorSelect.value = 'logistica';
        } else if (email.includes('plan') || email.includes('planejamento')) {
            setorSelect.value = 'planejamento';
        } else if (email.includes('ti') || email.includes('tech')) {
            setorSelect.value = 'ti';
        }
    });
});

// CSS para animações
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .cadastro-container {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease;
        }
        
        .form-group.focused input,
        .form-group.focused select,
        .form-group.focused textarea {
            border-color: #3b82f6;
            background: white;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .cadastro-btn:disabled {
            cursor: not-allowed;
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
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
        .form-group:nth-child(3) { animation-delay: 0.3s; }
        .form-group:nth-child(4) { animation-delay: 0.4s; }
        .form-group:nth-child(5) { animation-delay: 0.5s; }
        
        .feature-item {
            animation: slideIn 0.6s ease forwards;
        }
        
        .feature-item:nth-child(1) { animation-delay: 0.2s; }
        .feature-item:nth-child(2) { animation-delay: 0.4s; }
        .feature-item:nth-child(3) { animation-delay: 0.6s; }
    </style>
`);

