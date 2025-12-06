// Menú hamburguesa
document.getElementById("hamburger").addEventListener("click", function () {
    document.getElementById("navMenu").classList.toggle("active");
});

// Cerrar modal con la X
document.getElementById("modalClose").addEventListener("click", function () {
    document.getElementById("cocktailModal").classList.remove("active");
});

// Cerrar modal haciendo clic fuera
document.getElementById("cocktailModal").addEventListener("click", function (e) {
    if (e.target === this) {
        this.classList.remove("active");
    }
});

// Evento del botón buscar
document.getElementById("searchBtn").addEventListener("click", buscarCocktails);

// Enter para buscar
document.getElementById("searchInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        buscarCocktails();
    }
});

// Función principal de búsqueda
async function buscarCocktails() {
    const texto = document.getElementById("searchInput").value.trim();

    if (texto === "") {
        mostrarAlerta("Escribe un nombre para buscar", "warning");
        return;
    }

    document.getElementById("alertContainer").innerHTML = "";

    try {
        const respuesta = await fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + texto);
        const datos = await respuesta.json();

        if (datos.drinks === null) {
            mostrarAlerta("No hay resultados", "danger");
            document.getElementById("cocktailsContainer").innerHTML = "";
            return;
        }

        mostrarResultados(datos.drinks);

    } catch (err) {
        mostrarAlerta("Error al conectar con la API", "danger");
    }
}

// Mostrar las tarjetas
function mostrarResultados(lista) {
    const container = document.getElementById("cocktailsContainer");
    container.innerHTML = "";

    for (const item of lista) {
        const card = document.createElement("div");
        card.className = "cocktail-card";

        const img = document.createElement("img");
        img.src = item.strDrinkThumb;

        const body = document.createElement("div");
        body.className = "card-body";

        const titulo = document.createElement("h5");
        titulo.textContent = item.strDrink;

        const cat = document.createElement("p");
        cat.textContent = "Categoría: " + item.strCategory;

        const btn = document.createElement("button");
        btn.className = "btn-view-more";
        btn.textContent = "Ver más";
        btn.addEventListener("click", function () {
            mostrarModal(item);
        });

        body.append(titulo);
        body.append(cat);
        body.append(btn);

        card.append(img);
        card.append(body);

        container.append(card);
    }
}

// Mostrar modal
function mostrarModal(c) {
    const modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = "";

    const img = document.createElement("img");
    img.src = c.strDrinkThumb;
    img.className = "modal-image";

    const titulo = document.createElement("h2");
    titulo.textContent = c.strDrink;

    const cat = document.createElement("p");
    cat.innerHTML = "<strong>Categoría:</strong> " + c.strCategory;

    const alco = document.createElement("p");
    alco.innerHTML = "<strong>Tipo:</strong> " + c.strAlcoholic;

    const inst = document.createElement("p");
    inst.innerHTML = "<strong>Instrucciones:</strong> " + c.strInstructions;

    const ingTitulo = document.createElement("h4");
    ingTitulo.textContent = "Ingredientes:";

    const lista = document.createElement("ul");
    lista.className = "ingredients-list";

    for (let i = 1; i <= 15; i++) {
        const ing = c["strIngredient" + i];
        const cant = c["strMeasure" + i];

        if (ing) {
            const li = document.createElement("li");
            li.textContent = ing + " - " + (cant || "Al gusto");
            lista.append(li);
        }
    }

    modalBody.append(img);
    modalBody.append(titulo);
    modalBody.append(cat);
    modalBody.append(alco);
    modalBody.append(inst);
    modalBody.append(ingTitulo);
    modalBody.append(lista);

    document.getElementById("cocktailModal").classList.add("active");
}

// Botón cóctel aleatorio
document.getElementById("randomBtn").addEventListener("click", async function () {
    document.getElementById("alertContainer").innerHTML = "";

    try {
        const r = await fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php");
        const datos = await r.json();
        mostrarResultados(datos.drinks);
    } catch (err) {
        mostrarAlerta("No se pudo cargar un cóctel aleatorio", "danger");
    }
});

// Mostrar alertas simples con Bootstrap
function mostrarAlerta(msg, tipo) {
    const cont = document.getElementById("alertContainer");

    const div = document.createElement("div");
    div.className = "alert alert-" + tipo;
    div.textContent = msg;

    cont.append(div);
}