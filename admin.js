/**
 * admin.js - Lógica do Painel Privado do Administrador
 * Visualização e gestão dos pedidos recebidos com filtros temporais (Hoje, Semana, Mês).
 */

const STORAGE_KEY = 'circulo_oracoes_db_v1';
const PIN_KEY = 'circulo_oracoes_admin_pin_v2';
const DEFAULT_ADMIN_PASSWORD = '104832';
const AUTH_SESSION_KEY = 'circulo_admin_session_auth_v1';

// Dados de Exemplo Iniciais (caso seja o primeiro acesso)
const SAMPLE_DATA = [
  {
    id: 'req-today-hosp',
    senderName: 'Antônio Marcos',
    isSenderAnon: false,
    phone: '(42) 99123-7788',
    wantDevotional: true,
    targetPerson: 'Por meu pai Geraldo (74 anos)',
    isTargetAnon: false,
    purpose: 'Meu pai está internado no Hospital APMI após complicações respiratórias. Pedimos oração e que o pastor venha fazer uma visita de unção no leito para fortalecer a fé dele.',
    category: 'Visita Hospitalar',
    isUrgent: true,
    wantsToAttend: false,
    hospitalVisit: {
      requested: true,
      patientName: 'Geraldo de Oliveira',
      hospitalName: 'Hospital APMI (União da Vitória)',
      roomNumber: 'Quarto 312 - Ala B (Clínica Médica)',
      contactPhone: '(42) 99123-7788',
      notes: 'Visitas liberadas das 14h às 16h e das 19h às 20h. Paciente lúcido e consciente.'
    },
    status: 'pending',
    createdAt: Date.now() - 1000 * 60 * 25, // Há 25 minutos (Hoje)
    notes: 'Agendado com o pastor para as 15h',
    intercessionCount: 0
  },
  {
    id: 'req-hosp-completed-1',
    senderName: 'Familiar / Acompanhante',
    isSenderAnon: false,
    phone: '(42) 99876-1122',
    wantDevotional: false,
    targetPerson: 'Francisca Ribeiro (Paciente internada no Hospital Regional São Camilo)',
    isTargetAnon: false,
    purpose: 'Solicitação de visita pastoral no leito para a paciente Francisca Ribeiro, internada no Hospital Regional São Camilo (Quarto 104 - Leito 2). Contato do acompanhante: (42) 99876-1122. Observação: Pós-operatório de cirurgia ortopédica.',
    category: 'Visita Hospitalar',
    isUrgent: false,
    wantsToAttend: false,
    hospitalVisit: {
      requested: true,
      patientName: 'Francisca Ribeiro (68 anos)',
      hospitalName: 'Hospital Regional São Camilo (União da Vitória)',
      roomNumber: 'Quarto 104 - Leito 2 (Ala Feminina)',
      contactPhone: '(42) 99876-1122',
      notes: 'Pós-operatório de cirurgia ortopédica. Oração por recuperação rápida.'
    },
    status: 'prayed',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // Há 2 dias
    notes: 'Visita realizada pelo Pastor. Unção com óleo ministrada e oração com a família.',
    intercessionCount: 2
  },
  {
    id: 'req-hosp-answered-1',
    senderName: 'Marcos Vinícius de Castro',
    isSenderAnon: false,
    phone: '(42) 98833-4455',
    wantDevotional: true,
    targetPerson: 'Marcos Vinícius (7 anos)',
    isTargetAnon: false,
    purpose: 'Visita hospitalar na pediatria do Hospital São Braz. Estava com quadro infeccioso respiratório.',
    category: 'Visita Hospitalar',
    isUrgent: false,
    wantsToAttend: true,
    hospitalVisit: {
      requested: true,
      patientName: 'Marcos Vinícius (7 anos)',
      hospitalName: 'Hospital de Caridade São Braz (Porto União)',
      roomNumber: 'Quarto 208 (Pediatria)',
      contactPhone: '(42) 98833-4455',
      notes: 'Quadro infeccioso respiratório em melhora.'
    },
    status: 'answered',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8, // Há 8 dias
    notes: 'Glória a Deus! Visita realizada pelo pastor e intercessores, e a criança recebeu alta hospitalar!',
    intercessionCount: 4
  },
  {
    id: 'req-today-1',
    senderName: 'Cláudia Mendes',
    isSenderAnon: false,
    phone: '(42) 99812-3456',
    wantDevotional: true,
    targetPerson: 'Por meu filho Rafael (12 anos)',
    isTargetAnon: false,
    purpose: 'Rafael está com febre alta e crise respiratória há 2 dias. Peço que orem pela melhora rápida dele e sabedoria aos pediatras.',
    category: 'Causa Urgente',
    isUrgent: true,
    status: 'pending',
    createdAt: Date.now() - 1000 * 60 * 45, // Há 45 minutos (Hoje)
    notes: 'Colocar na oração da tarde',
    intercessionCount: 0
  },
  {
    id: 'req-today-2',
    senderName: 'Anônimo',
    isSenderAnon: true,
    targetPerson: 'Por mim mesmo',
    isTargetAnon: false,
    purpose: 'Estou sentindo uma angústia muito forte no peito e pensamentos de desânimo. Preciso da paz de Deus e de forças para continuar.',
    category: 'Paz',
    isUrgent: false,
    status: 'prayed',
    createdAt: Date.now() - 1000 * 60 * 60 * 3, // Há 3 horas (Hoje)
    notes: 'Intercedi e orei o Salmo 91',
    intercessionCount: 1
  },
  {
    id: 'req-week-1',
    senderName: 'Carlos Eduardo',
    isSenderAnon: false,
    targetPerson: 'Por minha mãe Helena',
    isTargetAnon: false,
    purpose: 'Minha mãe fará uma cirurgia na vesícula nesta quinta-feira. Que as mãos dos cirurgiões sejam guiadas pelo Senhor.',
    category: 'Saúde',
    isUrgent: false,
    status: 'prayed',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // Há 3 dias (Esta Semana)
    notes: 'Família avisada',
    intercessionCount: 3
  },
  {
    id: 'req-week-2',
    senderName: 'Anônimo',
    isSenderAnon: true,
    targetPerson: 'Em segredo / Anônimo',
    isTargetAnon: true,
    purpose: 'Restauração de uma relação familiar ferida por mágoas do passado. Que o Espírito Santo toque o coração de ambas as partes.',
    category: 'Família',
    isUrgent: false,
    status: 'pending',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // Há 5 dias (Esta Semana)
    notes: '',
    intercessionCount: 0
  },
  {
    id: 'req-month-1',
    senderName: 'Patrícia Souza',
    isSenderAnon: false,
    targetPerson: 'Por meu marido João',
    isTargetAnon: false,
    purpose: 'Provisão financeira e porta de emprego. Ele estava desempregado há 8 meses.',
    category: 'Trabalho',
    isUrgent: false,
    status: 'answered',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18, // Há 18 dias (Este Mês)
    notes: 'Graça alcançada! Conseguiu emprego na construtora!',
    intercessionCount: 5
  }
];

class AdminApp {
  constructor() {
    this.currentPeriod = 'all'; // 'all' | 'today' | 'week' | 'month'
    this.currentStatus = 'all'; // 'all' | 'pending' | 'prayed' | 'answered'
    this.searchQuery = '';
    this.prayers = [];

    this.init();
  }

  init() {
    this.ensureDefaultPin();
    this.loadData();
    this.bindLoginEvents();
    this.bindDashboardEvents();

    if (this.isUserAuthenticated()) {
      this.showDashboard();
    } else {
      this.showLogin();
    }
  }

  // --- Senha & Autenticação ---
  ensureDefaultPin() {
    const current = localStorage.getItem(PIN_KEY);
    const legacy = localStorage.getItem('circulo_oracoes_admin_pin_v1');
    if (!current || current === '1234' || legacy === '1234') {
      localStorage.setItem(PIN_KEY, DEFAULT_ADMIN_PASSWORD);
      localStorage.removeItem('circulo_oracoes_admin_pin_v1');
    }
  }

  getSavedPin() {
    const pin = localStorage.getItem(PIN_KEY);
    if (!pin || pin === '1234') {
      localStorage.setItem(PIN_KEY, DEFAULT_ADMIN_PASSWORD);
      return DEFAULT_ADMIN_PASSWORD;
    }
    return pin;
  }

  setNewPin(newPin) {
    localStorage.setItem(PIN_KEY, newPin);
  }

  isUserAuthenticated() {
    return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
  }

  setAuthenticated(status) {
    sessionStorage.setItem(AUTH_SESSION_KEY, status ? 'true' : 'false');
  }

  showLogin() {
    document.getElementById('admin-login-screen').classList.remove('hidden');
    document.getElementById('admin-main-dashboard').classList.add('hidden');
    document.getElementById('admin-pin-input').value = '';
    document.getElementById('admin-pin-input').focus();
  }

  showDashboard() {
    document.getElementById('admin-login-screen').classList.add('hidden');
    document.getElementById('admin-main-dashboard').classList.remove('hidden');
    this.renderAll();
  }

  bindLoginEvents() {
    const loginForm = document.getElementById('admin-login-form');
    const pinInput = document.getElementById('admin-pin-input');
    const errorMsg = document.getElementById('login-error-msg');

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredPin = pinInput.value.trim();
      const actualPin = this.getSavedPin();

      if (enteredPin === actualPin) {
        errorMsg.classList.add('hidden');
        this.setAuthenticated(true);
        this.showDashboard();
      } else {
        errorMsg.classList.remove('hidden');
        pinInput.value = '';
        pinInput.focus();
      }
    });

    document.getElementById('btn-admin-logout').addEventListener('click', () => {
      this.setAuthenticated(false);
      this.showLogin();
    });
  }

  // --- Carregamento de Dados ---
  loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.prayers = JSON.parse(raw);
      } else {
        this.prayers = SAMPLE_DATA;
        this.saveData();
      }
    } catch (e) {
      this.prayers = SAMPLE_DATA;
    }
  }

  saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.prayers));
    } catch (e) {
      console.error('Erro ao salvar dados:', e);
    }
    this.updateStats();
  }

  // --- Eventos do Dashboard ---
  bindDashboardEvents() {
    // Sincronização em Tempo Real com o Formulário Público (novos pedidos aparecem instantaneamente)
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        this.loadData();
        this.renderAll();
      }
    });

    // Atualiza automaticamente quando o administrador clica ou volta para a aba
    window.addEventListener('focus', () => {
      this.loadData();
      this.renderAll();
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.loadData();
        this.renderAll();
      }
    });

    // Filtros por Período (Tabs)
    const periodButtons = document.querySelectorAll('.period-btn');
    periodButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        periodButtons.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentPeriod = e.currentTarget.getAttribute('data-period');
        this.updateViewTitle();
        this.renderPrayersList();
      });
    });

    // Cards de Resumo também funcionam como atalhos para os períodos
    document.querySelectorAll('.summary-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const period = e.currentTarget.getAttribute('data-period');
        const targetBtn = document.querySelector(`.period-btn[data-period="${period}"]`);
        if (targetBtn) targetBtn.click();
      });
    });

    // Filtro por Status
    const statusSelect = document.getElementById('select-status-filter');
    statusSelect.addEventListener('change', (e) => {
      this.currentStatus = e.target.value;
      this.renderPrayersList();
    });

    // Busca
    const searchInput = document.getElementById('admin-search-input');
    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.renderPrayersList();
    });

    // Botão Relatório de Visitas Hospitalares (PDF) no Topo
    const btnPrintHosp = document.getElementById('btn-print-hospital');
    if (btnPrintHosp) {
      btnPrintHosp.addEventListener('click', () => {
        this.openHospitalPrintModal();
      });
    }

    // Modal de Visitas Hospitalares (PDF)
    const modalPrintHosp = document.getElementById('modal-print-hospital');
    const btnClosePrintHosp = document.getElementById('btn-close-print-hospital');
    const btnClosePrintHospBtm = document.getElementById('btn-close-print-hosp-bottom');
    if (btnClosePrintHosp && modalPrintHosp) {
      btnClosePrintHosp.addEventListener('click', () => {
        modalPrintHosp.classList.add('hidden');
      });
    }
    if (btnClosePrintHospBtm && modalPrintHosp) {
      btnClosePrintHospBtm.addEventListener('click', () => {
        modalPrintHosp.classList.add('hidden');
      });
    }

    const selectHospPrintStatus = document.getElementById('select-hosp-print-status');
    if (selectHospPrintStatus) {
      selectHospPrintStatus.addEventListener('change', () => {
        this.renderHospitalPrintPreview();
      });
    }

    const btnConfirmPrintHosp = document.getElementById('btn-confirm-print-hospital');
    if (btnConfirmPrintHosp) {
      btnConfirmPrintHosp.addEventListener('click', () => {
        this.printHospitalVisitsPDF();
      });
    }

    // Impressão Geral / PDF
    document.getElementById('btn-print-list').addEventListener('click', () => {
      if (this.currentStatus === 'hospital') {
        this.openHospitalPrintModal();
      } else {
        window.print();
      }
    });

    // Modal Configurações
    const modalSettings = document.getElementById('modal-settings');
    document.getElementById('btn-open-settings').addEventListener('click', () => {
      modalSettings.classList.remove('hidden');
    });
    document.getElementById('btn-close-settings').addEventListener('click', () => {
      modalSettings.classList.add('hidden');
    });

    document.getElementById('btn-save-settings').addEventListener('click', () => {
      const newPin = document.getElementById('input-new-pin').value.trim();
      if (newPin) {
        if (newPin.length < 3) {
          alert('A nova senha deve ter no mínimo 3 caracteres.');
          return;
        }
        this.setNewPin(newPin);
        this.showToast('Senha do administrador alterada com sucesso!');
      }
      modalSettings.classList.add('hidden');
    });

    document.getElementById('btn-admin-export').addEventListener('click', () => {
      this.exportBackup();
    });

    document.getElementById('btn-seed-samples').addEventListener('click', () => {
      if (confirm('Deseja recarregar os exemplos de demonstração?')) {
        this.prayers = SAMPLE_DATA;
        this.saveData();
        this.renderAll();
        modalSettings.classList.add('hidden');
        this.showToast('Exemplos carregados!');
      }
    });

    // Modal Testemunho Admin
    const modalTestimony = document.getElementById('modal-admin-testimony');
    document.getElementById('btn-close-admin-testimony').addEventListener('click', () => {
      modalTestimony.classList.add('hidden');
    });

    document.getElementById('btn-confirm-testimony').addEventListener('click', () => {
      const id = document.getElementById('target-prayer-id').value;
      const notes = document.getElementById('admin-testimony-notes').value.trim();
      this.markAnswered(id, notes);
      modalTestimony.classList.add('hidden');
    });
  }

  // --- Filtragem por Data & Período ---
  filterByPeriod(list) {
    const now = Date.now();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayTimestamp = startOfToday.getTime();

    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    return list.filter(item => {
      const created = item.createdAt || 0;
      if (this.currentPeriod === 'today') {
        return created >= todayTimestamp;
      }
      if (this.currentPeriod === 'week') {
        return created >= sevenDaysAgo;
      }
      if (this.currentPeriod === 'month') {
        return created >= thirtyDaysAgo;
      }
      return true; // 'all'
    });
  }

  updateViewTitle() {
    const titles = {
      all: 'Todos os Pedidos Recebidos',
      today: 'Pedidos Recebidos Hoje (Por Dia)',
      week: 'Pedidos Recebidos Esta Semana (Últimos 7 dias)',
      month: 'Pedidos Recebidos Este Mês (Últimos 30 dias)'
    };
    document.getElementById('view-title').textContent = titles[this.currentPeriod] || 'Pedidos de Oração';
  }

  // --- Atualização das Estatísticas ---
  updateStats() {
    const now = Date.now();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayTimestamp = startOfToday.getTime();

    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    const total = this.prayers.length;
    const today = this.prayers.filter(p => (p.createdAt || 0) >= todayTimestamp).length;
    const week = this.prayers.filter(p => (p.createdAt || 0) >= sevenDaysAgo).length;
    const month = this.prayers.filter(p => (p.createdAt || 0) >= thirtyDaysAgo).length;

    document.getElementById('count-total').textContent = total;
    document.getElementById('count-today').textContent = today;
    document.getElementById('count-week').textContent = week;
    document.getElementById('count-month').textContent = month;
  }

  // --- Renderização dos Cartões ---
  renderAll() {
    this.updateStats();
    this.renderPrayersList();
  }

  renderPrayersList() {
    const grid = document.getElementById('admin-prayers-grid');
    const emptyState = document.getElementById('admin-empty-state');
    const visibleCounter = document.getElementById('visible-counter');

    // 1. Filtrar por período
    let filtered = this.filterByPeriod(this.prayers);

    // 2. Filtrar por status
    if (this.currentStatus !== 'all') {
      if (this.currentStatus === 'hospital') {
        filtered = filtered.filter(p => p.hospitalVisit && p.hospitalVisit.requested);
      } else {
        filtered = filtered.filter(p => p.status === this.currentStatus);
      }
    }

    // 3. Filtrar por busca
    if (this.searchQuery) {
      filtered = filtered.filter(p => {
        const full = `${p.senderName} ${p.targetPerson} ${p.purpose} ${p.category} ${p.notes || ''}`.toLowerCase();
        return full.includes(this.searchQuery);
      });
    }

    visibleCounter.textContent = `Exibindo ${filtered.length} de ${this.prayers.length} pedidos`;

    if (filtered.length === 0) {
      grid.innerHTML = '';
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');

    // Ordenação: Urgentes primeiro, depois mais recentes
    filtered.sort((a, b) => {
      if (a.isUrgent && !b.isUrgent) return -1;
      if (!a.isUrgent && b.isUrgent) return 1;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

    grid.innerHTML = filtered.map(p => this.renderCardHTML(p)).join('');
    this.attachCardEvents(grid);
  }

  renderCardHTML(prayer) {
    const formattedDate = this.formatDate(prayer.createdAt);
    const statusBadges = {
      pending: '<span class="admin-badge badge-pending">🟡 Aguardando Oração</span>',
      prayed: `<span class="admin-badge badge-prayed">🟢 Já Intercedido (${prayer.intercessionCount || 1}x)</span>`,
      answered: '<span class="admin-badge badge-answered">🎉 Graça Alcançada</span>'
    };

    return `
      <div class="admin-card ${prayer.isUrgent ? 'card-urgent' : ''}" data-id="${prayer.id}">
        
        <!-- Topo do Card -->
        <div class="admin-card-header">
          <div class="header-tags">
            ${statusBadges[prayer.status] || statusBadges.pending}
            <span class="admin-badge badge-category">${this.escapeHTML(prayer.category || 'Geral')}</span>
            ${prayer.isUrgent ? '<span class="admin-badge badge-urgent-pulse">🚨 URGENTE</span>' : ''}
            ${prayer.wantsToAttend ? '<span class="admin-badge badge-attend">🏛️ Quer ir ao Culto Presencial</span>' : ''}
            ${prayer.wantDevotional ? '<span class="admin-badge badge-devotional">📖 Quer receber Devocional</span>' : ''}
            ${prayer.hospitalVisit && prayer.hospitalVisit.requested ? '<span class="admin-badge badge-hospital">🏥 VISITA HOSPITALAR</span>' : ''}
          </div>
          <span class="admin-card-date">${formattedDate}</span>
        </div>

        <!-- Participantes (Quem pediu & Para quem) -->
        <div class="admin-people-box">
          <div class="person-row">
            <span class="person-label">Quem enviou:</span>
            <strong class="person-value">${prayer.isSenderAnon ? '👤 Anônimo' : this.escapeHTML(prayer.senderName)}</strong>
          </div>
          ${!prayer.isSenderAnon && prayer.phone ? `
            <div class="person-row person-phone-row">
              <span class="person-label">Telefone / WhatsApp:</span>
              <div class="phone-actions">
                <strong class="person-value">${this.escapeHTML(prayer.phone)}</strong>
                <a href="https://wa.me/55${prayer.phone.replace(/\D/g, '')}?text=${encodeURIComponent('A paz do Senhor, ' + (prayer.senderName || '') + '! Recebemos seu pedido de oração no Culto do Empreendedor e estamos orando por você.')}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="btn-whatsapp-direct" 
                   title="Enviar mensagem ou devocional no WhatsApp">
                  💬 WhatsApp ${prayer.wantDevotional ? '• Enviar Devocional' : ''}
                </a>
              </div>
            </div>
          ` : ''}
          <div class="person-row highlight-target">
            <span class="person-label">Intercedendo por:</span>
            <strong class="person-value">${prayer.isTargetAnon ? '🔒 Em Segredo / Anônimo' : this.escapeHTML(prayer.targetPerson)}</strong>
          </div>
        </div>

        <!-- Bloco Especial: Solicitação de Visita Hospitalar -->
        ${prayer.hospitalVisit && prayer.hospitalVisit.requested ? `
          <div class="admin-hospital-alert-box">
            <div class="hosp-alert-title">
              <span>🏥 Solicitação de Visita Hospitalar (Capelania)</span>
            </div>
            <div class="hosp-alert-grid">
              <div class="hosp-alert-item">
                <span>👤 Paciente:</span>
                <strong>${this.escapeHTML(prayer.hospitalVisit.patientName)}</strong>
              </div>
              <div class="hosp-alert-item">
                <span>🏥 Hospital:</span>
                <strong>${this.escapeHTML(prayer.hospitalVisit.hospitalName)}</strong>
              </div>
              <div class="hosp-alert-item">
                <span>🛏️ Quarto / Leito:</span>
                <strong>${this.escapeHTML(prayer.hospitalVisit.roomNumber)}</strong>
              </div>
              <div class="hosp-alert-item">
                <span>📞 Acompanhante:</span>
                <strong>${prayer.hospitalVisit.contactPhone ? this.escapeHTML(prayer.hospitalVisit.contactPhone) : '<span style="color:#94a3b8; font-weight:normal;">Não informado</span>'}</strong>
              </div>
              ${prayer.hospitalVisit.notes ? `
                <div class="hosp-alert-item" style="grid-column: 1 / -1;">
                  <span>📋 OBSERVAÇÃO:</span>
                  <span style="color: #fef08a;">${this.escapeHTML(prayer.hospitalVisit.notes)}</span>
                </div>
              ` : ''}
            </div>
            ${prayer.hospitalVisit.contactPhone ? `
              <div class="hosp-alert-buttons-row">
                <a href="https://wa.me/55${prayer.hospitalVisit.contactPhone.replace(/\D/g, '')}?text=${encodeURIComponent('A paz do Senhor! Sou o pastor/intercessor do Culto do Empreendedor sobre a visita hospitalar ao(à) paciente ' + prayer.hospitalVisit.patientName + ' no ' + prayer.hospitalVisit.hospitalName + '. Gostaria de alinhar os detalhes para orarmos no leito.')}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="btn-whatsapp-hosp" 
                   title="Falar com acompanhante no WhatsApp para alinhar visita">
                  💬 Falar com Acompanhante no WhatsApp
                </a>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- Propósito / A Oração -->
        <div class="admin-purpose-box">
          <div class="purpose-title">Motivo / Propósito da Oração:</div>
          <p class="purpose-text">${this.escapeHTML(prayer.purpose)}</p>
        </div>

        <!-- Anotações do Intercessor -->
        <div class="admin-notes-row">
          <label class="notes-label">Anotações pastorais / de intercessão:</label>
          <input type="text" class="input-card-note" data-id="${prayer.id}" value="${this.escapeHTML(prayer.notes || '')}" placeholder="Ex: Orado na reunião, ligar para saber notícias...">
        </div>

        <!-- Barra de Ações do Administrador -->
        <div class="admin-card-actions">
          <div class="action-buttons-group">
            <button class="btn-action-pray" data-action="pray" data-id="${prayer.id}">
              <span>🙏 Interceder Agora</span>
              <span class="pray-badge-num">${prayer.intercessionCount || 0}</span>
            </button>

            ${prayer.status !== 'answered' ? `
              <button class="btn-action-testimony" data-action="testimony" data-id="${prayer.id}">
                <span>🎉 Graça Alcançada</span>
              </button>
            ` : ''}
          </div>

          <button class="btn-action-delete" data-action="delete" data-id="${prayer.id}" title="Excluir este pedido">
            🗑️
          </button>
        </div>

      </div>
    `;
  }

  attachCardEvents(container) {
    // Botão Interceder / Orar
    container.querySelectorAll('[data-action="pray"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.intercede(id);
      });
    });

    // Botão Graça Alcançada
    container.querySelectorAll('[data-action="testimony"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        document.getElementById('target-prayer-id').value = id;
        document.getElementById('admin-testimony-notes').value = '';
        document.getElementById('modal-admin-testimony').classList.remove('hidden');
      });
    });

    // Botão Excluir
    container.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('Tem certeza de que deseja remover este pedido do mural?')) {
          this.deletePrayer(id);
        }
      });
    });

    // Salvar nota ao digitar
    container.querySelectorAll('.input-card-note').forEach(input => {
      input.addEventListener('change', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const note = e.currentTarget.value.trim();
        const item = this.prayers.find(p => p.id === id);
        if (item) {
          item.notes = note;
          this.saveData();
          this.showToast('Anotação salva!');
        }
      });
    });
  }

  // --- Ações de Intercessão ---
  intercede(id) {
    const item = this.prayers.find(p => p.id === id);
    if (!item) return;

    item.intercessionCount = (item.intercessionCount || 0) + 1;
    if (item.status === 'pending') {
      item.status = 'prayed';
    }

    this.saveData();
    this.renderPrayersList();
    this.playChime();
    this.showToast(`Você intercedeu por este pedido! (Total: ${item.intercessionCount} vezes) 🙏`);
  }

  markAnswered(id, testimony) {
    const item = this.prayers.find(p => p.id === id);
    if (!item) return;

    item.status = 'answered';
    if (testimony) {
      item.notes = (item.notes ? item.notes + ' | ' : '') + `Vitória: ${testimony}`;
    }

    this.saveData();
    this.renderPrayersList();
    this.playChime();
    this.showToast('Glória a Deus! Graça alcançada registrada! 🎉');
  }

  deletePrayer(id) {
    this.prayers = this.prayers.filter(p => p.id !== id);
    this.saveData();
    this.renderAll();
    this.showToast('Pedido removido com sucesso.');
  }

  // --- Exportar Backup ---
  exportBackup() {
    const data = {
      exportDate: new Date().toISOString(),
      totalPrayers: this.prayers.length,
      prayers: this.prayers
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-circulo-oracao-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Backup baixado com sucesso!');
  }

  // --- Áudio Suave de Oração ---
  playChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      [528, 792, 1056].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        const vol = 0.12 / (idx + 1);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.6);
      });
    } catch (e) {}
  }

  showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    toastMsg.textContent = message;
    toast.classList.remove('hidden');

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3500);
  }

  formatDate(timestamp) {
    if (!timestamp) return 'Recentemente';
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const mins = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month} às ${hours}:${mins}`;
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

  // --- Relatório e Lista em PDF de Visitas Hospitalares ---
  getHospitalVisits(filter = 'all') {
    let list = this.prayers.filter(p => p.hospitalVisit && p.hospitalVisit.requested);
    if (filter === 'prayed') {
      list = list.filter(p => p.status === 'prayed');
    } else if (filter === 'pending') {
      list = list.filter(p => p.status === 'pending');
    } else if (filter === 'answered') {
      list = list.filter(p => p.status === 'answered');
    }
    return list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }

  openHospitalPrintModal() {
    const modal = document.getElementById('modal-print-hospital');
    if (!modal) return;
    this.renderHospitalPrintPreview();
    modal.classList.remove('hidden');
  }

  renderHospitalPrintPreview() {
    const select = document.getElementById('select-hosp-print-status');
    const filter = select ? select.value : 'all';
    const visits = this.getHospitalVisits(filter);
    const summaryBadge = document.getElementById('hosp-print-summary-count');
    const container = document.getElementById('hosp-print-sheet-content');

    const filterLabels = {
      all: 'Todas as Visitas Hospitalares',
      prayed: 'Visitas Feitas / Realizadas',
      pending: 'Visitas Pendentes (Aguardando no Leito)',
      answered: 'Visitas Concluídas com Graça (Altas)'
    };

    if (summaryBadge) {
      summaryBadge.textContent = `${visits.length} visita(s) • ${filterLabels[filter] || 'Geral'}`;
    }

    if (!container) return;

    if (visits.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: #64748b;">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">🏥</div>
          <p style="font-size: 1rem; font-weight: 700; color: #334155;">Nenhuma visita hospitalar encontrada para este filtro.</p>
          <small>Altere o filtro acima para visualizar outros registros.</small>
        </div>
      `;
      return;
    }

    const rowsHTML = visits.map((p, idx) => {
      const dateStr = this.formatDate(p.createdAt);
      const h = p.hospitalVisit;
      const statusBadges = {
        pending: '<span class="pdf-tag tag-pending">🟡 Aguardando Visita</span>',
        prayed: '<span class="pdf-tag tag-prayed">🟢 Visita Feita / Orado</span>',
        answered: '<span class="pdf-tag tag-answered">🎉 Graça / Alta Médica</span>'
      };
      const statusLabel = statusBadges[p.status] || statusBadges.pending;
      const notesBlock = h.notes ? `<div class="pdf-sub-obs"><strong>Obs:</strong> ${this.escapeHTML(h.notes)}</div>` : '';
      const pastorNotes = p.notes ? `<div class="pdf-sub-pastor"><strong>Pastor:</strong> ${this.escapeHTML(p.notes)}</div>` : '';

      return `
        <tr>
          <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
          <td>
            <div style="font-size: 0.82rem; font-weight: 600;">${dateStr}</div>
          </td>
          <td>
            <div style="font-weight: 800; font-size: 0.92rem; color: #0f172a;">${this.escapeHTML(h.patientName)}</div>
            <div style="font-size: 0.74rem; color: #475569;">Sol: ${this.escapeHTML(p.senderName || 'Familiar')}</div>
          </td>
          <td>
            <div style="font-weight: 700; color: #0284c7;">${this.escapeHTML(h.hospitalName)}</div>
          </td>
          <td>
            <span class="pdf-room-pill">${this.escapeHTML(h.roomNumber)}</span>
          </td>
          <td>
            <div style="font-weight: 600; font-size: 0.84rem;">${h.contactPhone ? this.escapeHTML(h.contactPhone) : '<span style="color:#94a3b8;">Não informado</span>'}</div>
          </td>
          <td>
            <div style="margin-bottom: 3px;">${statusLabel}</div>
            ${notesBlock}
            ${pastorNotes}
          </td>
        </tr>
      `;
    }).join('');

    const nowFormatted = new Date().toLocaleString('pt-BR');

    container.innerHTML = `
      <div class="hosp-doc-wrapper">
        <div class="hosp-doc-header">
          <div class="hosp-doc-brand">
            <img src="logo.svg" alt="Logo" class="hosp-doc-logo" onerror="this.onerror=null; this.src='logo.jpg';">
            <div>
              <div class="hosp-doc-church">IGREJA ASSEMBLEIA DE DEUS • UNIÃO DA VITÓRIA - PR</div>
              <h1 class="hosp-doc-title">RELATÓRIO DE VISITAS HOSPITALARES & CAPELANIA</h1>
              <div class="hosp-doc-sub">Culto do Empreendedor • Rua Ipiranga, 357 — Centro • União da Vitória - PR • <strong>Visitas às Quartas-feiras</strong></div>
            </div>
          </div>
          <div class="hosp-doc-meta">
            <div><strong>Emissão:</strong> ${nowFormatted}</div>
            <div><strong>Filtro:</strong> ${filterLabels[filter] || 'Geral'}</div>
            <div><strong>Total de Visitas:</strong> ${visits.length}</div>
          </div>
        </div>

        <table class="hosp-doc-table">
          <thead>
            <tr>
              <th style="width: 4%;">#</th>
              <th style="width: 13%;">Data Solicitação</th>
              <th style="width: 20%;">Paciente</th>
              <th style="width: 18%;">Hospital</th>
              <th style="width: 12%;">Quarto / Leito</th>
              <th style="width: 13%;">Acompanhante</th>
              <th style="width: 20%;">Situação & Observações</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHTML}
          </tbody>
        </table>

        <div class="hosp-doc-footer-signatures">
          <div class="hosp-sig-box">
            <div class="hosp-sig-line"></div>
            <div class="hosp-sig-title">Pastor Arnaldo • Capelão Responsável</div>
            <div class="hosp-sig-desc">Culto do Empreendedor • União da Vitória - PR</div>
          </div>
          <div class="hosp-sig-box">
            <div class="hosp-sig-line"></div>
            <div class="hosp-sig-title">Presb. Nilzom & Presb. Moacir • Obreiros</div>
            <div class="hosp-sig-desc">Coordenação de Visitas Hospitalares • Templo Sede</div>
          </div>
        </div>
      </div>
    `;
  }

  printHospitalVisitsPDF() {
    const select = document.getElementById('select-hosp-print-status');
    const filter = select ? select.value : 'all';
    const visits = this.getHospitalVisits(filter);

    if (visits.length === 0) {
      alert('Nenhuma visita hospitalar encontrada para gerar o relatório em PDF.');
      return;
    }

    const filterLabels = {
      all: 'Todas as Visitas Hospitalares',
      prayed: 'Visitas Feitas / Realizadas',
      pending: 'Visitas Pendentes (Aguardando no Leito)',
      answered: 'Visitas Concluídas com Graça (Altas)'
    };

    const nowFormatted = new Date().toLocaleString('pt-BR');

    const rowsHTML = visits.map((p, idx) => {
      const dateStr = this.formatDate(p.createdAt);
      const h = p.hospitalVisit;
      const statusLabels = {
        pending: '🟡 Aguardando Visita',
        prayed: '🟢 Visita Feita / Orado',
        answered: '🎉 Graça / Alta Médica'
      };
      const statusText = statusLabels[p.status] || 'Aguardando';

      return `
        <tr>
          <td style="text-align: center; font-weight: bold; padding: 7px 6px;">${idx + 1}</td>
          <td style="padding: 7px 6px;">
            <div style="font-weight: 600;">${dateStr}</div>
          </td>
          <td style="padding: 7px 6px;">
            <div style="font-weight: bold; font-size: 13px; color: #000;">${this.escapeHTML(h.patientName)}</div>
            <div style="font-size: 10.5px; color: #475569;">Sol: ${this.escapeHTML(p.senderName || 'Familiar')}</div>
          </td>
          <td style="padding: 7px 6px;">
            <strong style="color: #0369a1;">${this.escapeHTML(h.hospitalName)}</strong>
          </td>
          <td style="padding: 7px 6px; text-align: center;">
            <span style="font-weight: bold; background: #e0f2fe; padding: 2px 7px; border-radius: 4px; border: 1px solid #bae6fd;">${this.escapeHTML(h.roomNumber)}</span>
          </td>
          <td style="padding: 7px 6px;">
            <div>${h.contactPhone ? this.escapeHTML(h.contactPhone) : '<span style="color:#888;">Não informado</span>'}</div>
          </td>
          <td style="padding: 7px 6px;">
            <div style="font-weight: 700; font-size: 11px; margin-bottom: 2px;">${statusText}</div>
            ${h.notes ? `<div style="font-size: 10.5px; color: #333;"><strong>Obs:</strong> ${this.escapeHTML(h.notes)}</div>` : ''}
            ${p.notes ? `<div style="font-size: 10.5px; color: #047857;"><strong>Nota Pastor:</strong> ${this.escapeHTML(p.notes)}</div>` : ''}
          </td>
          <td style="padding: 7px 6px; min-width: 95px; border-left: 1px dashed #cbd5e1;">
            <div style="border-bottom: 1px solid #94a3b8; height: 18px; margin-top: 10px;"></div>
            <div style="font-size: 9px; text-align: center; color: #64748b; margin-top: 2px;">Data / Assinatura</div>
          </td>
        </tr>
      `;
    }).join('');

    const printWin = window.open('', '_blank');
    if (!printWin) {
      window.print();
      return;
    }

    const printHTML = '<!DOCTYPE html>' +
'<html lang="pt-BR">' +
'<head>' +
'  <meta charset="UTF-8">' +
'  <title>Relatório de Visitas Hospitalares - Culto do Empreendedor</title>' +
'  <style>' +
'    @page {' +
'      size: A4 landscape;' +
'      margin: 10mm 12mm;' +
'    }' +
'    * {' +
'      box-sizing: border-box;' +
'      -webkit-print-color-adjust: exact !important;' +
'      print-color-adjust: exact !important;' +
'    }' +
'    body {' +
'      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;' +
'      color: #0f172a;' +
'      background: #ffffff;' +
'      margin: 0;' +
'      padding: 16px;' +
'      font-size: 12px;' +
'      line-height: 1.35;' +
'    }' +
'    .toolbar-actions {' +
'      display: flex;' +
'      justify-content: space-between;' +
'      align-items: center;' +
'      background: #0f172a;' +
'      color: #ffffff;' +
'      padding: 12px 20px;' +
'      border-radius: 10px;' +
'      margin-bottom: 18px;' +
'      box-shadow: 0 4px 14px rgba(0,0,0,0.25);' +
'    }' +
'    .toolbar-actions button {' +
'      cursor: pointer;' +
'      padding: 8px 18px;' +
'      border-radius: 8px;' +
'      font-weight: 700;' +
'      font-size: 13px;' +
'      border: none;' +
'      transition: all 0.2s;' +
'    }' +
'    .btn-print-now {' +
'      background: #0284c7;' +
'      color: #ffffff;' +
'    }' +
'    .btn-print-now:hover {' +
'      background: #0369a1;' +
'    }' +
'    .btn-close-win {' +
'      background: #334155;' +
'      color: #ffffff;' +
'      margin-left: 8px;' +
'    }' +
'    .header-box {' +
'      display: flex;' +
'      align-items: center;' +
'      justify-content: space-between;' +
'      border-bottom: 2.5px solid #0284c7;' +
'      padding-bottom: 12px;' +
'      margin-bottom: 14px;' +
'    }' +
'    .header-left {' +
'      display: flex;' +
'      align-items: center;' +
'      gap: 14px;' +
'    }' +
'    .header-logo {' +
'      width: 54px;' +
'      height: auto;' +
'      border-radius: 6px;' +
'    }' +
'    .church-name {' +
'      font-size: 11px;' +
'      font-weight: 800;' +
'      color: #0284c7;' +
'      letter-spacing: 0.05em;' +
'      text-transform: uppercase;' +
'    }' +
'    .report-title {' +
'      font-size: 17px;' +
'      font-weight: 900;' +
'      color: #0f172a;' +
'      margin: 2px 0;' +
'    }' +
'    .church-sub {' +
'      font-size: 11px;' +
'      color: #475569;' +
'    }' +
'    .header-meta {' +
'      text-align: right;' +
'      font-size: 11px;' +
'      color: #334155;' +
'      line-height: 1.45;' +
'    }' +
'    table {' +
'      width: 100%;' +
'      border-collapse: collapse;' +
'      font-size: 11.5px;' +
'      margin-bottom: 20px;' +
'    }' +
'    th {' +
'      background: #f1f5f9;' +
'      color: #0f172a;' +
'      font-weight: 800;' +
'      text-align: left;' +
'      padding: 8px 6px;' +
'      border: 1px solid #cbd5e1;' +
'      font-size: 10.5px;' +
'      text-transform: uppercase;' +
'    }' +
'    td {' +
'      border: 1px solid #e2e8f0;' +
'      vertical-align: top;' +
'    }' +
'    tr:nth-child(even) td {' +
'      background: #f8fafc;' +
'    }' +
'    .footer-signatures {' +
'      margin-top: 26px;' +
'      display: flex;' +
'      justify-content: space-around;' +
'      page-break-inside: avoid;' +
'    }' +
'    .sig-box {' +
'      width: 280px;' +
'      text-align: center;' +
'    }' +
'    .sig-line {' +
'      border-bottom: 1.2px solid #0f172a;' +
'      margin-bottom: 6px;' +
'    }' +
'    .sig-title {' +
'      font-weight: 800;' +
'      font-size: 11.5px;' +
'      color: #0f172a;' +
'    }' +
'    .sig-sub {' +
'      font-size: 10px;' +
'      color: #64748b;' +
'    }' +
'    @media print {' +
'      .no-print {' +
'        display: none !important;' +
'      }' +
'      body {' +
'        padding: 0;' +
'      }' +
'    }' +
'  </style>' +
'</head>' +
'<body>' +
'  <div class="toolbar-actions no-print">' +
'    <div>' +
'      <strong>🏥 Relatório de Visitas Hospitalares & Capelania</strong>' +
'      <span style="opacity: 0.85; font-size: 12px; margin-left: 8px;">(Total: ' + visits.length + ' visitas • ' + (filterLabels[filter] || 'Geral') + ')</span>' +
'    </div>' +
'    <div>' +
'      <button class="btn-print-now" onclick="window.print()">🖨️ Salvar como PDF / Imprimir</button>' +
'      <button class="btn-close-win" onclick="window.close()">✖ Fechar</button>' +
'    </div>' +
'  </div>' +
'  <div class="header-box">' +
'    <div class="header-left">' +
'      <img src="logo.svg" alt="Logo" class="header-logo" onerror="this.onerror=null; this.src=\'logo.jpg\';">' +
'      <div>' +
'        <div class="church-name">IGREJA ASSEMBLEIA DE DEUS • UNIÃO DA VITÓRIA - PR</div>' +
'        <div class="report-title">RELATÓRIO DE VISITAS HOSPITALARES & CAPELANIA</div>' +
'        <div class="church-sub">Culto do Empreendedor • Rua Ipiranga, 357 — Centro • União da Vitória - PR • <strong>Visitas às Quartas-feiras</strong></div>' +
'      </div>' +
'    </div>' +
'    <div class="header-meta">' +
'      <div><strong>Emissão:</strong> ' + nowFormatted + '</div>' +
'      <div><strong>Filtro:</strong> ' + (filterLabels[filter] || 'Geral') + '</div>' +
'      <div><strong>Total de Visitas:</strong> ' + visits.length + '</div>' +
'    </div>' +
'  </div>' +
'  <table>' +
'    <thead>' +
'      <tr>' +
'        <th style="width: 4%;">#</th>' +
'        <th style="width: 13%;">Data Solicitação</th>' +
'        <th style="width: 19%;">Paciente</th>' +
'        <th style="width: 17%;">Hospital</th>' +
'        <th style="width: 11%;">Quarto/Leito</th>' +
'        <th style="width: 12%;">Acompanhante</th>' +
'        <th style="width: 14%;">Situação & Obs</th>' +
'        <th style="width: 10%;">Assinatura</th>' +
'      </tr>' +
'    </thead>' +
'    <tbody>' +
'      ' + rowsHTML +
'    </tbody>' +
'  </table>' +
'  <div class="footer-signatures">' +
'    <div class="sig-box">' +
'      <div class="sig-line"></div>' +
'      <div class="sig-title">Pastor Arnaldo • Capelão Responsável</div>' +
'      <div class="sig-sub">Culto do Empreendedor • União da Vitória - PR</div>' +
'    </div>' +
'    <div class="sig-box">' +
'      <div class="sig-line"></div>' +
'      <div class="sig-title">Presb. Nilzom & Presb. Moacir • Obreiros</div>' +
'      <div class="sig-sub">Coordenação de Visitas Hospitalares • Templo Sede</div>' +
'    </div>' +
'  </div>' +
'  <script>' +
'    window.onload = function() {' +
'      setTimeout(function() {' +
'        window.print();' +
'      }, 300);' +
'    };' +
'  <\/script>' +
'</body>' +
'</html>';

    printWin.document.open();
    printWin.document.write(printHTML);
    printWin.document.close();
  }
}

// Inicializa o Painel do Administrador
document.addEventListener('DOMContentLoaded', () => {
  window.adminApp = new AdminApp();
});
