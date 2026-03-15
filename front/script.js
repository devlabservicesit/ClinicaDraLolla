/**
 * Dra. Lolla - Clínica de Estética
 * Script Principal
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa todas as funcionalidades
    initHeader();
    initMobileMenu();
    initPopup();
    initFormSubmission();
    initSmoothScroll();
    initPhoneMask();
});

/**
 * Header - Efeito de scroll
 */
function initHeader() {
    const header = document.getElementById('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

/**
 * Popup Promocional
 */
function initPopup() {
    const popup = document.getElementById('popupOverlay');
    const closeBtn = document.getElementById('popupClose');
    const skipBtn = document.getElementById('popupSkip');
    const form = document.getElementById('popupForm');

    // Verifica se o popup existe e se já não foi fechado nesta sessão
    if (popup && !sessionStorage.getItem('popupClosed')) {
        // Mostra o popup após 5 segundos
        setTimeout(() => {
            popup.classList.add('active');
        }, 5000);
    }

    function closePopup() {
        if (popup) {
            popup.classList.remove('active');
            // Salva na sessão que o usuário já viu/fechou o popup
            sessionStorage.setItem('popupClosed', 'true');
        }
    }

    // Event Listeners para fechar
    if (closeBtn) closeBtn.addEventListener('click', closePopup);
    if (skipBtn) skipBtn.addEventListener('click', closePopup);

    // Fechar ao clicar fora do container (no overlay escuro)
    if (popup) {
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                closePopup();
            }
        });
    }

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação do telefone no Popup
            const phoneInput = form.querySelector('input[type="tel"]');
            if (phoneInput) {
                const phoneDigits = phoneInput.value.replace(/\D/g, '');
                if (phoneDigits.length < 11) {
                    alert('Por favor, informe um WhatsApp válido com DDD (11 dígitos).');
                    return;
                }
            }
            
            const btn = form.querySelector('button[type="submit"]');
            const originalContent = btn.innerHTML;

            // Ativa estado de loading
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            btn.classList.add('btn-loading');
            btn.disabled = true;
            
            setTimeout(() => {
                alert('Obrigado! Entraremos em contato em breve para agendar sua avaliação.');
                form.reset(); // Limpa o formulário
                closePopup();
                
                // Restaura o botão (para próxima vez)
                btn.innerHTML = originalContent;
                btn.classList.remove('btn-loading');
                btn.disabled = false;
            }, 1500);
        });
    }
}
/**
 * Menu Mobile - Toggle
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animação do toggle
            const spans = menuToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Fechar menu ao clicar em um link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

/**
 * Submission do Formulário de Agendamento
 */
function initFormSubmission() {
    const form = document.getElementById('agendamentoForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coleta os dados do formulário
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Validação básica
            if (!data.nome || !data.telefone || !data.email || !data.servico) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Validação de telefone (mínimo 11 dígitos)
            const cleanPhone = data.telefone.replace(/\D/g, '');
            if (cleanPhone.length < 11) {
                alert('Por favor, informe o telefone completo com DDD (11 dígitos).');
                return;
            }
            
            // Captura o botão e ativa o loading
            const btn = form.querySelector('button[type="submit"]');
            const originalContent = btn.innerHTML;
            
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            btn.classList.add('btn-loading');
            btn.disabled = true;

            // Simulação de envio (aqui você pode integrar com backend ou WhatsApp)
            const mensagem = `
*Nova solicitação de agendamento*

*Nome:* ${data.nome}
*Telefone:* ${data.telefone}
*E-mail:* ${data.email}
*Serviço:* ${data.servico}
*Data preferencial:* ${data.data || 'A combinar'}
*Horário:* ${data.horario || 'A combinar'}
*Mensagem:* ${data.mensagem || 'Sem mensagem adicional'}
            `;
            
            // Encode a mensagem para URL do WhatsApp
            const mensagemEncode = encodeURIComponent(mensagem);
            const telefoneWhatsApp = '5511999999999'; // Substitua pelo número real
            
            // Opção 1: Redirecionar para WhatsApp (futuro)
            // window.open(`https://wa.me/${telefoneWhatsApp}?text=${mensagemEncode}`, '_blank');
            
            // Simula delay de rede (2 segundos)
            setTimeout(() => {
                // Opção 2: Mostrar mensagem de sucesso
                alert('Obrigado pela sua mensagem! Em breve entraremos em contato para confirmar seu agendamento.');
                
                // Limpar formulário e restaurar botão
                form.reset();
                btn.innerHTML = originalContent;
                btn.classList.remove('btn-loading');
                btn.disabled = false;
            }, 2000);
        });
    }
}

/**
 * Smooth Scroll para links internos
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href !== '#!' && href.startsWith('#')) {
                e.preventDefault();
                
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Configuração do WhatsApp Flutuante (para implementar posteriormente)
 */
function initWhatsAppFloat() {
    // Código reservado para implementação futura da caixa de WhatsApp
    /*
    const whatsappBtn = document.createElement('a');
    whatsappBtn.href = 'https://wa.me/5511999999999';
    whatsappBtn.className = 'whatsapp-float';
    whatsappBtn.target = '_blank';
    whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    document.body.appendChild(whatsappBtn);
    */
}

/**
 * Animações ao scroll (Intersection Observer)
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll('.service-card, .testimonial-card');
    animateElements.forEach(el => observer.observe(el));
}

/**
 * Mask para telefone
 */
function initPhoneMask() {
    // Seleciona todos os inputs de telefone (incluindo o do Popup)
    const phoneInputs = document.querySelectorAll('input[type="tel"], #telefone');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Remove tudo que não for dígito
            let value = e.target.value.replace(/\D/g, '');
            
            // Limita a 11 dígitos (DDD + 9 números)

            if (value.length > 11) value = value.slice(0, 11);
            
            // Aplica a formatação (XX) XXXXX-XXXX
            if (value.length > 10) {
                value = value.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
            } else if (value.length > 6) {
                value = value.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
            } else if (value.length > 2) {
                value = value.replace(/^(\d\d)(\d{0,5}).*/, "($1) $2");
            } else if (value.length > 0) {
                value = value.replace(/^(\d*)/, "($1");
            }
            

            e.target.value = value;
        });
    });
}

/**
 * Custom Alert Modal
 * Replaces the default browser alert with a styled modal.
 */
function customAlert(message, title = 'Alerta') {
    const modal = document.getElementById('customAlert');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalBtn = document.getElementById('modalBtn');
    const modalClose = document.getElementById('modalClose');

    modalTitle.innerText = title;
    modalMessage.innerText = message;
    modal.classList.add('active');

    function closeModal() {
        modal.classList.remove('active');
    }

    modalBtn.onclick = closeModal;
    modalClose.onclick = closeModal;

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Example usage: replace alert() calls with customAlert()
// customAlert('Sua mensagem aqui!', 'Título Opcional');
