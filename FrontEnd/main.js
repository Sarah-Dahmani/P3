
getWorks(0); // (0) pour obtenir tous les travaux au démarrage
getFilters();

async function getFilters() {
//ron récupère les différentes catégories via un appel à l'API
    const response = await fetch("http://localhost:5678/api/categories");
//la réponse se transforme en langage json
    const filters = await response.json();

//on récupère les différentes catégories
    let filtersElements = document.getElementsByClassName("filters")[0];

//cette option permet d'afficher toutes les catégories par défaut
    let div = document.createElement("div");
//on ajoute une class au div des filtres
    div.classList.add("category-item");
//on ajoute une class active par défaut
    div.classList.add("active");
//on ajoute la catégorie "Tous"
    div.innerText = "Tous";
//on ajoute un id à la catégorie "Tous"
    div.id = "category-0";
//on ajoute la propriété dataset.id aux éléments filtres, id="category-1", un id est unique, 
    div.dataset.id = 0;
//on ajoute des div dans filtersElements
    filtersElements.appendChild(div);
//on ajoute un écouteur d'événement "click" sur les div des filtres
    div.addEventListener("click", onCategoryClick);

//on vient créer une boucle pour les différents éléments de la liste
for (const category of filters) {
    //on vient créer un élément de la liste ul écrite en html
    let div = document.createElement("div");
    div.classList.add("category-item");
    //on vient attribuer "category.name" au contenu du li
    div.innerText = category.name;
    //id unique
    div.id = "category-" + category.id;
    div.dataset.id = category.id;
    //on ajoute l'élément li à la liste ul
    filtersElements.appendChild(div);
    //on écoute l'événement click lorsque l'utilisateur clique sur les div filtres
    div.addEventListener("click", onCategoryClick);
  }
}

//action de filtrage avec l'événement 
//on vient créer la fonction événément qui peut être écouter lors d'un clic
function onCategoryClick(event) {
    const idCategory = event.target.dataset.id;
    //on vient créer un tableau avec le paramètre idCategory ce qui prend en compte la catégorie active en cours
    getWorks(idCategory);
    //on récupére tous les éléments avec la classe category-item
    const filtersItems = document.getElementsByClassName("category-item");
    for(let item of filtersItems) {
    //on retire la classe active à tous les éléments
        item.classList.remove("active");
    }
    //pour garder seulement le filtre actif
    event.target.classList.add("active");

}

//on ajoute une fonction pour créer la liste des Works en utilisant le paramètre "idCategory" - idCategory est lié aux éléments Works
async function getWorks(idCategory) {
    //on va chercher le tableau des différents travaux sur l'API
    const result = await fetch(`http://localhost:5678/api/works`);
    works = await result.json();
    console.log("Résultats API");   
    //console.log(Results);

    //si la catégorie n'est pas égale à 0
    if (idCategory != 0) {
    //alors on filtre le tableau works pour donner comme réponse l'idCategory de chaque élément work
      works = works.filter((work) => work.categoryId == idCategory);
    }
    let gallery = document.getElementsByClassName("gallery")[0];

    //on vide la page entièrement
    gallery.innerHTML = "";
    //pour chaque work dans du tableau
    for (const work of works) {
    //on construit un element figureElement
    let figureElement = document.createElement("figure");
  
    //on construit un element img, que l'on ajoute à figureElement
    let imgElement = document.createElement("img");
    //on donne une propriété à l'élément 
    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;
    //on rattache l'élément à son parent
    figureElement.appendChild(imgElement);
  
    //on construit un element fig caption, que l'on ajoute à figureElement
    let figCaptionElement = document.createElement("figcaption");
    //on donne une propriété à l'élément 
    figCaptionElement.innerText = work.title;
    //on rattache l'élément à son parent
    figureElement.appendChild(figCaptionElement);
  
    //on rattache figureElement à .gallery
    gallery.appendChild(figureElement);
    }
}

