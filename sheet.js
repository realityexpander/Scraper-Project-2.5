const { GoogleSpreadsheet } = require('google-spreadsheet');

class Sheet {
    constructor() {
        this.doc = new GoogleSpreadsheet('1a5nkiQVKhLieZ1DnIcs_6tlNzX2ZEHe0EkmiHu2uGwk');
    }
    
    async load() {
        await this.doc.useServiceAccountAuth(require('./credentials.json'))
        await this.doc.loadInfo(); // loads document properties and worksheets
    }

    async addRows(rows) {
        const sheet = this.doc.sheetsByIndex[0];
        await sheet.addRows(rows);
    }

    async clearSheet() {
        const sheet = this.doc.sheetsByIndex[0];
        let headerValues = sheet.headerValues
        await sheet.clear()
        await sheet.setHeaderRow(headerValues)
    }

    async addNewRowsAndIgnoreExistingDuplicates(newRows) {
        const sheet = this.doc.sheetsByIndex[0];
        const existingRows = await sheet.getRows()
        let headerValues = sheet.headerValues
        let numDuplicates = 0

        // Add existingRows to bottom of newRows, only if no duplicates
        for(let existRow of existingRows) {
            let duplicate = false
            for(let newRow of newRows) {
                if (newRow.keyword == existRow.keyword) {
                    // console.log("Duplicate:", existRow.keyword)
                    numDuplicates++
                    duplicate = true
                    break
                }
            }
            if (!duplicate) {
                const rowObject = {}
                for(let [i, header] of existRow._sheet.headerValues.entries()) {
                    rowObject[header] = existRow._rawData[i]
                }
                newRows.push(rowObject)
            }
        }

        console.log(`Total duplicates: ${numDuplicates}`)

        await sheet.clear()
        await sheet.setHeaderRow(headerValues)
        await sheet.addRows(newRows)
    }

}


// async function test() {
//     const sheet = new Sheet()

//     await sheet.load()
//     await sheet.addRows([
//         { name: "Chris Athanas", email:'jimmy@ho.com'},
//         { name: "Crap crapasaurus", email:'uyyy@hos.com'}
//     ])
// }
// test()


module.exports = Sheet
