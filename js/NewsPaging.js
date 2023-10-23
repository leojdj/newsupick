
/*
    Course:     INFO6134 (Capstone Project)
    Term:       F23
    Professor:  Murilo Trigo
    Author:     Leonardo Antezana
    Notes:      This application uses some of the code and patterns learned in different classes.
*/

// A class to handle the paging logic around the data received for the Home page.
export default class NewsPaging {   
    constructor(number) {
        this.number = number;        
        this.active = 0;

        this.idName = "news-page";
        this.className = "dailynews-pagenumber";
        this.classActive = "dailynews-pageactive";        
    }

    getActive() {
        return this.active;
    }

    previousPage() {             
        let previousActive = this.active;        
        if (this.active > 0) {
            this.active -= 1;
            this.togglePageNumbers(previousActive, this.active);
            return true;
        }        
        return false;
    }

    nextPage() {        
        let previousActive = this.active;        
        if (this.active < (this.number - 1) ) {
            this.active += 1;
            this.togglePageNumbers(previousActive, this.active);
            return true;
        }        
        return false;
    }

    togglePageNumbers(disable, enable) {        
        let activePageElement = document.getElementById(this.idName + disable);
        this.toggleActive(activePageElement, false);

        let newActivePageElement = document.getElementById(this.idName + enable);
        this.toggleActive(newActivePageElement, true);
    }

    // Resets the class of a "page number" DOM element. Adds "active" class when needed.
    toggleActive(uiElement, active) {        
        uiElement.className = this.className
        if (active) {
            uiElement.className += ` ${this.classActive}`;
        }
    }

    displayPageNumbers() {
        var newsPagingContainer = document.getElementById("dailynews-pagenumber-container");
        var htmlText = "";
        for (let i=0; i < this.number; i++) {
            let activePage = (i==this.active)? this.classActive: "";
            htmlText += `
                <div id="${this.idName}${i}" class="${this.className} ${activePage}">${i}</div>
            `
        }
        newsPagingContainer.innerHTML = htmlText;
    }   

    // Support function to handle the logic around Favourites.
    static displayPageNumbersEmpty() {
        var newsPagingContainer = document.getElementById("dailynews-pagenumber-container");
        newsPagingContainer.innerHTML = "";
    }
}