// ========== MENÚ HAMBURGUESA (SIN BOOTSTRAP) ==========
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Evento click para abrir/cerrar el menú
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Cerrar menú al hacer click en un enlace
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ========== VARIABLES GLOBALES ==========
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const randomBtn = document.getElementById('randomBtn');
const cocktailsContainer = document.getElementById('cocktailsContainer');
const alertContainer = document.getElementById('alertContainer');
const cocktailModal = document.getElementById('cocktailModal');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');

// ========== FUNCIONES DE BÚSQUEDA ==========

// Buscar cócteles por nombre
async function searchCocktails() {
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm === '') {
        showAlert('Por favor, escribe el nombre de un cóctel', 'warning');
        return;
    }

    try {
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`);
        const data = await response.json();
        
        if (data.drinks) {
            displayCocktails(data.drinks);
            clearAlert();
        } else {
            cocktailsContainer.innerHTML = '';
            showAlert('No se encontraron cócteles con ese nombre', 'info');
        }
    } catch (error) {
        showAlert('Error de conexión. Por favor, intenta de nuevo.', 'danger');
        console.error('Error:', error);
    }
}

// Obtener cóctel aleatorio
async function getRandomCocktail() {
    try {
        const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
        const data = await response.json();
        
        if (data.drinks) {
            displayCocktails(data.drinks);
            clearAlert();
        }
    } catch (error) {
        showAlert('Error de conexión. Por favor, intenta de nuevo.', 'danger');
        console.error('Error:', error);
    }
}

// ========== MOSTRAR RESULTADOS ==========

// Mostrar cócteles en tarjetas
function displayCocktails(cocktails) {
    cocktailsContainer.innerHTML = '';
    
    cocktails.forEach(cocktail => {
        const card = document.createElement('div');
        card.className = 'cocktail-card';
        
        card.innerHTML = `
            <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
            <div class="card-body">
                <h3 class="card-title">${cocktail.strDrink}</h3>
                <p class="card-category"><strong>Categoría:</strong> ${cocktail.strCategory}</p>
                <button class="btn-view-more" onclick="showCocktailDetails('${cocktail.idDrink}')">
                    Ver más
                </button>
            </div>
        `;
        
        cocktailsContainer.appendChild(card);
    });
}

// ========== MODAL DE DETALLES ==========

// Mostrar detalles del cóctel en modal
async function showCocktailDetails(id) {
    try {
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        
        if (data.drinks) {
            const cocktail = data.drinks[0];
            displayModal(cocktail);
        }
    } catch (error) {
        showAlert('Error al cargar los detalles', 'danger');
        console.error('Error:', error);
    }
}

// Generar contenido del modal
function displayModal(cocktail) {
    // Obtener ingredientes y medidas
    const ingredients = getIngredients(cocktail);
    
    modalBody.innerHTML = `
        <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" class="modal-image">
        <h2 class="modal-title">${cocktail.strDrink}</h2>
        
        <div class="modal-info">
            <strong>Categoría:</strong> ${cocktail.strCategory}
        </div>
        
        <div class="modal-info">
            <strong>Tipo:</strong> ${cocktail.strAlcoholic}
        </div>
        
        <div class="modal-info">
            <strong>Vaso:</strong> ${cocktail.strGlass}
        </div>
        
        <h3>Instrucciones:</h3>
        <p class="modal-instructions">${cocktail.strInstructions || 'No hay instrucciones disponibles'}</p>
        
        <h3>Ingredientes:</h3>
        <ul class="ingredients-list">
            ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
    `;
    
    // Mostrar modal con animación
    cocktailModal.classList.add('active');
}

// Obtener lista de ingredientes con medidas
function getIngredients(cocktail) {
    const ingredients = [];
    
    for (let i = 1; i <= 15; i++) {
        const ingredient = cocktail[`strIngredient${i}`];
        const measure = cocktail[`strMeasure${i}`];
        
        if (ingredient) {
            const text = measure ? `${measure} ${ingredient}` : ingredient;
            ingredients.push(text);
        }
    }
    
    return ingredients;
}

// Cerrar modal
function closeModal() {
    cocktailModal.classList.remove('active');
}

// ========== SISTEMA DE ALERTAS (Bootstrap) ==========

// Mostrar alerta
function showAlert(message, type) {
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}

// Limpiar alerta
function clearAlert() {
    alertContainer.innerHTML = '';
}

// ========== EVENT LISTENERS ==========

// Botón de búsqueda
searchBtn.addEventListener('click', searchCocktails);

// Enter en el input
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchCocktails();
    }
});

// Botón de cóctel aleatorio
randomBtn.addEventListener('click', getRandomCocktail);

// Cerrar modal
modalClose.addEventListener('click', closeModal);

// Cerrar modal al hacer click fuera
cocktailModal.addEventListener('click', (e) => {
    if (e.target === cocktailModal) {
        closeModal();
    }
});

// Cerrar modal con la tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cocktailModal.classList.contains('active')) {
        closeModal();
    }
});

// ========== INICIALIZACIÓN ==========
// Cargar un cóctel aleatorio al iniciar (opcional)
window.addEventListener('load', () => {
    console.log('Aplicación de cócteles cargada correctamente');
});