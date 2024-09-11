// Affichage initial des travaux et des filtres, qu'on soit connecté ou non
getFilters();
getWorks(0); // (0) pour obtenir tous les travaux au démarrage

// Fonction pour vérifier si l'utilisateur est connecté
function isLoggedIn() {
  return !!window.localStorage.getItem("token");
}

// Gestion de l'affichage du bandeau et du bouton de modification si connecté
const loggedIn = isLoggedIn();
document.getElementById("bandeau-id").style.display = loggedIn ? "flex" : "none";
document.getElementById("btn-modifier").style.display = loggedIn ? "flex" : "none";

// Récupération des différentes catégories via un appel à l'API
async function getFilters() {
  const response = await fetch("http://localhost:5678/api/categories");
  const filters = await response.json();

  // Ajout de l'objet "Tous" dans la liste des filtres
  filters.unshift({
    id: 0,
    name: "Tous"
  });

  let filtersElements = document.getElementById("filters-works");

  // Création des éléments de filtre
  for (const category of filters) {
    let div = document.createElement("div");
    div.classList.add("category-item");
    div.innerText = category.name;
    div.id = "category-" + category.id;
    div.dataset.id = category.id;
    filtersElements.appendChild(div);
    div.addEventListener("click", onCategoryClick);
  }
  // Ajout de la classe "active" au filtre "Tous" par défaut
  document.querySelector(".category-item[data-id='0']").classList.add("active");
}

// Fonction pour gérer l'événement de clic sur un filtre
function onCategoryClick(event) {
  const idCategory = event.target.dataset.id;
  getWorks(idCategory);

  // Gestion de l'affichage de l'état "actif" des filtres
  const filtersItems = document.getElementsByClassName("category-item");
  for (let item of filtersItems) {
    item.classList.remove("active");
  }
  event.target.classList.add("active");
}

// Fonction pour récupérer et afficher les travaux en fonction de la catégorie
async function getWorks(idCategory) {
  const result = await fetch(`http://localhost:5678/api/works`);
  let works = await result.json();
  console.log("Résultats API : ", works);

  // Filtrer les travaux si une catégorie spécifique est sélectionnée
  if (idCategory != 0) {
    works = works.filter((work) => work.categoryId == idCategory);
  }

  let gallery = document.getElementById("gallery-works");
  gallery.innerHTML = "";

  // Affichage des travaux
  for (const work of works) {
    let figureElement = document.createElement("figure");
  
    let imgElement = document.createElement("img");
    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;
    figureElement.appendChild(imgElement);
  
    let figCaptionElement = document.createElement("figcaption");
    figCaptionElement.innerText = work.title;
    figureElement.appendChild(figCaptionElement);
  
    gallery.appendChild(figureElement);
  }
}
