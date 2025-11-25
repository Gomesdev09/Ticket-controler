// Variáveis globais
let tempoTotalSegundos = 0;
let tempoPorTicketSegundos = 0;
let tempoAtualSegundos = 0;
let ticketsCompletos = 0;
let metaTickets = 0;
let intervaloCronometro = null;
let emPausa = false;

/**
 * Inicializa o timer com os valores fornecidos
 */
function iniciar() {
    const meta = parseInt(document.getElementById('metaTickets').value);
    const horas = parseFloat(document.getElementById('horasTrabalho').value);

    // Validação dos inputs
    if (!meta || !horas || meta <= 0 || horas <= 0) {
        alert('Por favor, preencha os valores corretamente!');
        return;
    }

    // Configuração inicial
    metaTickets = meta;
    tempoTotalSegundos = horas * 3600;
    tempoPorTicketSegundos = Math.floor(tempoTotalSegundos / meta);
    tempoAtualSegundos = tempoPorTicketSegundos;

    // Atualização da interface
    document.getElementById('tempoPorTicket').textContent = formatarTempo(tempoPorTicketSegundos);
    document.getElementById('metaHoras').textContent = horas + 'h';
    document.getElementById('metaTicketsDisplay').textContent = meta;
    document.getElementById('danoBacklog').textContent = meta;
    
    // Alternar telas
    document.getElementById('setupForm').classList.add('hidden');
    document.getElementById('timerSection').classList.remove('hidden');

    // Iniciar cronômetro
    iniciarCronometro();
}

/**
 * Inicia o cronômetro principal
 */
function iniciarCronometro() {
    if (intervaloCronometro) {
        clearInterval(intervaloCronometro);
    }
    
    intervaloCronometro = setInterval(() => {
        if (!emPausa) {
            tempoAtualSegundos--;
            atualizarDisplay();
        }
    }, 1000);
}

/**
 * Atualiza o display do cronômetro
 */
function atualizarDisplay() {
    const display = document.getElementById('cronometro');
    const tempoFormatado = formatarTempo(Math.abs(tempoAtualSegundos));
    
    if (tempoAtualSegundos < 0) {
        display.textContent = '-' + tempoFormatado;
        display.classList.add('negative');
    } else {
        display.textContent = tempoFormatado;
        display.classList.remove('negative');
    }
}

/**
 * Atualiza o indicador de tickets restantes
 */
function atualizarDanoBacklog() {
    const ticketsRestantes = metaTickets - ticketsCompletos;
    document.getElementById('danoBacklog').textContent = ticketsRestantes;
}

/**
 * Marca um ticket como completo
 */
function completarTicket() {
    // Desabilita o botão
    const btnComplete = document.getElementById('btnComplete');
    btnComplete.disabled = true;
    
    ticketsCompletos++;
    tempoAtualSegundos += tempoPorTicketSegundos;
    
    document.getElementById('ticketsCompletos').textContent = ticketsCompletos + ' / ' + metaTickets;
    atualizarDisplay();
    atualizarDanoBacklog();

    // Reabilita após 3 segundos
    setTimeout(() => {
        if (ticketsCompletos < metaTickets) {
            btnComplete.disabled = false;
        }
    }, 3000);

    if (ticketsCompletos >= metaTickets) {
        clearInterval(intervaloCronometro);
        alert('Parabéns! Você completou todos os tickets!');
        btnComplete.disabled = true;
    }
}

/**
 * Alterna entre pausar e retomar
 */
function togglePausa() {
    const btnPause = document.getElementById('btnPause');
    const btnComplete = document.getElementById('btnComplete');

    if (!emPausa) {
        // Pausar
        emPausa = true;
        btnPause.textContent = '▶ RETOMAR';
        btnComplete.disabled = true;
    } else {
        // Retomar
        emPausa = false;
        btnPause.textContent = '⏸ PAUSA LEO';
        btnComplete.disabled = false;
    }
}

/**
 * Formata segundos em HH:MM:SS ou MM:SS
 * @param {number} segundos - Número de segundos para formatar
 * @returns {string} Tempo formatado
 */
function formatarTempo(segundos) {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;

    if (horas > 0) {
        return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;
    }
    return `${String(minutos).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;
}

window.addEventListener('beforeunload', function (e) {
    // Só mostra o aviso se o cronômetro estiver rodando
    if (intervaloCronometro !== null) {
        e.preventDefault();
        e.returnValue = ''; // Necessário para alguns navegadores
        return ''; // Necessário para navegadores mais antigos
    }
});

