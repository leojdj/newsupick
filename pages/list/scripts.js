
/*
    Course:     INFO6134 (Capstone Project)
    Term:       F23
    Professor:  Murilo Trigo
    Author:     Leonardo Antezana
    Notes:      This application uses some of the code and patterns learned in different classes.
*/

import { jsonToArray, userMessage } from "./../../js/utilities.js";
import NewsDB from "./../../js/databases/db-local.js";

import { NEWSLISTDB_NAME } from "./../../js/databases/db-local.js";

let newsDB = new NewsDB(NEWSLISTDB_NAME)

var newsArray = [];

window.addEventListener('load', () => {    
    newsDB.open()
        .then( async () => {
            try {
                let results = await newsDB.getAll();
                                
                console.log(results);
                newsArray = jsonToArray(results, false);
                console.log(newsArray);
                displayNewsList();
            } catch(e) {
                console.log("[DB] Error fetching news from the database.", e);
            }
        
        })
        .catch( (error) => {
            console.log("[DB]: Error opening the cloud database.");
        });    
});

function displayNewsList() {
    let listContainer = document.getElementById("dailynews-page-container");

    if (newsArray.length == 0) {
        userMessage("No Saved News", "Save Your Favourite News to List Them Here", false);
        return
    }

    for (let article of newsArray) {
        listContainer.append(article.displayNewsItem( () => { onClickItem(article) }));        
    }

    createModal()
}


// Modal Functionality (Ideas: W3School, FreeCodeCamp)
function onClickItem(news) {
    let modalContainer = document.getElementById("modal-overlay")
    modalContainer.style.display = "block"

    news.displayNews(true)
}

function closeModal() {
    let modalContainer = document.getElementById("modal-overlay")
    modalContainer.style.display = "none"
}

function createModal() {
    let outermostContainer = document.getElementById("dailynews-page-container")

    let modalContainer = document.createElement('div')

    modalContainer.innerHTML = `
        <div id="modal-overlay" class="modal-overlay">
            <div class="modal-content">
                <div id="dailynews-page-usemodal">
                </div>
                <div class="modal-button-container">
                    <button id="modal-button" class="modal-button-close">Close</button>
                </div>
            </div>
        </div>        
    `;

    outermostContainer.append(modalContainer)

    let closeModalButton = document.getElementById("modal-button")
    closeModalButton.addEventListener("click", closeModal)
}
