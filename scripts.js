let todosOsProdutos = [];
let contadorCarrinho = 0;

window.addEventListener("load", async () => {
    // carregar produtos
    let listaSalva = await verificarLocalStorage();
    todosOsProdutos = listaSalva;
    gerarDom(todosOsProdutos);

    // carregar contador
    if (localStorage.getItem("contadorCarrinho")) {
        contadorCarrinho = parseInt(localStorage.getItem("contadorCarrinho"));
        document.getElementById("contadorCarrinho").textContent = contadorCarrinho;
    }
});

/*  PESQUISA */
document.querySelector("#search").addEventListener("keyup", (event) => {
    let texto = document.querySelector("#search").value.toLowerCase();
    if (event.key === "Enter") procurar(todosOsProdutos, texto);
});

/* LOCALSTORAGE */
async function verificarLocalStorage() {
    const listaLocal = localStorage.getItem("listaProdutos");
    if (listaLocal != null) return JSON.parse(listaLocal);

    const dadosJson = await chamarJson();
    localStorage.setItem("listaProdutos", JSON.stringify(dadosJson));
    return dadosJson;
}

/* CARREGA JSON */
async function chamarJson() {
    const resposta = await fetch('./produtos.json');
    return await resposta.json();
}

/* GERAR PRODUTOS */
function gerarDom(lista) {
    const container = document.querySelector("#produtos");
    let html = "";

    lista.forEach(e => {
        html += `
            <div class="cardsProdutos" id="${e.id}">
                <img src="${e.image}" class="imgProdutos">
                <h2>${e.title}</h2>
                <p class="valor">Preço: <span>R$${e.price.toFixed(2)}</span></p>
                <div class="actions">
                    <button class="vermais">Ver mais</button>
                    <i class="fa-solid fa-cart-plus adicionar"></i>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/* PESQUISA */
function procurar(lista, texto) {
    const filtrados = lista.filter(p =>
        p.title.toLowerCase().includes(texto)
    );

    if (filtrados.length > 0) gerarDom(filtrados);
    else alert("Não encontrado: " + texto);
}

/* CLIQUES */
document.addEventListener("click", function (e) {

    // VER MAIS → abrir modal
    if (e.target.classList.contains("vermais")) {
        const card = e.target.closest(".cardsProdutos");
        const produto = todosOsProdutos.find(p => p.id == card.id);
        mostrarModal(produto);
    }

    // ADICIONAR → contar carrinho
    if (e.target.classList.contains("adicionar")) {
        contadorCarrinho++;
        document.getElementById("contadorCarrinho").textContent = contadorCarrinho;
        localStorage.setItem("contadorCarrinho", contadorCarrinho);
    }
});

/* MODAL */
function mostrarModal(produto) {
    document.getElementById("modalImg").src = produto.image;
    document.getElementById("modalTitulo").textContent = produto.title;
    document.getElementById("modalPreco").textContent = "R$ " + produto.price.toFixed(2);
    document.getElementById("modalDescricao").textContent = produto.description;

    document.getElementById("modalProduto").style.bottom = "0";
}

// FECHAR MODAL
document.getElementById("fecharModal").addEventListener("click", () => {
    document.getElementById("modalProduto").style.bottom = "-100%";
});
