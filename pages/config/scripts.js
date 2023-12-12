
/*
    Course:     INFO6134 (Capstone Project)
    Term:       F23
    Professor:  Murilo Trigo
    Author:     Leonardo Antezana
    Notes:      This application uses some of the code and patterns learned in different classes.
*/

import { userMessage } from "../../js/utilities.js";
import NewsDB from "../../js/databases/db-local.js";

import { NEWSLISTDB_NAME } from "../../js/databases/db-local.js";

window.addEventListener('load', () => {   
    displayClearListButton();   
});

function displayClearListButton() {
    let listContainer = document.getElementById("dailynews-page-container");

    //External div:row:wrapper
    let divWrapper = document.createElement('div');
    divWrapper.className = "aboutpage-row-wrapper";

    //Internal div:column:wrapper
    let div = document.createElement('div');
    div.className = "aboutpage-button-wrapper";

    //Internal element:button
    let button = document.createElement('button');
    button.className = "aboutpage-deletedb-button";
    button.innerHTML = "Empty the News List";
    button.addEventListener('click', deleteNewsDataPressed);

    //Add element into internal:container:div
    div.append(button);

    //Add element into external:container:div
    divWrapper.append(div);

    //Internal div:column:wrapper
    div = document.createElement('div');
    div.className = "aboutpage-text-cell";
    
    //Internal element:Text
    let text = document.createElement('p');
    text.innerText = "Clicking on this button will delete all the saved News.";

    //Add element into internal:container:div
    div.append(text);

    //Add element into external:container:div
    divWrapper.append(div);

    //Add row into container:div
    listContainer.append(divWrapper);    
}

function deleteNewsDataPressed() {
    console.log("clicked delete");
    if (!confirm("ATTENTION!: Deleting cannot be reversed.\nDo you want to Continue?")) {
        return
    }

    let newsDB = new NewsDB(NEWSLISTDB_NAME)
        newsDB.open()
            .then( async () => {
                await newsDB.clear()
            })
            .catch( (e) => {
                console.log("[DB]: Issue opening the local database.", e)
            })
    userMessage("News Deleted", "Data Has Been Cleared. List is Empty");
}
