document.addEventListener('DOMContentLoaded', () => {
    // --- INTRO ANIMATION LOGIC ---
    const introOverlay = document.getElementById('intro-overlay');
    if (introOverlay) {
        // Check if intro has already been shown in this session
        if (sessionStorage.getItem('introShown')) {
            // Already shown, hide immediately
            introOverlay.style.display = 'none';
        } else {
            // First time, show animation
            setTimeout(() => {
                introOverlay.style.opacity = '0';
                introOverlay.style.visibility = 'hidden';
                setTimeout(() => {
                    introOverlay.style.display = 'none';
                }, 800);
            }, 2500);
            // Mark as shown
            sessionStorage.setItem('introShown', 'true');
        }
    }

    // --- THEME TOGGLE LOGIC ---
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeBtn ? themeBtn.querySelector('i') : null;

    // Load saved theme
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');

            if (body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light');
                if (icon) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                }
            } else {
                localStorage.setItem('theme', 'dark');
                if (icon) {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }
        });
    }

    // --- MOBILE MENU LOGIC ---
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.menu');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const menuIcon = menuBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
            } else {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });
    }

    // --- CODING BACKGROUND ANIMATION (Matrix Rain) ---
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        // Set canvas size
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Matrix characters (Binary + Code symbols)
        const chars = '01{}[]<>/*-+='.split('');
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];

        // Initialize drops
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        function draw() {
            // Translucent background to create trail effect
            const isLight = body.classList.contains('light-mode');

            ctx.fillStyle = isLight ? 'rgba(240, 249, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = isLight ? '#1e1b4b' : '#6366f1'; // Darker Indigo for Light Mode
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        setInterval(draw, 50);
    }

    // --- CONTACT FORM LOGIC ---
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const mensaje = document.getElementById('mensaje').value;

            // Validación básica
            if (nombre.trim().length < 2) {
                alert("Por favor escribe un nombre válido.");
                return;
            }

            if (!email.includes('@')) {
                alert("Por favor escribe un correo válido.");
                return;
            }

            // Simulación de envío visual
            const btn = document.querySelector('.submit-btn');
            const originalText = btn.innerHTML;

            btn.innerHTML = 'Enviando... <i class="fas fa-spinner fa-spin"></i>';
            btn.style.opacity = "0.7";

            setTimeout(() => {
                alert(`¡Gracias por contactar a EIR SYSTEMS, ${nombre}! \nHemos recibido tu mensaje.`);
                contactForm.reset();
                btn.innerHTML = originalText;
                btn.style.opacity = "1";
            }, 1500);
        });
    }
    // --- CHATBOT LOGIC (GROQ API) ---
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // API Configuration
    // API Configuration
    // IMPORTANTE: Para producción, usar variables de entorno o un backend seguro.
    // GitHub bloqueará el push si detecta llaves reales aquí.
    const GROQ_API_KEY = 'TU_API_KEY_AQUI'; // Reemplaza con tu llave de Groq para desarrollo local
    const SYSTEM_PROMPT = `
    Eres la IA asistente del portafolio de Emmanuel Ibarra Ruano.
    Responde siempre de forma amable, profesional y breve (max 2-3 oraciones).
    
    INFORMACIÓN SOBRE EMMANUEL:
    - Es Ingeniero en Computación y experto en Inteligencia Artificial.
    - Le fascina el Diseño Web y crear experiencias digitales únicas.
    - GUSTOS PERSONALES: 
      - Le encanta la Fórmula 1 y los autos.
      - Su marca favorita es Mercedes.
      - Su piloto favorito es Lewis Hamilton (quien correrá para Ferrari).
      - Su comida favorita es el Sushi.
      - En sus ratos libres hace música y practica programación web.
    
    Si te preguntan algo fuera de este contexto, responde que solo estás programado para hablar sobre el perfil profesional y gustos de Emmanuel.
    `;

    if (chatToggle && chatWindow) {
        // Toggle Chat
        function toggleChat() {
            chatWindow.classList.toggle('active');
            if (chatWindow.classList.contains('active')) {
                chatInput.focus();
            }
        }

        chatToggle.addEventListener('click', toggleChat);
        chatClose.addEventListener('click', toggleChat);

        // Add Message to UI
        function addMessage(text, sender) {
            const div = document.createElement('div');
            div.classList.add('message', sender);
            div.textContent = text;
            chatMessages.appendChild(div);
            // Auto scroll
            requestAnimationFrame(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            });
        }

        // Add Loading Indicator
        function showLoading() {
            const div = document.createElement('div');
            div.classList.add('typing-indicator');
            div.id = 'loading-indicator';
            div.innerHTML = `
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            `;
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function removeLoading() {
            const loadingCheck = document.getElementById('loading-indicator');
            if (loadingCheck) loadingCheck.remove();
        }

        // Handle Submit
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (!message) return;

            // 1. Show User Message
            addMessage(message, 'user');
            chatInput.value = '';

            // 2. Show Loading
            showLoading();

            try {
                // 3. Call Groq API
                const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${GROQ_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messages: [
                            { role: 'system', content: SYSTEM_PROMPT },
                            { role: 'user', content: message }
                        ],
                        model: 'llama3-8b-8192',
                        temperature: 0.7,
                        max_tokens: 150
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('API Error Details:', errorData);
                    throw new Error(`API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
                }

                const data = await response.json();
                removeLoading();

                if (data.choices && data.choices[0]) {
                    const botReply = data.choices[0].message.content;
                    addMessage(botReply, 'bot');
                } else {
                    throw new Error('Formato de respuesta inválido');
                }

            } catch (error) {
                console.error('Full Error:', error);
                removeLoading();

                let errorMsg = 'Lo siento, tuve un error de conexión.';

                if (error.message.includes('401')) {
                    errorMsg = 'Error de autenticación. Verifica la API Key.';
                } else if (error.message.includes('429')) {
                    errorMsg = 'Demasiadas solicitudes. Intenta más tarde.';
                } else if (error.message.includes('Failed to fetch')) {
                    errorMsg = 'Error de red (posible bloqueo CORS o sin internet).';
                }

                addMessage(errorMsg, 'bot');
            }
        });
    }
});