const db = require('./db_connection_module');

async function setupDatabase() {
    const createTableQuery = `
        CREATE TABLE Usuarios (
            Id INT IDENTITY(1,1) PRIMARY KEY,
            NomeUsuario NVARCHAR(100) NOT NULL,
            Email NVARCHAR(255) NOT NULL UNIQUE,
            SenhaHash NVARCHAR(255) NOT NULL,
            DataCadastro DATETIME NOT NULL DEFAULT GETDATE()
        );
    `;
    
    try {
        await db.execute(createTableQuery);
        console.log("Tabela 'Usuarios' criada com sucesso!");
    } catch (error) {
        console.error("Erro ao criar tabela Usuarios (Pode ser que ela já exista):", error.message);
    }
}

const API_MATCHES_URL = 'http://localhost:3000/api/matches';

async function loadAgenda() {
    const matchList = document.getElementById('match-list');
    matchList.innerHTML = '<li class="match-loading">Carregando agenda...</li>'; // Feedback visual

    try {
        const response = await fetch(API_MATCHES_URL);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const matches = await response.json();

        matchList.innerHTML = '';
        
        if (matches.length === 0) {
            matchList.innerHTML = '<li class="match-item no-matches">Nenhuma partida agendada.</li>';
            return;
        }

        matches.forEach(match => {
            const li = document.createElement('li');
            li.classList.add('match-item');

            const date = new Date(match.match_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            const time = match.match_time ? match.match_time.substring(0, 5) : 'A definir'; // Pega apenas HH:MM
            
            li.innerHTML = `
                <div class="match-details">
                    <strong>${match.team_a} vs ${match.team_b}</strong>
                    <span>${match.stage || 'Fase Eliminatória'} | ${match.game_title}</span>
                </div>
                <div class="match-time">
                    ${date} ${time} BRT
                    ${match.stream_link ? `<a href="${match.stream_link}" target="_blank" class="stream-link">📺 Assistir</a>` : ''}
                </div>
            `;
            matchList.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao buscar agenda:', error);
        matchList.innerHTML = `<li class="match-error">❌ Erro de Conexão: Não foi possível carregar a agenda. Verifique se o servidor backend (http://localhost:3000) está rodando e configurado corretamente.</li>`;
    }
}

const menuToggle = document.getElementById('menu-toggle');
if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        const navUl = document.querySelector('header nav ul');
        if (navUl) {
            navUl.classList.toggle('open');
        }
    });
}

function updateCartUI() {
}

document.addEventListener('DOMContentLoaded', () => {
    loadAgenda();
});
