
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

/**
 * Data fetching from API
 */

const IS_ON_MANUAL_FETCH = true;

// Returns true if the device's connection qualifies as good.
export function isGoodConnection() {    
    const acceptedSpeeds = ['2g', '3g', '4g'];

    // Check that the Connection feature exists in Device/Browser
    if ('connection' in navigator) {
        const NetworkInformation = navigator.connection;
        if ((NetworkInformation.downlink >= 1) 
            && (acceptedSpeeds.includes(NetworkInformation.effectiveType))) {            
                return true;
        }
    }
    return false;
}

// Toggle the state of the Manual News Fetch icon. Right most on the nav for News items.
export function setFetchButtonState(manual) {
    let buttonManualFetch = document.getElementById("dailynews-page-button-manual");
    let buttonIcon = document.getElementById("dailynews-page-button-auto-icon");
    let text = document.getElementById("dailynews-page-button-auto-text");
    if (manual) {
        buttonIcon.innerText = "download";
        text.innerText = "GET NEWS"
    } else {
        buttonIcon.innerText = "autorenew";
        text.innerText = "AUTO"
    }
    buttonManualFetch.disabled = !manual;
}

// Present a message to the user when needed. Below the nav buttons for News items.
export function userMessage(title, message) {
    let messageContainer = document.getElementById("dailynews-bottom-container");
    if (message.length > 0) {
        messageContainer.innerHTML = `
            <div class='user-message'>
                <h3>${title}</h3>
                <p>${message}.</p>
            </div>
        `
    } else {
        messageContainer.innerHTML = "";
    }
}

// Support function for clarity of purpose.
export function clearUserMessage() {
    userMessage("", "");
}

// ENTRY POINT INTO THE APP
// Check that the device is online
if (navigator.onLine) {
    if (isGoodConnection()) {
        console.log("automatic: fetching data from news io");                    
        fetchNews(); 
    } else {
        setFetchButtonState(IS_ON_MANUAL_FETCH);
        userMessage("Manual Fetch: Active", "Connection is slow. Please click on the (GET NEWS) button");
    }
} else {
    userMessage("Device Is Offline", "Cannot fetch news at the moment, please try again later");
    disableNewsNavButtons();
}

// Get News from News API.
function fetchNews() {
    let targetUrl = 'http://10.0.2.2:3001/querynews/'

    fetch(targetUrl)
        .then( response => response.json() )
        .then( json => { 
            jsonToArray(json.articles);            
        });
}


/* END Data Fetching */


/* IN-MEMORY DATA OBJECTS */

var newsArray = [];

var trackPages = null;

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
