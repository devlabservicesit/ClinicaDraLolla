/**
 * Dra. Lolla - Clínica de Estética
 * Script Principal
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa todas as funcionalidades
    initHeader();
    initMobileMenu();
    initFormSubmission();
    initSmoothScroll();
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
            
            // Opção 2: Mostrar mensagem de sucesso
            alert('Obrigado pela sua mensagem! Em breve entraremos em contato para confirmar seu agendamento.');
            
            // Limpar formulário
            form.reset();
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
    const phoneInput = document.getElementById('telefone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                value = '(' + value;
            }
            if (value.length > 3) {
                value = value.substring(0, 3) + ') ' + value.substring(3);
            }
            if (value.length > 10) {
                value = value.substring(0, 10) + '-' + value.substring(10, 14);
            }
            
            e.target.value = value;
        });
    }
}

