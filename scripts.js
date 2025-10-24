let todosOsProdutos = [];
window.addEventListener("load", async () => {
    console.log("HAHAHA");
    let listaSalva = await verificarLocalStorage();
    todosOsProdutos = listaSalva
    gerarDom(todosOsProdutos);
});

document.querySelector("#search").addEventListener("keyup", async (event) => {
    let texto = document.querySelector("#search").value.toLowerCase();
    console.log(texto)
    if (event.key === "Enter") {
        console.log("texto")
        procurar(todosOsProdutos, texto)
    }
})

async function verificarLocalStorage() {
    const listaLocal = localStorage.getItem("listaProdutos");
    if (listaLocal != null) {
        return JSON.parse(listaLocal)
    } else {
        const dadosDaApi = await chamarApi();
        localStorage.setItem("listaProdutos", JSON.stringify(dadosDaApi));
        return dadosDaApi;
    }
}
async function chamarApi() {
    console.log("AAA")
    const resposta = await fetch('https://fakestoreapi.com/products');
    const lista = await resposta.json();
    return lista;
}

function gerarDom(lista) {
    const container = document.querySelector("#produtos");
    let htmlProdutos = "";

    lista.forEach(e => {
        htmlProdutos += `
            <div class="cardsProdutos" id="${e.id}">
                <img src="${e.image}" class="imgProdutos" alt="${e.title}">
                <h2>${e.title}</h2>
                <p class="valor">Preço: <span>R$${e.price}</span> </p>
                <div class="actions">
                    <button class="adicionarCarrinho">Ver mais</button>
                    <i class="fa-solid fa-cart-plus"></i>
                </div>
            </div>
        `;
    });

    container.innerHTML = htmlProdutos;
}

function procurar(lista, texto) {

    const produtosFiltrados = lista.filter(produto => {
        return produto.title.toLowerCase().includes(texto);
    });
    if(produtosFiltrados.length >0 ){
        gerarDom(produtosFiltrados);
    }else{
        alert("Não foi encontrado o produto "+ texto)
    }

    
}
