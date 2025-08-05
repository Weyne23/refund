//seleciona ois elementos do formulário
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

//Seleciona os elementos da lista
const expenseList = document.querySelector("ul");
const expensesTotal = document.querySelector("aside header h2");
const expensesQuantity = document.querySelector("aside header p span");

// Captura o evento de input para formatar o valor
amount.oninput = () => {
    //Removendo os caracters nao numericos do input
    let value = amount.value.replace(/\D/g, "");

    //Transformar o valor em centavos
    value = Number(value)/100;

    //Formatando em real brasileiro
    amount.value = formatCurrencyBRL(value);
    
}

function formatCurrencyBRL(value) {
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })

    return value;
}


//captura o evento de submite do formulario para obter os valores
form.onsubmit = (event) => {
    //Previne o comportamento padrão de recarregar a pagina
    event.preventDefault();

    // Cria um objeto com os detalhes na nova despesa
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }

    expenseAdd(newExpense);
}

//Adiciona um novo item na lista
function expenseAdd(newExpense) {
    try {
        // Cria o elemento pra adicionar na lista
        const expenseItem = document.createElement("li");
        expenseItem.classList.add("expense");

        // Cria o icone da catecoria
        const expenseIcon = document.createElement("img");
        expenseIcon.setAttribute("src", `./img/${newExpense.category_id}.svg`);
        expenseIcon.setAttribute("alt", newExpense.category_name);

        //Cria a info da despesa
        const expenseInfo = document.createElement("div");
        expenseInfo.classList.add("expense-info");

        //Cria a categoria da despesa
        const expenseCategory = document.createElement("span");
        expenseCategory.textContent = newExpense.category_name;

        //Cria o nome da despesa
        const expenseName = document.createElement("strong");
        expenseName.textContent = newExpense.expense;

        //Adiciona nome e categoria na div das informações da despesa
        expenseInfo.append(expenseName);
        expenseInfo.append(expenseCategory);

        //Cria o valor da despesa
        const expenseAmount = document.createElement("span");
        expenseAmount.classList.add("expense-amount");
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
            .toUpperCase()
            .replace("R$", "")}`

        //Cria o icone de remover
        const removeIcon = document.createElement("img");
        removeIcon.classList.add("remove-icon");
        removeIcon.setAttribute("src", "./img/remove.svg");
        removeIcon.setAttribute("alt", "remover");

        // Adiciona as informações no item
        expenseItem.append(expenseIcon);
        expenseItem.append(expenseInfo);
        expenseItem.append(expenseAmount);
        expenseItem.append(removeIcon);

        // Adiciona o item na lista
        expenseList.append(expenseItem);

        //Atualizar o total
        updateTotals();

        //Limpa o formulario
        formClear();
    } catch (error) {
        alert("Não foi possível atualizar a lista de despesas.");
        console.log(error);
    }
}

// Atualizar os totais
function updateTotals() {
    try {
        // Recupera todos os lis da lista ul
        const items = expenseList.children;

        //atualiza a quantidade de itens na lista
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`;

        //Variavel para oncrementar o total
        let total = 0;

        //percorre cada item da lista
        for (let i = 0; i < items.length; i++) {
            const itemAmount = items[i].querySelector(".expense-amount");

            //Remover caracteres não numéricos e substitui a vírgula pelo ponto.
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".");

            value = parseFloat(value);
            
            if(isNaN(value))
                throw new Error("O valor não parece ser um número.");
            //incrementar o valor total

            total += Number(value);
        }

        //Criar a span para adicionar o R$ formatado
        const symbolBRL = document.createElement("small");
        symbolBRL.textContent = "R$";

        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

        //Limpa o conteúdo do total
        expensesTotal.innerHTML = ""
        
        expensesTotal.append(symbolBRL, total);

    } catch (error) {
        alert("Não foi possível atualizar os totais.");
        console.log(error);
    }
}

//Evento que captura os cliques da lista
expenseList.addEventListener("click", (event) => {
    // Verificar se o elemento clicado é o icone de remover
    if (event.target.classList.contains("remove-icon")) {
        // Obtem a li pai do elemento criado mais proximo
        const item = event.target.closest(".expense");

        //Remove o item da lista
        item.remove();
    }


    //Atualiza os totais
    updateTotals();
})

function formClear() {
    expense.value = "";
    category.value = "";
    amount.value = "";

    expense.focus();
}
