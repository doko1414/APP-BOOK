const URL_BOOK="https://potterapi-fedeperin.vercel.app/en/books"; //almacena la URL de una API sobre libros de Harry Potter.

async function getBooks() { //este getbook va tener una url para consultar que sera la constante URL
    const response=await fetch(URL_BOOK);//solicitud HTTP a la URL especificada. await se usa para esperar la respuesta de esa solicitud antes de continuar con el siguiente paso.
    const data=await response.json();//await response.json() procesa la respuesta y extrae los datos en formato JSON.
    //La respuesta de fetch es un objeto Response, por lo que hay que convertirlo a JSON para poder trabajar con los datos.
    return data;//La variable data contendrá un array de objetos con información sobre los libros de Harry Potter.Devuelve los datos obtenidos de la API.
};
function setLocalStorage(key,quantity){
    //localStorage.setItem('app_book_quantity',quantity);
    localStorage.setItem(key,quantity);
}
function getLocalStorage(key){
    return localStorage.getItem(key);
}
document.addEventListener('DOMContentLoaded',async function() {
    const ICON_SHOPPING=document.getElementById('shopping_cart');
    ICON_SHOPPING.setAttribute('data-badge', getLocalStorage('app_book_quantity') ||0);
    const LISTBOOKS=JSON.parse(getLocalStorage("app_book_details")) || [];
    const PAGE_CONTENT=document.querySelector('.page-content');
    PAGE_CONTENT.innerHTML='Cargando libros';
    const books=await getBooks();
    let htmlString='';
    books.forEach(book => {
        const bookElement = `
          <div class="demo-card-wide mdl-card mdl-shadow--2dp">
              <div class="mdl-card__title" style="background: url('${book.cover}') center/cover">
                <h2 class="mdl-card__title-text" data-title = "${book.title}" data-description = "${book.description}">${book.title}</h2>
              </div>
              <div class="mdl-card__supporting-text">
                ${book.description.substring(0,100)}...
              </div>
              <div class="mdl-card__actions mdl-card--border">
                <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
                  comprar este libro ${book.releaseDate}
                </a>
              </div>
              <div class="mdl-card__menu">
                <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                  <i class="material-icons">share</i>
                </button>
              </div>
            </div>
        `;
        htmlString+=bookElement;
        //PAGE_CONTENT.appendChild(bookElement);
    });
    
        PAGE_CONTENT.innerHTML=htmlString;
        const buttons=document.querySelectorAll(".mdl-button--colored");
        buttons.forEach(button=>{
            const title=button.parentElement.parentElement.querySelector('.mdl-card__title-text').getAttribute('data-title');
            console.log("boton anterior"+ title)
            const description=button.parentElement.parentElement.querySelector('.mdl-card__title-text').getAttribute('data-description');
            button.addEventListener('click',()=>{
                const quantity= +ICON_SHOPPING.getAttribute('data-badge') || 0;
                console.log(quantity);
                ICON_SHOPPING.setAttribute('data-badge', quantity + 1);
                setLocalStorage('app_book_quantity',quantity+1);
               
                const bookObject={
                    title:title,
                    description:description,
                    date:new Date().getTime()
                };
                LISTBOOKS.push(bookObject);
                setLocalStorage('app_book_details',JSON.stringify(LISTBOOKS));//
            })
        })
        //aplicando la web share api
        const shareIcons=document.querySelectorAll('.mdl-button--icon');
        shareIcons.forEach(shareIcon=>{
          const title= shareIcon.parentElement.parentElement.querySelector(".mdl-card__title-text").getAttribute('data-title');
          const description=shareIcon.parentElement.parentElement.querySelector(".mdl-card__title-text").getAttribute('data-description');
          const shareObjet={
            title:title,
            description:description,
            url: ""
          };
          shareIcon.addEventListener("click", async ()=>{
            try {
              await navigator.share(shareObjet);
              console.log("MDN shared successfully");
            } catch (err) {
              alert(`Error: ${err}`);
            }
          })
        })
        

});
/*
          
*/