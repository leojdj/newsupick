
/*
    Course:     INFO6134 (Capstone Project)
    Term:       F23
    Professor:  Murilo Trigo
    Author:     Leonardo Antezana
    Notes:      This application uses some of the code and patterns learned in different classes.
*/

import News from "./News.js";

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

// Present a message to the user when needed. Below the nav buttons for News items.
export function userMessage(title, message, timer = true) {
    let messageContainer = document.getElementById("dailynews-bottom-container");
    if (message.length > 0) {
        messageContainer.innerHTML = `
            <div class='user-message'>
                <h3>${title}</h3>
                <p>${message}.</p>
            </div>
        `
        if (timer) {
            setTimeout( () => { clearUserMessage(); }, 3000); 
        }
    } else {
        messageContainer.innerHTML = "";
    }
}

// Support function for clarity of purpose.
export function clearUserMessage() {
    userMessage("", "");
}

// Parse YYYY-MM-DDTHH:MM:SSZ to just the date portion
function parseDate(dateISO) {
    return dateISO.substring(0, dateISO.indexOf("T"))
}

// Verifies if the data in the Cache is empty or from today, which would make it stale
export function cacheIsStale(cache) {
    let today =  new Date().toISOString()
    today = parseDate(today)   

    for (let article of cache) {        
        if (today.localeCompare(parseDate(article.getFetchDate())) == 0) {
            return false
        }
    }
    return true
}

// Pass the articles data to a memory array structure (whether from Fetch or Database).
export function jsonToArray(jsonObjectList, isFetch = true) {
    let articles = jsonObjectList;
    let newsArray = [];

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
            newsArray[newsArray.length-1].setFetchDate(article.fetchDate);
        }
    }
    return newsArray;
}
