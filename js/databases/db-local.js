
/*
    Course:     INFO6134 (Capstone Project)
    Term:       F23
    Professor:  Murilo Trigo
    Author:     Leonardo Antezana
    Notes:      This application uses some of the code and patterns learned in different classes.
*/

class NewsDB {
    DB_VERSION = 1;
    DB_NEWSLIST = 'DailyNewsList';
    DB_NEWSLIST_KEY = 'id'

    constructor(name) {
        this.db = null;
        this.isAvailable = false;
        this.DB_NAME = name;
    }

    open() {
        return new Promise( (resolve, reject) => {
            // Validates whether the indexedDB object is available.
            if (indexedDB) {
                // Opens/Creates the database
                const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

                // Handles the errors when opening/creating the database.
                request.onerror = (event) => {
                    reject(event.target.error.message);
                }

                // Handles the success when opening/creating the database.
                request.onsuccess = (event) => {
                    const db = event.target.result;
                    if (db) {
                        this.db = db;
                        this.isAvailable = true;
                        resolve(); // No need to return anything.
                    } else {
                        reject('The database is not available.');
                    }
                }

                // Handles the database upgrade. (When new or changing version).
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    const objectStore = db.createObjectStore(this.DB_NEWSLIST, { keyPath: this.DB_NEWSLIST_KEY })                    
                }
            } else {
                reject("Your browser doesn't support IndexDB.")
            }
        });
    }

    add(newsObject) {
        return new Promise( (resolve, reject) => {

            if (!this.isAvailable) {
                reject('Database not opened!');
            }

            // Transaction handlers.
            const transaction = this.db.transaction([this.DB_NEWSLIST], 'readwrite');
            transaction.onerror = (event) => {
                console.log("[Transaction] Error:", event);
                reject(event.target.error.message);
            }
            transaction.oncomplete = (event) => {
                // no need for this since we aren't handling many "objectStores".
            }

            // Store handlers.
            const store = transaction.objectStore(this.DB_NEWSLIST);

            // Getting the proper data into the database.
            let data = newsObject.getJSONobj();
            data.id = Date.now() + Math.floor(Math.random() * 1000);

            const storeRequest = store.add(data);

            storeRequest.onerror = (event) => {
                reject(event.target.error.message);
            }
            storeRequest.onsuccess = (event) => {
                resolve(event.target.result);
            }
        });

    }

    getAll() {
        return new Promise( (resolve, reject) => {

            if (!this.isAvailable) {
                reject('Database not opened!');
            }

            // Transaction handlers.
            const transaction = this.db.transaction([this.DB_NEWSLIST], 'readonly');
            transaction.onerror = (event) => {
                reject(event.target.error.message);
            }

            transaction.oncomplete = (event) => {  }

            // Store handlers.
            const store = transaction.objectStore(this.DB_NEWSLIST);
            const request = store.getAll();

            request.onerror = (event) => {
                reject(event.target.error.message);
            }

            request.onsuccess = (event) => {
                resolve(event.target.result);
            }
        })
    }

    get(id) {
        return new Promise( (resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database not opened!');
            }

            // Transaction handlers.
            const transaction = this.db.transaction([this.DB_NEWSLIST], 'readonly');
            transaction.onerror = (event) => {
                reject(event.target.error.message);
            }

            transaction.oncomplete = (event) => {  }

            // Store handlers.
            const store = transaction.objectStore(this.DB_NEWSLIST);
            const request = store.get(id);

            request.onerror = (event) => {
                reject(event.target.error.message);
            }

            request.onsuccess = (event) => {
                resolve(event.target.result);
            }

        });
    }    

    update(updatedNews) {
        
        return new Promise( (resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database not opened!');
            }

            // Transaction handlers.
            const transaction = this.db.transaction([this.DB_NEWSLIST], 'readwrite');
            transaction.onerror = (event) => {
                reject(event.target.error.message);
            }

            transaction.oncomplete = (event) => {  }

            // Get the store we need and update it.
            const store = transaction.objectStore(this.DB_NEWSLIST);
            const request = store.put(updatedNews);

            request.onerror = (event) => {
                reject(event.target.error.message);
            }

            request.onsuccess = (event) => {
                resolve();
            }
        });
    }

    clear() {
        return new Promise( (resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database not opened!');
            }

            // Transaction handlers.
            const transaction = this.db.transaction([this.DB_NEWSLIST], 'readwrite');
            transaction.onerror = (event) => {
                reject(event.target.error.message);
            }

            transaction.oncomplete = (event) => { }
            
            const store = transaction.objectStore(this.DB_NEWSLIST);
            const request = store.clear();

            request.onerror = (event) => {
                reject(event.target.error.message);
            }

            request.onsuccess = (event) => {
                resolve();
            }
        });
    }

    delete(id) {
        return new Promise( (resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database not opened!');
            }

            // Transaction handlers.
            const transaction = this.db.transaction([this.DB_NEWSLIST], 'readwrite');
            transaction.onerror = (event) => {
                reject(event.target.error.message);
            }

            transaction.oncomplete = (event) => {  }

            // Get the store we need and update it.
            const store = transaction.objectStore(this.DB_NEWSLIST);
            const request = store.delete(id);

            request.onerror = (event) => {
                reject(event.target.error.message);
            }

            request.onsuccess = (event) => {
                resolve();
            }
        });
    }
}

// Exporting the Class.
export default NewsDB;

// Export default database names.
export const CACHEDB_NAME = "NewsCache";
export const NEWSLISTDB_NAME = "NewsList";
