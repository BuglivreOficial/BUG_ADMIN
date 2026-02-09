// Maintenance Page JavaScript
// Countdown Timer, Progress Bar, and Form Handling

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        // Define a data de término da manutenção (formato: 'YYYY-MM-DD HH:mm:ss')
        // Exemplo: 2 dias, 5 horas, 30 minutos e 45 segundos a partir de agora
        maintenanceEnd: new Date(Date.now() + (2 * 24 * 60 * 60 * 1000) + (5 * 60 * 60 * 1000) + (30 * 60 * 1000) + (45 * 1000)),
        
        // Ou defina uma data específica:
        // maintenanceEnd: new Date('2026-02-10 18:00:00'),
        
        updateInterval: 1000, // Atualizar a cada 1 segundo
    };

    // DOM Elements
    const elements = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds'),
        progressFill: document.getElementById('progressFill'),
        progressPercent: document.getElementById('progressPercent'),
        notifyForm: document.getElementById('notifyForm'),
        notifyEmail: document.getElementById('notifyEmail'),
        notifyBtn: document.querySelector('.notify-btn'),
        notifySuccess: document.getElementById('notifySuccess'),
    };

    // State
    let countdownInterval = null;
    const maintenanceStart = new Date(); // Hora de início (agora)
    const totalDuration = CONFIG.maintenanceEnd - maintenanceStart;

    /**
     * Formata número com zero à esquerda
     */
    function padZero(num) {
        return num.toString().padStart(2, '0');
    }

    /**
     * Calcula o tempo restante
     */
    function calculateTimeRemaining() {
        const now = new Date();
        const distance = CONFIG.maintenanceEnd - now;

        if (distance < 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                total: 0
            };
        }

        return {
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
            total: distance
        };
    }

    /**
     * Atualiza o display do contador
     */
    function updateCountdown() {
        const time = calculateTimeRemaining();

        // Atualiza os elementos do DOM
        elements.days.textContent = padZero(time.days);
        elements.hours.textContent = padZero(time.hours);
        elements.minutes.textContent = padZero(time.minutes);
        elements.seconds.textContent = padZero(time.seconds);

        // Atualiza a barra de progresso
        updateProgress(time.total);

        // Se o tempo acabou
        if (time.total <= 0) {
            stopCountdown();
            handleMaintenanceComplete();
        }
    }

    /**
     * Atualiza a barra de progresso
     */
    function updateProgress(remainingTime) {
        const elapsed = totalDuration - remainingTime;
        const progressPercent = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
        
        elements.progressFill.style.width = `${progressPercent}%`;
        elements.progressPercent.textContent = `${Math.round(progressPercent)}%`;
    }

    /**
     * Inicia o contador
     */
    function startCountdown() {
        // Atualização inicial
        updateCountdown();
        
        // Atualizar periodicamente
        countdownInterval = setInterval(updateCountdown, CONFIG.updateInterval);
    }

    /**
     * Para o contador
     */
    function stopCountdown() {
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
    }

    /**
     * Manipula quando a manutenção termina
     */
    function handleMaintenanceComplete() {
        // Adiciona uma animação especial ou redireciona
        elements.progressFill.style.width = '100%';
        elements.progressPercent.textContent = '100%';
        
        // Opcional: Redirecionar após alguns segundos
        setTimeout(() => {
            // window.location.href = '/';
            alert('Manutenção concluída! Redirecionando...');
        }, 2000);
    }

    /**
     * Valida email
     */
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Manipula envio do formulário de notificação
     */
    function handleNotifySubmit(e) {
        e.preventDefault();

        const email = elements.notifyEmail.value.trim();

        if (!isValidEmail(email)) {
            showError('Por favor, insira um email válido');
            return;
        }

        // Adiciona estado de loading
        elements.notifyBtn.classList.add('loading');
        elements.notifyBtn.disabled = true;

        // Simula envio (substitua com sua lógica real)
        setTimeout(() => {
            // Remove loading
            elements.notifyBtn.classList.remove('loading');
            elements.notifyBtn.disabled = false;

            // Esconde o formulário e mostra mensagem de sucesso
            elements.notifyForm.style.display = 'none';
            elements.notifySuccess.classList.add('show');

            // Salva no localStorage (opcional)
            localStorage.setItem('maintenanceNotifyEmail', email);

            // Aqui você enviaria o email para seu backend
            console.log('Email registrado para notificação:', email);
        }, 1500);
    }

    /**
     * Mostra mensagem de erro
     */
    function showError(message) {
        // Você pode criar um elemento de erro ou usar alert
        alert(message);
    }

    /**
     * Adiciona animação suave aos elementos quando carregam
     */
    function initAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Observa seções para animação
        document.querySelectorAll('.countdown-section, .progress-section, .description-section, .notification-section').forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * Adiciona efeito de partículas ao fundo (opcional)
     */
    function createParticles() {
        // Implementação opcional de partículas flutuantes
        // Pode ser implementado para efeito visual extra
    }

    /**
     * Verifica se já foi notificado anteriormente
     */
    function checkPreviousNotification() {
        const savedEmail = localStorage.getItem('maintenanceNotifyEmail');
        if (savedEmail) {
            elements.notifyEmail.value = savedEmail;
            elements.notifyForm.style.display = 'none';
            elements.notifySuccess.classList.add('show');
        }
    }

    /**
     * Event Listeners
     */
    function attachEventListeners() {
        // Form submit
        elements.notifyForm.addEventListener('submit', handleNotifySubmit);

        // Previne fechamento acidental da página
        window.addEventListener('beforeunload', (e) => {
            // Opcional: avisar usuário
            // e.preventDefault();
            // e.returnValue = '';
        });

        // Social links - adiciona feedback visual
        document.querySelectorAll('.neu-social').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Aqui você pode adicionar lógica de tracking ou redirecionamento
                console.log('Social link clicked:', link.getAttribute('aria-label'));
            });
        });
    }

    /**
     * Inicialização
     */
    function init() {
        console.log('Página de manutenção iniciada');
        console.log('Fim da manutenção:', CONFIG.maintenanceEnd);

        // Inicia o contador
        startCountdown();

        // Verifica notificação anterior
        checkPreviousNotification();

        // Adiciona event listeners
        attachEventListeners();

        // Inicia animações
        initAnimations();

        // Limpa o intervalo quando a página é fechada
        window.addEventListener('unload', stopCountdown);
    }

    // Inicia quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expõe funções globais se necessário (para debug)
    window.MaintenancePage = {
        getTimeRemaining: calculateTimeRemaining,
        stop: stopCountdown,
        start: startCountdown,
        config: CONFIG
    };

})();
