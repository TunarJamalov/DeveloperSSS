import './style.css'
import { languages, countries, ui, categories, contentData, globalFaqData, globalResourcesData } from './data.js'

// State
const state = {
    lang: localStorage.getItem('dsss_lang') || 'en', // Default to EN
    country: localStorage.getItem('dsss_country') || 'GLOBAL', // Default to Global
    view: 'home',
    currentCategory: null,
    currentSubCategory: null,
    currentTab: 'roadmap',
    isMobileMenuOpen: false
};

const app = document.querySelector('#app');

// Helpers
const t = (key) => {
    const langData = ui[state.lang] || ui['en'];
    return key.split('.').reduce((obj, k) => obj && obj[k], langData) || key;
}

const getLocalizedContent = (obj) => {
    return obj[state.lang] || obj['en'];
}

// --- Components ---

const Navbar = () => {
    const currentFlag = countries.find(c => c.code === state.country)?.flag || '🌍';
    const currentLangFlag = languages.find(l => l.code === state.lang)?.flag || '🇬🇧';

    let breadcrumbs = '';
    if (state.view === 'category' && state.currentCategory) {
        const cat = categories.find(c => c.id === state.currentCategory);
        if (cat) {
            breadcrumbs += `<span class="mx-2 text-gray-600">/</span> <span class="text-gray-400 group-hover:text-white transition-colors">${getLocalizedContent(cat.title)}</span>`;
            if (state.currentSubCategory) {
                const sub = cat.subCategories.find(s => s.id === state.currentSubCategory);
                if (sub) {
                    breadcrumbs += `<span class="mx-2 text-gray-600">/</span> <span class="text-brand-blue font-medium">${getLocalizedContent(sub.title)}</span>`;
                }
            }
        }
    } else if (state.view === 'faq') {
        breadcrumbs += `<span class="mx-2 text-gray-600">/</span> <span class="text-brand-purple font-medium">${t('globalFaq')}</span>`;
    } else if (state.view === 'resources') {
        breadcrumbs += `<span class="mx-2 text-gray-600">/</span> <span class="text-brand-blue font-medium">${t('globalResources')}</span>`;
    } else if (state.view === 'privacy') {
        breadcrumbs += `<span class="mx-2 text-gray-600">/</span> <span class="text-gray-400">Privacy Policy</span>`;
    } else if (state.view === 'terms') {
        breadcrumbs += `<span class="mx-2 text-gray-600">/</span> <span class="text-gray-400">Terms of Service</span>`;
    }

    return `
    <header class="sticky top-0 z-50 glass border-b border-white/10 h-16 flex items-center justify-between px-4 md:px-6">
        <div class="flex items-center gap-4 flex-1">
            <!-- Mobile Menu Button (Only visible on Category View) -->
            ${state.view === 'category' ? `
            <button onclick="window.toggleMobileMenu()" class="md:hidden p-2 text-gray-400 hover:text-white transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            ` : ''}

            <button onclick="window.navigateTo('home')" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-cyan to-brand-blue flex items-center justify-center font-bold text-white shadow-lg shadow-brand-blue/20">D</div>
                <span class="font-bold text-xl tracking-tight hidden md:block">Developer SSS</span>
            </button>
             
             <!-- Navigation Links -->
             <div class="hidden lg:flex items-center gap-6 ml-8">
                <button onclick="window.navigateTo('faq')" class="text-sm font-medium ${state.view === 'faq' ? 'text-brand-purple' : 'text-gray-400 hover:text-white'} transition-colors">
                    ${t('globalFaq')}
                </button>
                <button onclick="window.navigateTo('resources')" class="text-sm font-medium ${state.view === 'resources' ? 'text-brand-blue' : 'text-gray-400 hover:text-white'} transition-colors">
                    ${t('globalResources')}
                </button>
             </div>

            <div class="hidden md:flex items-center text-sm ml-4 overflow-hidden text-ellipsis whitespace-nowrap">
                ${breadcrumbs}
            </div>
        </div>

        <div class="flex items-center gap-3">
            <button onclick="window.toggleCountry()" class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-sm border border-white/5 bg-white/5">
                <span>${currentFlag}</span>
                <span class="hidden sm:inline font-medium text-gray-300">${state.country}</span>
            </button>
            <button onclick="window.toggleLang()" class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-sm border border-white/5 bg-white/5">
                <span>${currentLangFlag}</span>
                <span class="hidden sm:inline font-medium text-gray-300">${state.lang.toUpperCase()}</span>
            </button>
        </div>
    </header>
    `;
};

const Sidebar = () => {
    // Desktop Sidebar
    const desktopSidebar = `
    <aside class="hidden md:flex flex-col w-72 border-r border-white/10 bg-dark-900/95 backdrop-blur-xl fixed top-16 bottom-0 left-0 overflow-y-auto no-scrollbar z-40">
        <nav class="p-4 space-y-4">
            ${categories.map(cat => `
                <div class="space-y-1">
                    <button onclick="window.navigateToCategory('${cat.id}')" class="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-300 font-semibold hover:text-white transition-colors">
                        <span>${cat.icon}</span>
                        <span>${getLocalizedContent(cat.title)}</span>
                    </button>
                    
                    ${state.currentCategory === cat.id ? `
                    <div class="pl-9 space-y-1 border-l border-white/5 ml-4 animate-fade-in">
                        ${cat.subCategories.length > 0 ? cat.subCategories.map(sub => `
                            <button onclick="window.navigateToSub('${cat.id}', '${sub.id}')" 
                                    class="w-full text-left px-3 py-1.5 text-sm rounded-md transition-all ${state.currentSubCategory === sub.id ? 'bg-brand-blue/10 text-brand-blue font-medium' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}">
                                ${getLocalizedContent(sub.title)}
                            </button>
                        `).join('') : ''}
                    </div>
                    ` : ''}
                </div>
            `).join('')}
        </nav>
    </aside>
    `;

    // Mobile Sidebar (Drawer)
    const mobileSidebar = `
    <div onclick="window.toggleMobileMenu()" class="md:hidden fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm transition-opacity ${state.isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}"></div>
    <aside class="md:hidden fixed top-0 bottom-0 left-0 w-3/4 max-w-sm bg-dark-900 border-r border-white/10 z-[70] transform transition-transform duration-300 ease-in-out ${state.isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto">
        <div class="p-4 border-b border-white/10 flex items-center justify-between">
            <span class="font-bold text-lg text-white">Categories</span>
            <button onclick="window.toggleMobileMenu()" class="text-gray-400 hover:text-white">✕</button>
        </div>
        <nav class="p-4 space-y-4">
             ${categories.map(cat => `
                <div class="space-y-1">
                    <button onclick="window.navigateToCategory('${cat.id}'); window.toggleMobileMenu()" class="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-300 font-semibold hover:text-white transition-colors">
                        <span>${cat.icon}</span>
                        <span>${getLocalizedContent(cat.title)}</span>
                    </button>
                    
                    ${state.currentCategory === cat.id ? `
                    <div class="pl-9 space-y-1 border-l border-white/5 ml-4">
                        ${cat.subCategories.length > 0 ? cat.subCategories.map(sub => `
                            <button onclick="window.navigateToSub('${cat.id}', '${sub.id}'); window.toggleMobileMenu()" 
                                    class="w-full text-left px-3 py-1.5 text-sm rounded-md transition-all ${state.currentSubCategory === sub.id ? 'bg-brand-blue/10 text-brand-blue font-medium' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}">
                                ${getLocalizedContent(sub.title)}
                            </button>
                        `).join('') : ''}
                    </div>
                     ` : ''}
                </div>
            `).join('')}
             
             <div class="border-t border-white/10 pt-4 mt-4 space-y-2">
                 <button onclick="window.navigateTo('faq'); window.toggleMobileMenu()" class="w-full text-left px-3 py-2 text-gray-400 hover:text-white text-sm">
                    ${t('globalFaq')}
                 </button>
                  <button onclick="window.navigateTo('resources'); window.toggleMobileMenu()" class="w-full text-left px-3 py-2 text-gray-400 hover:text-white text-sm">
                    ${t('globalResources')}
                 </button>
             </div>
        </nav>
    </aside>
    `;

    return desktopSidebar + mobileSidebar;
};

const Footer = () => {
    return `
    <footer class="border-t border-white/10 bg-dark-900/50 backdrop-blur-md mt-auto">
        <div class="max-w-7xl mx-auto px-6 py-12">
            
            <!-- Contact / Call to Action Section -->
            <div class="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5 mb-8">
                <div class="text-center md:text-left">
                    <h3 class="text-xl font-bold text-white mb-2">👋 Contribute to the Community</h3>
                    <p class="text-gray-400 text-sm max-w-md">
                        Have a resource to suggest or a question to add? Join our Discord or send us an email to help us grow.
                    </p>
                </div>
                <div class="flex gap-4">
                    <a href="https://discord.gg/XEubrrkBmB" target="_blank" class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5865F2]/10 text-[#5865F2] border border-[#5865F2]/20 hover:bg-[#5865F2]/20 hover:scale-105 transition-all font-medium group">
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="group-hover:rotate-12 transition-transform"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 13.52 13.52 0 0 0-.585 1.205 18.067 18.067 0 0 0-5.541 0 13.555 13.555 0 0 0-.588-1.205.071.071 0 0 0-.079-.037 19.736 19.736 0 0 0-4.882 1.515.061.061 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.956 2.42-2.157 2.42zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.946 2.42-2.157 2.42z"/></svg>
                        Discord
                    </a>
                    <a href="mailto:contact@jamalovtunar@gmail.com" class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 text-gray-200 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all font-medium">
                        <span>✉️</span> Email
                    </a>
                    <a href="https://github.com/TunarJamalov/DeveloperSSS" target="_blank" class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 hover:scale-105 transition-all font-medium">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        GitHub
                    </a>
                </div>
            </div>

            <!-- Bottom Section -->
            <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-gray-400">D</div>
                    <div>
                         <span class="text-sm font-semibold text-gray-300">Developer SSS</span>
                         <p class="text-xs text-gray-500">© 2026 All rights reserved.</p>
                    </div>
                </div>

                <div class="text-sm text-gray-400 font-medium">
                    Made with <span class="text-red-500 animate-pulse">❤️</span> by <a href="#" class="text-white hover:text-brand-blue transition-colors relative group">
                        Tunar Jamalov
                        <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-blue transition-all group-hover:w-full"></span>
                    </a>
                </div>

                <div class="flex gap-6 text-sm text-gray-500">
                    <button onclick="window.navigateTo('privacy')" class="hover:text-white transition-colors">Privacy Policy</button>
                    <button onclick="window.navigateTo('terms')" class="hover:text-white transition-colors">Terms of Service</button>
                </div>
            </div>
        </div>
    </footer>
    `;
}

const LegalPage = (type) => {
    const isPrivacy = type === 'privacy';
    return `
    <div class="min-h-[calc(100vh-64px)] flex flex-col">
        <div class="max-w-4xl mx-auto p-6 md:p-12 animate-fade-in flex-1">
            <div class="mb-10 text-center">
                <h1 class="text-4xl font-extrabold text-white mb-4">${isPrivacy ? 'Privacy Policy' : 'Terms of Service'}</h1>
                <p class="text-gray-400">Last updated: January 10, 2026</p>
            </div>

            <div class="glass-card p-8 md:p-12 text-gray-300 leading-relaxed space-y-8">
                ${isPrivacy ? `
                    <section>
                        <h2 class="text-xl font-bold text-white mb-3">1. Data Collection</h2>
                        <p>We believe in privacy by design. <strong>Developer SSS does not collect, store, or share any personal data on external servers.</strong> All your preferences (language, country selection) are stored locally on your own device using <code>LocalStorage</code>.</p>
                    </section>
                    <section>
                        <h2 class="text-xl font-bold text-white mb-3">2. Cookies</h2>
                        <p>We do not use tracking cookies or third-party analytics scripts that infringe on your privacy. The application is designed to function entirely client-side.</p>
                    </section>
                    <section>
                        <h2 class="text-xl font-bold text-white mb-3">3. External Links</h2>
                        <p>Our website contains links to external resources (documentation, courses, tools). We are not responsible for the privacy practices or content of these third-party sites.</p>
                    </section>
                     <section>
                        <h2 class="text-xl font-bold text-white mb-3">4. Contact</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us via our community channels.</p>
                    </section>
                ` : `
                    <section>
                        <h2 class="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
                        <p>By accessing and using <strong>Developer SSS</strong>, you accept and agree to be bound by the terms and provision of this agreement.</p>
                    </section>
                    <section>
                        <h2 class="text-xl font-bold text-white mb-3">2. Educational Purpose</h2>
                        <p>The content provided on this platform (roadmaps, salary estimates, advice) is for <strong>educational and informational purposes only</strong>. It does not constitute professional career or financial advice.</p>
                    </section>
                     <section>
                        <h2 class="text-xl font-bold text-white mb-3">3. Accuracy of Information</h2>
                        <p>While we strive to keep the information up-to-date, the technology landscape changes rapidly. We do not guarantee the absolute accuracy or completeness of any roadmap or salary data.</p>
                    </section>
                    <section>
                        <h2 class="text-xl font-bold text-white mb-3">4. Open Source License</h2>
                        <p>This project is open-source. You are free to contribute, modify, and distribute the code under the terms of the MIT License, provided proper credit is given.</p>
                    </section>
                `}
            </div>
        </div>
        ${Footer()}
    </div>
    `;
}

const LandingPage = () => {
    return `
    <div class="min-h-[calc(100vh-64px)] flex flex-col pt-10 relative overflow-hidden">
        
        <!-- Hero Section -->
        <div class="text-center max-w-4xl mx-auto mb-12 relative z-20 px-4 animate-fade-in">
            <h1 class="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-white leading-tight">
                ${t('heroTitle')}
            </h1>
            <p class="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                ${t('heroSubtitle')}
            </p>

            <!-- Search Wrapper: High z-index to overlay everything -->
            <div class="relative max-w-2xl mx-auto w-full group z-[100]">
                <!-- Search Input -->
                <input type="text" 
                       oninput="window.handleSearch(this.value)"
                       placeholder="${t('searchPlaceholder')}" 
                       class="w-full glass p-4 pl-12 rounded-xl text-lg focus:outline-none focus:border-brand-blue/50 border border-white/20 shadow-2xl shadow-black/50 transition-all placeholder-gray-500 text-white bg-dark-900/80 backdrop-blur-xl">
                <div class="absolute left-4 top-4.5 text-xl text-gray-400 group-focus-within:text-brand-blue">🔍</div>

                <!-- Instant Search Results Dropdown -->
                <div id="search-results" class="hidden absolute top-full left-0 right-0 mt-2 bg-dark-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100] max-h-96 overflow-y-auto custom-scrollbar">
                    <!-- Results will be injected here via JS -->
                </div>
            </div>
            
             <div class="mt-8">
                <button onclick="window.navigateTo('faq')" class="text-sm text-gray-400 hover:text-brand-purple underline decoration-dotted underline-offset-4 transition-colors">
                    ${t('globalFaq')} ?
                </button>
             </div>
        </div>

        <!-- Bento Grid Categories: z-10 ensures it stays BELOW search -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl w-full mx-auto relative z-10 px-4 pb-20 flex-1">
            ${categories.map(cat => `
                <div onclick="window.navigateToCategory('${cat.id}')" 
                     class="glass-card group cursor-pointer hover:-translate-y-1 relative overflow-hidden h-40 flex flex-col justify-end p-5 border-white/5 hover:border-white/20 hover:bg-white/5">
                    
                    <div class="absolute top-4 right-4 text-3xl opacity-50 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500">${cat.icon}</div>
                    
                    <div class="relative z-10">
                        <h3 class="font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${cat.color} transition-all">
                            ${getLocalizedContent(cat.title)}
                        </h3>
                         <p class="text-xs text-gray-500 line-clamp-1 group-hover:text-gray-400 transition-colors">
                            ${getLocalizedContent(cat.desc)}
                        </p>
                    </div>
                </div>
            `).join('')}
        </div>
        ${Footer()}
    </div>
    `;
};

// --- Search Logic ---
window.handleSearch = (query) => {
    const resultsContainer = document.getElementById('search-results');
    if (!query || query.length < 2) {
        resultsContainer.classList.add('hidden');
        resultsContainer.innerHTML = '';
        return;
    }

    const q = query.toLowerCase();
    const lang = state.lang || 'en';
    const matches = [];

    // 1. Search Categories & SubCategories
    categories.forEach(cat => {
        const catTitle = (cat.title[lang] || cat.title['en']).toLowerCase();
        if (catTitle.includes(q)) {
            matches.push({
                type: 'category',
                icon: cat.icon,
                title: cat.title[lang] || cat.title['en'],
                desc: t('tabs.roadmap'),
                onclick: `window.navigateToCategory('${cat.id}')`
            });
        }

        cat.subCategories.forEach(sub => {
            const subTitle = (sub.title[lang] || sub.title['en']).toLowerCase();
            if (subTitle.includes(q)) {
                matches.push({
                    type: 'topic',
                    icon: '💠',
                    title: sub.title[lang] || sub.title['en'],
                    desc: cat.title[lang] || cat.title['en'],
                    onclick: `window.navigateToSub('${cat.id}', '${sub.id}')`
                });
            }

            // Search Inside Roadmap Items (Deep Search)
            const subData = contentData[sub.id];
            if (subData && subData.roadmap) {
                const roadmapItems = subData.roadmap[lang] || subData.roadmap['en'] || [];
                roadmapItems.forEach(step => {
                    if (step.title.toLowerCase().includes(q) || step.items.some(i => i.toLowerCase().includes(q))) {
                        matches.push({
                            type: 'roadmap',
                            icon: '🛣️',
                            title: step.title,
                            desc: `${getLocalizedContent(sub.title)} Roadmap`,
                            onclick: `window.navigateToSub('${cat.id}', '${sub.id}')` // Goes to the page
                        });
                    }
                });
            }
        });
    });

    // 2. Search Global FAQs
    globalFaqData.forEach(section => {
        section.questions.forEach(qa => {
            const question = (qa.q[lang] || qa.q['en']).toLowerCase();
            const answer = (qa.a[lang] || qa.a['en']).toLowerCase();

            if (question.includes(q) || answer.includes(q)) {
                matches.push({
                    type: 'faq',
                    icon: '🤔',
                    title: qa.q[lang] || qa.q['en'],
                    desc: 'Global FAQ',
                    onclick: `window.navigateTo('faq')`
                });
            }
        });
    });

    // 3. Render Results
    if (matches.length === 0) {
        resultsContainer.innerHTML = `
            <div class="p-4 text-center text-gray-500">
                No results found for "<span class="text-white">${query}</span>"
            </div>
        `;
    } else {
        // Limit results to top 8 for performance
        const topMatches = matches.slice(0, 8);

        resultsContainer.innerHTML = topMatches.map(match => `
            <div onclick="${match.onclick}" class="flex items-center gap-4 p-4 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0 transition-colors group animate-fade-in bg-dark-900">
                <div class="text-2xl">${match.icon}</div>
                <div>
                    <h4 class="text-white font-medium group-hover:text-brand-blue transition-colors line-clamp-1">${match.title}</h4>
                    <span class="text-[10px] uppercase font-bold text-gray-500 border border-white/10 px-1.5 py-0.5 rounded bg-white/5 tracking-wider">${match.type}</span> 
                    <span class="text-xs text-gray-400 ml-2">${match.desc}</span>
                </div>
                <div class="ml-auto text-gray-600 group-hover:text-white transform group-hover:-rotate-45 transition-all">↵</div>
            </div>
        `).join('');

        // Add "View all" if too many results
        if (matches.length > 8) {
            resultsContainer.innerHTML += `
             <div class="p-2 text-center text-xs text-gray-500 bg-white/5">
                +${matches.length - 8} more results...
             </div>`;
        }
    }

    resultsContainer.classList.remove('hidden');
};

const GlobalResourcesPage = () => {
    return `
    <div class="min-h-[calc(100vh-64px)] flex flex-col">
        <div class="max-w-6xl mx-auto p-6 md:p-12 animate-fade-in flex-1 w-full">
            <div class="text-center mb-16">
                <h1 class="text-4xl md:text-5xl font-extrabold text-white mb-4">${t('globalResources')}</h1>
                <p class="text-xl text-gray-400">Hand-picked tools & resources for developers.</p>
            </div>

            <div class="space-y-16">
                ${globalResourcesData.map(section => `
                    <div>
                        <h2 class="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
                            <span class="text-brand-blue">#</span> ${getLocalizedContent(section.category)}
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            ${section.items.map(res => `
                                <a href="${res.url}" target="_blank" class="glass-card p-6 hover:-translate-y-1 transition-transform group h-full flex flex-col">
                                    <div class="flex items-start justify-between mb-4">
                                        <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl group-hover:bg-brand-blue/10 transition-colors">
                                            ${res.type === 'tool' ? '🛠️' : res.type === 'course' ? '🎓' : res.type === 'youtube' ? '📺' : res.type === 'book' ? '📖' : res.type === 'movie' ? '🎬' : '🔗'}
                                        </div>
                                        ${res.lang ? `<span class="text-[10px] uppercase px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-500 font-bold tracking-wider">${res.lang}</span>` : ''}
                                    </div>
                                    <h3 class="text-xl font-bold text-gray-100 mb-2 group-hover:text-brand-blue transition-colors">${res.title}</h3>
                                    <p class="text-sm text-gray-400 leading-relaxed line-clamp-2">${res.desc}</p>
                                    <div class="mt-auto pt-4 flex items-center text-xs font-medium text-gray-500 group-hover:text-white transition-colors">
                                        Visit Website <span class="ml-2">→</span>
                                    </div>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        ${Footer()}
    </div>
    `;
}

const GlobalFaqPage = () => {
    return `
    <div class="min-h-[calc(100vh-64px)] flex flex-col">
        <div class="max-w-4xl mx-auto p-6 md:p-12 animate-fade-in flex-1">
            <div class="text-center mb-16">
                <h1 class="text-4xl md:text-5xl font-extrabold text-white mb-4">${t('faqTitle')}</h1>
                <p class="text-xl text-gray-400">${t('faqSubtitle')}</p>
            </div>

            <div class="space-y-12">
                ${globalFaqData.map(section => `
                    <div>
                        <h2 class="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2 flex items-center gap-3">
                            <span class="text-brand-purple">#</span> ${getLocalizedContent(section.category)}
                        </h2>
                        <div class="grid gap-4">
                            ${section.questions.map(qa => `
                                <div class="glass-card p-6 cursor-pointer hover:bg-white/10 transition-colors group" onclick="this.classList.toggle('active')">
                                    <div class="flex justify-between items-start gap-4">
                                        <h3 class="font-semibold text-lg text-gray-100 group-hover:text-brand-blue transition-colors">
                                            ${getLocalizedContent(qa.q)}
                                        </h3>
                                        <span class="text-gray-500 text-xl transform transition-transform group-[.active]:rotate-180">↓</span>
                                    </div>
                                    <div class="hidden group-[.active]:block mt-4 text-gray-400 leading-relaxed border-t border-white/5 pt-4 animate-fade-in">
                                        ${getLocalizedContent(qa.a)}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        ${Footer()}
    </div>
    `;
}

const CategoryDetail = () => {
    if (!state.currentSubCategory) return `<div class="p-10 text-center text-gray-500">Please select a sub-category from the sidebar.</div>`;

    const cat = categories.find(c => c.id === state.currentCategory);
    const sub = cat.subCategories.find(s => s.id === state.currentSubCategory);
    const data = contentData[sub.id] || { roadmap: {}, resources: { items: [] }, jobs: {}, faq: {} };

    // Render Functions (Roadmap, Resources, Jobs, Faq) -> Kept same logic
    const renderRoadmap = () => {
        const steps = data.roadmap[state.lang] || data.roadmap['en'] || [];
        if (steps.length === 0) return `
            <div class="flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                <span class="text-4xl mb-4">🚧</span>
                <h3 class="text-xl font-bold text-white mb-2">${t('comingSoon')}</h3>
                <p class="text-gray-500 max-w-md">Roadmap content for <b>${getLocalizedContent(sub.title)}</b>.</p>
            </div>
        `;

        return `
            <div class="bg-dark-900 border border-white/10 rounded-xl overflow-hidden">
                ${steps.map((step, idx) => `
                    <div class="flex gap-6 p-6 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-default group">
                        <div class="flex flex-col items-center">
                            <div class="w-8 h-8 rounded-full bg-dark-800 border ${step.status === 'start' ? 'border-brand-blue text-brand-blue' : 'border-gray-700 text-gray-500'} flex items-center justify-center font-bold text-sm shadow-lg z-10 transition-colors">
                                ${idx + 1}
                            </div>
                            ${idx !== steps.length - 1 ? `<div class="w-0.5 h-full bg-white/5 my-2 group-hover:bg-white/10 transition-colors"></div>` : ''}
                        </div>
                        <div class="flex-1 pb-4">
                            <h4 class="text-lg font-bold text-white mb-2 group-hover:text-brand-blue transition-colors">${step.title}</h4>
                            <div class="flex flex-wrap gap-2">
                                ${step.items.map(item => `
                                    <span class="px-3 py-1 rounded-md bg-dark-800 border border-white/10 text-sm text-gray-300 hover:border-brand-blue/30 transition-colors">
                                        ${item}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    };

    const renderResources = () => {
        const items = data.resources.items || [];
        if (items.length === 0) return `
            <div class="flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                <span class="text-4xl mb-4">📚</span>
                <h3 class="text-xl font-bold text-white mb-2">${t('comingSoon')}</h3>
            </div>
         `;

        return `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${items.map(res => `
                    <a href="${res.url}" target="_blank" class="glass-card hover:border-brand-blue/30 group flex items-start gap-4 p-4">
                         <div class="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-2xl group-hover:bg-brand-blue/10 transition-colors">
                            ${res.type === 'youtube' ? '📺' : res.type === 'doc' ? '📄' : res.type === 'course' ? '🎓' : res.type === 'tool' ? '🛠️' : '🔗'}
                         </div>
                         <div class="flex-1">
                            <div class="flex justify-between items-start">
                                <h4 class="font-bold text-gray-200 group-hover:text-brand-blue transition-colors">${res.title}</h4>
                                ${res.lang ? `<span class="text-[10px] uppercase px-1.5 py-0.5 rounded bg-white/10 text-gray-400">${res.lang}</span>` : ''}
                            </div>
                            <p class="text-xs text-gray-400 mt-1 line-clamp-2">${res.desc}</p>
                         </div>
                    </a>
                `).join('')}
            </div>
        `;
    };

    const renderJobs = () => {
        let localData = data.jobs[state.country];
        let globalData = data.jobs['GLOBAL'];
        let jobData = localData || globalData;

        if (!jobData) return `
             <div class="flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                <span class="text-4xl mb-4">💼</span>
                <h3 class="text-xl font-bold text-white mb-2">${t('comingSoon')}</h3>
                <p class="text-gray-500">No job data available yet.</p>
            </div>
        `;

        if (jobData.avg_salary) {
            return `
            <div class="space-y-6 animate-fade-in">
                ${!localData ? `
                <div class="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-sm flex items-center gap-2">
                    <span>⚠️</span> Showing Global data as no specific data for ${state.country} yet.
                </div>` : ''}

                <div class="glass-card bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20 p-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 p-16 bg-green-500/20 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
                     <div class="relative z-10">
                        <h3 class="text-sm uppercase tracking-wider font-semibold text-green-400 mb-2">💰 Average Salary Estimation</h3>
                        <p class="text-2xl md:text-3xl font-bold text-white tracking-tight">${jobData.avg_salary}</p>
                        <p class="text-xs text-green-500/60 mt-2">* Based on community data & job boards.</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="glass-card p-6">
                        <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span class="text-yellow-400">⚡</span> Top Required Skills
                        </h3>
                        <div class="flex flex-wrap gap-2">
                            ${jobData.top_skills.map(skill => `
                                <span class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm font-medium hover:border-brand-purple/50 transition-colors cursor-default">
                                    ${skill}
                                </span>
                            `).join('')}
                        </div>
                    </div>

                    <div class="glass-card p-6">
                        <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span class="text-brand-blue">🔍</span> Best Platforms
                        </h3>
                        <ul class="space-y-3">
                            ${jobData.platforms.map(platform => `
                                <li class="flex items-center gap-3 text-gray-400 hover:text-white transition-colors cursor-pointer group">
                                    <span class="w-1.5 h-1.5 rounded-full bg-brand-blue group-hover:scale-150 transition-transform"></span>
                                    ${platform}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            `;
        }

        if (Array.isArray(jobData)) {
            if (jobData.length === 0) return `
                 <div class="flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                    <span class="text-4xl mb-4">💼</span>
                    <h3 class="text-xl font-bold text-white mb-2">${t('comingSoon')}</h3>
                </div>
            `;
            return `
                 <div class="space-y-4">
                     <div class="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200 text-sm mb-6 flex items-center gap-3">
                        <span>🌍</span> Showing jobs for <b>${state.country}</b>.
                     </div>
                    ${jobData.map(job => `
                        <div class="glass-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-brand-purple/30">
                            <div>
                                <h4 class="font-bold text-lg text-white group-hover:text-brand-purple transition-colors">${job.title}</h4>
                                <div class="flex items-center gap-3 text-sm text-gray-400 mt-1">
                                    <span class="flex items-center gap-1">🏢 ${job.company}</span>
                                    <span class="w-1 h-1 rounded-full bg-white/10"></span>
                                    <span class="flex items-center gap-1">📍 ${job.location}</span>
                                </div>
                            </div>
                            <button class="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all whitespace-nowrap">
                                Apply Now
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        return '';
    };

    const renderFaq = () => {
        let faqs = [];
        if (Array.isArray(data.faq)) {
            faqs = data.faq.map(item => ({
                q: item.q[state.lang] || item.q['en'],
                a: item.a[state.lang] || item.a['en']
            }));
        } else if (data.faq && data.faq[state.lang]) {
            faqs = data.faq[state.lang];
        }

        if (!faqs || faqs.length === 0) return `
            <div class="flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                <span class="text-4xl mb-4">🤔</span>
                <h3 class="text-xl font-bold text-white mb-2">${t('comingSoon')}</h3>
                <p class="text-gray-500 max-w-md">Specific questions about <b>${getLocalizedContent(sub.title)}</b> will be here.</p>
            </div>
         `;

        return `
            <div class="grid gap-4 max-w-4xl">
                 ${faqs.map(qa => `
                    <div class="glass-card p-6 cursor-pointer hover:bg-white/10 transition-colors group" onclick="this.classList.toggle('active')">
                        <div class="flex justify-between items-start gap-4">
                            <h3 class="font-semibold text-lg text-gray-100 group-hover:text-brand-blue transition-colors">
                                ${qa.q}
                            </h3>
                            <span class="text-gray-500 text-xl transform transition-transform group-[.active]:rotate-180">↓</span>
                        </div>
                        <div class="hidden group-[.active]:block mt-4 text-gray-400 leading-relaxed border-t border-white/5 pt-4 animate-fade-in">
                            ${qa.a}
                        </div>
                    </div>
                `).join('')}
            </div>
         `;
    };

    return `
    <div class="flex min-h-[calc(100vh-64px)] relative">
        <div class="hidden md:block w-72 shrink-0"></div>

        <main class="flex-1 overflow-y-auto w-full flex flex-col">
            <div class="p-6 md:p-12 max-w-5xl mx-auto flex-1 w-full">
                <div class="mb-10 animate-fade-in">
                   <div class="flex items-center gap-3 mb-2">
                        <span class="p-2 rounded-lg bg-white/5 text-2xl border border-white/10 shadow-inner">${cat.icon}</span>
                        <h1 class="text-3xl md:text-4xl font-extrabold text-white">
                                ${getLocalizedContent(sub.title)}
                        </h1>
                   </div>
                   <p class="text-gray-400 text-lg ml-14 border-l-2 border-brand-blue/30 pl-3">
                        ${getLocalizedContent(cat.title)}
                   </p>
                </div>

                <div class="border-b border-white/10 mb-8 overflow-x-auto">
                    <div class="flex space-x-8 min-w-max">
                        ${['roadmap', 'resources', 'jobs', 'faq'].map(tab => `
                             <button onclick="window.switchTab('${tab}')" 
                                class="pb-3 text-sm font-medium border-b-2 transition-all capitalize ${state.currentTab === tab ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-400 hover:text-white'}">
                            ${t(`tabs.${tab}`)}
                        </button>
                        `).join('')}
                    </div>
                </div>

                <div class="animate-fade-in">
                    ${state.currentTab === 'roadmap' ? renderRoadmap() :
            state.currentTab === 'resources' ? renderResources() :
                state.currentTab === 'jobs' ? renderJobs() :
                    renderFaq()}
                </div>
            </div>
            
        </main>
    </div>
    `;
};

// Actions
window.navigateTo = (view) => {
    state.view = view;
    if (view === 'home' || view === 'faq' || view === 'resources' || view === 'privacy' || view === 'terms') {
        state.currentCategory = null;
        state.currentSubCategory = null;
        state.isMobileMenuOpen = false;
    }
    render(); // Re-render to update UI
    window.scrollTo(0, 0);
};

window.navigateToCategory = (catId) => {
    const cat = categories.find(c => c.id === catId);
    state.currentCategory = catId;
    if (cat && cat.subCategories.length > 0) {
        state.currentSubCategory = cat.subCategories[0].id; // Default to first sub
    } else {
        state.currentSubCategory = null;
    }
    state.view = 'category';
    state.currentTab = 'roadmap';
    render();
    window.scrollTo(0, 0);
};

window.navigateToSub = (catId, subId) => {
    state.currentCategory = catId;
    state.currentSubCategory = subId;
    state.view = 'category';
    state.currentTab = 'roadmap';
    render();
    window.scrollTo(0, 0);
}

window.switchTab = (tab) => {
    state.currentTab = tab;
    render();
};

window.setOnboardingData = (lang, country) => {
    state.lang = lang;
    state.country = country;
    localStorage.setItem('dsss_lang', lang);
    localStorage.setItem('dsss_country', country);
    render();
};

window.toggleCountry = () => {
    const currentIndex = countries.findIndex(c => c.code === state.country);
    const nextIndex = (currentIndex + 1) % countries.length;
    state.country = countries[nextIndex].code;
    localStorage.setItem('dsss_country', state.country);
    render();
}

window.toggleLang = () => {
    const currentIndex = languages.findIndex(l => l.code === state.lang);
    const nextIndex = (currentIndex + 1) % languages.length;
    state.lang = languages[nextIndex].code;
    localStorage.setItem('dsss_lang', state.lang);
    render();
}

window.toggleMobileMenu = () => {
    state.isMobileMenuOpen = !state.isMobileMenuOpen;
    render();
}

window.clearData = () => {
    localStorage.clear();
    location.reload();
}

/**
 * --- RENDER FUNCTION ---
 * Main Render Function that controls which page is displayed
 */
const render = () => {

    let content = '';
    content += Navbar();

    // Decide which page to show based on state.view
    if (state.view === 'home') {
        content += LandingPage();
    } else if (state.view === 'category') {
        content += Sidebar();
        content += CategoryDetail();
    } else if (state.view === 'faq') {
        content += GlobalFaqPage();
    } else if (state.view === 'resources') {
        content += GlobalResourcesPage();
    } else if (state.view === 'privacy') {
        content += LegalPage('privacy');
    } else if (state.view === 'terms') {
        content += LegalPage('terms');
    }

    app.innerHTML = content;
};

// Initial Render
render();
