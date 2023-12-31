
/*
    Course:     INFO6134 (Capstone Project)
    Term:       F23
    Professor:  Murilo Trigo
    Author:     Leonardo Antezana
    Notes:      This application uses some of the code and patterns learned in different classes.
*/

import DeleteListItem from "./DeleteListItem.js";

// A class to handle all internal data management of a News instance.
// Only "favourite" is a parameter that will be updated.

export default class News {
    NO_DATA = "No Data Available";
    UNKNOWN = "Unknown";

    constructor(urlToImage, title, sourceName, author, publishedAt, content) {
        this.urlToImage = urlToImage? urlToImage: "images/no_image_available.png";
        this.title = title? title: this.NO_DATA;
        this.sourceName = sourceName? sourceName: this.UNKNOWN;
        this.author = author? author: this.UNKNOWN;
        this.publishedAt = publishedAt? this.dateParse(publishedAt, "t"): this.UNKNOWN;
        this.content = content? this.contentParse(content): this.NO_DATA;
        this.favourite = false;
        this.id = 0;
        this.fetchDate = this.dateParse(new Date().toISOString())
    }

    // Removes the .999 milliseconds of a Date/Time or the Time from a Date
    // filterType = ms, default, remove the milliseconds.
    // date = date/time to parse.
    dateParse(date, filterType = "ms") {
        // Date is already in needed format.
        if (date.length == 10) {
            return date;
        }

        let filterChar = ".";
        let tailText = "Z";

        if (filterType.localeCompare("ms") != 0) {
            filterChar = "T";
            tailText = "";
        }       

        date = date.substring(0, date.indexOf(filterChar)) + tailText;    
        return date;
    }

    // Parse content field for character count.
    contentParse(rawString) {
        let indexEnd = rawString.indexOf("[");

        if (indexEnd == -1) {
            return rawString;
        }

        let parsedString = rawString.substring(0, indexEnd - 2) + " [ ... ]";
        
        return parsedString;
    }

    getReleaseDate() {
        return this.getReleaseDate;
    }

    getFetchDate() {
        return this.fetchDate;
    }

    setFetchDate(fetchDate) {
        this.fetchDate = fetchDate;
    }

    toggleFavourite() {
        this.favourite = !this.favourite;        
    }

    setFavourite(isFavourite) {
        this.favourite = isFavourite;
    }

    getJSONobj() {
        return {
            urlToImage: this.urlToImage,
            title: this.title,
            sourceName: this.sourceName,
            author: this.author,
            publishedAt: this.publishedAt,
            content: this.content,
            favourite: this.favourite,
            fetchDate: this.fetchDate
        }
    }   
    
    getDate() {
        return this.publishedAt;
    }

    // Required to delete from Local Db.
    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }    

    // Directly displays the data into the received DIV element.
    // Parameter helps determine if to find a normal (or modal) container as the target of the detailed view.
    displayNews(useModal = false) {     
        let containerName = useModal ? "dailynews-page-usemodal" : "dailynews-page-container"
        var newsContainer = document.getElementById(containerName);

        var htmlText = `
            <div class="dailynews-page-image-container"><img src="${this.urlToImage}" alt="${this.sourceName}"></div>
            <div><h3>${this.title}</h3></div>
            ${(this.favourite)? '<div><p class="dailynews-page-isfavourite">Favourite</p></div>' : '' }
            <div class="dailynews-page-section">Source: 
                <span>${this.sourceName}</span>
            </div>
            <div class="dailynews-page-section">Author: 
                <span>${this.author}</span>
            </div>
            <div class="dailynews-page-section">Published At: 
                <span>${this.publishedAt}</span>
            </div>
            <div class="dailynews-page-section">Content
                <p>${this.content}</p>
            </div>
        `;
        newsContainer.innerHTML = htmlText;       
    }

    // Returns a structured block to append to a list of news.
    // Parameter is a callback fn to handle the Item-click, opens the modal with a detailed view of the News. 
    displayNewsItem(onClickItem) {
        let newDiv = document.createElement("div");
        newDiv.className = "news-item-container";

        // Fix for "clicking on trashcan displays the modal".
        let newsObject = document.createElement("div");
        newsObject.className = "news-item-object"
        newsObject.addEventListener("click", onClickItem);

        let htmlText = `            
            <div class="news-item-title text-overflow"><h3>${this.title}</h3></div>
            <div class="news-item-label-container">                                
                <div class="news-item-label">Source: 
                    <span>${this.sourceName}</span>
                </div>
                <div class="news-item-label">Author: 
                    <span>${this.author}</span>
                </div>                                
                <div class="news-item-label">|
                    <span class="news-item-date">${this.getDate()}</span>
                </div>
            </div>            
        `;

        // Fix for "clicking on trashcan displays the modal".
        newsObject.innerHTML = htmlText;
        newDiv.append(newsObject);        

        // Create the DIV with the icon and the function callback to delete the corresponding News item by its id.
        let deleteDiv = document.createElement('div')
        deleteDiv.className = "news-item-icon"
        deleteDiv.onclick = () => { DeleteListItem.deleteItem(this.id) }
        deleteDiv.innerHTML = '<span class="material-symbols-outlined">delete</span>'    

        newDiv.append(deleteDiv);
        return (newDiv);        
    }    

    // Support function for the functionality of the Favourite button.
    static displayNewsEmpty() {
        var newsContainer = document.getElementById("dailynews-page-container");
        newsContainer.innerHTML = "";
    }    
}
