
/*
    Course:     INFO6134 (Capstone Project)
    Term:       F23
    Professor:  Murilo Trigo
    Author:     Leonardo Antezana
    Notes:      This application uses some of the code and patterns learned in different classes.
*/

import NewsDB from "./databases/db-local.js"

import { NEWSLISTDB_NAME } from "./databases/db-local.js"

/**
 * This helper class contains the callback for the delete action on a News from the List.
 * The call is created dynamically during the generation of the News list elements.
 */
export default class DeleteListItem {
    static deleteItem(id) {
        if (!confirm("ATTENTION!: Deleting cannot be reversed.\nDo you want to Continue?")) {
            return
        }

        let newsDB = new NewsDB(NEWSLISTDB_NAME)
        newsDB.open()
            .then( async () => {
                await newsDB.delete(id)
                location.reload()
            })
            .catch( (e) => {
                console.log("[DB]: Issue opening the local database.", e)
            })
    }
}
