
/*
    Course:     INFO6134 (Capstone Project)
    Term:       F23
    Professor:  Murilo Trigo
    Author:     Leonardo Antezana
    Notes:      This application uses some of the code and patterns learned in different classes.
*/

// A class to handle all internal data management of a News instance.
// Only "favourite" is a parameter that will be updated.

export default class News {
    constructor(urlToImage, title, sourceName, author, publishedAt, content) {
        this.urlToImage = urlToImage? urlToImage: "images/no_image_available.png";
        this.title = title;
        this.sourceName = sourceName;
        this.author = author;
        this.publishedAt = publishedAt;
        this.content = content;
        this.favourite = false;
        this.id = 0;
        this.fetchDate = this.fetchDateParse()
    }

    fetchDateParse() {
        let date = new Date().toISOString()
        date = date.substring(0, date.indexOf(".")) + "Z"
        return date
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
        return this.publishedAt.substring(0, 10);
    }

    // Required to delete from Local Db.
    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    // Directly displays the data into the received DIV element.
    displayNews() {     
        var newsContainer = document.getElementById("dailynews-page-container");

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
    displayNewsItem() {
        let newDiv = document.createElement("div");
        newDiv.className = "news-item-container";

        let htmlText = `
            <div class="news-item-object">
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
            </div>
            <div class="news-item-icon">
                <span class="material-symbols-outlined">delete</span>
            </div>                
        `;
        newDiv.innerHTML = htmlText;
        return (newDiv);        
    }    

    // Support function for the functionality of the Favourite button.
    static displayNewsEmpty() {
        var newsContainer = document.getElementById("dailynews-page-container");
        newsContainer.innerHTML = "";
    }
}
