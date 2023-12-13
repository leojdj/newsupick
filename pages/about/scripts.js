
/*
    Course:     INFO6134 (Capstone Project)
    Term:       F23
    Professor:  Murilo Trigo
    Author:     Leonardo Antezana
    Notes:      This application uses some of the code and patterns learned in different classes.
*/

// Returns the icon name of a given Tab from the navigation menu. To use in the menu descriptions.
function iconName(tabName) {
    switch(tabName) {
        case "Home": return "home";
        case "List": return "star";
        case "About": return "info";
        case "Config": return "tune";
    }
}

// Generic function to create a text block for the menu descriptions.
function descriptionDiv(tabName, textString) {
    let listContainer = document.getElementById("dailynews-page-container");

    //External div:row:wrapper
    let divWrapper = document.createElement('div');
    divWrapper.className = "aboutpage-row-wrapper";

    //Internal div:column:wrapper
    let div = document.createElement('div');

    if (tabName.length > 0) {
        // Internal div:column:left        
        div.className = "aboutpage-title-wrapper";

        //Add element into internal:menu button
        let innerHTML = `
            <div class="menu-option-wrapper" >
                <span class="material-symbols-outlined">${iconName(tabName)}</span>
                <span class="menu-option-text">${tabName}</span>
            </div>`;

        div.innerHTML = innerHTML;

        //Add element into external:container:div
        divWrapper.append(div);        
    }    

    //Internal div:column:wrapper
    div = document.createElement('div');
    div.className = "aboutpage-text-cell";
    
    //Internal element:Text
    let text = document.createElement('p');
    text.innerText = textString;

    //Add element into internal:container:div
    div.append(text);

    //Add element into external:container:div
    divWrapper.append(div);

    //Add row into container:div
    listContainer.append(divWrapper);    
}

// Menu descriptions.
descriptionDiv("", "NewsUPick is an App that allows the user to fetch news and save those that are of interest, to read at a later time.");

descriptionDiv("", "This App was created as part of the Capstone Project class for the Mobile Application Development Program at Fanshawe College (London, Ontario, Canada). Fall 2023.");

descriptionDiv("", "Version 1.0. December 2023.");

descriptionDiv("Home", "Presents a News browser where a limited number (5) of them is displayed for viewing. The Arrow-Buttons allow to navigate the News details. The Save button stores a News for later viewing. The Fetch button gets a new group of News.");

descriptionDiv("List", "Displays the saved News for viewing. The trashcan icon in each row allows to delete the News from the list (Warning: this operation cannot be undone). Clicking on a News item opens a detailed view of it with additional data.");

descriptionDiv("About", "Displays this page.");

descriptionDiv("Config", "Contains a button that allows to empty the List of saved News (Warning: this operation cannot be undone).");
