
/*
    Course:     INFO6134 (Capstone Project)
    Term:       F23
    Professor:  Murilo Trigo
    Author:     Leonardo Antezana
    Notes:      This application uses some of the code and patterns learned in different classes.
 */

    
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