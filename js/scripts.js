
/*
    Course:     INFO6134 (Capstone Project)
    Term:       F23
    Professor:  Murilo Trigo
    Author:     Leonardo Antezana
    Notes:      This application uses some of the code and patterns learned in different classes.
*/

import News from "./News.js";
import NewsPaging from "./NewsPaging.js";

import { API_KEY } from "../secrets/config.js";

/* IN-MEMORY DATA OBJECTS */

var newsArray = [];

var trackPages = null;

/* MOCK DATA & CALLS SECTION: Trigger the visualization feature */

let article1 = {
      source: {
        id: "",
        name: "Cormier, Sanford and Kautzer"
      },
      author: "Ila Nader",
      title: "Omnis iusto consequatur quae qui iure impedit provident nobis.",
      description: "Doloribus quidem quis exercitationem quasi culpa corporis.",
      url: "",
      urlToImage: "https://cataas.com/cat",
      publishedAt: "2023-10-22T23:41:10Z",
      content: "Quasi consectetur blanditiis nostrum saepe voluptatibus."
}

let article2 = {
      source: {
        id: "",
        name: "Schimmel LLC"
      },
      author: "Jenifer Powlowski",
      title: "Velit laborum dolorem magni.",
      description: "Perferendis rem explicabo reprehenderit quidem.",
      url: "",
      urlToImage: "https://cataas.com/cat",
      publishedAt: "2023-10-22T23:41:10Z",
      content: "Iure non culpa laboriosam nesciunt alias."
}

newsArray.push(article1);
newsArray.push(article2);
newsArray.push(article1);
newsArray.push(article2);
newsArray.push(article1);

jsonToArray(newsArray);

/* MOCK DATA & CALLS SECTION */

// Pass the articles data to memory array structure (whether from Fetch or Database).
function jsonToArray(jsonObjectList) {
    let articles = jsonObjectList;
    let isFetch = true;
    newsArray = [];

    // Extra filtering to generalize the function to handle fetched data from the API or from the database.    
    if (News.hasPlaceholder(articles)) {
        isFetch = false;
        articles.splice(News.getPlaceholderIndex(articles), 1); // The Today's Placeholder from DB is not needed. Remove from articles array.
    }    

    for (let article of articles) {        
        let sourceName = isFetch? article.source.name: article.sourceName;        

        newsArray.push(new News(
            article.urlToImage,
            article.title,
            sourceName,
            article.author,
            article.publishedAt,
            article.content
        ));      

        // When fetched from API default values work for id and favourite. Need to reasign them when from database.
        if (!isFetch) {
            newsArray[newsArray.length-1].setId(article.id);
            newsArray[newsArray.length-1].setFavourite(article.favourite);
        }
    }    
    
    initDisplay();
}

// Display initialization function. (Needed because of the promise nature of fetch).
function initDisplay() {
    if(newsArray.length > 0) {
        // Init the page numbers at the top.
        trackPages = new NewsPaging(newsArray.length);

        // In-memory data persistence and handling.    
        newsArray[0].displayNews();

        // Page number tracking, based on the number of news obtained "today".        
        trackPages.displayPageNumbers();
    } else {
       News.displayNewsEmpty();
       NewsPaging.displayPageNumbersEmpty();
       disableNewsNavButtons();
   }
}

// Support function to reduce code repetition.
function disableNewsNavButtons() {
    buttonPrev.disabled = true;
    buttonFav.disabled = true;
    buttonNext.disabled = true;
}

// Listeners and support functions for the News Navigation Buttons.

let buttonPrev = document.getElementById("dailynews-page-button-previous");        
buttonPrev.addEventListener('click', () => { previousPage(trackPages)} );

let buttonFav = document.getElementById("dailynews-page-button-fav");
buttonFav.addEventListener('click', () => { favouriteToggle(trackPages)} );

let buttonNext = document.getElementById("dailynews-page-button-next");
buttonNext.addEventListener('click', () => { nextPage(trackPages)} );

let buttonGetNews = document.getElementById("dailynews-page-button-manual");
buttonGetNews.addEventListener('click', () => { 
    fetchNews(); 
    clearUserMessage();
    buttonGetNews.disabled = IS_ON_MANUAL_FETCH;
 });

function previousPage(newsPaging) {
    if (newsPaging.previousPage()) {
        newsArray[newsPaging.getActive()].displayNews();
    }
}

function nextPage(newsPaging) {
    if (newsPaging.nextPage()) {
        newsArray[newsPaging.getActive()].displayNews();
    }
}

    
// ----- SERVICE WORKER: Registration ----
// Enabled as a module to allow for imports.

// Service Worker registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/service-worker.js', { scope: '/', type: 'module' })
        .then( (registration) => {
            console.log('[SW]: Register success:', registration);
        })
        .catch( (error) => {
            console.log('[SW]: Service Worker failed to register:', error);
        });
} else {
    console.log('[SW]: Service Worker is not supported by this browser.');
}