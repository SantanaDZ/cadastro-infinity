// Garantir que o DOM está pronto antes de buscar os elementos
document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('meuFormulario');
    const listaUsuarios = document.getElementById('listaUsuarios');
    const btnLimpar = document.getElementById('btnLimpar');
    const btnExportar = document.getElementById('btnExportar');

    // Carregar dados iniciais
    const carregarDados = () => {
        const dadosSalvos = JSON.parse(localStorage.getItem('usuarios')) || [];
        listaUsuarios.innerHTML = ""; // Limpa antes de renderizar para não duplicar
        dadosSalvos.forEach(user => adicionarNaLista(user));
    };

    // Função de renderização na tela
    window.adicionarNaLista = (usuario) => {
        if (!listaUsuarios) return;

        const card = document.createElement('div');
        card.className = 'user-card';
        card.setAttribute('data-id', usuario.id);

        card.innerHTML = `
            <div>
                <strong style="color: #333;">${usuario.nome}</strong><br>
                <span style="font-size: 0.9em; color: #666;">${usuario.email}</span><br>
                <small style="color: #888;">${usuario.telefone}</small>
            </div>
            <button class="btn-delete" onclick="removerIndividual(${usuario.id})">Excluir</button>
        `;
        
        listaUsuarios.appendChild(card);
    };

    // Evento de Envio
    formulario.addEventListener('submit', (event) => {
        event.preventDefault();

        const usuario = {
            id: Date.now(),
            nome: document.getElementById('nome').value,
            telefone: document.getElementById('telefone').value,
            data: document.getElementById('nascimento').value,
            email: document.getElementById('email').value
        };

        // Salvar primeiro, depois mostrar
        salvarUsuario(usuario);
        adicionarNaLista(usuario);
        
        formulario.reset();
        console.log("Usuário adicionado com sucesso:", usuario);
    });

    const salvarUsuario = (usuario) => {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        usuarios.push(usuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    };

    // Botão Limpar Tudo
    btnLimpar.addEventListener('click', () => {
        if(confirm("Deseja realmente apagar toda a lista?")) {
            listaUsuarios.innerHTML = "";
            localStorage.removeItem('usuarios');
        }
    });

    // Exportar CSV
    btnExportar.addEventListener('click', () => {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        if (usuarios.length === 0) return alert("Lista vazia!");

        let csv = "Nome,Telefone,Data,Email\n";
        usuarios.forEach(u => csv += `${u.nome},${u.telefone},${u.data},${u.email}\n`);

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'usuarios.csv';
        a.click();
    });

    // Inicializa a lista ao abrir a página
    carregarDados();
});

// Função global para o botão de excluir (chamado pelo onclick do HTML)
window.removerIndividual = (id) => {
    const elemento = document.querySelector(`[data-id="${id}"]`);
    if (elemento) elemento.remove();

    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios = usuarios.filter(user => user.id !== id);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    console.log("Removido ID:", id);
};