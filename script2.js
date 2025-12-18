const db = require('./db_connection_module');

async function setupDatabase() {
    const createTableQuery = 
` CREATE DATABASE IF NOT EXISTS hexys_esports;
USE hexys_esports;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('admin', 'cliente') DEFAULT 'cliente',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    estoque INT DEFAULT 0,
    imagem_url VARCHAR(255)
);

CREATE TABLE partidas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    time_a VARCHAR(50) NOT NULL,
    time_b VARCHAR(50) NOT NULL,
    data_hora DATETIME NOT NULL,
    resultado VARCHAR(20) DEFAULT 'A definir'
);`;
    
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


