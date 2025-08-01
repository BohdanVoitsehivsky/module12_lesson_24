import './style.css'
import axios from 'axios'


// Створи фільмотеку з популярними фільмами, для цього використай
// https://developer.themoviedb.org/reference/trending-movies

// Щоб отримати постер фільму потрібно підставити url з відповіді від бекенду та url з документації
// https://developer.themoviedb.org/docs/image-basics

// Відмалюй картки з фільмами
// Приклад картки  => https://prnt.sc/Hi_iLLg7Nd1F

// Реалізуй пагінацію
// 1 Кнопка "Load More"
// 2 Infinity scroll (https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

const BASE_URL = "https://api.themoviedb.org/3";
const END_POINT = "/trending/movie/week";
const API_KEY = "345007f9ab440e5b86cef51be6397df1";


// const container = document.querySelector(".js-movie-list");
const loadMore = document.querySelector(".js-load-more");

// let page = 1;

// loadMore.addEventListener("click", onLoadMore);

// async function serviceMovie(page = 1) {
//     const { data } = await axios(`${BASE_URL}${END_POINT}`, {
//         params: {
//             api_key: API_KEY,
//             page: page
//         }
//     });
//     return data;
// }


// serviceMovie(page)
//     .then(res => {
//         console.log(res);
//         container.insertAdjacentHTML("beforeend", createMarkup(res.results));

//         if(res.page < res.total_pages) {
//             loadMore.classList.replace("load-more-hidden", "load-more");
//         }
//     })
//     .catch(error => {
//         console.log(error.message);
//     })

// function createMarkup(arr) {
//     return arr.map(({ poster_path, release_date, original_title, vote_average }) => {
//         return `
//             <li class="movie-card">
//                 <img src="https://image.tmdb.org/t/p/w300${poster_path}" alt="${original_title}"/>
//                 <div class="movie-info">
//                     <h2>${original_title}</h2>
//                     <p>Release Date: ${release_date}</p>
//                     <p>Vote Average: ${vote_average}</p>
//                 </div>
//             </li>
//         ` 
//     }).join("");
// }

// async function onLoadMore() {
//     page++;
//     loadMore.disabled = true;

    
//     try {
//         const data = await serviceMovie(page);
//         container.insertAdjacentHTML("beforeend", createMarkup(data.results));

//         if(data.page >= data.total_pages) {
//             loadMore.classList.replace("load-more", "load-more-hidden");
//         }

        // const card = document.querySelector(".movie-card");
        // const cardHeight = card.getBoundingClientRect().height;

        // window.scrollBy({
        //     left: 0,
        //     top: cardHeight,
        //     behavior: "smooth"
        // })
//     } catch(error) {
//         alert(error.message);
//     } finally {
//         loadMore.disabled = false;
//     }

// }





// --------------------------------------------------

const container = document.querySelector(".js-movie-list");
const guard = document.querySelector(".js-guard");

let page = 500;

const options = {
  root: null,
  rootMargin: "300px",
  threshold: 0,
};

const observer = new IntersectionObserver(handlerPagination, options);


async function serviceMovie(page = 1) {
    const { data } = await axios(`${BASE_URL}${END_POINT}`, {
        params: {
            api_key: API_KEY,
            page
        }
    });
    return data;
}

function createMarkup(arr) {
    return arr.map(({ poster_path, release_date, original_title, vote_average }) => {
        return `
            <li class="movie-card">
                <img src="https://image.tmdb.org/t/p/w300${poster_path}" alt="${original_title}"/>
                <div class="movie-info">
                    <h2>${original_title}</h2>
                    <p>Release Date: ${release_date}</p>
                    <p>Vote Average: ${vote_average}</p>
                </div>
            </li>
        `
    }).join("");
}

serviceMovie(page)
    .then((data) => {
        container.insertAdjacentHTML("beforeend", createMarkup(data.results));
        
        if(data.page < data.total_pages) {
            observer.observe(guard);
        }
    })
    .catch((error) => {
        console.log(error.message);
    })


function handlerPagination(entries, observer) {
    entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
            page++;
            
            try {
                const data = await serviceMovie(page);                
                container.insertAdjacentHTML("beforeend", createMarkup(data.results));

                if(data.page >= data.total_pages) {
                    observer.unobserve(guard);
                }
            } catch(error) {
                alert(error.message);
            }
        }
    })
}