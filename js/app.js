/**
 * ============================================
 * ARCHITECT-PLAYER OS v2.1
 * Engine: Vanilla JavaScript
 * Storage: LocalStorage
 * Theme: Solo Leveling RPG
 * ============================================
 */

// ============================================
// 1. CONFIGURATION & DATA
// ============================================

const CONFIG = {
    STORAGE_KEY: 'architect_player_os_v2',
    XP_PER_LEVEL: 100,
    DAILY_QUESTS_COUNT: 3,
    SECONDARY_QUESTS_COUNT: 4,
    MAX_PROOFS: 100,
    MAX_CAP_QUESTS: 50
};

// Solo Leveling Style Ranks
const RANKS = [
    { minXP: 0, name: "Rang-E : Éveil", short: "RANG-E", emoji: "🌑" },
    { minXP: 100, name: "Rang-D : Chasseur", short: "RANG-D", emoji: "🗡️" },
    { minXP: 300, name: "Rang-C : Guerrier", short: "RANG-C", emoji: "⚔️" },
    { minXP: 600, name: "Rang-B : Élite", short: "RANG-B", emoji: "🛡️" },
    { minXP: 1000, name: "Rang-A : Vétéran", short: "RANG-A", emoji: "🔥" },
    { minXP: 1500, name: "Rang-S : Champion", short: "RANG-S", emoji: "⭐" },
    { minXP: 2500, name: "Rang-SS : Légende", short: "RANG-SS", emoji: "💎" },
    { minXP: 4000, name: "Rang-SSS : Monarque", short: "RANG-SSS", emoji: "👑" },
    { minXP: 6000, name: "Rang-??? : Transcendant", short: "RANG-???", emoji: "⚡" }
];

// 25 Achievements
const ACHIEVEMENTS = [
    // Progression (5)
    { id: 'first_blood', name: 'First Blood', desc: 'Premier level up', icon: '🩸', condition: (s) => s.level >= 2 },
    { id: 'xp_hunter', name: 'XP Hunter', desc: '500 XP total', icon: '🎯', condition: (s) => s.xpTotal >= 500 },
    { id: 'xp_legend', name: 'XP Legend', desc: '2000 XP total', icon: '🏆', condition: (s) => s.xpTotal >= 2000 },
    { id: 'xp_overlord', name: 'XP Overlord', desc: '5000 XP total', icon: '💀', condition: (s) => s.xpTotal >= 5000 },
    { id: 'transcendance', name: 'Transcendance', desc: 'Atteindre Rang-???', icon: '⚡', condition: (s) => s.xpTotal >= 6000 },

    // Streak (4)
    { id: 'week_warrior', name: 'Week Warrior', desc: '7 jours de streak', icon: '🔥', condition: (s) => s.streak >= 7 },
    { id: 'flame_eternal', name: 'Flamme Éternelle', desc: '14 jours de streak', icon: '🔥', condition: (s) => s.streak >= 14 },
    { id: 'month_master', name: 'Month Master', desc: '30 jours de streak', icon: '💎', condition: (s) => s.streak >= 30 },
    { id: 'legend_constant', name: 'Légende Constante', desc: '60 jours de streak', icon: '🌟', condition: (s) => s.streak >= 60 },

    // Stats (5)
    { id: 'grand_coeur', name: 'Grand Cœur', desc: '250 XP Amour', icon: '❤️', condition: (s) => s.stats.love >= 250 },
    { id: 'createur_fou', name: 'Créateur Fou', desc: '250 XP Créativité', icon: '🎨', condition: (s) => s.stats.creativity >= 250 },
    { id: 'eternel_curieux', name: 'Éternel Curieux', desc: '250 XP Curiosité', icon: '🔍', condition: (s) => s.stats.curiosity >= 250 },
    { id: 'equilibre', name: 'Équilibré', desc: '100+ dans chaque stat', icon: '⚖️', condition: (s) => s.stats.love >= 100 && s.stats.curiosity >= 100 && s.stats.creativity >= 100 },
    { id: 'maitre_piliers', name: 'Maître des Piliers', desc: '500+ dans chaque stat', icon: '🌈', condition: (s) => s.stats.love >= 500 && s.stats.curiosity >= 500 && s.stats.creativity >= 500 },

    // Activity (6)
    { id: 'proof_collector', name: 'Proof Collector', desc: '10 preuves collectées', icon: '📦', condition: (s) => s.proofsCount >= 10 },
    { id: 'archiviste', name: 'Archiviste', desc: '30 preuves collectées', icon: '🏛️', condition: (s) => s.proofsCount >= 30 },
    { id: 'task_master', name: 'Task Master', desc: '25 quêtes C.A.P complétées', icon: '✅', condition: (s) => s.questsCompleted >= 25 },
    { id: 'productif', name: 'Productif', desc: '100 quêtes C.A.P complétées', icon: '📋', condition: (s) => s.questsCompleted >= 100 },
    { id: 'rebooter', name: 'Rebooter', desc: '4 réflexions effectuées', icon: '🔄', condition: (s) => s.reflectCount >= 4 },
    { id: 'sage', name: 'Sage', desc: '12 réflexions (3 mois)', icon: '🧘', condition: (s) => s.reflectCount >= 12 },

    // Special (5)
    { id: 'early_bird', name: 'Lève-tôt', desc: 'Gagner XP avant 7h', icon: '🌅', condition: (s) => s.earlyBird },
    { id: 'night_owl', name: 'Noctambule', desc: 'Gagner XP après 23h', icon: '🌙', condition: (s) => s.nightOwl },
    { id: 'combo_5', name: 'Combo x5', desc: '5 actions en une session', icon: '💪', condition: (s) => s.sessionActions >= 5 },
    { id: 'jackpot', name: 'Jackpot', desc: 'Compléter les 3 quêtes quotidiennes', icon: '🎰', condition: (s) => s.dailyQuestsAllCompleted },
    { id: 'perfectionist', name: 'Perfectionniste', desc: 'Tous les achievements', icon: '🏅', condition: (s) => s.achievements.length >= 24 }
];

// Quest Pool - All possible quests with descriptions
const QUEST_POOL = [
    // Creativity
    { id: 'creation_10min', name: 'Règle des 10min', type: 'creativity', xp: 20, desc: 'Créer quelque chose avant de consommer du contenu', emoji: '🎥' },
    { id: 'ugly_version', name: 'Version "Moche"', type: 'creativity', xp: 10, desc: 'Terminer un projet imparfait plutôt que rien', emoji: '🧱' },
    { id: 'no_scroll', name: 'No Scroll 1h', type: 'creativity', xp: 15, desc: 'Résister au scroll pendant 1 heure', emoji: '📵' },
    { id: 'deep_work', name: 'Deep Work 25min', type: 'creativity', xp: 20, desc: 'Session Pomodoro de focus intense', emoji: '🧠' },
    { id: 'code_30min', name: 'Code 30min', type: 'creativity', xp: 20, desc: 'Coder pendant 30 minutes minimum', emoji: '💻' },
    { id: 'write_500', name: 'Write 500', type: 'creativity', xp: 15, desc: 'Écrire 500 mots (journal, projet, etc)', emoji: '✍️' },

    // Curiosity
    { id: 'journal_truth', name: 'Journal de Vérité', type: 'curiosity', xp: 15, desc: 'Écrire une phrase brute sur tes peurs ou blocages', emoji: '📓' },
    { id: 'fear_compass', name: 'Boussole Peur', type: 'curiosity', xp: 25, desc: 'Faire une action qui te fait peur', emoji: '🧭' },
    { id: 'learn_new', name: 'Learn Something', type: 'curiosity', xp: 15, desc: 'Apprendre un concept nouveau (doc, tuto, article)', emoji: '📚' },
    { id: 'read_20min', name: 'Lecture 20min', type: 'curiosity', xp: 15, desc: 'Lire un livre/article pendant 20 minutes', emoji: '📖' },
    { id: 'meditation', name: 'Méditation 5min', type: 'curiosity', xp: 10, desc: 'Session de méditation ou respiration', emoji: '🧘' },
    { id: 'question_day', name: 'Question du Jour', type: 'curiosity', xp: 10, desc: 'Se poser une question profonde sur soi', emoji: '❓' },

    // Love
    { id: 'curious_compliment', name: 'Compliment Curieux', type: 'love', xp: 20, desc: 'Poser une question sincère à quelqu\'un', emoji: '🤝' },
    { id: 'mma_anchor', name: 'Ancre MMA', type: 'love', xp: 5, desc: 'Faire ton geste de check mental (MMA)', emoji: '👊' },
    { id: 'connect_irl', name: 'Connect IRL', type: 'love', xp: 25, desc: 'Parler à quelqu\'un en vrai (pas en ligne)', emoji: '💬' },
    { id: 'mma_training', name: 'MMA Training', type: 'love', xp: 25, desc: 'Séance d\'entraînement MMA complète', emoji: '🥋' },
    { id: 'gratitude_3', name: 'Gratitude x3', type: 'love', xp: 10, desc: 'Noter 3 choses pour lesquelles tu es reconnaissant', emoji: '🙏' },
    { id: 'help_someone', name: 'Aide Quelqu\'un', type: 'love', xp: 20, desc: 'Aider quelqu\'un sans attendre de retour', emoji: '🤲' },
    { id: 'aldi_reframe', name: 'Reframing Aldi', type: 'love', xp: 15, desc: 'Voir le travail comme game design réel', emoji: '💼' }
];

// Page explanations
const PAGE_EXPLANATIONS = {
    quests: {
        title: '⚔️ Quêtes',
        desc: 'Gagne de l\'XP en accomplissant des actions alignées avec tes valeurs. Les quêtes quotidiennes changent chaque jour - complète-les toutes pour un bonus!',
        tip: '💡 Tip: Les quêtes quotidiennes donnent un bonus XP x2!'
    },
    cap: {
        title: '⚡ C.A.P System',
        desc: 'Capture tes idées et tâches, Agis sur les petites (moins de 2min), Priorise une quête principale avec ⭐. C\'est ton cerveau externalisé.',
        tip: '💡 Tip: Marque ta tâche la plus importante avec l\'étoile!'
    },
    vault: {
        title: '🛡️ Dossier Preuves',
        desc: 'Ton bouclier anti-syndrome de l\'imposteur. Stocke chaque petite victoire pour te rappeler que tu progresses vraiment.',
        tip: '💡 Tip: Clique sur ✏️ pour modifier une preuve!'
    },
    profile: {
        title: '🏆 Profil Chasseur',
        desc: 'Ton tableau de bord de progression. Vois ton rang, tes stats, et débloque des badges en jouant régulièrement.',
        tip: '💡 Tip: Chaque badge débloqué prouve ton évolution!'
    },
    reflect: {
        title: '🧘 Réflexion Hebdo',
        desc: 'Chaque dimanche, prends 5 minutes pour célébrer tes victoires et identifier ce qui t\'a bloqué. Ajuste ton approche et continue!',
        tip: '💡 Tip: C\'est le moment de faire le point, pas de tout changer!'
    }
};

// ============================================
// 2. STATE MANAGEMENT
// ============================================

const defaultState = {
    // Core
    level: 1,
    xpTotal: 0,
    stats: { love: 0, curiosity: 0, creativity: 0 },

    // Streak
    streak: 0,
    lastActiveDate: null,

    // Quests
    dailyQuests: [],
    dailyQuestsCompleted: [],
    secondaryQuests: [],
    lastQuestRefresh: null,

    // C.A.P
    capQuests: [],
    priorityQuestIndex: null,
    questsCompleted: 0,

    // Proofs
    proofs: [],
    proofsCount: 0,

    // Achievements
    achievements: [],

    // Reflect
    reflectCount: 0,
    reflectNotes: { joy: '', obstacles: '', intentions: '' },

    // Session tracking
    sessionActions: 0,
    earlyBird: false,
    nightOwl: false,
    dailyQuestsAllCompleted: false,

    // Welcome
    hasSeenWelcome: false
};

let state = loadState();
let editingProofIndex = null;

function loadState() {
    try {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return { ...defaultState, ...parsed };
        }
    } catch (e) {
        console.error('Error loading state:', e);
    }
    return { ...defaultState };
}

function save() {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error('Error saving state:', e);
    }
}

// ============================================
// 3. WELCOME SCREEN
// ============================================

let currentWelcomeSlide = 0;
const TOTAL_WELCOME_SLIDES = 4;

function initWelcome() {
    const overlay = document.getElementById('welcome-overlay');
    if (state.hasSeenWelcome) {
        overlay.classList.add('hidden');
        return;
    }
    overlay.classList.remove('hidden');
}

function nextWelcomeSlide() {
    currentWelcomeSlide++;

    if (currentWelcomeSlide >= TOTAL_WELCOME_SLIDES) {
        skipWelcome();
        return;
    }

    updateWelcomeSlide();

    // Change button text on last slide
    if (currentWelcomeSlide === TOTAL_WELCOME_SLIDES - 1) {
        document.getElementById('btn-welcome-next').textContent = 'Commencer';
    }
}

function updateWelcomeSlide() {
    document.querySelectorAll('.welcome-slide').forEach((slide, i) => {
        slide.classList.toggle('active', i === currentWelcomeSlide);
    });
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentWelcomeSlide);
    });
}

function skipWelcome() {
    state.hasSeenWelcome = true;
    save();
    document.getElementById('welcome-overlay').classList.add('hidden');
}

// ============================================
// 4. DATE & STREAK LOGIC
// ============================================

function getTodayString() {
    return new Date().toISOString().split('T')[0];
}

function checkAndUpdateStreak() {
    const today = getTodayString();
    const lastActive = state.lastActiveDate;

    if (!lastActive) {
        state.streak = 0;
    } else if (lastActive === today) {
        return; // Already active today
    } else {
        const lastDate = new Date(lastActive);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            state.streak++;
            showToast(`🔥 Streak: ${state.streak} jours!`);
        } else if (diffDays > 1) {
            if (state.streak > 0) {
                showToast('💔 Streak perdu... Recommence!');
            }
            state.streak = 0;
        }
    }
}

function markActiveToday() {
    const today = getTodayString();
    if (state.lastActiveDate !== today) {
        checkAndUpdateStreak();
        state.lastActiveDate = today;
        if (state.streak === 0) {
            state.streak = 1;
        }
        // Reset session counter for new day
        state.sessionActions = 0;
        state.dailyQuestsAllCompleted = false;
        save();
        renderHUD();
    }
}

// ============================================
// 5. QUEST GENERATION
// ============================================

function shouldRefreshQuests() {
    const today = getTodayString();
    return state.lastQuestRefresh !== today;
}

function refreshDailyQuests() {
    const today = getTodayString();

    if (state.lastQuestRefresh === today) {
        return; // Already refreshed today
    }

    // Shuffle and pick daily quests
    const shuffled = [...QUEST_POOL].sort(() => Math.random() - 0.5);

    // Pick 3 for daily (try to balance types)
    const daily = [];
    const types = ['creativity', 'curiosity', 'love'];
    for (const type of types) {
        const quest = shuffled.find(q => q.type === type && !daily.includes(q));
        if (quest) daily.push(quest);
    }

    // Pick 4 for secondary (remaining)
    const usedIds = daily.map(q => q.id);
    const secondary = shuffled.filter(q => !usedIds.includes(q.id)).slice(0, CONFIG.SECONDARY_QUESTS_COUNT);

    state.dailyQuests = daily.map(q => q.id);
    state.dailyQuestsCompleted = [];
    state.secondaryQuests = secondary.map(q => q.id);
    state.lastQuestRefresh = today;

    save();
}

function getQuestById(id) {
    return QUEST_POOL.find(q => q.id === id);
}

// ============================================
// 6. XP & LEVELING SYSTEM
// ============================================

function getRank(xp) {
    let rank = RANKS[0];
    for (const r of RANKS) {
        if (xp >= r.minXP) {
            rank = r;
        }
    }
    return rank;
}

function getXPProgress() {
    const currentLevelXP = (state.level - 1) * CONFIG.XP_PER_LEVEL;
    const progress = state.xpTotal - currentLevelXP;
    const needed = CONFIG.XP_PER_LEVEL;
    return { progress, needed, percent: (progress / needed) * 100 };
}

function gainXP(type, amount, isDaily = false) {
    const finalAmount = isDaily ? amount * 2 : amount;

    state.stats[type] += finalAmount;
    state.xpTotal += finalAmount;
    state.sessionActions++;

    // Check time-based achievements
    const hour = new Date().getHours();
    if (hour < 7) state.earlyBird = true;
    if (hour >= 23) state.nightOwl = true;

    // Check level up
    const newLevel = Math.floor(state.xpTotal / CONFIG.XP_PER_LEVEL) + 1;
    const didLevelUp = newLevel > state.level;

    if (didLevelUp) {
        state.level = newLevel;
        showLevelUp(newLevel);
        launchConfetti();
    }

    markActiveToday();
    checkAchievements();
    save();
    renderHUD();

    const prefix = isDaily ? '⭐ DAILY x2! ' : '';
    showToast(`${prefix}+${finalAmount} XP`);
}

// ============================================
// 7. ACHIEVEMENTS SYSTEM
// ============================================

function checkAchievements() {
    for (const achievement of ACHIEVEMENTS) {
        if (!state.achievements.includes(achievement.id) && achievement.condition(state)) {
            unlockAchievement(achievement);
        }
    }
}

function unlockAchievement(achievement) {
    state.achievements.push(achievement.id);
    save();
    showAchievementPopup(achievement);
}

function showAchievementPopup(achievement) {
    const popup = document.getElementById('achievement-popup');
    document.getElementById('achievement-title').textContent = achievement.name;
    document.getElementById('achievement-desc').textContent = achievement.desc;
    popup.querySelector('.achievement-icon').textContent = achievement.icon;

    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 3000);
}

// ============================================
// 8. UI NOTIFICATIONS
// ============================================

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

function showLevelUp(level) {
    const overlay = document.getElementById('levelup-overlay');
    const text = document.getElementById('levelup-text');
    const rank = getRank(state.xpTotal);

    text.innerHTML = `Tu es maintenant niveau <strong>${level}</strong><br><span style="color: var(--accent)">${rank.emoji} ${rank.name}</span>`;
    overlay.classList.add('show');
}

function closeLevelUp() {
    document.getElementById('levelup-overlay').classList.remove('show');
}

function launchConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#ffd32a', '#ff4757', '#2ed573', '#58a6ff', '#a55eea', '#ff6b35'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = (Math.random() * 10 + 5) + 'px';
        confetti.style.height = (Math.random() * 10 + 5) + 'px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.animation = `confetti-fall ${Math.random() * 2 + 2}s ease forwards`;
        confetti.style.animationDelay = Math.random() * 0.5 + 's';

        container.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
    }
}

// ============================================
// 9. HUD RENDERING
// ============================================

function renderHUD() {
    const rank = getRank(state.xpTotal);
    const xpProgress = getXPProgress();

    document.getElementById('player-rank').textContent = rank.short;
    document.getElementById('player-lvl').textContent = state.level;

    const ring = document.getElementById('xp-ring');
    const dashOffset = 97.4 - (97.4 * (xpProgress.percent / 100));
    ring.style.strokeDashoffset = Math.max(0, dashOffset);

    document.getElementById('streak-count').textContent = state.streak;

    const maxStat = 500;
    document.getElementById('bar-love').style.width = Math.min((state.stats.love / maxStat) * 100, 100) + '%';
    document.getElementById('bar-curiosity').style.width = Math.min((state.stats.curiosity / maxStat) * 100, 100) + '%';
    document.getElementById('bar-creativity').style.width = Math.min((state.stats.creativity / maxStat) * 100, 100) + '%';

    document.getElementById('val-love').textContent = state.stats.love;
    document.getElementById('val-curiosity').textContent = state.stats.curiosity;
    document.getElementById('val-creativity').textContent = state.stats.creativity;
}

// ============================================
// 10. ROUTER & PAGES
// ============================================

let currentPage = 'quests';

function router(page) {
    currentPage = page;
    const main = document.getElementById('main-content');

    // Update nav buttons (both sidebar and dock)
    document.querySelectorAll('.nav-btn, .sidebar-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === page);
    });

    switch (page) {
        case 'quests': renderQuestsPage(main); break;
        case 'cap': renderCAPPage(main); break;
        case 'vault': renderVaultPage(main); break;
        case 'profile': renderProfilePage(main); break;
        case 'reflect': renderReflectPage(main); break;
    }

    main.scrollTop = 0;
}

// ============================================
// 11. QUESTS PAGE
// ============================================

function renderQuestsPage(main) {
    refreshDailyQuests();

    const exp = PAGE_EXPLANATIONS.quests;

    let html = `
        <div class="page-header">
            <h2>${exp.title}</h2>
            <p>${exp.desc}</p>
            <div class="tip">${exp.tip}</div>
        </div>
        
        <h2>⭐ QUÊTES QUOTIDIENNES</h2>
        <div class="card daily-quest">
            <span class="card-badge">BONUS x2</span>
    `;

    // Daily quests
    for (const questId of state.dailyQuests) {
        const quest = getQuestById(questId);
        if (!quest) continue;

        const isCompleted = state.dailyQuestsCompleted.includes(questId);
        html += `
            <button class="btn-action golden ${isCompleted ? 'completed' : ''}" 
                    onclick="${isCompleted ? '' : `completeDailyQuest('${questId}')`}"
                    ${isCompleted ? 'disabled' : ''}>
                <div class="quest-info">
                    <span class="quest-name">${quest.emoji} ${quest.name}</span>
                    <span class="quest-desc">${quest.desc}</span>
                </div>
                <span class="xp">+${quest.xp * 2} XP</span>
            </button>
        `;
    }

    html += `</div>
        <h2>📜 QUÊTES SECONDAIRES</h2>
        <div class="card secondary-quests">
    `;

    // Secondary quests
    for (const questId of state.secondaryQuests) {
        const quest = getQuestById(questId);
        if (!quest) continue;

        html += `
            <button class="btn-action" onclick="completeSecondaryQuest('${questId}')">
                <div class="quest-info">
                    <span class="quest-name">${quest.emoji} ${quest.name}</span>
                    <span class="quest-desc">${quest.desc}</span>
                </div>
                <span class="xp">+${quest.xp} XP</span>
            </button>
        `;
    }

    html += `</div>
        <h2>🔄 ACTIONS LIBRES</h2>
        <div class="card">
            <p class="text-muted" style="font-size: 0.8rem; margin-bottom: 12px;">
                Actions rapides toujours disponibles
            </p>
    `;

    // Quick actions (always available)
    const quickActions = [
        { name: '👊 Ancre MMA', type: 'love', xp: 5, desc: 'Check mental rapide' },
        { name: '🙏 Gratitude', type: 'love', xp: 10, desc: 'Note 3 gratitudes' },
        { name: '🧘 Respiration', type: 'curiosity', xp: 5, desc: '1 minute de respiration' }
    ];

    for (const action of quickActions) {
        html += `
            <button class="btn-action" onclick="gainXP('${action.type}', ${action.xp})">
                <div class="quest-info">
                    <span class="quest-name">${action.name}</span>
                    <span class="quest-desc">${action.desc}</span>
                </div>
                <span class="xp">+${action.xp} XP</span>
            </button>
        `;
    }

    html += `</div>`;
    main.innerHTML = html;
}

function completeDailyQuest(questId) {
    const quest = getQuestById(questId);
    if (!quest || state.dailyQuestsCompleted.includes(questId)) return;

    state.dailyQuestsCompleted.push(questId);

    // Check if all daily quests completed
    if (state.dailyQuestsCompleted.length >= state.dailyQuests.length) {
        state.dailyQuestsAllCompleted = true;
        showToast('🎰 JACKPOT! Toutes les quêtes du jour!');
    }

    gainXP(quest.type, quest.xp, true);
    router('quests');
}

function completeSecondaryQuest(questId) {
    const quest = getQuestById(questId);
    if (!quest) return;

    gainXP(quest.type, quest.xp, false);
}

// ============================================
// 12. C.A.P PAGE
// ============================================

function renderCAPPage(main) {
    const exp = PAGE_EXPLANATIONS.cap;

    let html = `
        <div class="page-header">
            <h2>${exp.title}</h2>
            <p>${exp.desc}</p>
            <div class="tip">${exp.tip}</div>
        </div>
        
        <div class="input-group">
            <input type="text" id="cap-input" placeholder="Capturer une tâche..." onkeypress="if(event.key==='Enter')addCapQuest()">
            <button class="btn-add" onclick="addCapQuest()">+</button>
        </div>
    `;

    if (state.capQuests.length === 0) {
        html += `
            <div class="empty-state">
                <div class="icon">📝</div>
                <p>Aucune quête capturée.<br>Ajoute ta première tâche!</p>
            </div>
        `;
    } else {
        const quests = state.capQuests.map((q, i) => ({ text: q, index: i }));
        quests.sort((a, b) => {
            if (a.index === state.priorityQuestIndex) return -1;
            if (b.index === state.priorityQuestIndex) return 1;
            return 0;
        });

        html += `<ul id="cap-list">`;
        for (const quest of quests) {
            const isPriority = quest.index === state.priorityQuestIndex;
            html += `
                <li class="${isPriority ? 'priority' : ''}">
                    <span>${quest.text}</span>
                    <div class="task-actions">
                        <button class="priority-btn" onclick="setCapPriority(${quest.index})" title="Quête principale">
                            ${isPriority ? '⭐' : '☆'}
                        </button>
                        <button class="complete-btn" onclick="completeCapQuest(${quest.index})" title="Terminé">✓</button>
                        <button class="delete-btn" onclick="removeCapQuest(${quest.index})" title="Supprimer">×</button>
                    </div>
                </li>
            `;
        }
        html += `</ul>`;
    }

    main.innerHTML = html;
}

function addCapQuest() {
    const input = document.getElementById('cap-input');
    const text = input.value.trim();

    if (text && state.capQuests.length < CONFIG.MAX_CAP_QUESTS) {
        state.capQuests.push(text);
        save();
        router('cap');
        showToast('📝 Quête capturée!');
    }
}

function completeCapQuest(index) {
    state.capQuests.splice(index, 1);
    state.questsCompleted++;

    if (state.priorityQuestIndex === index) {
        state.priorityQuestIndex = null;
    } else if (state.priorityQuestIndex > index) {
        state.priorityQuestIndex--;
    }

    gainXP('curiosity', 10);
    router('cap');
}

function removeCapQuest(index) {
    state.capQuests.splice(index, 1);

    if (state.priorityQuestIndex === index) {
        state.priorityQuestIndex = null;
    } else if (state.priorityQuestIndex > index) {
        state.priorityQuestIndex--;
    }

    save();
    router('cap');
}

function setCapPriority(index) {
    state.priorityQuestIndex = (state.priorityQuestIndex === index) ? null : index;
    save();
    router('cap');
}

// ============================================
// 13. VAULT PAGE (Proofs)
// ============================================

function renderVaultPage(main) {
    const exp = PAGE_EXPLANATIONS.vault;

    let html = `
        <div class="page-header">
            <h2>${exp.title}</h2>
            <p>${exp.desc}</p>
            <div class="tip">${exp.tip}</div>
        </div>
        
        <div class="input-group">
            <input type="text" id="proof-input" placeholder="Ta victoire..." onkeypress="if(event.key==='Enter')addProof()">
            <button class="btn-add" onclick="addProof()">+</button>
        </div>
    `;

    if (state.proofs.length === 0) {
        html += `
            <div class="empty-state">
                <div class="icon">🏆</div>
                <p>Aucune preuve encore.<br>Ajoute ta première victoire!</p>
            </div>
        `;
    } else {
        html += `<div class="proofs-list">`;
        for (let i = 0; i < state.proofs.length; i++) {
            const proof = state.proofs[i];
            html += `
                <div class="proof-item">
                    <div class="proof-info">
                        <span class="proof-text">🏆 ${proof.text}</span>
                        <span class="timestamp">${proof.date}</span>
                    </div>
                    <div class="proof-actions">
                        <button class="edit-btn" onclick="openEditProofModal(${i})" title="Modifier">✏️</button>
                        <button class="delete-btn" onclick="deleteProof(${i})" title="Supprimer">×</button>
                    </div>
                </div>
            `;
        }
        html += `</div>`;
    }

    main.innerHTML = html;
}

function addProof() {
    const input = document.getElementById('proof-input');
    const text = input.value.trim();

    if (text) {
        const now = new Date();
        const dateStr = now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

        state.proofs.unshift({ text, date: dateStr });
        state.proofsCount++;

        if (state.proofs.length > CONFIG.MAX_PROOFS) {
            state.proofs.pop();
        }

        gainXP('love', 10);
        router('vault');
    }
}

function deleteProof(index) {
    if (confirm('Supprimer cette preuve?')) {
        state.proofs.splice(index, 1);
        save();
        router('vault');
        showToast('Preuve supprimée');
    }
}

function openEditProofModal(index) {
    editingProofIndex = index;
    const proof = state.proofs[index];

    document.getElementById('edit-proof-text').value = proof.text;

    // Parse date for input
    const dateInput = document.getElementById('edit-proof-date');
    const now = new Date();
    dateInput.value = now.toISOString().split('T')[0];

    document.getElementById('edit-proof-modal').classList.add('show');
}

function closeEditProofModal() {
    document.getElementById('edit-proof-modal').classList.remove('show');
    editingProofIndex = null;
}

function saveEditedProof() {
    if (editingProofIndex === null) return;

    const text = document.getElementById('edit-proof-text').value.trim();
    const dateValue = document.getElementById('edit-proof-date').value;

    if (text) {
        const date = new Date(dateValue);
        const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

        state.proofs[editingProofIndex] = { text, date: dateStr };
        save();
        closeEditProofModal();
        router('vault');
        showToast('✏️ Preuve modifiée!');
    }
}

// ============================================
// 14. PROFILE PAGE
// ============================================

function renderProfilePage(main) {
    const exp = PAGE_EXPLANATIONS.profile;
    const rank = getRank(state.xpTotal);
    const xpProgress = getXPProgress();

    let html = `
        <div class="page-header">
            <h2>${exp.title}</h2>
            <p>${exp.desc}</p>
            <div class="tip">${exp.tip}</div>
        </div>
        
        <div class="card">
            <div style="text-align: center; margin-bottom: 16px;">
                <span style="font-size: 3rem;">${rank.emoji}</span>
                <h3 style="color: var(--accent); margin-top: 8px;">${rank.name}</h3>
            </div>
            
            <div class="stats-summary">
                <div class="stat-box">
                    <span class="value">${state.level}</span>
                    <span class="label">Niveau</span>
                </div>
                <div class="stat-box">
                    <span class="value">${state.xpTotal}</span>
                    <span class="label">XP Total</span>
                </div>
                <div class="stat-box">
                    <span class="value">${state.streak}🔥</span>
                    <span class="label">Streak</span>
                </div>
            </div>
            
            <div style="margin-top: 12px;">
                <p class="text-muted" style="font-size: 0.75rem; margin-bottom: 4px;">
                    Prochain niveau: ${xpProgress.progress}/${xpProgress.needed} XP
                </p>
                <div class="progress-bar" style="height: 8px;">
                    <div class="fill curiosity" style="width: ${xpProgress.percent}%"></div>
                </div>
            </div>
        </div>
        
        <h2>🎖️ ACHIEVEMENTS (${state.achievements.length}/${ACHIEVEMENTS.length})</h2>
        <div class="achievements-grid">
    `;

    for (const achievement of ACHIEVEMENTS) {
        const unlocked = state.achievements.includes(achievement.id);
        html += `
            <div class="achievement-item ${unlocked ? 'unlocked' : 'locked'}" title="${achievement.desc}">
                <span class="icon">${achievement.icon}</span>
                <span class="name">${achievement.name}</span>
            </div>
        `;
    }

    html += `</div>
        
        <div class="mt-16">
            <h2>📊 STATISTIQUES</h2>
            <div class="card">
                <p style="font-size: 0.85rem; margin-bottom: 8px;">❤️ Amour: <strong>${state.stats.love}</strong></p>
                <p style="font-size: 0.85rem; margin-bottom: 8px;">🎨 Créativité: <strong>${state.stats.creativity}</strong></p>
                <p style="font-size: 0.85rem; margin-bottom: 8px;">🔍 Curiosité: <strong>${state.stats.curiosity}</strong></p>
                <hr style="border: none; border-top: 1px solid var(--border); margin: 12px 0;">
                <p style="font-size: 0.85rem;">✅ Quêtes C.A.P: <strong>${state.questsCompleted}</strong></p>
                <p style="font-size: 0.85rem;">🏆 Preuves: <strong>${state.proofsCount}</strong></p>
                <p style="font-size: 0.85rem;">🧘 Réflexions: <strong>${state.reflectCount}</strong></p>
            </div>
        </div>
        
        <div class="mt-16 mb-16">
            <button class="btn-action" style="background: var(--love); justify-content: center;" onclick="confirmReset()">
                🗑️ RESET PROGRESSION
            </button>
        </div>
    `;

    main.innerHTML = html;
}

function confirmReset() {
    if (confirm('⚠️ Es-tu sûr de vouloir TOUT effacer? Cette action est irréversible!')) {
        if (confirm('🔴 DERNIÈRE CHANCE: Vraiment tout supprimer?')) {
            localStorage.removeItem(CONFIG.STORAGE_KEY);
            state = { ...defaultState };
            state.hasSeenWelcome = true; // Don't show welcome again
            save();
            showToast('💀 Progression effacée...');
            router('quests');
            renderHUD();
        }
    }
}

// ============================================
// 15. REFLECT PAGE
// ============================================

function renderReflectPage(main) {
    const exp = PAGE_EXPLANATIONS.reflect;

    let html = `
        <div class="page-header">
            <h2>${exp.title}</h2>
            <p>${exp.desc}</p>
            <div class="tip">${exp.tip}</div>
        </div>
        
        <div class="card reflect">
            <div class="reflect-section">
                <h3>🌟 Célébrations</h3>
                <p>Qu'est-ce qui a bien marché cette semaine? De quoi es-tu fier?</p>
                <textarea id="reflect-joy" placeholder="Tes victoires de la semaine...">${state.reflectNotes.joy || ''}</textarea>
            </div>
            
            <div class="reflect-section">
                <h3>🧱 Obstacles</h3>
                <p>Qu'est-ce qui t'a bloqué ou ralenti?</p>
                <textarea id="reflect-obstacles" placeholder="Les friction que tu as rencontrées...">${state.reflectNotes.obstacles || ''}</textarea>
            </div>
            
            <div class="reflect-section">
                <h3>🎯 Intentions</h3>
                <p>Que veux-tu améliorer la semaine prochaine?</p>
                <textarea id="reflect-intentions" placeholder="Tes intentions pour avancer...">${state.reflectNotes.intentions || ''}</textarea>
            </div>
            
            <button class="btn-action golden" style="justify-content: center; margin-top: 16px;" onclick="completeReflect()">
                🧘 VALIDER MA RÉFLEXION (+50 XP)
            </button>
        </div>
        
        <div class="card" style="margin-top: 16px;">
            <h3 style="margin-bottom: 12px;">📝 Rappel: Les 3 Piliers</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6;">
                Chaque action doit nourrir un de ces piliers:<br><br>
                ❤️ <strong>Amour</strong> — Relations, confiance, connexion<br>
                🎨 <strong>Créativité</strong> — Création, projets, expression<br>
                🔍 <strong>Curiosité</strong> — Apprentissage, exploration, croissance
            </p>
        </div>
    `;

    main.innerHTML = html;
}

function completeReflect() {
    const joyInput = document.getElementById('reflect-joy');
    const obstaclesInput = document.getElementById('reflect-obstacles');
    const intentionsInput = document.getElementById('reflect-intentions');

    state.reflectNotes = {
        joy: joyInput.value,
        obstacles: obstaclesInput.value,
        intentions: intentionsInput.value
    };
    state.reflectCount++;

    gainXP('curiosity', 50);
    showToast('🧘 Réflexion complétée!');

    save();
    checkAchievements();
}

// ============================================
// 16. INITIALIZATION
// ============================================

function init() {
    // Check welcome
    initWelcome();

    // Check streak
    checkAndUpdateStreak();

    // Refresh quests if new day
    if (shouldRefreshQuests()) {
        refreshDailyQuests();
    }

    // Save
    save();

    // Render
    renderHUD();
    router('quests');

    console.log('🎮 ARCHITECT-PLAYER OS v2.1 loaded!');
}

// Run on load
init();

// Global exports
window.router = router;
window.gainXP = gainXP;
window.addCapQuest = addCapQuest;
window.completeCapQuest = completeCapQuest;
window.removeCapQuest = removeCapQuest;
window.setCapPriority = setCapPriority;
window.addProof = addProof;
window.deleteProof = deleteProof;
window.openEditProofModal = openEditProofModal;
window.closeEditProofModal = closeEditProofModal;
window.saveEditedProof = saveEditedProof;
window.completeReflect = completeReflect;
window.completeDailyQuest = completeDailyQuest;
window.completeSecondaryQuest = completeSecondaryQuest;
window.closeLevelUp = closeLevelUp;
window.confirmReset = confirmReset;
window.nextWelcomeSlide = nextWelcomeSlide;
window.skipWelcome = skipWelcome;