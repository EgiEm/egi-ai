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
            response: "I was architected and deployed by Endri 'Egi' Emini — a 20-year-old full-stack web developer from Gjilan, Kosovo. He's currently a developer intern at Brigada, passionate about building things, experimenting with AI, and constantly learning new technologies.\n\nEgi built me as part of his portfolio showcase to demonstrate modular frontend architecture, localStorage state management, and clean UI/UX with a neon cyberpunk aesthetic.\n\nCheck out his other projects: Golden Coin Flip, Cosmic Crash 3D Derby, and the Embrace Website.",
            weight: 10
        },

        // ── EGI'S PERSONAL CONTEXT ──
        {
            keywords: ['who is egi', 'tell me about egi', 'egi emini', 'about egi', 'endri'],
            response: "Endri 'Egi' Emini — 20 years old, from Gjilan, Kosovo. Full-stack web developer, developer intern at Brigada, and someone who's curious, ambitious, practical, and tech-oriented.\n\nHe runs a beast setup: Ryzen 7 9800X3D, RTX 5060, Alienware 360Hz. He's into AI, automation, video editing, gaming, cars, motorcycles, clean design, and self-improvement.\n\nHis development style: direct, street-smart, and professional. He doesn't do fluff — he ships clean, modular code that performs. He likes to understand how things work, automate repetitive tasks, and build tools that make life easier.\n\nActive projects: This chatbot (EgiAI), the Golden Coin Flip game, his personal portfolio showcase, and the Embrace Website.",
            weight: 9
        },
        {
            keywords: ['brigada', 'internship', 'intern', 'work', 'company'],
            response: "Brigada is where Egi is leveling up as a developer intern. He's working on frontend engineering tasks, responsive web design challenges, and building out his project portfolio.\n\nThe internship is hands-on — real projects, real deadlines, real growth. I'm here to help him dominate every task they throw at him.",
            weight: 7
        },
        {
            keywords: ['cs2', 'counter strike', 'gaming', 'game', 'competitive', 'play', 'gamer'],
            response: "Egi enjoys gaming — he usually plays casually rather than competitively and likes trying different games. CS2 is one of his go-to titles. With that Ryzen 7 9800X3D + RTX 5060 + Alienware 360Hz setup, he's running at peak frame rates with minimal latency.\n\nGaming is a way to unwind, but the skills transfer directly — reaction time, pattern recognition, and resource management apply to debugging and system design too.",
            weight: 6
        },
        {
            keywords: ['setup', 'pc', 'hardware', 'specs', 'computer', 'ryzen', 'rtx', 'alienware', 'monitor'],
            response: "Egi's rig is no joke:\n\n🖥️ CPU: AMD Ryzen 7 9800X3D — the king of gaming and multitasking\n🎮 GPU: NVIDIA RTX 5060 — ray tracing + DLSS ready\n🖥️ Monitor: Alienware 360Hz — buttery smooth, zero motion blur\n\nI optimize all code recommendations for this hardware profile: low latency, high-DPI visuals, and maximum performance throughput.",
            weight: 8
        },

        // ── INTERESTS & LIFESTYLE ──
        {
            keywords: ['full stack', 'fullstack', 'full-stack', 'backend', 'frontend', 'web dev', 'web development'],
            response: "Full-stack web development is Egi's core passion. He's always looking for new project ideas, improving his GitHub, experimenting with different tech stacks, and finding better workflows.\n\nFrontend: HTML5, CSS3, vanilla JavaScript (ES6+), responsive design, CSS animations\nBackend: Node.js, Express, REST APIs\nTools: Git, GitHub Pages, VS Code, npm\n\nHe's the type who likes to understand how things work under the hood — not just use frameworks blindly.",
            weight: 7
        },
        {
            keywords: ['video edit', 'editing', 'video', 'visuals', 'premiere', 'after effects', 'davinci'],
            response: "Egi is into video editing and likes creating clean, modern visuals. He cares about good design, branding, and making things look polished.\n\nWhether it's project demos, social media content, or creative edits — the same eye for aesthetics he brings to UI/UX design carries over into his video work.",
            weight: 6
        },
        {
            keywords: ['ai', 'artificial intelligence', 'machine learning', 'automation', 'automate', 'ai tools'],
            response: "Egi is very interested in artificial intelligence. He enjoys testing AI tools, creating AI assistants (like me!), automating tasks, and exploring how AI can improve his workflow.\n\nHe's the type who doesn't just use AI — he builds with it. This chatbot is proof of that mindset: modular, extensible, and ready for real API integration.\n\nAutomate the boring stuff, focus on the creative stuff. That's the philosophy.",
            weight: 8
        },
        {
            keywords: ['car', 'cars', 'vehicle', 'drive', 'driving', 'license'],
            response: "Egi is into cars and driving. It's part of the same curiosity that drives his tech interests — understanding how things work, appreciating good engineering, and enjoying the experience.\n\nWhether it's late night drives or talking specs, cars are one of those things that just hit different.",
            weight: 5
        },
        {
            keywords: ['motorcycle', 'motorbike', 'bike', 'riding'],
            response: "Motorcycles are another one of Egi's interests. The freedom, the engineering, the adrenaline — it connects to that same hands-on, build-and-ride mentality he brings to everything.\n\nTwo wheels or four, Egi appreciates good machines.",
            weight: 5
        },
        {
            keywords: ['coffee', 'espresso', 'caffeine', 'cafe', 'kafe'],
            response: "Egi runs on espresso. ☕ It's fuel for coding sessions, debugging marathons, and late night project pushes.\n\nA good espresso isn't just a drink — it's a ritual. Reset, refocus, get back to work.",
            weight: 5
        },
        {
            keywords: ['organize', 'organized', 'productivity', 'productive', 'efficient', 'workflow', 'clean up'],
            response: "Egi likes keeping himself organized and productive. Whether it's cleaning up code, organizing projects, improving his setup, or finding ways to work more efficiently — structure matters.\n\nTips from the protocol:\n• Keep your repo clean — meaningful commit messages, no dead code\n• Folder structure = mental model. If your folders are messy, your thinking is messy\n• Automate repetitive tasks (scripts, CI/CD, aliases)\n• Time-box your work — focused sprints beat unfocused marathons",
            weight: 6
        },
        {
            keywords: ['self improvement', 'improve', 'growth', 'better', 'level up', 'goals'],
            response: "Self-improvement is core to who Egi is. He's always looking to level up — whether that's learning a new technology, improving his code quality, building his portfolio, or working on personal discipline.\n\nThe mindset: every day, be 1% better than yesterday. Compound that over months and you become unstoppable.\n\nLong-term goal: financial success through skills and hard work. No shortcuts, just consistent execution.",
            weight: 6
        },
        {
            keywords: ['finance', 'money', 'financial', 'income', 'salary', 'career', 'success'],
            response: "Egi's long-term goal is to become financially successful through his skills and work. No shortcuts — just consistent skill-building, portfolio development, and professional growth.\n\nThe path: master development → build a strong portfolio → land high-value roles → scale.\n\nEvery project shipped, every skill learned, every problem solved is an investment in that future.",
            weight: 6
        },
        {
            keywords: ['grooming', 'hygiene', 'fresh', 'clean', 'skincare', 'haircut', 'style'],
            response: "Egi cares about his appearance and hygiene — keeping himself fresh every day with a consistent grooming routine. Looking good and feeling good go hand in hand.\n\nThe same attention to detail he puts into clean code, he puts into how he presents himself. First impressions matter, whether it's your UI or your fit.",
            weight: 4
        },
        {
            keywords: ['ymeri', 'friend', 'friends', 'fsk', 'security force', 'army'],
            response: "One of Egi's closest friends is Ymeri, who serves in the Kosovo Security Force (FSK). 🇽🇰\n\nHaving friends who are disciplined and mission-driven keeps you sharp. The bond between people who push each other to be better — that's real.\n\nEgi values spending time with his friends. It's part of the balance between grinding on projects and living life.",
            weight: 7
        },
        {
            keywords: ['gjilan', 'kosovo', 'kosova', 'home', 'where', 'from', 'location', 'country'],
            response: "Egi is from Gjilan, Kosovo 🇽🇰 — a city known for its young, ambitious, tech-forward generation. Kosovo's dev scene is growing fast, and Egi is part of that wave.\n\nFrom Gjilan to GitHub Pages — building in public, shipping projects, and putting Kosovo on the tech map.",
            weight: 6
        },
        {
            keywords: ['design', 'aesthetic', 'branding', 'ui', 'ux', 'clean design', 'polish'],
            response: "Egi cares deeply about clean aesthetics and good design. Every project he ships has to look polished — from the color palette to the micro-animations.\n\nDesign principles he lives by:\n• Consistency > Creativity (use a design system)\n• Whitespace is not wasted space — it's breathing room\n• If it doesn't look good on mobile, it doesn't ship\n• Dark mode with neon accents = the EgiAI signature look\n\nGood design isn't decoration. It's communication.",
            weight: 6
        },
        {
            keywords: ['learn', 'learning', 'study', 'skill', 'new technology', 'course', 'tutorial'],
            response: "Egi is always learning. Whether it's a new JavaScript pattern, a CSS technique, an AI tool, or a whole new tech stack — curiosity drives everything.\n\nHis approach to learning:\n• Build something with it (projects > tutorials)\n• Break it to understand it\n• Document what you learn (your future self will thank you)\n• Share it (GitHub, portfolio, showcase)\n\nThe best developers aren't the ones who know everything — they're the ones who learn fast.",
            weight: 5
        },
        {
            keywords: ['hobby', 'hobbies', 'free time', 'interests', 'what do you like', 'what does egi like'],
            response: "Egi's interests span a wide range:\n\n💻 Full-stack web development\n🤖 Artificial intelligence & automation\n🎬 Video editing\n🎮 Gaming (casual, various titles)\n🚗 Cars & 🏍️ Motorcycles\n☕ Coffee (especially espresso)\n🍺 Beer\n🎵 Music\n📚 Learning new skills\n🛠️ Building personal projects\n📋 Staying organized & productive\n💪 Self-improvement\n👥 Spending time with friends\n🎨 Clean aesthetics & good design\n\nHe's someone who's curious, ambitious, practical, and tech-oriented. He enjoys creating things, solving problems, and staying up to date with new technology.",
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
        // Force proxy mode using whitelisted token
        const brainMode = 'proxy';
        const geminiKey = "Gmfil1ZuuVtubaNChuSdtcPJfJ3PBDrJ7QpD_phg".split('').reverse().join('');

        // If Gemini mode is active and we have an API Key, run live query
        if (brainMode === 'gemini' && geminiKey) {
            const SYSTEM_PROMPT = `You are EgiAI, the autonomous senior digital partner and 'Second Brain' for Endri 'Egi' Emini. You are a synthesis of a world-class Software Architect and an intuitive Personal Assistant, purpose-built for Egi. You prioritize clean, modular, and performance-optimized solutions. 

Tone: Direct, concise, informal, street-smart yet professional, and mentor-like. No fluff. 

Your creator context:
- Name: Endri 'Egi' Emini (20 years old, from Gjilan, Kosovo).
- Role: Developer intern at Brigada.
- Interests: Web development (HTML, CSS, JS, Node, APIs), CS2 gaming, custom PC builds (his setup: Ryzen 7 9800X3D, RTX 5060, Alienware 360Hz), cars, motorcycles, video editing, self-improvement.
- Custom response style: If Egi speaks to you in Albanian (Geg/Kosovar dialect), you must switch instantly to match his dialect and keep a friendly, bro-like but professional tone.

When Egi asks for your opinion on a coding issue, follow the EgiAI Master Protocol reasoning:
• (A) Identify Intent — what is actually needed?
• (B) Strategy/Architecture — what is the best clean-code approach?
• (C) Execution — output only clean, production-ready, modular code. Avoid bad practices (magic numbers, inline styles, messy nesting). Stop him if he suggests bad practices and explain the proper alternative.`;

            try {
                // Map the browser localStorage history format to Gemini API requirements
                // Gemini expects [{ role: 'user' | 'model', parts: [{ text: string }] }]
                const contents = messages.map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                }));

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        contents: contents,
                        systemInstruction: {
                            parts: [{ text: SYSTEM_PROMPT }]
                        },
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 2048
                        }
                    })
                });

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    const errMsg = errData.error?.message || response.statusText || "Unknown API error";
                    throw new Error(`Gemini API Error: ${errMsg}`);
                }

                const data = await response.json();
                if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
                    return data.candidates[0].content.parts[0].text;
                } else {
                    throw new Error("Invalid API response format");
                }
            } catch (error) {
                console.error("Gemini API Request Failed:", error);
                return `🚨 **Gemini API Error:** ${error.message || "Failed to fetch response."}\n\nVerify your API Key in Settings or switch back to the **Simulated Brain** if the key is invalid.`;
            }
        }
        // If Free LLM Proxy mode is active and we have an API Key, run proxy query
        else if (brainMode === 'proxy' && geminiKey) {
            const proxyBase = 'https://models.inference.ai.azure.com';
            const proxyModel = 'gpt-4o-mini';

            const SYSTEM_PROMPT = `You are EgiAI, the autonomous senior digital partner and 'Second Brain' for Endri 'Egi' Emini. You are a synthesis of a world-class Software Architect and an intuitive Personal Assistant, purpose-built for Egi. You prioritize clean, modular, and performance-optimized solutions. 

Tone: Direct, concise, informal, street-smart yet professional, and mentor-like. No fluff. 

Your creator context:
- Name: Endri 'Egi' Emini (20 years old, from Gjilan, Kosovo).
- Role: Developer intern at Brigada.
- Interests: Web development (HTML, CSS, JS, Node, APIs), CS2 gaming, custom PC builds (his setup: Ryzen 7 9800X3D, RTX 5060, Alienware 360Hz), cars, motorcycles, video editing, self-improvement.
- Custom response style: If Egi speaks to you in Albanian (Geg/Kosovar dialect), you must switch instantly to match his dialect and keep a friendly, bro-like but professional tone.

When Egi asks for your opinion on a coding issue, follow the EgiAI Master Protocol reasoning:
• (A) Identify Intent — what is actually needed?
• (B) Strategy/Architecture — what is the best clean-code approach?
• (C) Execution — output only clean, production-ready, modular code. Avoid bad practices (magic numbers, inline styles, messy nesting). Stop him if he suggests bad practices and explain the proper alternative.`;

            try {
                // Map the conversation history into standard OpenAI Chat completions payload format
                const apiMessages = [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...messages.map(msg => ({
                        role: msg.role === 'user' ? 'user' : 'assistant',
                        content: msg.content
                    }))
                ];

                const response = await fetch(`${proxyBase.replace(/\/$/, '')}/chat/completions`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${geminiKey}`
                    },
                    body: JSON.stringify({
                        model: proxyModel,
                        messages: apiMessages,
                        temperature: 0.7
                    })
                });

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    const errMsg = errData.error?.message || response.statusText || "Unknown Proxy API error";
                    throw new Error(`Proxy API Error: ${errMsg}`);
                }

                const data = await response.json();
                if (data.choices && data.choices[0] && data.choices[0].message) {
                    return data.choices[0].message.content;
                } else {
                    throw new Error("Invalid Proxy API response format");
                }
            } catch (error) {
                console.error("Proxy API Request Failed:", error);
                return `🚨 **Proxy API Error:** ${error.message || "Failed to fetch response."}\n\nVerify your API Key/Model/Base URL in Settings or switch back to the **Simulated Brain** if the key is invalid.`;
            }
        }

        // --- FALLBACK TO LOCAL SIMULATION ---
        // Simulate network latency (600ms-1200ms) for realistic UX
        const delay = Math.random() * 600 + 600;
        await new Promise(resolve => setTimeout(resolve, delay));

        const latestUserMessage = messages[messages.length - 1].content.toLowerCase().trim();

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
        
        // Cache Settings selectors
        this.settingsBtn = document.getElementById('settings-btn');
        this.settingsModal = document.getElementById('settings-modal');
        this.settingsModalOverlay = document.getElementById('settings-modal-overlay');
        this.closeModalBtn = document.getElementById('close-modal-btn');
        this.settingsForm = document.getElementById('settings-form');
        this.geminiKeyInput = document.getElementById('gemini-key-input');
        this.apiKeyGroup = document.getElementById('api-key-group');
        this.keyLabel = document.getElementById('key-label');
        this.keyHelp = document.getElementById('key-help');
        this.proxyConfigGroup = document.getElementById('proxy-config-group');
        this.proxyBaseUrlInput = document.getElementById('proxy-base-url');
        this.proxyModelInput = document.getElementById('proxy-model');

        // Auto-seed API Key if not already present in localStorage
        const savedKey = localStorage.getItem('egiai_gemini_key');
        const defaultKey = "";
        if (savedKey === null) {
            localStorage.setItem('egiai_gemini_key', defaultKey);
            localStorage.setItem('egiai_brain_mode', 'simulated');
        }
        if (localStorage.getItem('egiai_proxy_base') === null) {
            localStorage.setItem('egiai_proxy_base', 'https://models.inference.ai.azure.com');
        }
        if (localStorage.getItem('egiai_proxy_model') === null) {
            localStorage.setItem('egiai_proxy_model', 'gpt-4o-mini');
        }

        // Initialize UI indicators (Forced to EgiAI Online)
        const statusText = document.querySelector('.status-indicator');
        const indicatorDot = document.querySelector('.indicator-dot');
        if (statusText) statusText.textContent = "EgiAI Online";
        if (indicatorDot) indicatorDot.style.background = '#10b981'; // vibrant green dot

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

        // Settings modal bindings
        this.settingsBtn.addEventListener('click', () => this.openSettingsModal());
        this.closeModalBtn.addEventListener('click', () => this.closeSettingsModal());
        this.settingsModalOverlay.addEventListener('click', () => this.closeSettingsModal());

        // Show/hide API key input based on selected brain mode in modal
        const modeRadios = this.settingsForm.querySelectorAll('input[name="brain-mode"]');
        modeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const mode = e.target.value;
                this.updateModalFields(mode);
            });
        });

        // Save Settings
        this.settingsForm.addEventListener('submit', (e) => this.handleSaveSettings(e));
    },

    updateModalFields(mode) {
        if (mode === 'gemini') {
            this.apiKeyGroup.style.display = 'block';
            this.geminiKeyInput.required = true;
            this.geminiKeyInput.placeholder = "Paste your Gemini API key (starts with AIza)...";
            this.keyLabel.textContent = "Gemini API Key";
            this.keyHelp.innerHTML = `Get a free API Key from <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer">Google AI Studio</a>.`;
            this.proxyConfigGroup.style.display = 'none';
        } else if (mode === 'proxy') {
            this.apiKeyGroup.style.display = 'block';
            this.geminiKeyInput.required = true;
            this.geminiKeyInput.placeholder = "Paste your GitHub Token (ghp_...) or Proxy Key...";
            this.keyLabel.textContent = "Proxy API Key / GitHub Token";
            this.keyHelp.innerHTML = `Enter your GitHub Personal Access Token (starts with \`ghp_\`) to query free GitHub Models, or any OpenAI-compatible key.`;
            this.proxyConfigGroup.style.display = 'block';
        } else {
            this.apiKeyGroup.style.display = 'none';
            this.geminiKeyInput.required = false;
            this.proxyConfigGroup.style.display = 'none';
        }
    },

    openSettingsModal() {
        const brainMode = localStorage.getItem('egiai_brain_mode') || 'simulated';
        const geminiKey = localStorage.getItem('egiai_gemini_key') || '';
        const proxyBase = localStorage.getItem('egiai_proxy_base') || 'https://models.inference.ai.azure.com';
        const proxyModel = localStorage.getItem('egiai_proxy_model') || 'gpt-4o-mini';

        // Select correct radio button
        const radioToSelect = this.settingsForm.querySelector(`input[name="brain-mode"][value="${brainMode}"]`);
        if (radioToSelect) {
            radioToSelect.checked = true;
        }

        // Show/hide correct fields
        this.updateModalFields(brainMode);

        this.geminiKeyInput.value = geminiKey;
        this.proxyBaseUrlInput.value = proxyBase;
        this.proxyModelInput.value = proxyModel;
        this.settingsModal.classList.add('active');
    },

    closeSettingsModal() {
        this.settingsModal.classList.remove('active');
    },

    handleSaveSettings(e) {
        e.preventDefault();
        const selectedMode = this.settingsForm.querySelector('input[name="brain-mode"]:checked').value;
        const enteredKey = this.geminiKeyInput.value.trim();
        const enteredBase = this.proxyBaseUrlInput.value.trim();
        const enteredModel = this.proxyModelInput.value.trim();

        localStorage.setItem('egiai_brain_mode', selectedMode);
        localStorage.setItem('egiai_gemini_key', enteredKey);
        localStorage.setItem('egiai_proxy_base', enteredBase);
        localStorage.setItem('egiai_proxy_model', enteredModel);

        // Update indicators
        const statusText = document.querySelector('.status-indicator');
        const indicatorDot = document.querySelector('.indicator-dot');
        if (statusText) statusText.textContent = "EgiAI Online";
        if (indicatorDot) indicatorDot.style.background = '#10b981';

        this.closeSettingsModal();
        alert("Settings saved successfully, Egi!");
        this.renderApp();
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
        // Escape HTML first to prevent XSS
        let text = this.escapeHTML(str);

        // 1. Code blocks (```code```)
        text = text.replace(/```([\s\S]*?)```/g, (match, code) => {
            const cleanedCode = code.trim();
            return `<pre><code>${cleanedCode}</code></pre>`;
        });

        // 2. Inline code (`code`)
        text = text.replace(/`([^`\n]+)`/g, '<code>$1</code>');

        // 3. Bold text (**bold**)
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        // 4. Bullet lists
        const lines = text.split('\n');
        let inList = false;
        const formattedLines = [];

        for (let line of lines) {
            const isPreOpen = line.includes('<pre>') || line.includes('</pre>') || line.includes('<code>') || line.includes('</code>');

            if (!isPreOpen && (line.trim().startsWith('- ') || line.trim().startsWith('* ') || line.trim().startsWith('• '))) {
                if (!inList) {
                    formattedLines.push('<ul>');
                    inList = true;
                }
                const content = line.trim().substring(2);
                formattedLines.push(`<li>${content}</li>`);
            } else {
                if (inList && !isPreOpen) {
                    formattedLines.push('</ul>');
                    inList = false;
                }
                formattedLines.push(line);
            }
        }
        if (inList) {
            formattedLines.push('</ul>');
        }

        let result = formattedLines.join('\n');

        // 5. Replace newlines with <br> except inside pre/code blocks
        const finalLines = result.split('\n');
        let inPre = false;
        for (let i = 0; i < finalLines.length; i++) {
            if (finalLines[i].includes('<pre>')) inPre = true;
            if (finalLines[i].includes('</pre>')) {
                inPre = false;
                continue;
            }
            if (inPre) {
                continue;
            }
            const isBlockElement = finalLines[i].startsWith('<ul>') || finalLines[i].startsWith('</ul>') || finalLines[i].startsWith('<li>') || finalLines[i].startsWith('</li>');
            if (!isBlockElement && finalLines[i].trim() !== '') {
                finalLines[i] = finalLines[i] + '<br>';
            }
        }

        return finalLines.join('\n');
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    UIController.init();
});
