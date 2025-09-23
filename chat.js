// Chat Widget Functionality
class ChatWidget {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.initializeElements();
        this.bindEvents();
        this.loadPredefinedResponses();
    }

    initializeElements() {
        this.chatToggle = document.getElementById('chat-toggle');
        this.chatContainer = document.getElementById('chat-container');
        this.chatClose = document.getElementById('chat-close');
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.chatSend = document.getElementById('chat-send');
    }

    bindEvents() {
        this.chatToggle.addEventListener('click', () => this.toggleChat());
        this.chatClose.addEventListener('click', () => this.closeChat());
        this.chatSend.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !e.target.closest('.chat-widget')) {
                this.closeChat();
            }
        });
    }

    loadPredefinedResponses() {
        this.responses = {
            // Saudações
            'oi': 'Olá! Como posso ajudá-lo hoje?',
            'olá': 'Oi! Em que posso ser útil?',
            'ola': 'Oi! Em que posso ser útil?',

            'bom dia': 'Bom dia! Como posso ajudá-lo?',
            'boa tarde': 'Boa tarde! Em que posso ajudar?',
            'boa noite': 'Boa noite! Como posso ser útil?',

            // kpis 
            'analises': 'Você pode consultar os KPIs em → <a href="https://lookerstudio.google.com/reporting/02dae42c-97bc-4bf5-a9ab-c1d7ff70f3a6" target="_blank">Acessar KPIs</a>',
            'kpi': 'Você pode consultar os KPIs em → <a href="https://lookerstudio.google.com/reporting/02dae42c-97bc-4bf5-a9ab-c1d7ff70f3a6" target="_blank">Acessar KPIs</a>',
            'regularização': 'Você pode consultar as regularizações em  → <a href="https://lookerstudio.google.com/reporting/78c38528-8bbd-4493-83f1-bd3deecc283e" target="_blank">Acessar Regularizações</a>',



            // Informações sobre sistemas
            'sistema': 'Nossos principais sistemas incluem: Gestão de Cargas, Planejamento de Rotas, e Dashboard de Performance. Sobre qual você gostaria de saber mais?',
            'login': 'Para fazer login, clique no botão "Entrar" no canto superior direito da página. Se esqueceu sua senha, entre em contato com o suporte técnico.',
            'senha': 'Para redefinir sua senha, entre em contato com o suporte técnico através do ramal 0000 ou email suporte@latam.com',

            // Suporte técnico
            'suporte': 'Para suporte técnico, você pode: \n• Ligar para o ramal 0000 \n• Enviar email para suporte@latam.com \n• Acessar a seção "Suporte" no menu principal',
            'problema': 'Descreva brevemente seu problema e eu tentarei ajudar ou direcioná-lo para o setor apropriado.',
            'erro': 'Se você está enfrentando um erro no sistema, por favor anote a mensagem de erro e entre em contato com o suporte técnico no ramal 2050.',

            // Informações operacionais
            'horário': 'O portal funciona 24/7. Para suporte presencial, nosso horário é de segunda a sexta, das 8h às 18h.',
            'ramais': 'Você pode encontrar todos os ramais internos na seção "Contatos Internos" do menu de acesso rápido.',
            'treinamento': 'Informações sobre treinamentos estão disponíveis na seção de notícias e através do RH no ramal 0000.',

            // Procedimentos
            'procedimento': 'Os manuais de procedimentos estão disponíveis na seção "Manuais" do menu de acesso rápido.',
            'segurança': 'Para questões de segurança, consulte os protocolos na seção "Segurança" ou entre em contato com o responsável no ramal 0000.',
            'emergência': 'Em caso de emergência, ligue imediatamente para o ramal 9999 ou para a segurança no ramal 0000.',

            // Despedidas
            'obrigado': 'De nada! Fico feliz em ajudar. Se precisar de mais alguma coisa, estarei aqui!',
            'tchau': 'Até logo! Tenha um ótimo dia de trabalho!',
            'valeu': 'Por nada! Sempre à disposição para ajudar.',

            // Default
            'default': 'Desculpe, não entendi sua pergunta. Você pode tentar reformular ou entrar em contato com o suporte técnico no ramal 0000 para assistência personalizada.'
        };
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.isOpen = true;
        this.chatContainer.classList.add('active');
        this.chatInput.focus();
        this.scrollToBottom();
    }

    closeChat() {
        this.isOpen = false;
        this.chatContainer.classList.remove('active');
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.chatInput.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Simulate response delay
        setTimeout(() => {
            this.hideTypingIndicator();
            this.generateResponse(message);
        }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageText = document.createElement('span');
        messageText.className = 'message-text';

        // ✅ Bot pode renderizar HTML (links, formatação)
        if (sender === 'bot') {
            messageText.innerHTML = text;
        } else {
            // ✅ Usuário continua em texto puro (segurança)
            messageText.textContent = text;
        }
        
        const messageTime = document.createElement('span');
        messageTime.className = 'message-time';
        messageTime.textContent = this.getCurrentTime();
        
        messageDiv.appendChild(messageText);
        messageDiv.appendChild(messageTime);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        this.messages.push({
            text: text,
            sender: sender,
            timestamp: new Date()
        });
    }

    generateResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        let response = this.responses.default;
        
        // Check for keyword matches
        for (const [keyword, reply] of Object.entries(this.responses)) {
            if (lowerMessage.includes(keyword)) {
                response = reply;
                break;
            }
        }
        
        this.addMessage(response, 'bot');
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message';
        typingDiv.id = 'typing-indicator';
        
        const typingContent = document.createElement('div');
        typingContent.className = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingContent.appendChild(dot);
        }
        
        typingDiv.appendChild(typingContent);
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
}

// Initialize chat widget when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatWidget();
});
