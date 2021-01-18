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
