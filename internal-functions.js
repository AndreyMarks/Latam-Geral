// Funcionalidades específicas para funcionários internos da LATAM Cargas

// Sistema de notificações dinâmicas
class InternalNotificationSystem {
    constructor() {
        this.notifications = [
            {
                icon: "📢",
                text: "Atenção equipe: Nova atualização do sistema de cargas disponível - Treinamento obrigatório até 20/09",
                priority: "high"
            },
            {
                icon: "👥",
                text: "Reunião de supervisores hoje às 14h - Sala de conferências",
                priority: "medium"
            },
            {
                icon: "🎯",
                text: "Meta mensal de eficiência: 97% alcançado - Parabéns equipe!",
                priority: "low"
            },
            {
                icon: "⚠️",
                text: "Manutenção programada do sistema às 22h - Duração estimada: 2h",
                priority: "high"
            },
            {
                icon: "📊",
                text: "Relatório semanal disponível no dashboard - Confira os indicadores",
                priority: "medium"
            }
        ];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.updateNotificationContent();
        setInterval(() => {
            this.nextNotification();
        }, 8000); // Troca a cada 8 segundos
    }

    nextNotification() {
        this.currentIndex = (this.currentIndex + 1) % this.notifications.length;
        this.updateNotificationContent();
    }

    updateNotificationContent() {
        const notificationContent = document.querySelector('.notification-content');
        if (notificationContent) {
            const notification = this.notifications[this.currentIndex];
            notificationContent.innerHTML = `
                <span class="notification-icon">${notification.icon}</span>
                <span class="notification-text">${notification.text}</span>
            `;
            
            // Adiciona classe de prioridade
            notificationContent.className = `notification-content priority-${notification.priority}`;
        }
    }
}

// Sistema de status em tempo real
class SystemStatusMonitor {
    constructor() {
        this.systems = [
            { name: 'Sistema Principal', status: 'online', element: null },
            { name: 'Rastreamento', status: 'online', element: null },
            { name: 'Backup Server', status: 'warning', element: null },
            { name: 'Comunicações', status: 'online', element: null }
        ];
        this.init();
    }

    init() {
        this.bindElements();
        this.startMonitoring();
    }

    bindElements() {
        const statusItems = document.querySelectorAll('.status-item');
        statusItems.forEach((item, index) => {
            if (this.systems[index]) {
                this.systems[index].element = item.querySelector('.status-indicator');
            }
        });
    }

    startMonitoring() {
        // Simula mudanças de status aleatórias
        setInterval(() => {
            this.simulateStatusChange();
        }, 30000); // A cada 30 segundos
    }

    simulateStatusChange() {
        const randomSystem = Math.floor(Math.random() * this.systems.length);
        const statuses = ['online', 'warning', 'offline'];
        const currentStatus = this.systems[randomSystem].status;
        
        // Evita mudanças muito frequentes para offline
        const availableStatuses = statuses.filter(status => 
            status !== currentStatus && (status !== 'offline' || Math.random() > 0.8)
        );
        
        if (availableStatuses.length > 0) {
            const newStatus = availableStatuses[Math.floor(Math.random() * availableStatuses.length)];
            this.updateSystemStatus(randomSystem, newStatus);
        }
    }

    updateSystemStatus(systemIndex, newStatus) {
        if (this.systems[systemIndex] && this.systems[systemIndex].element) {
            const element = this.systems[systemIndex].element;
            
            // Remove classes antigas
            element.classList.remove('status-online', 'status-warning', 'status-offline');
            
            // Adiciona nova classe
            element.classList.add(`status-${newStatus}`);
            
            // Atualiza o status interno
            this.systems[systemIndex].status = newStatus;
            
            // Log para debug (pode ser removido em produção)
            console.log(`Sistema ${this.systems[systemIndex].name} mudou para ${newStatus}`);
        }
    }
}

// Sistema de informações do turno
class ShiftInformation {
    constructor() {
        this.shifts = [
            { name: 'Manhã', start: '06:00', end: '14:00', supervisor: 'Felipe, Ayra' },
            { name: 'Tarde', start: '14:00', end: '22:00', supervisor: 'Humberto' },
            { name: 'Noite', start: '22:00', end: '06:00', supervisor: 'Daisy, William' }
        ];
        this.init();
    }

    init() {
        this.updateShiftInfo();
        // Atualiza a cada minuto
        setInterval(() => {
            this.updateShiftInfo();
        }, 60000);
    }

    getCurrentShift() {
        const now = new Date();
        const currentHour = now.getHours();
        
        if (currentHour >= 6 && currentHour < 14) {
            return this.shifts[0]; // Manhã
        } else if (currentHour >= 14 && currentHour < 22) {
            return this.shifts[1]; // Tarde
        } else {
            return this.shifts[2]; // Noite
        }
    }

    getNextShiftTime() {
        const now = new Date();
        const currentHour = now.getHours();
        
        if (currentHour >= 6 && currentHour < 14) {
            return '14:00';
        } else if (currentHour >= 14 && currentHour < 22) {
            return '22:00';
        } else {
            return '06:00';
        }
    }

    updateShiftInfo() {
        const currentShift = this.getCurrentShift();
        const nextShiftTime = this.getNextShiftTime();
        
        const shiftCurrentElement = document.querySelector('.shift-current');
        const shiftTimeElement = document.querySelector('.shift-time');
        const shiftSupervisorElement = document.querySelector('.shift-supervisor');
        
        if (shiftCurrentElement) {
            shiftCurrentElement.textContent = `Turno Atual: ${currentShift.name} (${currentShift.start} - ${currentShift.end})`;
        }
        
        if (shiftTimeElement) {
            shiftTimeElement.textContent = `Próxima troca: ${nextShiftTime}`;
        }
        
        if (shiftSupervisorElement) {
            shiftSupervisorElement.textContent = `Supervisor: ${currentShift.supervisor}`;
        }
    }
}

// Sistema de acesso rápido interativo
class QuickAccessSystem {
    constructor() {
        this.init();
    }

    init() {
        this.bindQuickAccessItems();
    }

    bindQuickAccessItems() {
        const quickAccessItems = document.querySelectorAll('.quick-access-item');
        
        quickAccessItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.handleQuickAccessClick(index, item);
            });
            
            // Adiciona cursor pointer
            item.style.cursor = 'pointer';
        });
    }

    handleQuickAccessClick(index, element) {
        // Adiciona efeito visual de clique
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = 'translateY(-2px)';
        }, 150);

        // Simula ações baseadas no índice
        const actions = [
            () => this.showMessage('Redirecionando para o sistema de ponto eletrônico...'),
            () => this.showMessage('Abrindo checklist diário...'),
            () => this.showMessage('Carregando lista de contatos internos...'),
            () => this.showMessage('Acessando biblioteca de manuais...'),
            () => this.showMessage('Exibindo metas do setor...'),
            () => this.showMessage('Formulário de solicitação de manutenção...')
        ];

        if (actions[index]) {
            actions[index]();
        }
    }

    showMessage(message) {
        // Cria um toast de notificação
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #e20074 0%, #120069 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(toast);

        // Remove o toast após 3 segundos
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

// Adiciona animações CSS dinamicamente
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        .toast-notification {
            font-weight: 500;
            font-size: 0.9rem;
        }

        .priority-high .notification-content {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        .priority-medium .notification-content {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .priority-low .notification-content {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
    `;
    document.head.appendChild(style);
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona estilos dinâmicos
    addDynamicStyles();
    
    // Inicializa todos os sistemas
    new InternalNotificationSystem();
    new SystemStatusMonitor();
    new ShiftInformation();
    new QuickAccessSystem();
    
    console.log('Sistemas internos da LATAM Cargas inicializados com sucesso!');
});

// Função para atualizar horário em tempo real
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR');
    const dateString = now.toLocaleDateString('pt-BR');
    
    // Procura por elementos de tempo na página
    const timeElements = document.querySelectorAll('.current-time');
    timeElements.forEach(element => {
        element.textContent = `${dateString} - ${timeString}`;
    });
}

// Atualiza o horário a cada segundo
setInterval(updateCurrentTime, 1000);

// Exporta as classes para uso externo se necessário
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        InternalNotificationSystem,
        SystemStatusMonitor,
        ShiftInformation,
        QuickAccessSystem
    };
}

