/**
 * pedir.js - Lógica do Formulário Público de Oração
 * Coleta os 3 campos (Nome, Para quem é a oração, Propósito/Oração)
 * e salva de forma segura e privada para o Administrador.
 */

const STORAGE_KEY = 'circulo_oracoes_db_v1';

// Elementos da Interface
const form = document.getElementById('prayer-public-form');
const formCard = document.getElementById('form-card-container');
const confCard = document.getElementById('confirmation-container');

const senderInput = document.getElementById('sender-name');
const checkAnonSender = document.getElementById('check-anon-sender');

const senderPhoneInput = document.getElementById('sender-phone');
const checkWantDevotional = document.getElementById('check-want-devotional');
const boxPhoneDevotional = document.getElementById('box-phone-devotional');

const targetInput = document.getElementById('target-person');
const checkAnonTarget = document.getElementById('check-anon-target');

const purposeInput = document.getElementById('prayer-purpose');
const categoryInput = document.getElementById('prayer-category');
const checkUrgent = document.getElementById('check-urgent-prayer');

const checkAttendService = document.getElementById('check-attend-service');
const churchLocationDetails = document.getElementById('church-location-details');

// Elementos da Visita Hospitalar
const checkHospitalVisit = document.getElementById('check-hospital-visit');
const hospitalVisitCard = document.getElementById('hospital-visit-card');
const hospitalVisitFormDetails = document.getElementById('hospital-visit-form-details');
const hospConfirmDesejo = document.getElementById('hosp-confirm-desejo');
const hospPatientName = document.getElementById('hosp-patient-name');
const hospPatientPhone = document.getElementById('hosp-patient-phone');
const hospSelectHospital = document.getElementById('hosp-select-hospital');
const hospCustomHospital = document.getElementById('hosp-custom-hospital');
const hospRoomNumber = document.getElementById('hosp-room-number');
const hospContactPhone = document.getElementById('hosp-contact-phone');
const hospVisitNotes = document.getElementById('hosp-visit-notes');

const confHospBox = document.getElementById('conf-hosp-box');
const confHospSummary = document.getElementById('conf-hosp-summary');

const btnSubmitPrayer = document.getElementById('btn-submit-prayer');
const btnNewSubmission = document.getElementById('btn-new-submission');

// Máscara amigável de telefone (42) 99999-9999
if (senderPhoneInput) {
  senderPhoneInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.substring(0, 11);
    if (v.length > 6) {
      e.target.value = `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7)}`;
    } else if (v.length > 2) {
      e.target.value = `(${v.substring(0, 2)}) ${v.substring(2)}`;
    } else if (v.length > 0) {
      e.target.value = `(${v}`;
    }
  });
}

// Máscara de telefone do paciente hospitalar
if (hospPatientPhone) {
  hospPatientPhone.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.substring(0, 11);
    if (v.length > 6) {
      e.target.value = `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7)}`;
    } else if (v.length > 2) {
      e.target.value = `(${v.substring(0, 2)}) ${v.substring(2)}`;
    } else if (v.length > 0) {
      e.target.value = `(${v}`;
    }
  });
}

// Máscara de telefone do acompanhante hospitalar
if (hospContactPhone) {
  hospContactPhone.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.substring(0, 11);
    if (v.length > 6) {
      e.target.value = `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7)}`;
    } else if (v.length > 2) {
      e.target.value = `(${v.substring(0, 2)}) ${v.substring(2)}`;
    } else if (v.length > 0) {
      e.target.value = `(${v}`;
    }
  });
}

// Alternância da Localização do Culto Presencial
if (checkAttendService && churchLocationDetails) {
  checkAttendService.addEventListener('change', (e) => {
    if (e.target.checked) {
      churchLocationDetails.classList.remove('hidden');
    } else {
      churchLocationDetails.classList.add('hidden');
    }
  });
}

// Alternância do Formulário de Visita Hospitalar
if (checkHospitalVisit && hospitalVisitFormDetails) {
  checkHospitalVisit.addEventListener('change', (e) => {
    if (e.target.checked) {
      hospitalVisitFormDetails.classList.remove('hidden');
      if (hospitalVisitCard) hospitalVisitCard.classList.add('active-open');
      if (btnSubmitPrayer) {
        btnSubmitPrayer.innerHTML = `<span>Enviar Solicitação de Visita Hospitalar</span> <span class="btn-arrow">🏥</span>`;
      }
    } else {
      hospitalVisitFormDetails.classList.add('hidden');
      if (hospitalVisitCard) hospitalVisitCard.classList.remove('active-open');
      if (btnSubmitPrayer) {
        btnSubmitPrayer.innerHTML = `<span>Enviar Pedido de Oração</span> <span class="btn-arrow">🙏</span>`;
      }
    }
  });
}

// Dropdown de Hospital: Exibir campo para digitar caso escolha "Outro"
if (hospSelectHospital && hospCustomHospital) {
  hospSelectHospital.addEventListener('change', (e) => {
    if (e.target.value.includes('Outro')) {
      hospCustomHospital.classList.remove('hidden');
      hospCustomHospital.focus();
    } else {
      hospCustomHospital.classList.add('hidden');
    }
  });
}

// Confirmação elementos
const confSender = document.getElementById('conf-sender-name');
const confPhoneRow = document.getElementById('conf-phone-row');
const confPhone = document.getElementById('conf-sender-phone');
const confTarget = document.getElementById('conf-target-person');
const confPurpose = document.getElementById('conf-purpose');

// Alternância de Anônimo (se existirem na tela)
if (checkAnonSender) {
  checkAnonSender.addEventListener('change', (e) => {
    if (e.target.checked) {
      senderInput.value = '';
      senderInput.disabled = true;
      senderInput.placeholder = 'Seu nome não será exibido';
      if (boxPhoneDevotional) {
        boxPhoneDevotional.style.opacity = '0.45';
        boxPhoneDevotional.style.pointerEvents = 'none';
      }
      if (senderPhoneInput) {
        senderPhoneInput.disabled = true;
        senderPhoneInput.value = '';
      }
    } else {
      senderInput.disabled = false;
      senderInput.placeholder = 'Ex: Maria Aparecida, Lucas Silva...';
      if (boxPhoneDevotional) {
        boxPhoneDevotional.style.opacity = '1';
        boxPhoneDevotional.style.pointerEvents = 'auto';
      }
      if (senderPhoneInput) {
        senderPhoneInput.disabled = false;
      }
    }
  });
}

if (checkAnonTarget) {
  checkAnonTarget.addEventListener('change', (e) => {
    if (e.target.checked) {
      targetInput.value = '';
      targetInput.disabled = true;
      targetInput.placeholder = 'Pessoa mantida em sigilo';
    } else {
      targetInput.disabled = false;
      targetInput.placeholder = 'Ex: Por mim mesmo, Por minha mãe Helena...';
    }
  });
}

// Submissão do Formulário
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Tratamento da Solicitação de Visita Hospitalar
  const wantsHospitalVisit = checkHospitalVisit ? checkHospitalVisit.checked : false;
  let hospitalVisitData = null;

  if (wantsHospitalVisit) {
    const pName = hospPatientName ? hospPatientName.value.trim() : '';
    const pPhone = hospPatientPhone ? hospPatientPhone.value.trim() : '';
    let hName = hospSelectHospital ? hospSelectHospital.value : '';
    if (hName.includes('Outro') && hospCustomHospital) {
      hName = hospCustomHospital.value.trim() || 'Outro Hospital / Clínica';
    }
    const rNum = hospRoomNumber ? hospRoomNumber.value.trim() : '';
    const cPhone = hospContactPhone ? hospContactPhone.value.trim() : '';
    const hNotes = hospVisitNotes ? hospVisitNotes.value.trim() : '';

    if (!pName) {
      alert('🏥 Por favor, informe o Nome do Paciente para a visita hospitalar.');
      if (hospPatientName) hospPatientName.focus();
      return;
    }
    if (!hName) {
      alert('🏥 Por favor, selecione o Hospital onde o paciente está internado.');
      if (hospSelectHospital) hospSelectHospital.focus();
      return;
    }
    if (!rNum) {
      alert('🏥 Por favor, informe o Número do Quarto ou Leito do hospital.');
      if (hospRoomNumber) hospRoomNumber.focus();
      return;
    }

    hospitalVisitData = {
      requested: true,
      patientName: pName,
      patientPhone: pPhone,
      hospitalName: hName,
      roomNumber: rNum,
      contactPhone: cPhone,
      notes: hNotes
    };
  }

  // VALIDAÇÃO OBRIGATÓRIA DOS CAMPOS 1, 2 E 3
  let senderName = '';
  let targetPerson = '';
  let purpose = '';

  const rawPhone = senderPhoneInput ? senderPhoneInput.value.trim() : '';
  let phone = rawPhone;
  const wantDevotional = checkWantDevotional ? checkWantDevotional.checked : false;
  const isUrgent = checkUrgent ? checkUrgent.checked : false;
  const category = categoryInput ? categoryInput.value : 'Outros';
  const wantsToAttend = checkAttendService ? checkAttendService.checked : false;

  if (wantsHospitalVisit && hospitalVisitData) {
    // Quando solicita visita hospitalar, os dados do paciente suprem os campos superiores
    const rawSender = senderInput ? senderInput.value.trim() : '';
    senderName = rawSender || (hospitalVisitData.contactPhone ? `Familiar / Acompanhante (${hospitalVisitData.contactPhone})` : 'Familiar / Acompanhante');
    if (!phone) {
      phone = hospitalVisitData.contactPhone || hospitalVisitData.patientPhone || '';
    }
    targetPerson = `${hospitalVisitData.patientName} (Internado no ${hospitalVisitData.hospitalName})`;
    const patientPhoneText = hospitalVisitData.patientPhone ? ` Tel Paciente: ${hospitalVisitData.patientPhone}.` : '';
    const contactText = hospitalVisitData.contactPhone ? ` Contato acompanhante: ${hospitalVisitData.contactPhone}.` : '';
    const extraNotes = hospitalVisitData.notes ? ` Observação: ${hospitalVisitData.notes}.` : '';
    purpose = `Solicitação de visita pastoral no leito para o(a) paciente ${hospitalVisitData.patientName}, internado(a) no ${hospitalVisitData.hospitalName} (${hospitalVisitData.roomNumber}).${patientPhoneText}${contactText}${extraNotes}`;
  } else {
    // CAMPO 1 OBRIGATÓRIO: Seu Nome
    const rawSender = senderInput ? senderInput.value.trim() : '';
    if (!rawSender) {
      alert('⚠️ O CAMPO 1 É OBRIGATÓRIO!\n\nPor favor, digite o Seu Nome para enviar o pedido de oração.');
      if (senderInput) {
        senderInput.focus();
        senderInput.classList.add('input-error-pulse');
        setTimeout(() => senderInput.classList.remove('input-error-pulse'), 1800);
      }
      return;
    }
    senderName = rawSender;

    // CAMPO 2 OBRIGATÓRIO: Para quem é a oração
    const rawTarget = targetInput ? targetInput.value.trim() : '';
    if (!rawTarget) {
      alert('⚠️ O CAMPO 2 É OBRIGATÓRIO!\n\nPor favor, informe para quem é esta oração no campo 2 (ex: "Por mim mesmo", "Por minha família", "Pela minha empresa").');
      if (targetInput) {
        targetInput.focus();
        targetInput.classList.add('input-error-pulse');
        setTimeout(() => targetInput.classList.remove('input-error-pulse'), 1800);
      }
      return;
    }
    targetPerson = rawTarget;

    // CAMPO 3 OBRIGATÓRIO: A oração ou propósito
    const rawPurpose = purposeInput ? purposeInput.value.trim() : '';
    if (!rawPurpose) {
      alert('⚠️ O CAMPO 3 É OBRIGATÓRIO!\n\nPor favor, escreva a sua oração ou propósito no campo 3.');
      if (purposeInput) {
        purposeInput.focus();
        purposeInput.classList.add('input-error-pulse');
        setTimeout(() => purposeInput.classList.remove('input-error-pulse'), 1800);
      }
      return;
    }
    purpose = rawPurpose;
  }

  // Criação do objeto do pedido
  const newPrayer = {
    id: 'req-' + Date.now(),
    senderName: senderName,
    isSenderAnon: false,
    phone: phone,
    wantDevotional: wantDevotional && Boolean(phone),
    targetPerson: targetPerson,
    isTargetAnon: false,
    purpose: purpose,
    category: wantsHospitalVisit ? 'Visita Hospitalar' : (isUrgent ? 'Causa Urgente' : category),
    isUrgent: isUrgent || wantsHospitalVisit,
    wantsToAttend: wantsToAttend,
    hospitalVisit: hospitalVisitData,
    status: 'pending', // 'pending' (Aguardando Oração) | 'prayed' (Orado/Intercedido) | 'answered' (Graça)
    createdAt: Date.now(),
    notes: wantsHospitalVisit ? `Visita hospitalar no ${hospitalVisitData.hospitalName} (${hospitalVisitData.roomNumber})` : '',
    intercessionCount: 0
  };

  // Salvar no repositório compartilhado (localStorage)
  savePrayerToDatabase(newPrayer);

  // Tocar sino suave de confirmação
  playChime();

  // Exibir tela de confirmação
  confSender.textContent = senderName;
  confTarget.textContent = targetPerson;
  confPurpose.textContent = purpose;

  if (phone && confPhoneRow && confPhone) {
    const devTxt = wantDevotional ? ' (Devocional Solicitado ✨)' : '';
    confPhone.textContent = `${phone}${devTxt}`;
    confPhoneRow.classList.remove('hidden');
  } else if (confPhoneRow) {
    confPhoneRow.classList.add('hidden');
  }

  // Exibir resumo da visita hospitalar na confirmação se solicitada
  if (wantsHospitalVisit && hospitalVisitData && confHospBox && confHospSummary) {
    let summaryText = `Paciente: ${hospitalVisitData.patientName}`;
    if (hospitalVisitData.patientPhone) {
      summaryText += ` (Tel: ${hospitalVisitData.patientPhone})`;
    }
    summaryText += ` • ${hospitalVisitData.hospitalName} (${hospitalVisitData.roomNumber})`;
    if (hospitalVisitData.contactPhone) {
      summaryText += ` • Acompanhante: ${hospitalVisitData.contactPhone}`;
    }
    if (hospitalVisitData.notes) {
      summaryText += ` • Observação: ${hospitalVisitData.notes}`;
    }
    confHospSummary.textContent = summaryText;
    confHospBox.classList.remove('hidden');
  } else if (confHospBox) {
    confHospBox.classList.add('hidden');
  }

  formCard.classList.add('hidden');
  confCard.classList.remove('hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Botão para enviar outro pedido
btnNewSubmission.addEventListener('click', () => {
  form.reset();
  if (churchLocationDetails) {
    churchLocationDetails.classList.add('hidden');
  }
  if (hospitalVisitFormDetails) {
    hospitalVisitFormDetails.classList.add('hidden');
  }
  if (hospitalVisitCard) {
    hospitalVisitCard.classList.remove('active-open');
  }
  if (hospCustomHospital) {
    hospCustomHospital.classList.add('hidden');
  }
  if (confHospBox) {
    confHospBox.classList.add('hidden');
  }
  if (boxPhoneDevotional) {
    boxPhoneDevotional.style.opacity = '1';
    boxPhoneDevotional.style.pointerEvents = 'auto';
  }
  if (senderPhoneInput) {
    senderPhoneInput.disabled = false;
    senderPhoneInput.value = '';
  }
  if (confPhoneRow) {
    confPhoneRow.classList.add('hidden');
  }
  if (btnSubmitPrayer) {
    btnSubmitPrayer.innerHTML = `<span>Enviar Pedido de Oração</span> <span class="btn-arrow">🙏</span>`;
  }
  senderInput.disabled = false;
  senderInput.placeholder = 'Ex: Maria Aparecida, Lucas Silva...';
  targetInput.disabled = false;
  targetInput.placeholder = 'Ex: Por mim mesmo, Por minha mãe Helena...';

  confCard.classList.add('hidden');
  formCard.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Armazenamento
function savePrayerToDatabase(prayer) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let list = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) list = [];
    list.unshift(prayer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Erro ao salvar oração:', err);
  }
}

// Síntese de som do sino via Web Audio API
function playChime() {
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
      const vol = 0.1 / (idx + 1);
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
