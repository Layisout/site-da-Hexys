// Simulação de dados da agenda
const matches = [
    { id: 1, time: "xx:xx BRT", teams: "Esperando informações", stage: "Esperando informações" },
    { id: 2, time: "xx:xx BRT", teams: "Esperando informações", stage: "Esperando informações" },
    { id: 3, time: "xx:xx BRT", teams: "Esperando informações", stage: "Esperando informações" },
    // Adicione mais jogos conforme necessário
];

// Função para carregar a agenda
function loadAgenda() {
    const matchList = document.getElementById('match-list');
    
    matches.forEach(match => {
        const li = document.createElement('li');
        li.classList.add('match-item');
        li.innerHTML = `
            <div class="match-details">
                <strong>${match.teams}</strong>
                <span>${match.stage}</span>
            </div>
            <div class="match-time">${match.time}</div>
        `;
        matchList.appendChild(li);
    });
}

// Lógica para o menu hamburguer (responsividade)
document.getElementById('menu-toggle').addEventListener('click', function() {
    const navUl = document.querySelector('header nav ul');
    navUl.classList.toggle('open');
});

// Executa o carregamento da agenda ao carregar a página
document.addEventListener('DOMContentLoaded', loadAgenda);

// Poderia adicionar aqui a lógica de CRUD (com requisições fetch para um backend), 
// login/cadastro (com requisições para um backend com hash de senhas), 
// e lógica de carrinho (armazenamento local/sessão ou backend).