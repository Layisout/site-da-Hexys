// server.js (Conceitual)

const db = require('./db_connection_module'); // Módulo de conexão

// Função que executa o comando SQL
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
        await db.execute(createTableQuery); // Executa o SQL no BD
        console.log("Tabela 'Usuarios' criada com sucesso!");
    } catch (error) {
        // Se a tabela já existir, a execução irá falhar, o que é esperado após a primeira vez.
        // Você pode ignorar erros de "tabela já existe" aqui.
        console.error("Erro ao criar tabela Usuarios (Pode ser que ela já exista):", error.message);
    }
}

// Chame esta função antes de iniciar o servidor, mas apenas uma vez
// setupDatabase(); 

// ... Início do servidor e rotas (como a rota /api/matches) ...

// URL do seu servidor backend (onde roda o server.js)
const API_MATCHES_URL = 'http://localhost:3000/api/matches';

// Função para buscar e carregar a agenda
async function loadAgenda() {
    const matchList = document.getElementById('match-list');
    matchList.innerHTML = '<li class="match-loading">Carregando agenda...</li>'; // Feedback visual

    try {
        const response = await fetch(API_MATCHES_URL);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const matches = await response.json();

        matchList.innerHTML = ''; // Limpa o "Carregando"
        
        if (matches.length === 0) {
            matchList.innerHTML = '<li class="match-item no-matches">Nenhuma partida agendada.</li>';
            return;
        }

        matches.forEach(match => {
            const li = document.createElement('li');
            li.classList.add('match-item');

            // Formata a data e hora para exibição
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

// Lógica para o menu hamburguer (responsividade)
// ** ATENÇÃO: Verifique se o ID 'menu-toggle' existe no seu index2.html **
const menuToggle = document.getElementById('menu-toggle');
if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        const navUl = document.querySelector('header nav ul');
        if (navUl) {
            navUl.classList.toggle('open');
        }
    });
}

// Lógica de Atualização do Ícone do Carrinho (Mantida do seu código)
function updateCartUI() {
    // Código existente do carrinho aqui (Se estiver em script2.js)
    // Se a lógica do carrinho estiver em outro lugar, remova esta função daqui.
}

// Executa o carregamento da agenda ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    loadAgenda();
    // Se a lógica do carrinho estiver aqui, chame: updateCartUI();
});
