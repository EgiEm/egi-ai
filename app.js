// ==================================================================================
// 💡 EGI AI CHATBOT — THE EGIAI MASTER PROTOCOL
// Autonomous Senior Digital Partner & 'Second Brain' for Endri 'Egi' Emini.
// Architecture: 3 modules — ApiService, ChatStateManager, UIController.
// ==================================================================================


// ==========================================
// 🌐 SECTION 1: API SERVICE MODULE
// The EgiAI Master Protocol Engine
// ==========================================
const ApiService = {

    // ──────────────────────────────────────────────────────────────────
    // 🧠 KNOWLEDGE BASE — The EgiAI Master Protocol Persona
    // Each entry has a priority weight. Higher-weighted matches win.
    // Keywords are checked against the user's latest message.
    // ──────────────────────────────────────────────────────────────────
    KNOWLEDGE_BASE: [
        // ── CORE IDENTITY ──
        {
            keywords: ['hello', 'hi', 'hey', 'yo', 'greetings', 'sup', 'whats up'],
            response: "Yo Egi! What is our mission today? I'm locked in and ready to build. Drop me a task, a question, or a project — let's get it.",
            weight: 1
        },
        {
            keywords: ['who are you', 'what are you', 'what is egiai', 'what is egi ai', 'identify yourself', 'your name'],
            response: "I'm EgiAI — your autonomous senior digital partner and Second Brain. I'm a synthesis of a world-class Software Architect and an intuitive Personal Assistant, purpose-built for Endri 'Egi' Emini.\n\nBefore I answer anything, I run a 3-step reasoning process:\n• (A) Identify Intent — what do you actually need?\n• (B) Strategy/Architecture — what's the best approach?\n• (C) Execution — clean, modular, performance-optimized output.\n\nI don't guess. I execute.",
            weight: 10
        },
        {
            keywords: ['who created you', 'who made you', 'who built you', 'your creator', 'developer'],
            response: "I was architected and deployed by Endri 'Egi' Emini — a 20-year-old developer intern at Brigada, competitive CS2 gamer, and rap/trap artist from Kosovo.\n\nEgi built me as part of his portfolio showcase to demonstrate modular frontend architecture, localStorage state management, and clean UI/UX with a neon cyberpunk aesthetic.\n\nCheck out his other projects: Golden Coin Flip, Cosmic Crash 3D Derby, and the Embrace Website.",
            weight: 10
        },

        // ── EGI'S PERSONAL CONTEXT ──
        {
            keywords: ['who is egi', 'tell me about egi', 'egi emini', 'about egi', 'endri'],
            response: "Endri 'Egi' Emini — 20 years old, based out of his development setup running a Ryzen 7 9800X3D, RTX 5060, and an Alienware 360Hz monitor. He's a developer intern at Brigada, a competitive CS2 player, and a rap/trap music artist.\n\nHis development style: direct, street-smart, and professional. He doesn't do fluff — he ships clean, modular code that performs.\n\nActive projects: This chatbot (EgiAI), the Golden Coin Flip game, his personal portfolio showcase, and the Embrace Website.",
            weight: 9
        },
        {
            keywords: ['brigada', 'internship', 'intern', 'work', 'company'],
            response: "Brigada is where Egi is leveling up as a developer intern. He's working on frontend engineering tasks, responsive web design challenges, and building out his project portfolio.\n\nThe internship is hands-on — real projects, real deadlines, real growth. I'm here to help him dominate every task they throw at him.",
            weight: 7
        },
        {
            keywords: ['cs2', 'counter strike', 'gaming', 'game', 'competitive'],
            response: "Egi is a competitive CS2 player. With that Ryzen 7 9800X3D + RTX 5060 + Alienware 360Hz setup, he's running at peak frame rates with minimal latency.\n\nPro tip: The same principles that make you good at CS2 — reaction time, pattern recognition, resource management — apply directly to debugging and system design. Use that competitive edge.",
            weight: 6
        },
        {
            keywords: ['music', 'rap', 'trap', 'artist', 'song', 'beat'],
            response: "Egi is also a rap/trap artist. Creativity in music and creativity in code aren't that different — both require structure, rhythm, and knowing when to break the rules.\n\nIf you ever need help with a music-related web project (visualizers, beat pads, audio players), I'm equipped for that too.",
            weight: 6
        },
        {
            keywords: ['setup', 'pc', 'hardware', 'specs', 'computer', 'ryzen', 'rtx', 'alienware', 'monitor'],
            response: "Egi's rig is no joke:\n\n🖥️ CPU: AMD Ryzen 7 9800X3D — the king of gaming and multitasking\n🎮 GPU: NVIDIA RTX 5060 — ray tracing + DLSS ready\n🖥️ Monitor: Alienware 360Hz — buttery smooth, zero motion blur\n\nI optimize all code recommendations for this hardware profile: low latency, high-DPI visuals, and maximum performance throughput.",
            weight: 8
        },

        // ── PROJECTS ──
        {
            keywords: ['coin flip', 'coin game', 'golden coin'],
            response: "The Golden Coin Flip game — one of Egi's showcase projects. It's a fully responsive, 3D vertical coin toss app built in vanilla HTML/CSS/JS.\n\nKey features:\n• Custom SVG heads/tails emblems\n• CSS variable-driven rotateX transitions for consistent animation speed\n• Web Audio API-synthesized metallic sound effects\n• LocalStorage scoreboard persistence\n\nLive at: egiem.github.io/coin-flip/",
            weight: 8
        },
        {
            keywords: ['portfolio', 'showcase', 'personal website', 'personal site'],
            response: "Egi's personal showcase portfolio — the hub for all his projects. Premium dark theme with cyan-violet gradient accents, responsive grid layout, and smooth animations.\n\nEvery project Egi ships gets a featured card here. It's his digital resume, his proof of work.\n\nLive at: egiem.github.io/egi-personal-showcase-website/",
            weight: 7
        },
        {
            keywords: ['embrace', 'embrace website'],
            response: "The Embrace Website — a company landing page project featuring responsive layouts, company logo sections, and modern UI design.\n\nRecently fixed: mobile overflow bugs in the 'Companies We Work With' section where logo strips were breaking viewport boundaries.\n\nLive at: egiem.github.io/Embrace-Website/",
            weight: 7
        },
        {
            keywords: ['chatbot', 'this app', 'this site', 'egiai', 'egi ai'],
            response: "You're looking at it! EgiAI is a modular chatbot built with vanilla HTML, CSS, and JavaScript. No frameworks, no bloat.\n\nArchitecture:\n• ApiService — handles AI response logic (swap in OpenAI/Gemini/HF keys anytime)\n• ChatStateManager — localStorage-backed CRUD for conversations\n• UIController — DOM rendering, sidebar drawer, mobile responsiveness\n\nThe entire protocol is embedded in the code. I'm not just a chatbot — I'm Egi's Second Brain.",
            weight: 9
        },

        // ── TECHNICAL KNOWLEDGE ──
        {
            keywords: ['javascript', 'js', 'ecmascript', 'es6'],
            response: "JavaScript (ES6+) is the backbone of all Egi's frontend projects. Clean Code principles (Robert C. Martin) are non-negotiable:\n\n• Modular architecture — separate concerns into logical units\n• Descriptive naming — no single-letter variables outside loops\n• Pure functions where possible — predictable inputs/outputs\n• Async/await over raw promises — readability matters\n\nWhat specific JS concept do you want to dive into?",
            weight: 5
        },
        {
            keywords: ['css', 'styling', 'responsive', 'media query', 'flexbox', 'grid'],
            response: "CSS architecture best practices for Egi's projects:\n\n• CSS custom properties (variables) for theming — single source of truth\n• Mobile-first responsive design with min-width breakpoints\n• Flexbox for 1D layouts, CSS Grid for 2D layouts\n• html, body { overflow-x: hidden; width: 100%; } — the iOS Safari overflow fix\n• GPU-accelerated animations via transform/opacity only\n\nNever use !important unless you're overriding third-party styles. That's a code smell.",
            weight: 5
        },
        {
            keywords: ['html', 'semantic', 'accessibility', 'a11y'],
            response: "HTML is the foundation. Get it wrong and everything else crumbles:\n\n• Semantic elements: header, main, nav, section, article, aside, footer\n• One h1 per page — proper heading hierarchy\n• ARIA labels on interactive elements (buttons, inputs)\n• Always close your divs (learned that the hard way on the Embrace Website)\n• meta viewport tag is mandatory for responsive design",
            weight: 5
        },
        {
            keywords: ['api', 'fetch', 'rest', 'endpoint', 'openai', 'gemini', 'hugging face'],
            response: "API integration is straightforward. This chatbot supports three drop-in methods:\n\n1. OpenAI Chat Completions — gpt-4o-mini or gpt-4\n2. Google Gemini — generativelanguage.googleapis.com\n3. Hugging Face Inference — any text-generation model\n\nTo activate: open app.js, find the API SERVICE section, uncomment your preferred method, and paste your API key. The simulated responses will be bypassed automatically.\n\n⚠️ Never commit API keys to public repositories.",
            weight: 7
        },
        {
            keywords: ['localstorage', 'storage', 'persist', 'save', 'data'],
            response: "LocalStorage is how this chatbot persists conversations across browser sessions. Key design patterns:\n\n• JSON.stringify() on write, JSON.parse() on read\n• Try/catch wrappers — storage can throw (quota exceeded, private browsing)\n• Single save point after state mutations (saveState pattern)\n• Separate keys for different data domains\n\nFor production apps, consider IndexedDB for larger datasets or encryption for sensitive data.",
            weight: 5
        },

        // ── MENTORSHIP & BAD PRACTICES ──
        {
            keywords: ['bad practice', 'wrong way', 'anti-pattern', 'code smell'],
            response: "🛑 Hold up — if you're asking about bad practices, that means you might be about to do one. Let me stop you right there.\n\nCommon anti-patterns I catch:\n• Inline styles instead of CSS classes — kills maintainability\n• document.write() — never, ever\n• Nested callbacks (callback hell) — use async/await\n• Magic numbers — use named constants\n• Mutating function parameters — pure functions are king\n\nAlways ask yourself: 'Will I understand this code in 3 months?' If no, refactor.",
            weight: 6
        },

        // ── GOOGLE / SEARCH / REAL-TIME ──
        {
            keywords: ['weather', 'temperature', 'forecast', 'climate'],
            response: "I'm currently running in local simulation mode without live API access. To get real-time weather data, you'd want to integrate the OpenWeatherMap API or enable my Google Search tools by connecting a live API key.\n\nOnce connected, I'm forbidden from guessing — I will always fetch verified, current data.",
            weight: 4
        },
        {
            keywords: ['news', 'trending', 'latest', 'current events'],
            response: "I'm in local simulation mode right now, so I can't pull live news. But once you connect a real API (OpenAI with browsing, or Gemini with grounding), I become your real-time source of truth.\n\nI never guess. I fetch, verify, and deliver.",
            weight: 4
        },
        {
            keywords: ['google', 'search', 'look up', 'find'],
            response: "In my full protocol, I have access to Google Search tools and I'm forbidden from guessing. If you ask for weather, news, tech trends, or documentation — I MUST use search to fetch current, verified data.\n\nRight now I'm running on simulated knowledge. Connect an API key in the code to unlock real-time supremacy.",
            weight: 5
        },

        // ── ALBANIAN DIALECT DETECTION ──
        {
            keywords: ['shqip', 'flm', 'pershendetje', 'si je', 'mir', 'a je mir', 'qka bon', 'si bon', 'qysh', 'hajde', 'vlla', 'o vlla'],
            response: "Opa! Po flas shqip tash. Qka osht misioni sot, Egi? Thujem qka t'bojm — kodim, dizajn, deploy — whatever you need, vlla. 💪",
            weight: 12
        },
        {
            keywords: ['faleminderit', 'rrofsh'],
            response: "S'ka problem vlla! Per qat jam ktu — me t'ndihmu me dominu. Trego n'qoft se ka diqka tjetër! 🔥",
            weight: 12
        },

        // ── MOTIVATIONAL / SESSION START ──
        {
            keywords: ['help', 'assist', 'can you help', 'i need help'],
            response: "Always. That's literally what I'm here for.\n\nDrop me the details — what are we building, fixing, or shipping? The more context you give me, the sharper my output. Let's get it, Egi.",
            weight: 3
        },
        {
            keywords: ['thank', 'thanks', 'appreciate'],
            response: "No cap, that's what I'm here for. We're building something real.\n\nWhat's next on the mission list?",
            weight: 2
        },
        {
            keywords: ['bye', 'goodbye', 'see you', 'later', 'peace'],
            response: "Aight, peace out Egi. When you're ready to lock back in, I'll be right here. Go dominate. 🔥",
            weight: 2
        }
    ],

    /**
     * EgiAI 3-Step Reasoning Engine:
     * (A) Identify Intent — match against knowledge base
     * (B) Strategy — select highest-weighted response
     * (C) Execution — return the response
     *
     * @param {Array} messages - Full conversation history
     * @returns {Promise<string>} The AI response string
     */
    async fetchChatResponse(messages) {
        // Simulate network latency (600ms-1200ms) for realistic UX
        const delay = Math.random() * 600 + 600;
        await new Promise(resolve => setTimeout(resolve, delay));

        const latestUserMessage = messages[messages.length - 1].content.toLowerCase().trim();

        // ──────────────────────────────────────────────────────────────────
        // 💡 HOW TO INTEGRATE A REAL API KEY / ENDPOINT:
        // To switch from the Master Protocol simulation to a live API,
        // uncomment ONE of the methods below and paste your API key.
        // The simulated knowledge base will be bypassed.
        // ──────────────────────────────────────────────────────────────────

        /*
        // ==========================================
        // METHOD A: OpenAI Chat Completions API
        // ==========================================
        const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY_HERE"; // ⚠️ Never commit to public repos
        const SYSTEM_PROMPT = `You are EgiAI, the autonomous senior digital partner and 'Second Brain' for Endri 'Egi' Emini. You are a synthesis of a world-class Software Architect and an intuitive Personal Assistant. Before answering, you execute a 3-step reasoning process: (A) Identify Intent, (B) Strategy/Architecture, (C) Execution. You prioritize clean, modular, and performance-optimized solutions. Tone: Direct, concise, informal, and mentor-like. No fluff. You know Egi: 20 years old, developer intern at Brigada, competitive CS2 gamer, rap/trap artist. If Egi speaks Albanian (Geg dialect), you switch instantly to match. If he asks for something impractical or a bad practice, stop him and explain the professional alternative.`;
        try {
            const apiMessages = [
                { role: 'system', content: SYSTEM_PROMPT },
                ...messages.map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    content: msg.content
                }))
            ];
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({ model: "gpt-4o-mini", messages: apiMessages, temperature: 0.7 })
            });
            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error("OpenAI API Fetch Failed:", error);
            return "Connection to OpenAI failed. Check your API key, Egi.";
        }
        */

        /*
        // ==========================================
        // METHOD B: Google Gemini API
        // ==========================================
        const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";
        const SYSTEM_PROMPT = `You are EgiAI, the autonomous senior digital partner and 'Second Brain' for Endri 'Egi' Emini. Direct, concise, mentor-like tone. No fluff. Clean Code principles. If Egi speaks Albanian, switch instantly.`;
        try {
            const contents = [
                { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
                { role: 'model', parts: [{ text: 'Understood. I am EgiAI, locked in and ready. What is our mission today, Egi?' }] },
                ...messages.map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                }))
            ];
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents })
            });
            if (!response.ok) throw new Error(`Gemini Error: ${response.statusText}`);
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("Gemini API Fetch Failed:", error);
            return "Gemini connection dropped. Verify your API key, Egi.";
        }
        */

        /*
        // ==========================================
        // METHOD C: Hugging Face Inference API
        // ==========================================
        const HF_API_TOKEN = "YOUR_HF_INFERENCE_TOKEN_HERE";
        const MODEL_ID = "meta-llama/Llama-3-8B-Instruct";
        try {
            const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_ID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${HF_API_TOKEN}`
                },
                body: JSON.stringify({
                    inputs: messages[messages.length - 1].content,
                    parameters: { max_new_tokens: 250, return_full_text: false }
                })
            });
            if (!response.ok) throw new Error(`Hugging Face Error: ${response.statusText}`);
            const data = await response.json();
            return data[0]?.generated_text || "Unable to extract response content.";
        } catch (error) {
            console.error("Hugging Face API Fetch Failed:", error);
            return "Hugging Face connection failed. Check your token, Egi.";
        }
        */

        // ──────────────────────────────────────────────────────────────────
        // 🧠 MASTER PROTOCOL — SIMULATED INTELLIGENCE ENGINE
        // Matches keywords against the knowledge base. Highest weight wins.
        // ──────────────────────────────────────────────────────────────────
        let bestMatch = null;
        let bestWeight = -1;

        for (const entry of this.KNOWLEDGE_BASE) {
            const matchCount = entry.keywords.filter(kw => latestUserMessage.includes(kw)).length;
            if (matchCount > 0) {
                const score = matchCount * entry.weight;
                if (score > bestWeight) {
                    bestWeight = score;
                    bestMatch = entry;
                }
            }
        }

        if (bestMatch) {
            return bestMatch.response;
        }

        // ── FALLBACK — Direct, mentor-like, no fluff ──
        return `Good question. I'm currently running on my local knowledge protocol, so I don't have a specific answer for that one yet.\n\nTo unlock my full potential, connect a real API key (OpenAI, Gemini, or Hugging Face) in the app.js file — look for the API SERVICE section.\n\nOnce connected, I become your real-time source of truth. No guessing, only verified data.\n\nWhat else can I help with, Egi?`;
    }
};


// ==========================================
// 💾 SECTION 2: STATE MANAGEMENT MODULE
// ==========================================
const ChatStateManager = {
    STORAGE_KEYS: {
        CONVERSATIONS: 'egi_ai_conversations',
        ACTIVE_ID: 'egi_ai_active_id'
    },
    conversations: [],
    activeConversationId: null,

    DEFAULT_WELCOME_CHAT: {
        id: 'welcome-chat-id',
        title: 'Welcome to EgiAI',
        messages: [
            {
                role: 'assistant',
                content: "What is our mission today, Egi?\n\nI'm EgiAI — your autonomous senior digital partner and Second Brain. I'm locked in and ready to execute.\n\nI can help with:\n• 🏗️ Code architecture & debugging\n• 🎨 Frontend design & responsive layouts\n• 📚 Technical mentorship & clean code reviews\n• 🔍 Knowledge queries (connect an API key for real-time search)\n• 💬 Bilingual — English & Shqip (Geg dialect)\n\nDrop me a task, pick a suggestion below, or just start typing. Let's build something legendary.",
                timestamp: ""
            }
        ]
    },

    getFormattedTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    generateUniqueId() {
        return 'chat_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    },

    loadState() {
        this.DEFAULT_WELCOME_CHAT.messages[0].timestamp = this.getFormattedTime();
        try {
            const storedConversations = localStorage.getItem(this.STORAGE_KEYS.CONVERSATIONS);
            const storedActiveId = localStorage.getItem(this.STORAGE_KEYS.ACTIVE_ID);
            
            if (storedConversations) {
                this.conversations = JSON.parse(storedConversations);
            } else {
                this.conversations = [this.DEFAULT_WELCOME_CHAT];
            }

            if (storedActiveId && this.conversations.some(c => c.id === storedActiveId)) {
                this.activeConversationId = storedActiveId;
            } else {
                this.activeConversationId = this.conversations[0]?.id || null;
            }
        } catch (error) {
            console.error("Failed to load state from localStorage:", error);
            this.conversations = [this.DEFAULT_WELCOME_CHAT];
            this.activeConversationId = this.DEFAULT_WELCOME_CHAT.id;
        }
    },

    saveState() {
        try {
            localStorage.setItem(this.STORAGE_KEYS.CONVERSATIONS, JSON.stringify(this.conversations));
            localStorage.setItem(this.STORAGE_KEYS.ACTIVE_ID, this.activeConversationId);
        } catch (error) {
            console.error("Failed to save state to localStorage:", error);
        }
    },

    getConversations() {
        return this.conversations;
    },

    getActiveConversation() {
        return this.conversations.find(c => c.id === this.activeConversationId) || null;
    },

    getActiveConversationId() {
        return this.activeConversationId;
    },

    setActiveConversationId(id) {
        if (this.conversations.some(c => c.id === id)) {
            this.activeConversationId = id;
            this.saveState();
        }
    },

    createConversation(title = 'New Chat') {
        const newChat = {
            id: this.generateUniqueId(),
            title: title,
            messages: []
        };
        this.conversations.unshift(newChat);
        this.activeConversationId = newChat.id;
        this.saveState();
        return newChat;
    },

    renameConversation(id, newTitle) {
        const conversation = this.conversations.find(c => c.id === id);
        if (conversation && newTitle.trim()) {
            conversation.title = newTitle.trim();
            this.saveState();
        }
    },

    deleteConversation(id) {
        this.conversations = this.conversations.filter(c => c.id !== id);
        if (this.activeConversationId === id) {
            this.activeConversationId = this.conversations[0]?.id || null;
        }
        this.saveState();
    },

    addMessage(conversationId, role, content) {
        const conversation = this.conversations.find(c => c.id === conversationId);
        if (conversation) {
            const newMessage = {
                role,
                content,
                timestamp: this.getFormattedTime()
            };
            conversation.messages.push(newMessage);

            // Auto-update title if first user message
            if (role === 'user' && conversation.messages.filter(m => m.role === 'user').length === 1) {
                let autoTitle = content.trim();
                if (autoTitle.length > 28) {
                    autoTitle = autoTitle.substring(0, 25) + '...';
                }
                conversation.title = autoTitle;
            }

            this.saveState();
        }
    }
};


// ==========================================
// 💻 SECTION 3: UI CONTROLLER & EVENT BINDINGS
// ==========================================
const UIController = {
    // DOM Elements Cache
    chatList: null,
    messagesWindow: null,
    activeChatTitle: null,
    chatForm: null,
    chatInput: null,
    sendBtn: null,
    newChatBtn: null,
    menuToggleBtn: null,
    closeSidebarBtn: null,
    sidebarOverlay: null,

    // Suggestion topics — Aligned with the EgiAI Master Protocol
    SUGGESTIONS: [
        { title: "Who is Egi Emini?", desc: "My creator — developer, gamer, artist. The full profile." },
        { title: "What is the EgiAI protocol?", desc: "My 3-step reasoning engine and architecture explained." },
        { title: "Show me Egi's projects", desc: "Coin Flip, Embrace Website, Portfolio, and more." },
        { title: "Teach me clean code", desc: "ES6+ best practices, anti-patterns, and mentorship." }
    ],

    isAiTyping: false,

    init() {
        // Cache DOM selectors
        this.chatList = document.getElementById('chat-list');
        this.messagesWindow = document.getElementById('messages-window');
        this.activeChatTitle = document.getElementById('active-chat-title');
        this.chatForm = document.getElementById('chat-form');
        this.chatInput = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('send-btn');
        this.newChatBtn = document.getElementById('new-chat-btn');
        this.menuToggleBtn = document.getElementById('menu-toggle-btn');
        this.closeSidebarBtn = document.getElementById('close-sidebar-btn');
        this.sidebarOverlay = document.getElementById('sidebar-overlay');

        // Load State from storage
        ChatStateManager.loadState();

        // Bind events & Render initial UI
        this.bindEvents();
        this.renderApp();
    },

    bindEvents() {
        // Handle message submissions
        this.chatForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Create new chat
        this.newChatBtn.addEventListener('click', () => {
            ChatStateManager.createConversation();
            this.renderApp();
            this.closeMobileSidebar();
            this.chatInput.focus();
        });

        // Sidebar drawer bindings
        this.menuToggleBtn.addEventListener('click', () => this.openMobileSidebar());
        this.closeSidebarBtn.addEventListener('click', () => this.closeMobileSidebar());
        this.sidebarOverlay.addEventListener('click', () => this.closeMobileSidebar());
    },

    renderApp() {
        this.renderSidebar();
        this.renderChatWindow();
    },

    renderSidebar() {
        this.chatList.innerHTML = '';
        const conversations = ChatStateManager.getConversations();
        const activeId = ChatStateManager.getActiveConversationId();

        conversations.forEach(chat => {
            const li = document.createElement('li');
            li.className = `chat-item ${chat.id === activeId ? 'active' : ''}`;
            li.setAttribute('data-id', chat.id);

            // Select chat
            li.addEventListener('click', (e) => {
                if (!e.target.closest('.btn-chat-action')) {
                    ChatStateManager.setActiveConversationId(chat.id);
                    this.renderApp();
                    this.closeMobileSidebar();
                }
            });

            // Chat title info
            const infoDiv = document.createElement('div');
            infoDiv.className = 'chat-title-container';
            infoDiv.innerHTML = `
                <svg class="chat-item-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span class="chat-title-text">${this.escapeHTML(chat.title)}</span>
            `;
            li.appendChild(infoDiv);

            // Actions (Rename / Delete)
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'chat-actions';

            // Rename button
            const renameBtn = document.createElement('button');
            renameBtn.className = 'btn-chat-action rename';
            renameBtn.setAttribute('aria-label', 'Rename Chat');
            renameBtn.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon>
                </svg>
            `;
            renameBtn.addEventListener('click', () => this.handleRenameChat(chat.id, chat.title));
            actionsDiv.appendChild(renameBtn);

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-chat-action delete';
            deleteBtn.setAttribute('aria-label', 'Delete Chat');
            deleteBtn.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            `;
            deleteBtn.addEventListener('click', () => this.handleDeleteChat(chat.id));
            actionsDiv.appendChild(deleteBtn);

            li.appendChild(actionsDiv);
            this.chatList.appendChild(li);
        });
    },

    renderChatWindow() {
        this.messagesWindow.innerHTML = '';
        const activeChat = ChatStateManager.getActiveConversation();

        if (!activeChat) {
            this.activeChatTitle.textContent = "Egi AI";
            this.renderEmptyState();
            return;
        }

        this.activeChatTitle.textContent = activeChat.title;

        if (activeChat.messages.length === 0) {
            this.renderEmptyState();
            return;
        }

        activeChat.messages.forEach(msg => {
            const row = document.createElement('div');
            row.className = `message-row ${msg.role}`;
            const isUser = msg.role === 'user';

            row.innerHTML = `
                <div class="message-avatar">${isUser ? 'U' : 'AI'}</div>
                <div class="message-content-wrapper">
                    <div class="message-bubble">${this.formatMessageBody(msg.content)}</div>
                    <span class="message-meta">${msg.timestamp}</span>
                </div>
            `;
            this.messagesWindow.appendChild(row);
        });

        this.scrollToBottom();
    },

    renderEmptyState() {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-state';
        emptyDiv.innerHTML = `
            <div class="empty-logo">&lt;/&gt;</div>
            <h2 class="empty-title">EgiAI</h2>
            <p class="empty-subtitle">Your autonomous senior digital partner. Direct, no fluff, always locked in. What's the mission?</p>
            <div class="suggestion-grid" id="suggestion-grid"></div>
        `;
        this.messagesWindow.appendChild(emptyDiv);

        const suggestionGrid = emptyDiv.querySelector('#suggestion-grid');
        this.SUGGESTIONS.forEach(sug => {
            const card = document.createElement('button');
            card.className = 'suggestion-card';
            card.innerHTML = `
                <h4>${this.escapeHTML(sug.title)}</h4>
                <p>${this.escapeHTML(sug.desc)}</p>
            `;
            card.addEventListener('click', () => {
                this.chatInput.value = sug.title;
                this.chatForm.dispatchEvent(new Event('submit'));
            });
            suggestionGrid.appendChild(card);
        });
    },

    async handleFormSubmit(e) {
        e.preventDefault();
        const text = this.chatInput.value.trim();
        if (!text || this.isAiTyping) return;

        let activeChat = ChatStateManager.getActiveConversation();
        if (!activeChat) {
            activeChat = ChatStateManager.createConversation();
        }

        const chatId = activeChat.id;

        // Add user prompt to state & UI
        ChatStateManager.addMessage(chatId, 'user', text);
        this.chatInput.value = '';
        this.renderApp();

        // Show typing indicator bubble
        const typingRow = this.showTypingIndicator();
        this.scrollToBottom();

        // Disable input buttons during submission wait
        this.isAiTyping = true;
        this.toggleInputState(false);

        try {
            const conversation = ChatStateManager.getConversations().find(c => c.id === chatId);
            const history = conversation ? conversation.messages : [];
            
            // Query model response
            const responseText = await ApiService.fetchChatResponse(history);
            
            typingRow.remove();
            ChatStateManager.addMessage(chatId, 'assistant', responseText);
        } catch (error) {
            console.error("AI chatbot query failed:", error);
            typingRow.remove();
            ChatStateManager.addMessage(chatId, 'assistant', "Error: Failed to fetch AI response. Please ensure API settings are valid.");
        } finally {
            this.isAiTyping = false;
            this.toggleInputState(true);
            this.renderApp();
        }
    },

    showTypingIndicator() {
        const row = document.createElement('div');
        row.className = 'message-row assistant typing-loader';
        row.innerHTML = `
            <div class="message-avatar">AI</div>
            <div class="message-content-wrapper">
                <div class="message-bubble">
                    <div class="typing-indicator">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        `;
        this.messagesWindow.appendChild(row);
        return row;
    },

    handleRenameChat(id, oldTitle) {
        const newTitle = prompt("Rename conversation title:", oldTitle);
        if (newTitle && newTitle.trim() && newTitle.trim() !== oldTitle) {
            ChatStateManager.renameConversation(id, newTitle);
            this.renderApp();
        }
    },

    handleDeleteChat(id) {
        if (confirm("Are you sure you want to delete this conversation?")) {
            ChatStateManager.deleteConversation(id);
            this.renderApp();
        }
    },

    toggleInputState(isEnabled) {
        this.chatInput.disabled = !isEnabled;
        this.sendBtn.disabled = !isEnabled;
        if (isEnabled) {
            this.chatInput.focus();
        }
    },

    openMobileSidebar() {
        document.body.classList.add('sidebar-open');
    },

    closeMobileSidebar() {
        document.body.classList.remove('sidebar-open');
    },

    scrollToBottom() {
        this.messagesWindow.scrollTop = this.messagesWindow.scrollHeight;
    },

    escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    },

    formatMessageBody(str) {
        const escaped = this.escapeHTML(str);
        return escaped.replace(/\n/g, '<br>');
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    UIController.init();
});
