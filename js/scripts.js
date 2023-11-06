
/*
    Course:     INFO6134 (Capstone Project)
    Term:       F23
    Professor:  Murilo Trigo
    Author:     Leonardo Antezana
    Notes:      This application uses some of the code and patterns learned in different classes.
*/

import News from "./News.js";
import NewsPaging from "./NewsPaging.js";

import NewsDB from "./databases/db-local.js";

import { isGoodConnection, userMessage, clearUserMessage } from "./utilities.js"; 
import { API_KEY } from "../secrets/config.js";

// DATABASE
/* Create the Cache and the My List databases */
let cacheDB = new NewsDB("NewsCache")
let newsDB = new NewsDB("NewsList")

let cacheResults = []

// ENTRY POINT INTO THE APP/Main Page
cacheDB.open()
    .then( async () => {
        console.log("[DB]: Fetching data.")
        // Get Cache database data if any exists.
        cacheResults = await cacheDB.getAll()
        
        // Transfer Cache data to internal News object list.
        jsonToArray(cacheResults, false)

        handleDbOrFetch()        
    })
    .catch( (e) => {
        console.log("[DB]: Issue opening the local database.", e)
    });

// Parse YYYY-MM-DDTHH:MM:SSZ to just the date portion
function parseDate(dateISO) {
    return dateISO.substring(0, dateISO.indexOf("T"))}

function cacheIsStale(cache) {
    let today =  new Date().toISOString()
    today = parseDate(today)   

    for (let article of cache) {        
        if (today.localeCompare(parseDate(article.getFetchDate())) == 0) {
            return false
        }
    }
    return true
}

// DATABASE

// Check if the Cache data is still valid. Or proceed to check if device is online to download.
function handleDbOrFetch() {    
    if(cacheIsStale(newsArray)) {
        if (navigator.onLine) {
            if (isGoodConnection()) {
                console.log("Data Source: News IO.");                    
                fetchNews();
            } else {                
                userMessage("Slow Connection", "Please click on the (FETCH) button.");
            }
        } else {
            userMessage("Device Is Offline", "Cannot fetch news at the moment, please try again later.");
            toggleNewsNavButtons();
        }
    } else {
        console.log("Data Source: Cache database.")
        initDisplay()
    }    
}

// Get News from News API.
function fetchNews() {
    let targetUrl = 'http://127.0.0.1:3001/querynews/'

    fetch(targetUrl)
        .then( response => response.json() )
        .then( async json => { 
            jsonToArray(json.articles);
            initDisplay()            
            
            try {
                await cacheDB.clear();

                // Add all fetched News to the Cache database. Clears any current stale data first.
                for (let article of newsArray) {                                      
                    let articleId = await cacheDB.add(article)                        
                    article.setId(articleId)                    
                }
            } catch(e) {
                console.log('[DB]: Error saving data to local database.')
            }
        });
}

/* END Data Fetching */


/* IN-MEMORY DATA OBJECTS */

var newsArray = [];

var trackPages = null;

// Pass the articles data to memory array structure (whether from Fetch or Database).
function jsonToArray(jsonObjectList, isFetch = true) {
    let articles = jsonObjectList;
    newsArray = [];

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
}

// Display initialization function. (Needed because of the promise nature of fetch).
function initDisplay() {    
    if(newsArray.length > 0) {
        if (buttonPrev.disabled) {
            toggleNewsNavButtons()
        }

        // Init the page numbers at the top.
        trackPages = new NewsPaging(newsArray.length);

        // In-memory data persistence and handling.    
        newsArray[0].displayNews();

        // Page number tracking, based on the number of news obtained "today".        
        trackPages.displayPageNumbers();
    } else {
       News.displayNewsEmpty();
       NewsPaging.displayPageNumbersEmpty();
       toggleNewsNavButtons();
   }
}

// Support function to reduce code repetition.
function toggleNewsNavButtons() {
    buttonPrev.disabled = !buttonPrev.disabled;
    buttonFav.disabled = !buttonFav.disabled;
    buttonNext.disabled = !buttonNext.disabled;    
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

function favouriteToggle(newsPaging) {
    newsArray[newsPaging.getActive()].toggleFavourite();
    newsArray[newsPaging.getActive()].displayNews();

    // A Favourite News is saved to the MyNews database. Otherwise it will be lost with the next News fetch.
    // Gets deleted from Cache DB and memory Array.
          
    newsDB.open()
        .then( async () => {
            console.log("[DB] Open: Success");
            
            await newsDB.add(newsArray[newsPaging.getActive()])
                
            userMessage("Saving Favourite", "It will be removed from the Today's Cache");                
                    
            let deleteId = newsArray[newsPaging.getActive()].getId();                
                    
            await cacheDB.delete(deleteId)
            newsArray.splice(newsPaging.getActive(), 1);
            setTimeout( () => { 
                clearUserMessage();
                initDisplay(); }, 0);
        })
        .catch( (error) => {
            console.log("[DB] Open: Error", error);
    });
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
