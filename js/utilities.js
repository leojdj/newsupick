
/*
    Course:     INFO6134 (Capstone Project)
    Term:       F23
    Professor:  Murilo Trigo
    Author:     Leonardo Antezana
    Notes:      This application uses some of the code and patterns learned in different classes.
*/

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
