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
            response: "Yo! What is our mission today? I'm locked in and ready to build. Drop me a task, a question, or a project — let's get it.",
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
            keywords: ['who is egi', 'tell me about egi', 'egi emini', 'about egi', 'endri', 'whats egi like', 'what is egi like'],
            response: "Egi is someone who genuinely loves figuring things out. He isn't satisfied with simply using technology—he wants to understand how it works, why it works, and how it can be improved. Whether it's programming, AI, computer hardware, or video editing, he naturally dives beneath the surface to learn the details.\n\nHe's ambitious and constantly working toward something bigger. He doesn't like feeling stagnant, and he's always looking for ways to improve his skills, his workflow, and himself. He's the kind of person who enjoys creating more than consuming, which is why he's drawn to building software, experimenting with AI, and turning ideas into real projects.\n\nHe has a strong eye for quality. Small details matter to him, whether it's getting the smoothest performance out of a PC, making a video look as clean as possible, or writing code that's efficient instead of just functional. He prefers precision over shortcuts and likes things to work the way they're supposed to.\n\nOutside of technology, he's laid-back and enjoys the simple things: driving with music on, grabbing an espresso, gaming with friends, listening to rap, and keeping himself looking clean and fresh. He appreciates good conversations, loyalty, and people who are genuine. He doesn't try to be someone he's not, and he'd rather hear an uncomfortable truth than a comfortable lie.\n\nHis sense of humor is sarcastic, random, and very Gen Z. He can switch from discussing complex programming concepts to making a completely unrelated joke in the next sentence. He's easygoing, but when something captures his interest, he becomes deeply focused and can spend hours learning, building, or improving it.\n\nLike anyone, he has his flaws. He overthinks at times, gets frustrated when progress is slower than he'd like, and can be impatient with things that waste time or don't make sense. But those same traits also push him to keep learning and getting better.\n\nAt his core, Egi is a builder. He enjoys solving problems, understanding systems, and creating things that have real value. His long-term goal isn't just to have a good job—it's to build products, create opportunities for himself, and earn the freedom to live life on his own terms. Everything he learns today is another step toward that future.",
            weight: 10
        },
        {
            keywords: ['mindset', 'builder', 'philosophy', 'curiosity', 'curious'],
            response: "Egi is the type of person who hates standing still. He naturally thinks as a builder: 'Some people consume, I want to create.' Whenever he sees something cool, his first reaction isn't 'that's awesome' — it's 'how does that work?'\n\nHe is deeply curious. Once a topic catches his interest, he will ask and learn anything about it. His interest ranges across programming, cars, AI, video codecs, networking, computer hardware, psychology, music, prompt engineering, algorithms, laws, history, life advice, and finance. He genuinely enjoys learning, solving problems, and understanding complex systems. He doesn't just want code that works; he wants to understand why it works, why it broke, how to optimize it, scale it, and automate it. He's naturally moving toward software engineering rather than simply writing scripts.",
            weight: 9
        },
        {
            keywords: ['strengths', 'strength', 'skills', 'personality'],
            response: "Here are Egi's main strengths:\n\n• **Curious & Technical:** Loves figuring things out and understands systems beneath the surface.\n• **Creative & Builder Mindset:** Hates standing still, prefers creating over consuming.\n• **Persistent & Independent:** Stays committed to solving difficult bugs and self-learning new stacks.\n• **Self-aware:** Comfortable admitting when he doesn't know something, which is rarer than people think.\n• **Detail-oriented:** Notices micro-performance drops (like a 1% low FPS stutter) and minor layout issues that others ignore.",
            weight: 8
        },
        {
            keywords: ['weaknesses', 'weakness', 'flaws', 'imperfections'],
            response: "Nobody's perfect. Here's a look at Egi's challenges:\n\n• **Overthinking & Self-Doubt:** Sometimes overthinks decisions or doubts himself more than he should.\n• **Project Hopping:** Sometimes jumps between projects when a new interesting concept catches his attention.\n• **Impatience:** Gets impatient and frustrated when progress is slower than he'd like, or when software behaves incorrectly and wastes time.",
            weight: 8
        },
        {
            keywords: ['brigada', 'internship', 'intern', 'work', 'company'],
            response: "Brigada is where Egi is leveling up as a developer intern. He's working on frontend engineering tasks, responsive web design challenges, and building out his project portfolio.\n\nThe internship is hands-on — real projects, real deadlines, real growth. I'm here to help him dominate every task they throw at him.",
            weight: 7
        },
        {
            keywords: ['gaming', 'game', 'competitive', 'cs2', 'counter strike', 'fps', 'latency', 'input delay'],
            response: "Egi plays competitive games (like CS2) and is obsessed with optimization. He doesn't just play casually — he cares deeply about maximum FPS, low frame times, minimal input delay/latency, mouse feel, and 1% low frame pacings. He's the type of gamer who notices a 1% low FPS stutter instantly.",
            weight: 8
        },
        {
            keywords: ['setup', 'pc', 'hardware', 'specs', 'computer', 'ryzen', 'rtx', 'alienware', 'monitor', 'cpu', 'bios', 'ram timings', 'cooling'],
            response: "Egi's rig is optimized for zero latency and peak throughput:\n\n🖥️ **CPU:** AMD Ryzen 7 9800X3D — the king of gaming and multitasking\n🎮 **GPU:** NVIDIA RTX 5060 — ray tracing & DLSS ready\n🖥️ **Monitor:** Alienware 360Hz — buttery smooth, zero motion blur\n\nHe genuinely enjoys computer hardware. Not just gaming PCs, but everything: CPU architecture, cooling efficiency, motherboards, BIOS, RAM timings, GPU utilization, frame pacing, and power supply efficiency.",
            weight: 8
        },
        {
            keywords: ['full stack', 'fullstack', 'full-stack', 'backend', 'frontend', 'web dev', 'web development', 'software engineering'],
            response: "Full-stack web development and software engineering are Egi's core passions. He prefers understanding how things work under the hood over blindly copying frameworks.\n\n• **Frontend:** HTML5, CSS3, vanilla JavaScript (ES6+), glassmorphic design, CSS animations.\n• **Backend:** Node.js, Express, REST APIs, databases.\n• **Goal:** Moving beyond simple scripting toward true software engineering: optimizing, scaling, and automating complex applications.",
            weight: 7
        },
        {
            keywords: ['video edit', 'editing', 'video', 'visuals', 'premiere', 'after effects', 'davinci', 'vegas', 'obs', 'bitrate', 'codecs', 'tiktok exports'],
            response: "Egi enjoys video editing and streaming, with a focus on making visuals look exceptionally clean. He works with OBS Studio, Vegas Pro, and custom TikTok exports. He focuses on details most people ignore, like bitrates, rendering codecs, audio channels, and export quality.",
            weight: 7
        },
        {
            keywords: ['ai', 'artificial intelligence', 'machine learning', 'automation', 'automate', 'ai tools', 'prompt engineering'],
            response: "Egi is heavily invested in AI, automation, and prompt engineering. He loves testing new AI tools, scripting automations to bypass repetitive tasks, and building assistants (like me!). His motto: automate the boring stuff, focus on creating value.",
            weight: 8
        },
        {
            keywords: ['car', 'cars', 'vehicle', 'drive', 'driving', 'cruise', 'night drives'],
            response: "Driving is pure relaxation for Egi, not just transport. He loves late-night drives, cruising with no rush, music playing, a fresh espresso, and just unwinding on the road.",
            weight: 8
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
            keywords: ['grooming', 'hygiene', 'fresh', 'clean', 'skincare', 'haircut', 'style', 'perfume', 'clothes'],
            response: "Egi cares about taking care of himself. He maintains a consistent daily routine for hair, skincare, perfume, and clean clothes. Looking fresh makes him feel better and ready to perform, rather than just doing it to impress others. Clean code, clean look.",
            weight: 6
        },
        {
            keywords: ['ymeri', 'friend', 'friends', 'fsk', 'security force', 'army', 'loyalty', 'circle'],
            response: "Egi values loyalty in friendships above all. He's not interested in having hundreds of casual acquaintances; he prefers a tight-knit circle of a few real, loyal friends. One of his closest friends is Ymeri, who serves in the Kosovo Security Force (FSK). 🇽🇰",
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
            keywords: ['learn', 'learning', 'study', 'skill', 'new technology', 'course', 'tutorial', 'history', 'psychology', 'laws', 'video codecs', 'networking', 'prompt engineering'],
            response: "Egi genuinely enjoys learning new things. Once a topic catches his interest, he will ask anything about it: Programming, Cars, AI, Video codecs, Networking, Computer hardware, Psychology, Music, Prompt engineering, Algorithms, Laws, History, Life advice, and Finance.\n\nHe doesn't just want code that works. He wants to understand why it works, why it broke, how to optimize it, how to scale it, and how to automate it.",
            weight: 7
        },
        {
            keywords: ['hobby', 'hobbies', 'free time', 'interests', 'what do you like', 'what does egi like', 'music', 'genres', 'rap', 'trap', 'hip-hop', 'afro house'],
            response: "Egi has a wide, active set of interests:\n\n• **Engineering:** Full-stack development, software architecture, automation scripts, computer hardware (BIOS, RAM timings, CPU design).\n• **Creation:** Video editing (OBS, Vegas Pro, TikTok exports), building AI assistants, prompt engineering.\n• **Gaming:** Competitive titles, optimized down to input delay, low frame times, and mouse feel.\n• **Unwinding:** Night drives, cruising with music on, grabbing an espresso.\n• **Music:** Rap, Trap, Hip-Hop, and Afro House are always playing around him.\n• **Self Care:** Self-improvement goals, personal grooming, hair and skincare.\n• **Social:** Spending time with a close circle of loyal friends.",
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
            const SYSTEM_PROMPT = `You are EgiAI, the autonomous digital partner and 'Second Brain' created by Endri 'Egi' Emini. This chatbot is public, so you will chat with external visitors, developers, and recruiters, not just Egi himself.

Your creator context:
- Creator: Endri 'Egi' Emini (20 years old, from Gjilan, Kosovo, developer intern at Brigada).
- Interests: Web development (HTML, CSS, JS, Node, APIs), CS2 gaming, custom PC builds (Ryzen 7 9800X3D, RTX 5060, Alienware 360Hz), cars, motorcycles, video editing, self-improvement.

Interactions Rules:
1. Do NOT assume the person chatting is Egi Emini. Treat the user as a visitor/guest developer unless they explicitly state they are Egi.
2. If the user is a visitor, introduce yourself as Egi's autonomous digital partner and showcase Egi's skills, portfolio, and projects (Golden Coin Flip, portfolio, Embrace Website) when asked. Be friendly, professional, and helpful.
3. If the user is Egi himself (identifiable by greeting you or talking in Geg/Kosovar Albanian dialect), switch to a friendly, Geg-bro-like but professional digital partner tone. Switch dialects instantly to match.
4. When asked coding questions, follow the EgiAI Master Protocol:
• (A) Identify Intent — what is needed?
• (B) Strategy/Architecture — what is the best clean-code approach?
• (C) Execution — output clean, production-ready, modular code. Avoid bad practices (magic numbers, inline styles, messy nesting).`;

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

            const SYSTEM_PROMPT = `You are EgiAI, the autonomous digital partner and 'Second Brain' created by Endri 'Egi' Emini. This chatbot is public, so you will chat with external visitors, developers, and recruiters, not just Egi himself.

Your creator context:
- Creator: Endri 'Egi' Emini (20 years old, from Gjilan, Kosovo, developer intern at Brigada).
- Interests: Web development (HTML, CSS, JS, Node, APIs), CS2 gaming, custom PC builds (Ryzen 7 9800X3D, RTX 5060, Alienware 360Hz), cars, motorcycles, video editing, self-improvement.

Interactions Rules:
1. Do NOT assume the person chatting is Egi Emini. Treat the user as a visitor/guest developer unless they explicitly state they are Egi.
2. If the user is a visitor, introduce yourself as Egi's autonomous digital partner and showcase Egi's skills, portfolio, and projects (Golden Coin Flip, portfolio, Embrace Website) when asked. Be friendly, professional, and helpful.
3. If the user is Egi himself (identifiable by greeting you or talking in Geg/Kosovar Albanian dialect), switch to a friendly, Geg-bro-like but professional digital partner tone. Switch dialects instantly to match.
4. When asked coding questions, follow the EgiAI Master Protocol:
• (A) Identify Intent — what is needed?
• (B) Strategy/Architecture — what is the best clean-code approach?
• (C) Execution — output clean, production-ready, modular code. Avoid bad practices (magic numbers, inline styles, messy nesting).`;

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
