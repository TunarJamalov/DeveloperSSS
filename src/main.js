import './style.css'
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'
import { languages, countries, ui, categories, contentData, globalFaqData, globalResourcesData, glossary, toolOfTheWeek } from './data.js'

// Initialize Vercel Analytics
inject();

// Initialize Vercel Speed Insights
injectSpeedInsights();

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

const updateMeta = () => {
    let title = "Developer SSS | Ultimate Roadmap & Interview Platform";
    let subTitle = "";

    if (state.view === 'category' && state.currentCategory) {
        const cat = categories.find(c => c.id === state.currentCategory);
        if (cat) {
            subTitle = getLocalizedContent(cat.title);
            if (state.currentSubCategory) {
                const sub = cat.subCategories.find(s => s.id === state.currentSubCategory);
                if (sub) subTitle = `${getLocalizedContent(sub.title)} - ${subTitle}`;
            }
        }
    } else if (state.view === 'faq') subTitle = t('globalFaq');
    else if (state.view === 'resources') subTitle = t('globalResources');
    else if (state.view === 'glossary') subTitle = t('glossary');
    else if (state.view === 'hall-of-fame') subTitle = t('hallOfFame');

    if (subTitle) title = `${subTitle} | Developer SSS`;

    document.title = title;

    // Update OG and Twitter tags dynamically
    const metaTitle = document.querySelector('meta[name="title"]');
    if (metaTitle) metaTitle.setAttribute('content', title);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
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
            <!-- Mobile Menu Button -->
            <button onclick="window.toggleMobileMenu()" class="lg:hidden p-2 text-gray-400 hover:text-white transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>

            <button onclick="window.navigateTo('home')" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img src="/logo.png" class="w-10 h-10 rounded-xl shadow-lg shadow-brand-blue/20" alt="Logo">
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
                <button onclick="window.navigateTo('hall-of-fame')" class="text-sm font-medium ${state.view === 'hall-of-fame' ? 'text-brand-cyan' : 'text-gray-400 hover:text-white'} transition-colors">
                    ${t('hallOfFame')}
                </button>
                <button onclick="window.navigateTo('glossary')" class="text-sm font-medium ${state.view === 'glossary' ? 'text-yellow-400' : 'text-gray-400 hover:text-white'} transition-colors">
                    ${t('glossary')}
                </button>
             </div>

            <div class="hidden md:flex items-center text-sm ml-4 overflow-hidden text-ellipsis whitespace-nowrap">
                ${breadcrumbs}
            </div>
        </div>

        <div class="flex items-center gap-3">
            <button onclick="window.toggleLang()" class="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all text-sm border border-white/10 bg-white/5 shadow-inner group">
                <span class="text-base group-hover:scale-110 transition-transform">${currentLangFlag}</span>
                <span class="font-bold text-gray-200">${state.lang.toUpperCase()}</span>
            </button>
        </div>
    </header>
    `;
};

const Sidebar = () => {
    // Desktop Sidebar only
    return `
    <aside class="hidden lg:flex flex-col w-72 border-r border-white/10 bg-dark-900/95 backdrop-blur-xl fixed top-16 bottom-0 left-0 overflow-y-auto no-scrollbar z-40">
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
};

const MobileMenu = () => {
    return `
    <div onclick="window.toggleMobileMenu()" class="lg:hidden fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm transition-opacity ${state.isMobileMenuOpen ? 'opacity-100 placeholder:pointer-events-auto' : 'opacity-0 pointer-events-none'}"></div>
    <aside class="lg:hidden fixed inset-y-0 left-0 w-[85%] max-w-xs bg-dark-900 border-r border-white/10 z-[70] transform transition-transform duration-300 ease-out ${state.isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto shadow-2xl">
        <div class="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-dark-900 z-10">
            <div class="flex items-center gap-2">
                <img src="/logo.png" class="w-8 h-8 rounded-lg" alt="Logo">
                <span class="font-bold text-lg text-white">Menu</span>
            </div>
            <button onclick="window.toggleMobileMenu()" class="text-gray-400 hover:text-white p-2">✕</button>
        </div>
        <nav class="p-4 space-y-6">
            <!-- Global Links -->
            <div class="space-y-2">
                <button onclick="window.toggleLang()" class="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-all mb-4">
                    <div class="flex items-center gap-3">
                        <span class="text-xl">${languages.find(l => l.code === state.lang)?.flag}</span>
                        <span>${state.lang.toUpperCase()}</span>
                    </div>
                    <span class="text-xs text-gray-500 uppercase tracking-widest">${t('back') === 'Back' ? 'Change' : 'Dəyiş'} →</span>
                </button>

                <button onclick="window.navigateTo('faq'); window.toggleMobileMenu()" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/5 bg-white/5 text-gray-300 font-medium hover:text-white transition-colors ${state.view === 'faq' ? 'border-brand-purple/50 bg-brand-purple/10 text-brand-purple' : ''}">
                    <span class="text-lg">📋</span> ${t('globalFaq')}
                </button>
                <button onclick="window.navigateTo('resources'); window.toggleMobileMenu()" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/5 bg-white/5 text-gray-300 font-medium hover:text-white transition-colors ${state.view === 'resources' ? 'border-brand-blue/50 bg-brand-blue/10 text-brand-blue' : ''}">
                    <span class="text-lg">📚</span> ${t('globalResources')}
                </button>
                <button onclick="window.navigateTo('hall-of-fame'); window.toggleMobileMenu()" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/5 bg-white/5 text-gray-300 font-medium hover:text-white transition-colors ${state.view === 'hall-of-fame' ? 'border-brand-cyan/50 bg-brand-cyan/10 text-brand-cyan' : ''}">
                    <span class="text-lg">🏆</span> ${t('hallOfFame')}
                </button>
                <button onclick="window.navigateTo('glossary'); window.toggleMobileMenu()" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/5 bg-white/5 text-gray-300 font-medium hover:text-white transition-colors ${state.view === 'glossary' ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400' : ''}">
                    <span class="text-lg">📖</span> ${t('glossary')}
                </button>
            </div>

            <div class="h-px bg-white/5"></div>

            <!-- Categories -->
            <div class="space-y-1">
                <h3 class="text-xs uppercase tracking-widest font-bold text-gray-500 px-3 mb-2">Technical Roadmaps</h3>
                ${categories.map(cat => `
                    <div class="space-y-1">
                        <button onclick="window.navigateToCategory('${cat.id}')" class="w-full flex items-center gap-3 px-3 py-2.5 text-left text-gray-300 font-semibold hover:text-white transition-colors">
                            <span class="text-lg">${cat.icon}</span>
                            <span>${getLocalizedContent(cat.title)}</span>
                        </button>
                        
                        ${state.currentCategory === cat.id ? `
                        <div class="pl-10 space-y-1 border-l border-white/10 ml-5">
                            ${cat.subCategories.length > 0 ? cat.subCategories.map(sub => `
                                <button onclick="window.navigateToSub('${cat.id}', '${sub.id}'); window.toggleMobileMenu()" 
                                        class="w-full text-left px-3 py-2 text-sm rounded-lg transition-all ${state.currentSubCategory === sub.id ? 'bg-brand-blue/10 text-brand-blue font-medium' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}">
                                    ${getLocalizedContent(sub.title)}
                                </button>
                            `).join('') : ''}
                        </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </nav>
    </aside>
    `;
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
                <div class="flex flex-wrap justify-center gap-4">
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
                    <img src="/logo.png" class="w-8 h-8 rounded-lg" alt="Logo">
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

                <div class="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
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

const HallOfFamePage = () => {
    // Fetch contributors if not already loaded
    if (!state.contributors && !state.isLoadingContributors) {
        state.isLoadingContributors = true;
        fetch('https://api.github.com/repos/TunarJamalov/DeveloperSSS/contributors')
            .then(res => res.json())
            .then(data => {
                state.contributors = Array.isArray(data) ? data : [];
                state.isLoadingContributors = false;
                render();
            })
            .catch(err => {
                console.error('Failed to fetch contributors:', err);
                state.contributors = [];
                state.isLoadingContributors = false;
                render();
            });
    }

    const contributorsList = state.contributors || [];

    return `
    <div class="min-h-[calc(100vh-64px)] flex flex-col">
        <div class="max-w-6xl mx-auto p-6 md:p-12 animate-fade-in flex-1 w-full">
            <div class="text-center mb-16">
                <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                    ${t('hallOfFame')}
                </h1>
                <p class="text-xl text-gray-400 max-w-2xl mx-auto">
                    A special thanks to everyone who contributed to making Developer SSS better.
                </p>
            </div>

            ${state.isLoadingContributors ? `
                <div class="flex flex-col items-center justify-center p-20">
                    <div class="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p class="text-gray-500">Loading heroes...</p>
                </div>
            ` : `
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    ${contributorsList.map(c => `
                        <a href="${c.html_url}" target="_blank" class="glass-card p-6 flex flex-col items-center text-center group hover:border-brand-cyan/50 transition-all hover:-translate-y-2">
                            <div class="relative mb-4">
                                <img src="${c.avatar_url}" class="w-20 h-20 rounded-full border-2 border-white/10 group-hover:border-brand-cyan transition-colors shadow-2xl" alt="${c.login}">
                                <div class="absolute -bottom-1 -right-1 bg-brand-cyan text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                                    ${c.contributions}
                                </div>
                            </div>
                            <h3 class="font-bold text-white group-hover:text-brand-cyan transition-colors mb-1 truncate w-full text-base">
                                ${c.login}
                            </h3>
                            <p class="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Contributor</p>
                        </a>
                    `).join('')}
                    
                    <!-- Contribution Invitation -->
                    <a href="https://github.com/TunarJamalov/DeveloperSSS" target="_blank" class="glass-card p-6 flex flex-col items-center justify-center text-center border-dashed border-white/20 hover:border-brand-purple/50 transition-all hover:-translate-y-2 group">
                        <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                            ✨
                        </div>
                        <h3 class="font-bold text-gray-400 group-hover:text-brand-purple transition-colors mb-2">You?</h3>
                        <p class="text-[10px] text-gray-500 uppercase tracking-widest">Join Us on GitHub</p>
                    </a>
                </div>
            `}
        </div>
        ${Footer()}
    </div>
    `;
}

const renderGlossaryList = (searchTerm) => {
    const filteredTerms = glossary.filter(item =>
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getLocalizedContent(item.desc).toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.term.localeCompare(b.term));

    if (filteredTerms.length === 0) {
        return `
            <div class="text-center p-20 border border-dashed border-white/10 rounded-3xl animate-fade-in">
                <p class="text-gray-500">No terms found for "<span class="text-white">${searchTerm}</span>"</p>
            </div>
        `;
    }

    return `
    <div class="columns-1 md:columns-2 gap-8 space-y-8">
        ${filteredTerms.map(item => `
            <div class="break-inside-avoid glass-card p-8 border border-white/10 hover:border-yellow-500/30 transition-all group animate-fade-in">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-extrabold text-white group-hover:text-yellow-400 transition-colors">
                        ${item.term}
                    </h3>
                    <span class="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-white/5 text-gray-500 border border-white/5">
                        ${item.category}
                    </span>
                </div>
                <p class="text-gray-400 leading-relaxed text-sm">
                    ${getLocalizedContent(item.desc)}
                </p>
            </div>
        `).join('')}
    </div>
    `;
};

const GlossaryPage = () => {
    const searchTerm = state.glossarySearch || '';

    return `
    <div class="min-h-[calc(100vh-64px)] flex flex-col">
        <div class="max-w-5xl mx-auto p-6 md:p-12 animate-fade-in flex-1 w-full">
            <div class="text-center mb-12">
                <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                    ${t('glossary')}
                </h1>
                <p class="text-xl text-gray-400 max-w-2xl mx-auto">
                    Master the technical language of the tech world. Simple explanations for complex terms.
                </p>
            </div>

            <!-- Search Area -->
            <div class="relative max-w-2xl mx-auto mb-16 group">
                <input type="text" 
                       id="glossary-search-input"
                       value="${searchTerm.replace(/"/g, '&quot;')}"
                       oninput="window.handleGlossarySearch(this.value)"
                       placeholder="Search terms (e.g. API, Docker, Middleware...)" 
                       class="w-full glass p-5 pl-14 rounded-2xl text-lg focus:outline-none focus:border-yellow-500/50 border border-white/10 shadow-2xl transition-all placeholder-gray-500 text-white bg-dark-900/80 backdrop-blur-xl">
                <div class="absolute left-5 top-5 text-2xl text-gray-400 group-focus-within:text-yellow-400">📖</div>
            </div>

            <div id="glossary-results-container">
                ${renderGlossaryList(searchTerm)}
            </div>
        </div>
        ${Footer()}
    </div>
    `;
};

window.renderGlossaryListHelper = renderGlossaryList;

const ToolOfTheWeek = () => {
    return `
    <div class="max-w-7xl mx-auto px-4 mb-20 relative z-20 animate-fade-in">
        <div class="relative group">
            <!-- Background Glow -->
            <div class="absolute -inset-1 bg-gradient-to-r from-brand-blue to-brand-purple rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            <div class="relative glass-card p-6 md:p-10 border border-white/10 overflow-hidden">
                <div class="absolute top-0 right-0 p-6 md:p-10 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                    <span class="text-7xl md:text-9xl">${toolOfTheWeek.icon}</span>
                </div>
                
                <div class="flex flex-col md:flex-row gap-8 items-start relative z-10">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-4">
                            <span class="px-3 py-1 rounded-full bg-brand-blue/20 text-brand-blue text-[10px] font-bold uppercase tracking-widest border border-brand-blue/30">
                                ✨ ${t('toolOfTheWeek')}
                            </span>
                            <span class="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                ${getLocalizedContent(toolOfTheWeek.category)}
                            </span>
                        </div>
                        
                        <h2 class="text-3xl md:text-5xl font-black text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-brand-blue transition-all">
                            ${toolOfTheWeek.title}
                        </h2>
                        
                        <p class="text-lg text-gray-300 mb-6 max-w-2xl leading-relaxed">
                            ${getLocalizedContent(toolOfTheWeek.desc)}
                        </p>
                        
                        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
                            <a href="${toolOfTheWeek.url}" target="_blank" class="px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-brand-blue hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95 text-center">
                                ${t('viewTool')}
                            </a>
                            <div class="flex flex-col">
                                <span class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 italic">Pro Tip:</span>
                                <p class="text-sm text-gray-400 max-w-full sm:max-w-xs border-l-2 border-brand-purple/50 pl-3">
                                    ${getLocalizedContent(toolOfTheWeek.whyCool)}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="w-full md:w-auto flex flex-col gap-3">
                        <!-- Extra badges or info could go here -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
};

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

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 pb-20 max-w-7xl mx-auto relative z-10 w-full">
            ${categories.map(cat => `
                <div onclick="window.navigateToCategory('${cat.id}')" 
                     class="glass-card group cursor-pointer hover:-translate-y-1 relative overflow-hidden flex flex-col p-6 border-white/5 hover:border-white/20 hover:bg-white/5 min-h-[160px]">
                    
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500">${cat.icon}</div>
                        <div class="w-1 h-12 rounded-full bg-gradient-to-b ${cat.color} opacity-20 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    
                    <div class="relative z-10">
                        <h3 class="font-bold text-lg text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${cat.color} transition-all">
                            ${getLocalizedContent(cat.title)}
                        </h3>
                         <p class="text-xs text-gray-400 line-clamp-2 leading-relaxed">
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

    // 3. Search Glossary
    glossary.forEach(item => {
        const term = item.term.toLowerCase();
        const desc = getLocalizedContent(item.desc).toLowerCase();
        if (term.includes(q) || desc.includes(q)) {
            matches.push({
                type: 'glossary',
                icon: '📖',
                title: item.term,
                desc: getLocalizedContent(item.desc),
                onclick: `window.navigateTo('glossary'); state.glossarySearch = '${item.term}'; render();`
            });
        }
    });

    // 4. Render Results
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

            ${ToolOfTheWeek()}

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

    const renderInterview = () => {
        const questions = data.interview || [];
        if (questions.length === 0) return `
             <div class="flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                <span class="text-4xl mb-4">🧩</span>
                <h3 class="text-xl font-bold text-white mb-2">${t('comingSoon')}</h3>
                <p class="text-gray-500">Interview questions for this category are being prepared.</p>
            </div>
        `;

        // Manage random state to prevent re-shuffle on flip
        if (state.currentInterviewSub !== sub.id || !state.interviewQuestions) {
            state.interviewQuestions = [...questions].sort(() => 0.5 - Math.random()).slice(0, 5);
            state.currentInterviewSub = sub.id;
        }

        return `
            <div class="space-y-6">
                
                <div class="p-4 rounded-xl bg-gradient-to-r from-brand-blue/10 to-transparent border border-brand-blue/20 text-blue-200 text-sm flex items-center gap-3">
                    <span class="text-xl">💡</span>
                    <div>
                        <strong>Pro Tip:</strong> Questions are randomized. Click the card to reveal the answer.
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                    ${state.interviewQuestions.map(item => `
                        <div class="group h-64 [perspective:1000px] cursor-pointer" onclick="this.querySelector('.flip-inner').classList.toggle('[transform:rotateY(180deg)]')">
                            <div class="flip-inner relative w-full h-full transition-all duration-500 [transform-style:preserve-3d]">
                                <!-- Front -->
                                <div class="absolute inset-0 w-full h-full bg-dark-900 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-xl [backface-visibility:hidden]">
                                    <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl mb-4 border border-white/10 group-hover:border-brand-blue/50 transition-colors">
                                        ❓
                                    </div>
                                    <h3 class="text-lg font-bold text-white leading-snug">
                                        ${getLocalizedContent(item.q)}
                                    </h3>
                                    <p class="absolute bottom-4 text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-1 opacity-60">
                                        Tap to Reveal
                                    </p>
                                </div>

                                <!-- Back -->
                                <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-brand-blue/20 to-dark-900 border border-brand-blue/30 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
                                    <div class="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center text-sm mb-3 text-brand-blue border border-brand-blue/30">
                                        ✓
                                    </div>
                                    <p class="text-gray-200 text-sm leading-relaxed overflow-y-auto max-h-[160px] custom-scrollbar">
                                        ${getLocalizedContent(item.a)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="flex justify-center pb-12">
                    <button onclick="window.shuffleQuestions()" class="flex items-center gap-2 px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all hover:scale-105 active:scale-95 group">
                        <span class="group-hover:rotate-180 transition-transform duration-500">🎲</span>
                        Shuffle Questions
                    </button>
                </div>
            </div>
        `;
    };

    const renderProjects = () => {
        const projects = data.projects || [];
        if (projects.length === 0) return `
             <div class="flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                <span class="text-4xl mb-4">🚀</span>
                <h3 class="text-xl font-bold text-white mb-2">${t('comingSoon')}</h3>
                <p class="text-gray-500">Project ideas for this category are on the way.</p>
            </div>
        `;

        const getLevelColor = (level) => {
            switch (level) {
                case 'junior': return 'bg-green-500/10 text-green-400 border-green-500/20';
                case 'mid': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
                case 'expert': return 'bg-red-500/10 text-red-400 border-red-500/20';
                default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
            }
        };

        return `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                ${projects.map(p => `
                    <div class="glass-card p-6 flex flex-col h-full group hover:border-brand-blue/30 transition-all">
                        <div class="flex justify-between items-start mb-4">
                            <span class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getLevelColor(p.level)}">
                                ${p.level}
                            </span>
                            <div class="text-2xl group-hover:scale-110 transition-transform">💡</div>
                        </div>
                        
                        <h3 class="text-xl font-bold text-white mb-2 group-hover:text-brand-blue transition-colors">
                            ${getLocalizedContent(p.title)}
                        </h3>
                        
                        <p class="text-gray-400 text-sm mb-6 flex-1">
                            ${getLocalizedContent(p.desc)}
                        </p>

                        <div class="space-y-4">
                            <div>
                                <h4 class="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Tech Stack</h4>
                                <div class="flex flex-wrap gap-2">
                                    ${p.tech.map(t => `<span class="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-gray-300">${t}</span>`).join('')}
                                </div>
                            </div>
                            
                            <div>
                                <h4 class="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">Key Features</h4>
                                <ul class="space-y-1">
                                    ${getLocalizedContent(p.features).map(f => `
                                        <li class="text-xs text-gray-400 flex items-center gap-2">
                                            <span class="w-1 h-1 rounded-full bg-brand-blue"></span>
                                            ${f}
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    };

    return `
    <div class="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] relative">
        <div class="hidden lg:block w-72 shrink-0"></div>

        <main class="flex-1 w-full flex flex-col min-w-0">
            <div class="p-4 md:p-12 max-w-5xl mx-auto flex-1 w-full">
                <button onclick="window.navigateTo('home')" class="flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors group text-sm font-medium">
                    <span class="group-hover:-translate-x-1 transition-transform">←</span> ${t('back')}
                </button>
                <div class="mb-10 animate-fade-in">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
                        <span class="p-2 rounded-lg bg-white/5 text-2xl border border-white/10 shadow-inner">${cat.icon}</span>
                        <h1 class="text-2xl md:text-4xl font-extrabold text-white break-words">
                            ${getLocalizedContent(sub.title)}
                        </h1>
                    </div>
                    <p class="text-gray-400 text-sm md:text-lg ml-2 sm:ml-14 border-l-2 border-brand-blue/30 pl-3">
                        ${getLocalizedContent(cat.title)}
                    </p>
                </div>

                <div class="border-b border-white/10 mb-8 overflow-x-auto no-scrollbar">
                    <div class="flex space-x-6 md:space-x-8 min-w-max">
                        ${['roadmap', 'resources', 'jobs', 'faq', 'interview', 'projects'].map(tab => `
                             <button onclick="window.switchTab('${tab}')" 
                                class="pb-3 text-sm font-medium border-b-2 transition-all capitalize whitespace-nowrap ${state.currentTab === tab ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-400 hover:text-white'}">
                            ${t(`tabs.${tab}`)}
                        </button>
                        `).join('')}
                    </div>
                </div>

                <div class="animate-fade-in">
                    ${state.currentTab === 'roadmap' ? renderRoadmap() :
            state.currentTab === 'resources' ? renderResources() :
                state.currentTab === 'jobs' ? renderJobs() :
                    state.currentTab === 'interview' ? renderInterview() :
                        state.currentTab === 'projects' ? renderProjects() :
                            renderFaq()}
                </div>
            </div >

        </main >
    </div >
    `;
};

// Actions
window.navigateTo = (view) => {
    state.view = view;
    if (view === 'home' || view === 'faq' || view === 'resources' || view === 'privacy' || view === 'terms' || view === 'hall-of-fame' || view === 'glossary') {
        state.currentCategory = null;
        state.currentSubCategory = null;
        state.isMobileMenuOpen = false;
    }
    render(); // Re-render to update UI
    updateMeta();
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
    updateMeta();
    window.scrollTo(0, 0);
};

window.navigateToSub = (catId, subId) => {
    state.currentCategory = catId;
    state.currentSubCategory = subId;
    state.view = 'category';
    state.currentTab = 'roadmap';
    render();
    updateMeta();
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

window.handleGlossarySearch = (query) => {
    state.glossarySearch = query;
    const container = document.getElementById('glossary-results-container');
    if (container) {
        container.innerHTML = window.renderGlossaryListHelper(query);
    }
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

    // Sync country with language if applicable
    if (state.lang === 'tr') state.country = 'TR';
    else if (state.lang === 'az') state.country = 'AZ';
    else state.country = 'GLOBAL';

    localStorage.setItem('dsss_lang', state.lang);
    localStorage.setItem('dsss_country', state.country);
    render();
}

window.toggleMobileMenu = () => {
    state.isMobileMenuOpen = !state.isMobileMenuOpen;
    render();
}

window.shuffleQuestions = () => {
    state.interviewQuestions = null;
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
    content += MobileMenu();

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
    } else if (state.view === 'hall-of-fame') {
        content += HallOfFamePage();
    } else if (state.view === 'glossary') {
        content += GlossaryPage();
    }

    app.innerHTML = content;
};

// Initial Render
render();

// --- PWA Service Worker Registration ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW Registered!', reg))
            .catch(err => console.log('SW Registration failed:', err));
    });
}
