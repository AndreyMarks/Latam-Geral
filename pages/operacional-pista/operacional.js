// ================= OPERACIONAL PISTA JAVASCRIPT =================

document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupFileUpload();
    setupFormValidation();
    loadDraftIfExists();
});

// Inicialização do formulário
function initializeForm() {
    // Definir data atual
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('data-operacao').value = hoje;
    
    // Detectar turno atual
    const agora = new Date();
    const hora = agora.getHours();
    const turnoSelect = document.getElementById('turno');
    
    if (hora >= 6 && hora < 14) {
        turnoSelect.value = 'manha';
    } else if (hora >= 14 && hora < 22) {
        turnoSelect.value = 'tarde';
    } else {
        turnoSelect.value = 'noite';
    }
}

// Configuração do upload de arquivos
function setupFileUpload() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('fotos');
    const fileList = document.getElementById('file-list');
    let uploadedFiles = [];

    // Eventos de drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    });

    // Evento de clique
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
    });

    function handleFiles(files) {
        files.forEach(file => {
            if (validateFile(file)) {
                uploadedFiles.push(file);
                addFileToList(file);
            }
        });
    }

    function validateFile(file) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

        if (!allowedTypes.includes(file.type)) {
            showNotification('Tipo de arquivo não permitido: ' + file.name, 'error');
            return false;
        }

        if (file.size > maxSize) {
            showNotification('Arquivo muito grande: ' + file.name + ' (máx. 5MB)', 'error');
            return false;
        }

        return true;
    }

    function addFileToList(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <span class="file-icon">${getFileIcon(file.type)}</span>
                <div>
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${formatFileSize(file.size)}</div>
                </div>
            </div>
            <button type="button" class="file-remove" onclick="removeFile('${file.name}')">×</button>
        `;
        fileList.appendChild(fileItem);
    }

    function getFileIcon(type) {
        if (type.startsWith('image/')) return '🖼️';
        if (type === 'application/pdf') return '📄';
        return '📁';
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Função global para remover arquivo
    window.removeFile = function(fileName) {
        uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
        const fileItems = fileList.querySelectorAll('.file-item');
        fileItems.forEach(item => {
            if (item.querySelector('.file-name').textContent === fileName) {
                item.remove();
            }
        });
    };
}

// Validação do formulário
function setupFormValidation() {
    const form = document.getElementById('operacional-form');
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => clearFieldError(field));
    });

    form.addEventListener('submit', handleFormSubmit);
}

function validateField(field) {
    const value = field.value.trim();
    const isValid = value !== '';

    if (isValid) {
        field.classList.remove('error');
        field.classList.add('success');
        removeErrorMessage(field);
    } else {
        field.classList.remove('success');
        field.classList.add('error');
        showFieldError(field, 'Este campo é obrigatório');
    }

    return isValid;
}

function clearFieldError(field) {
    field.classList.remove('error');
    removeErrorMessage(field);
}

function showFieldError(field, message) {
    removeErrorMessage(field);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function removeErrorMessage(field) {
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// Manipulação do formulário
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (validateForm()) {
        submitForm();
    } else {
        showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
    }
}

function validateForm() {
    const form = document.getElementById('operacional-form');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function submitForm() {
    const submitBtn = document.querySelector('.btn-primary');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Simular envio (aqui você faria a requisição real)
    setTimeout(() => {
        const protocolo = generateProtocol();
        
        // Limpar formulário
        document.getElementById('operacional-form').reset();
        document.getElementById('file-list').innerHTML = '';
        
        // Remover rascunho salvo
        localStorage.removeItem('operacional-draft');
        
        // Mostrar modal de sucesso
        showSuccessModal(protocolo);
        
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        showNotification('Relatório enviado com sucesso!', 'success');
    }, 2000);
}

function generateProtocol() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `OP-${year}${month}${day}-${hours}${minutes}-${random}`;
}

// Funções auxiliares
function limparFormulario() {
    if (confirm('Tem certeza que deseja limpar todos os dados do formulário?')) {
        document.getElementById('operacional-form').reset();
        document.getElementById('file-list').innerHTML = '';
        
        // Limpar classes de validação
        const fields = document.querySelectorAll('.form-input, .form-select, .form-textarea');
        fields.forEach(field => {
            field.classList.remove('error', 'success');
        });
        
        // Remover mensagens de erro
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
        
        // Remover rascunho
        localStorage.removeItem('operacional-draft');
        
        showNotification('Formulário limpo com sucesso', 'success');
        
        // Reinicializar dados básicos
        initializeForm();
    }
}

function salvarRascunho() {
    const formData = new FormData(document.getElementById('operacional-form'));
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    localStorage.setItem('operacional-draft', JSON.stringify(data));
    showNotification('Rascunho salvo com sucesso', 'success');
}

function loadDraftIfExists() {
    const draft = localStorage.getItem('operacional-draft');
    if (draft) {
        const data = JSON.parse(draft);
        
        if (confirm('Existe um rascunho salvo. Deseja carregá-lo?')) {
            Object.keys(data).forEach(key => {
                const field = document.getElementById(key);
                if (field) {
                    field.value = data[key];
                }
            });
            
            showNotification('Rascunho carregado com sucesso', 'success');
        }
    }
}

// Modal
function showSuccessModal(protocolo) {
    document.getElementById('protocolo-numero').textContent = protocolo;
    document.getElementById('modal-confirmacao').classList.add('show');
}

function fecharModal() {
    document.getElementById('modal-confirmacao').classList.remove('show');
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    // Remover notificação existente
    const existing = document.querySelector('.notification-toast');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Adicionar estilos inline
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#fee' : type === 'success' ? '#efe' : '#eef'};
        color: ${type === 'error' ? '#c53030' : type === 'success' ? '#38a169' : '#2d3748'};
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 2001;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        border-left: 4px solid ${type === 'error' ? '#e53e3e' : type === 'success' ? '#38a169' : '#4299e1'};
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remover após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s ease;
    }
    
    .notification-close:hover {
        background: rgba(0,0,0,0.1);
    }
`;
document.head.appendChild(style);

