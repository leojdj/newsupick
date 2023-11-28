
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

import { NEWSLISTDB_NAME, CACHEDB_NAME } from "./databases/db-local.js";

import { isGoodConnection, userMessage, clearUserMessage, jsonToArray, cacheIsStale } from "./utilities.js"; 
import { API_KEY } from "../secrets/config.js";

// DATABASE
/* Create the Cache and the My List databases */
let cacheDB = new NewsDB(CACHEDB_NAME)
let newsDB = new NewsDB(NEWSLISTDB_NAME)

// Holds the in-memory list of Articles (with source database or response from fetch)) 
let newsArray = []

// ENTRY POINT INTO THE APP/Main Page
cacheDB.open()
    .then( async () => {
        console.log("[DB]: Fetching data.")
        // Get Cache database data if any exists.
        let cacheResults = await cacheDB.getAll()
        
        // Transfer Cache data to internal News object list.
        newsArray = jsonToArray(cacheResults, false)

        handleDbOrFetch()        
    })
    .catch( (e) => {
        console.log("[DB]: Issue opening the local database.", e)
    });

// Check if the Cache data is still valid. Or proceed to check if device is online to download.
function handleDbOrFetch() {    
    if(cacheIsStale(newsArray)) {
        if (navigator.onLine) {
            if (isGoodConnection()) {
                console.log("Data Source: News IO.");                    
                fetchNews();
            } else {                
                userMessage("Slow Connection", "Please click on the (FETCH) button");
            }
        } else {
            userMessage("Device Is Offline", "Cannot fetch news at the moment, please try again later");
            toggleNewsNavButtons();
        }
    } else {
        console.log("Data Source: Cache database.")
        initDisplay()
    }    
}

// Get News from News API.
function fetchNews() {
    //let targetUrl = 'http://127.0.0.1:3001/querynews/'
    //let targetUrl = 'http://10.0.2.2:3001/querynews/'    
    let targetUrl = 'https://newsapi.org/v2/top-headlines?category=technology&pageSize=5&country=us&apiKey=';
    

    fetch(targetUrl)
        .then( response => response.json() )
        .then( async json => { 
            newsArray = jsonToArray(json.articles);
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

var trackPages = null;

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
       
        userMessage("For More News", "Click the FETCH Button");
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
    if (navigator.onLine) {
        if (newsArray.length > 0) {
            if (!confirm("ATTENTION!: Today's News will be refreshed.\nDo you want to Continue?")) {
                return
            }
        }
        fetchNews();
    } else {
        userMessage("Device Is Offline", "Cannot fetch news at the moment, please try again later");
    }
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
            
            userMessage("Saving News...", "It will be removed from the Today's Browser", false);

            await newsDB.add(newsArray[newsPaging.getActive()]);
                    
            let deleteId = newsArray[newsPaging.getActive()].getId();                
                    
            await cacheDB.delete(deleteId)
            newsArray.splice(newsPaging.getActive(), 1);
            setTimeout( () => { 
                clearUserMessage();
                initDisplay(); }, 3000);            
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
