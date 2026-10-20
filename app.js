/**
 * Círculo de Oração - Lógica da Aplicação
 * Gerenciamento de pedidos, orações intercessórias, testemunhos e momentos de fé.
 */

// ==========================================
// Banco de Versículos Inspiradores
// ==========================================
const DAILY_VERSES = [
  { text: "Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, e com ação de graças, apresentem seus pedidos a Deus.", ref: "Filipenses 4:6" },
  { text: "A oração feita por um justo pode muito em seus efeitos.", ref: "Tiago 5:16" },
  { text: "Clama a mim, e responder-te-ei, e anunciar-te-ei coisas grandes e firmes que não sabes.", ref: "Jeremias 33:3" },
  { text: "O Senhor é o meu pastor; de nada terei falta. Ele me faz repousar em pastos verdejantes e me guia a águas tranquilas.", ref: "Salmos 23:1-2" },
  { text: "Venham a mim, todos os que estão cansados e sobrecarregados, e eu darei descanso a vocês.", ref: "Mateus 11:28" },
  { text: "O Senhor te abençoe e te guarde; o Senhor faça resplandecer o seu rosto sobre ti e te conceda paz.", ref: "Números 6:24-26" },
  { text: "Pois onde dois ou três estiverem reunidos em meu nome, ali estou no meio deles.", ref: "Mateus 18:20" },
  { text: "Mil poderão cair ao seu lado e dez mil à sua direita, mas nada o atingirá.", ref: "Salmos 91:7" }
];

// ==========================================
// Pedidos Iniciais (Seed Data de Exemplo)
// ==========================================
const INITIAL_PRAYERS = [
  {
    id: "prayer-1",
    author: "Anônimo",
    isAnonymous: true,
    title: "Internação na UTI do pequeno Gabriel",
    description: "Gabriel tem 4 anos e está enfrentando uma complicação pulmonar. Os médicos estão monitorando e pedimos que a comunidade clame pela recuperação plena do pulmãozinho dele.",
    category: "Causa Urgente",
    isUrgent: true,
    status: "active", // active | answered
    createdAt: Date.now() - 1000 * 60 * 60 * 3, // há 3h
    prayersCount: 42,
    testimony: null,
    comments: [
      { id: "c1", author: "Irmã Cleide", text: "Estou em oração contínua pelo Gabriel! O Senhor Jesus é o médico dos médicos.", time: "há 2 horas" },
      { id: "c2", author: "Pastor Marcos", text: "Deus derrame cura e fortaleza sobre os pais neste momento.", time: "há 1 hora" }
    ]
  },
  {
    id: "prayer-2",
    author: "Maria S.",
    isAnonymous: false,
    title: "Restauração e paz no casamento e família",
    description: "Estamos passando por um momento de muitas discussões e afastamento no lar. Peço oração para que o amor, o perdão e a paciência reinem novamente em nossa casa.",
    category: "Família",
    isUrgent: false,
    status: "active",
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    prayersCount: 19,
    testimony: null,
    comments: [
      { id: "c3", author: "Lucas F.", text: "Deus restaura alianças! Clamando por vocês.", time: "há 4 horas" }
    ]
  },
  {
    id: "prayer-3",
    author: "Roberto Costa",
    isAnonymous: false,
    title: "Direcionamento profissional e porta de emprego",
    description: "Estou desempregado há 6 meses com contas acumulando. Peço a bênção de Deus para uma entrevista de trabalho nesta próxima segunda-feira.",
    category: "Trabalho",
    isUrgent: false,
    status: "active",
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    prayersCount: 27,
    testimony: null,
    comments: []
  },
  {
    id: "prayer-4",
    author: "Dona Helena",
    isAnonymous: false,
    title: "Cura do diagnóstico de nódulo na tireoide",
    description: "Havia pedido orações no mês passado para o resultado da biópsia. Deus ouviu as nossas preces e o resultado foi benigno!",
    category: "Saúde",
    isUrgent: false,
    status: "answered",
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    prayersCount: 56,
    testimony: "Glória a Deus! Os exames deram negativos para malignidade. O médico suspendeu qualquer cirurgia invasiva. Agradeço do fundo do coração a todos que oraram por mim!",
    comments: [
      { id: "c4", author: "Ana Paula", text: "Deus seja louvado! Que notícia maravilhosa!", time: "ontem" }
    ]
  }
];

// ==========================================
// Estado Global
// ==========================================
class PrayerApp {
  constructor() {
    this.storageKey = 'circulo_oracoes_db_v1';
    this.userPrayedKey = 'circulo_oracoes_my_prayed_v1';
    this.myPrayersKey = 'circulo_oracoes_my_created_v1';
    this.themeKey = 'circulo_oracoes_theme_v1';

    this.prayers = this.loadPrayers();
    this.userPrayed = this.loadUserPrayed();
    this.myCreatedIds = this.loadMyCreatedIds();

    this.activeTab = 'wall'; // wall | testimonies | my-prayers
    this.activeCategory = 'all';
    this.searchQuery = '';

    // Audio Context para sino de oração
    this.audioCtx = null;
    this.soundEnabled = true;

    // Timer do momento de oração
    this.timerInterval = null;
    this.timerSeconds = 120; // 2 min
    this.timerRemaining = 120;
    this.timerRunning = false;

    this.init();
  }

  init() {
    this.initTheme();
    this.bindEvents();
    this.renderVerse();
    this.renderStats();
    this.renderPrayers();
  }

  // --- Carregamento e Persistência ---
  loadPrayers() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Erro ao carregar do localStorage', e);
    }
    return INITIAL_PRAYERS;
  }

  savePrayers() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.prayers));
    } catch (e) {
      console.error('Falha ao salvar no localStorage', e);
    }
    this.renderStats();
  }

  loadUserPrayed() {
    try {
      const data = localStorage.getItem(this.userPrayedKey);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  saveUserPrayed() {
    try {
      localStorage.setItem(this.userPrayedKey, JSON.stringify(this.userPrayed));
    } catch (e) {
      console.error(e);
    }
  }

  loadMyCreatedIds() {
    try {
      const data = localStorage.getItem(this.myPrayersKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveMyCreatedIds() {
    try {
      localStorage.setItem(this.myPrayersKey, JSON.stringify(this.myCreatedIds));
    } catch (e) {
      console.error(e);
    }
  }

  // --- Tema (Claro / Escuro) ---
  initTheme() {
    const saved = localStorage.getItem(this.themeKey) || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    this.updateThemeIcon(saved);
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(this.themeKey, next);
    this.updateThemeIcon(next);
  }

  updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  // --- Eventos de Interface ---
  bindEvents() {
    // Alternar tema
    document.getElementById('btn-theme-toggle').addEventListener('click', () => this.toggleTheme());

    // Versículo do Dia
    document.getElementById('btn-new-verse').addEventListener('click', () => this.renderVerse(true));

    // Abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });

    // Chips de Categoria
    document.querySelectorAll('#category-chips .chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        document.querySelectorAll('#category-chips .chip').forEach(c => c.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.activeCategory = e.currentTarget.getAttribute('data-cat');
        this.renderPrayers();
      });
    });

    // Busca
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.renderPrayers();
    });

    // Modais - Novo Pedido
    const modalNew = document.getElementById('modal-new-prayer');
    const openModalBtn = document.getElementById('btn-open-modal');
    const closeModalBtn = document.getElementById('btn-close-modal');
    const cancelModalBtn = document.getElementById('btn-cancel-modal');
    const emptyAddBtn = document.getElementById('btn-empty-add');

    const showModal = () => {
      modalNew.classList.remove('hidden');
      document.getElementById('input-title').focus();
    };
    const hideModal = () => modalNew.classList.add('hidden');

    openModalBtn.addEventListener('click', showModal);
    if (emptyAddBtn) emptyAddBtn.addEventListener('click', showModal);
    closeModalBtn.addEventListener('click', hideModal);
    cancelModalBtn.addEventListener('click', hideModal);

    modalNew.addEventListener('click', (e) => {
      if (e.target === modalNew) hideModal();
    });

    // Anônimo Checkbox
    const checkAnon = document.getElementById('check-anonymous');
    const inputAuthor = document.getElementById('input-author');
    checkAnon.addEventListener('change', (e) => {
      if (e.target.checked) {
        inputAuthor.value = '';
        inputAuthor.disabled = true;
        inputAuthor.placeholder = 'Pedido será postado como Anônimo';
      } else {
        inputAuthor.disabled = false;
        inputAuthor.placeholder = 'Ex: Maria S. ou Deixe em branco';
      }
    });

    // Submissão do Novo Pedido
    document.getElementById('form-new-prayer').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleCreatePrayer();
      hideModal();
    });

    // Modal Testemunho
    const modalTestimony = document.getElementById('modal-testimony');
    const closeTestimony = document.getElementById('btn-close-testimony-modal');
    const cancelTestimony = document.getElementById('btn-cancel-testimony');

    const hideTestimonyModal = () => modalTestimony.classList.add('hidden');
    closeTestimony.addEventListener('click', hideTestimonyModal);
    cancelTestimony.addEventListener('click', hideTestimonyModal);
    modalTestimony.addEventListener('click', (e) => {
      if (e.target === modalTestimony) hideTestimonyModal();
    });

    document.getElementById('form-testimony').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSaveTestimony();
      hideTestimonyModal();
    });

    // Modal Momento de Oração
    const modalMoment = document.getElementById('modal-prayer-moment');
    const btnOpenMoment = document.getElementById('btn-open-prayer-moment');
    const btnCloseMoment = document.getElementById('btn-close-prayer-moment');

    btnOpenMoment.addEventListener('click', () => {
      modalMoment.classList.remove('hidden');
    });
    btnCloseMoment.addEventListener('click', () => {
      modalMoment.classList.add('hidden');
      this.stopTimer();
    });
    modalMoment.addEventListener('click', (e) => {
      if (e.target === modalMoment) {
        modalMoment.classList.add('hidden');
        this.stopTimer();
      }
    });

    // Timer do Momento de Oração
    document.getElementById('btn-start-timer').addEventListener('click', () => this.toggleTimer());
    document.getElementById('btn-reset-timer').addEventListener('click', () => this.resetTimer());
    document.getElementById('btn-toggle-sound').addEventListener('click', () => this.toggleSound());

    // Backup
    document.getElementById('btn-export-data').addEventListener('click', () => this.exportBackup());
    document.getElementById('file-import-data').addEventListener('change', (e) => this.importBackup(e));
  }

  // --- Versículo Aleatório ---
  renderVerse(forceNew = false) {
    const textEl = document.getElementById('daily-verse-text');
    const refEl = document.getElementById('daily-verse-ref');

    let verseIndex = 0;
    if (forceNew) {
      verseIndex = Math.floor(Math.random() * DAILY_VERSES.length);
    } else {
      // Baseado no dia atual para ser consistente
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
      verseIndex = dayOfYear % DAILY_VERSES.length;
    }

    const verse = DAILY_VERSES[verseIndex];
    textEl.textContent = `"${verse.text}"`;
    refEl.textContent = `— ${verse.ref}`;
  }

  // --- Estatísticas ---
  renderStats() {
    const active = this.prayers.filter(p => p.status === 'active').length;
    const answered = this.prayers.filter(p => p.status === 'answered').length;
    const totalPrayed = this.prayers.reduce((acc, p) => acc + (p.prayersCount || 0), 0);

    document.getElementById('stat-active-prayers').textContent = active;
    document.getElementById('stat-total-prayed').textContent = totalPrayed;
    document.getElementById('stat-testified').textContent = answered;
    document.getElementById('testimony-count').textContent = answered;
  }

  // --- Troca de Abas ---
  switchTab(tab) {
    this.activeTab = tab;
    document.querySelectorAll('.tabs-nav .tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });
    this.renderPrayers();
  }

  // --- Criar Pedido ---
  handleCreatePrayer() {
    const checkAnon = document.getElementById('check-anonymous').checked;
    const authorVal = document.getElementById('input-author').value.trim();
    const author = checkAnon || !authorVal ? 'Anônimo' : authorVal;
    const category = document.getElementById('select-category').value;
    const title = document.getElementById('input-title').value.trim();
    const description = document.getElementById('input-description').value.trim();
    const isUrgent = document.getElementById('check-urgent').checked;

    const newPrayer = {
      id: 'prayer-' + Date.now(),
      author: author,
      isAnonymous: checkAnon || !authorVal,
      title: title,
      description: description,
      category: isUrgent ? 'Causa Urgente' : category,
      isUrgent: isUrgent,
      status: 'active',
      createdAt: Date.now(),
      prayersCount: 1, // o autor já começa orando
      testimony: null,
      comments: []
    };

    this.prayers.unshift(newPrayer);
    this.myCreatedIds.push(newPrayer.id);
    this.userPrayed[newPrayer.id] = true;

    this.savePrayers();
    this.saveMyCreatedIds();
    this.saveUserPrayed();

    this.renderPrayers();
    this.showToast('Seu pedido de oração foi publicado com amor! 🙏');
    this.playBellChime();

    // Reset formulário
    document.getElementById('form-new-prayer').reset();
    document.getElementById('input-author').disabled = false;
  }

  // --- Orar por um Pedido (Intercessão) ---
  togglePray(prayerId) {
    const prayer = this.prayers.find(p => p.id === prayerId);
    if (!prayer) return;

    const alreadyPrayed = !!this.userPrayed[prayerId];

    if (alreadyPrayed) {
      prayer.prayersCount = Math.max(0, (prayer.prayersCount || 1) - 1);
      delete this.userPrayed[prayerId];
      this.showToast('Intercessão removida.');
    } else {
      prayer.prayersCount = (prayer.prayersCount || 0) + 1;
      this.userPrayed[prayerId] = true;
      this.showToast('Que lindo! Você orou por este irmão(ã). Deus abençoe! 🙏✨');
      this.playBellChime();
    }

    this.savePrayers();
    this.saveUserPrayed();
    this.renderPrayers();
  }

  // --- Adicionar Palavra de Bênção (Comentário) ---
  addComment(prayerId, text) {
    if (!text.trim()) return;
    const prayer = this.prayers.find(p => p.id === prayerId);
    if (!prayer) return;

    if (!prayer.comments) prayer.comments = [];
    prayer.comments.push({
      id: 'c-' + Date.now(),
      author: 'Irmão(ã) em Cristo',
      text: text.trim(),
      time: 'agora mesmo'
    });

    this.savePrayers();
    this.renderPrayers();
    this.showToast('Palavra de bênção enviada!');
  }

  // --- Abrir Modal de Testemunho ---
  openTestimonyModal(prayerId) {
    const prayer = this.prayers.find(p => p.id === prayerId);
    if (!prayer) return;

    document.getElementById('testimony-prayer-id').value = prayerId;
    document.getElementById('input-testimony-text').value = '';
    document.getElementById('modal-testimony').classList.remove('hidden');
  }

  // --- Salvar Testemunho ---
  handleSaveTestimony() {
    const prayerId = document.getElementById('testimony-prayer-id').value;
    const testimonyText = document.getElementById('input-testimony-text').value.trim();

    const prayer = this.prayers.find(p => p.id === prayerId);
    if (!prayer) return;

    prayer.status = 'answered';
    prayer.testimony = testimonyText;

    this.savePrayers();
    this.renderPrayers();
    this.showToast('Aleluia! Testemunho registrado com sucesso! 🎉🙌');
    this.playCelebrationChime();
  }

  // --- Compartilhar Pedido (WhatsApp / Área de Transferência) ---
  sharePrayer(prayer) {
    const text = `🙏 *Pedido de Oração:* ${prayer.title}\n"${prayer.description}"\n\n🕊️ Vamos interceder juntos no *Círculo de Oração*!\nJá são ${prayer.prayersCount} orações realizadas.`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Pedido de Oração - ' + prayer.title,
        text: text
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast('Texto copiado para compartilhar no WhatsApp! 📋');
      });
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  }

  // --- Renderização dos Cards ---
  renderPrayers() {
    const grid = document.getElementById('prayers-grid');
    const emptyState = document.getElementById('empty-state');

    // Filtros
    let filtered = this.prayers.filter(p => {
      // Filtro de aba
      if (this.activeTab === 'testimonies' && p.status !== 'answered') return false;
      if (this.activeTab === 'wall' && p.status === 'answered') return false;
      if (this.activeTab === 'my-prayers' && !this.myCreatedIds.includes(p.id)) return false;

      // Filtro de Categoria
      if (this.activeCategory !== 'all') {
        if (this.activeCategory === 'Causa Urgente' && !p.isUrgent) return false;
        if (this.activeCategory !== 'Causa Urgente' && p.category !== this.activeCategory) return false;
      }

      // Filtro de Busca
      if (this.searchQuery) {
        const fullContent = `${p.title} ${p.description} ${p.author} ${p.category} ${p.testimony || ''}`.toLowerCase();
        if (!fullContent.includes(this.searchQuery)) return false;
      }

      return true;
    });

    // Ordenação: Urgentes no topo primeiro, depois mais recentes
    filtered.sort((a, b) => {
      if (a.isUrgent && !b.isUrgent) return -1;
      if (!a.isUrgent && b.isUrgent) return 1;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

    if (filtered.length === 0) {
      grid.innerHTML = '';
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    grid.innerHTML = filtered.map(p => this.renderPrayerCard(p)).join('');

    // Adicionar eventos aos elementos interativos dos cards
    this.attachCardEventListeners(grid);
  }

  renderPrayerCard(prayer) {
    const isPrayed = !!this.userPrayed[prayer.id];
    const isOwner = this.myCreatedIds.includes(prayer.id);
    const timeAgo = this.formatTimeAgo(prayer.createdAt);

    const commentsCount = (prayer.comments && prayer.comments.length) || 0;

    return `
      <article class="prayer-card ${prayer.isUrgent ? 'is-urgent' : ''} ${prayer.status === 'answered' ? 'is-testimony' : ''}" data-id="${prayer.id}">
        <div class="card-top">
          <div class="card-badges">
            <span class="badge badge-cat">${this.escapeHTML(prayer.category)}</span>
            ${prayer.isUrgent ? '<span class="badge badge-urgent">🚨 Urgente</span>' : ''}
            ${prayer.status === 'answered' ? '<span class="badge badge-testimony">🎉 Graça Alcançada</span>' : ''}
          </div>
          <span class="card-time">${timeAgo}</span>
        </div>

        <div class="card-author-row">
          <div class="author-avatar">${prayer.author ? prayer.author[0].toUpperCase() : 'A'}</div>
          <span class="author-name">${prayer.isAnonymous ? 'Anônimo' : this.escapeHTML(prayer.author)}</span>
        </div>

        <h3 class="card-title">${this.escapeHTML(prayer.title)}</h3>
        <p class="card-body">${this.escapeHTML(prayer.description)}</p>

        ${prayer.testimony ? `
          <div class="testimony-highlight">
            <div class="testimony-title">🙌 Testemunho de Graça:</div>
            <div class="testimony-content">"${this.escapeHTML(prayer.testimony)}"</div>
          </div>
        ` : ''}

        <div class="card-actions">
          <button class="btn-pray ${isPrayed ? 'prayed' : ''}" data-action="pray" data-id="${prayer.id}" title="Interceder por esta causa">
            <span>${isPrayed ? '🙏 Orei por você' : '🤍 Vou Orar'}</span>
            <span class="pray-count">${prayer.prayersCount || 0}</span>
          </button>

          <div class="card-secondary-actions">
            <button class="btn-card-small" data-action="toggle-comments" data-id="${prayer.id}" title="Palavras de bênção">
              💬 ${commentsCount}
            </button>
            <button class="btn-card-small" data-action="share" data-id="${prayer.id}" title="Compartilhar no WhatsApp">
              ↗️
            </button>
            ${prayer.status !== 'answered' ? `
              <button class="btn-card-small" data-action="mark-answered" data-id="${prayer.id}" title="Marcar como Graça Alcançada">
                🎉 Graça
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Seção Expansível de Comentários / Palavras de Fé -->
        <div class="card-comments-section hidden" id="comments-section-${prayer.id}">
          <div class="comments-list">
            ${commentsCount === 0 ? '<p style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">Nenhuma palavra de bênção ainda. Seja o primeiro a enviar conforto!</p>' : ''}
            ${(prayer.comments || []).map(c => `
              <div class="comment-bubble">
                <div class="comment-header">
                  <span class="comment-author">${this.escapeHTML(c.author)}</span>
                  <span class="comment-time">${c.time}</span>
                </div>
                <div class="comment-text">${this.escapeHTML(c.text)}</div>
              </div>
            `).join('')}
          </div>
          <form class="comment-form" data-id="${prayer.id}">
            <input type="text" class="comment-input" placeholder="Escreva uma palavra de conforto ou versículo..." required>
            <button type="submit" class="btn-comment-send">Enviar</button>
          </form>
        </div>
      </article>
    `;
  }

  attachCardEventListeners(container) {
    // Botão Orar
    container.querySelectorAll('[data-action="pray"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.togglePray(id);
      });
    });

    // Botão Compartilhar
    container.querySelectorAll('[data-action="share"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const prayer = this.prayers.find(p => p.id === id);
        if (prayer) this.sharePrayer(prayer);
      });
    });

    // Botão Graça Alcançada
    container.querySelectorAll('[data-action="mark-answered"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.openTestimonyModal(id);
      });
    });

    // Botão Alternar Comentários
    container.querySelectorAll('[data-action="toggle-comments"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const section = document.getElementById(`comments-section-${id}`);
        if (section) {
          section.classList.toggle('hidden');
        }
      });
    });

    // Envio de Comentário
    container.querySelectorAll('.comment-form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = e.currentTarget.getAttribute('data-id');
        const input = e.currentTarget.querySelector('.comment-input');
        this.addComment(id, input.value);
      });
    });
  }

  // --- Timer: Momento de Oração Guiada ---
  toggleTimer() {
    if (this.timerRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    this.timerRunning = true;
    document.getElementById('btn-start-timer').textContent = 'Pausar';
    document.getElementById('timer-status').textContent = 'Orando em silêncio...';
    document.getElementById('timer-circle').classList.add('active');

    this.playBellChime();

    this.timerInterval = setInterval(() => {
      this.timerRemaining--;
      this.updateTimerDisplay();

      if (this.timerRemaining <= 0) {
        this.stopTimer();
        this.playCelebrationChime();
        this.showToast('Momento de oração concluído! Que a paz de Deus reine em você.');
        document.getElementById('timer-status').textContent = 'Amém! Oração concluída.';
      }
    }, 1000);
  }

  pauseTimer() {
    this.timerRunning = false;
    clearInterval(this.timerInterval);
    document.getElementById('btn-start-timer').textContent = 'Continuar';
    document.getElementById('timer-status').textContent = 'Pausado';
    document.getElementById('timer-circle').classList.remove('active');
  }

  stopTimer() {
    this.timerRunning = false;
    clearInterval(this.timerInterval);
    document.getElementById('btn-start-timer').textContent = 'Iniciar 2 Minutos';
    document.getElementById('timer-circle').classList.remove('active');
  }

  resetTimer() {
    this.stopTimer();
    this.timerRemaining = this.timerSeconds;
    this.updateTimerDisplay();
    document.getElementById('timer-status').textContent = 'Pronto para orar';
  }

  updateTimerDisplay() {
    const mins = Math.floor(this.timerRemaining / 60);
    const secs = this.timerRemaining % 60;
    document.getElementById('timer-display').textContent = 
      `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    document.getElementById('sound-status').textContent = this.soundEnabled ? 'Ligado' : 'Mudo';
    document.getElementById('sound-icon').textContent = this.soundEnabled ? '🔔' : '🔕';
    this.showToast(this.soundEnabled ? 'Som suave ativado' : 'Som desativado');
  }

  // --- Áudio Suave com Web Audio API (Sino / Tibetan Bowl Chime) ---
  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  playBellChime() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Tríade harmônica reconfortante (Dó Maior / Fá)
      const freqs = [528, 792, 1056]; // 528Hz freq de cura / calma

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const initialVol = 0.12 / (idx + 1);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(initialVol, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 3.6);
      });
    } catch (e) {
      console.warn('Web Audio não suportado ou bloqueado', e);
    }
  }

  playCelebrationChime() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // Arpeggio C, E, G, C

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        gain.gain.setValueAtTime(0, now + idx * 0.15);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.15 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 2.6);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // --- Exportar / Importar Backup ---
  exportBackup() {
    const data = {
      prayers: this.prayers,
      userPrayed: this.userPrayed,
      myCreatedIds: this.myCreatedIds,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-circulo-oracoes-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Backup exportado com sucesso!');
  }

  importBackup(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported.prayers)) {
          this.prayers = imported.prayers;
          this.userPrayed = imported.userPrayed || {};
          this.myCreatedIds = imported.myCreatedIds || [];
          this.savePrayers();
          this.saveUserPrayed();
          this.saveMyCreatedIds();
          this.renderPrayers();
          this.showToast('Dados restaurados com sucesso!');
        } else {
          alert('Arquivo de backup inválido.');
        }
      } catch (err) {
        alert('Erro ao ler arquivo de backup: ' + err.message);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  // --- Utilitários ---
  showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    toastMsg.textContent = message;
    toast.classList.remove('hidden');

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3800);
  }

  formatTimeAgo(timestamp) {
    if (!timestamp) return 'recentemente';
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'agora há pouco';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `há ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours} h`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'ontem';
    return `há ${days} dias`;
  }

  escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }
}

// Inicializa a aplicação ao carregar
document.addEventListener('DOMContentLoaded', () => {
  window.prayerApp = new PrayerApp();
});
