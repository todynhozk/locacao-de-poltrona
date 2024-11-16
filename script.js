// Verifica se há dados no localStorage, caso contrário, usa um array vazio
let objetos = JSON.parse(localStorage.getItem("objetos")) || [];

// Função para calcular a data de devolução com base na data inicial e no número de dias
function calcularDataDevolucao(dataInicial, dias) {
    const data = new Date(dataInicial);
    data.setDate(data.getDate() + parseInt(dias));
    return data.toISOString().split("T")[0]; // Retorna no formato YYYY-MM-DD
}

// Função para salvar os dados no localStorage
function salvarNoLocalStorage() {
    localStorage.setItem("objetos", JSON.stringify(objetos));
}

// Função para carregar a tabela com os objetos
function carregarTabela() {
    const tabela = document.getElementById("tabela-objetos");
    tabela.innerHTML = ""; // Limpa a tabela

    if (objetos.length === 0) {
        tabela.innerHTML = "<tr><td colspan='7'>Nenhuma poltrona encontrada</td></tr>";
    } else {
        objetos.forEach((objeto, index) => {
            // Adiciona logs para depuração
            console.log(objeto); // Verifique o conteúdo do objeto
            if (objeto && objeto.dataAlocacao && objeto.diasAlocacao) {
                const dataDevolucao = calcularDataDevolucao(objeto.dataAlocacao, objeto.diasAlocacao);

                // Verifica o status para aplicar a classe correta (e mudar a cor)
                const statusClass = objeto.status === "Locada" ? "locada" : "nao-locada";

                const row = `<tr class="${statusClass}">
                    <td>${objeto.nome}</td>
                    <td>${objeto.local}</td>
                    <td>${objeto.dataAlocacao}</td>
                    <td>${objeto.diasAlocacao}</td>
                    <td>${dataDevolucao}</td>
                    <td>${objeto.status}</td>
                    <td>
                        <button onclick="editarObjeto(${index})">Editar</button>
                        <button onclick="deletarObjeto(${index})">Deletar</button>
                    </td>
                </tr>`;
                tabela.innerHTML += row;
            } else {
                console.error(`Objeto inválido: ${JSON.stringify(objeto)}`);
            }
        });
    }
}

// Função para adicionar um novo objeto
function adicionarObjeto() {
    const nome = document.getElementById("add-nome").value;
    const local = document.getElementById("add-local").value;
    const dataAlocacao = document.getElementById("add-data-alocacao").value;
    const diasAlocacao = document.getElementById("add-dias-alocacao").value;
    const status = document.getElementById("add-status").value;

    // Verificar se todos os campos estão preenchidos
    if (nome && local && dataAlocacao && diasAlocacao && status) {
        // Criar o novo objeto
        const novoObjeto = {
            nome,
            local,
            dataAlocacao,
            diasAlocacao,
            status
        };

        // Adicionar ao array de objetos
        objetos.push(novoObjeto);

        // Salvar no localStorage
        salvarNoLocalStorage();

        // Carregar novamente a tabela com todos os dados
        carregarTabela();

        // Limpar o formulário
        document.getElementById("form-adicionar").reset();
    } else {
        alert("Preencha todos os campos!");
    }
}

// Função para deletar um objeto
function deletarObjeto(index) {
    if (confirm("Tem certeza que deseja deletar esse objeto?")) {
        objetos.splice(index, 1); // Remove o objeto do array
        salvarNoLocalStorage(); // Atualiza o localStorage
        carregarTabela(); // Recarrega a tabela
    }
}

// Carregar a tabela ao carregar a página
document.addEventListener("DOMContentLoaded", carregarTabela);

// Função para editar um objeto
function editarObjeto(index) {
    const objeto = objetos[index];

    // Preencher os campos do formulário com os dados do objeto
    document.getElementById("add-nome").value = objeto.nome;
    document.getElementById("add-local").value = objeto.local;
    document.getElementById("add-data-alocacao").value = objeto.dataAlocacao;
    document.getElementById("add-dias-alocacao").value = objeto.diasAlocacao;
    document.getElementById("add-status").value = objeto.status;

    // Atualizar o botão de adicionar para salvar as mudanças
    const adicionarBtn = document.getElementById("adicionar-btn");
    adicionarBtn.textContent = "Salvar Alterações";
    adicionarBtn.onclick = function() {
        // Atualizar os valores do objeto
        objeto.nome = document.getElementById("add-nome").value;
        objeto.local = document.getElementById("add-local").value;
        objeto.dataAlocacao = document.getElementById("add-data-alocacao").value;
        objeto.diasAlocacao = document.getElementById("add-dias-alocacao").value;
        objeto.status = document.getElementById("add-status").value;

        // Salvar no localStorage
        salvarNoLocalStorage();

        // Carregar novamente a tabela com todos os dados
        carregarTabela();

        // Limpar o formulário
        document.getElementById("form-adicionar").reset();
        adicionarBtn.textContent = "Adicionar";
        adicionarBtn.onclick = adicionarObjeto;
    };
}
