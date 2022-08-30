
import xpath from "xpath-html"
import fs from "fs";
const stopWords = fs.readFileSync("./stopWords.txt")


export const keywords = {

    async findbyXpath(html, selector){
        try {
            return xpath.fromPageSource(html).findElements(selector);
        } catch (e){
            console.log(e)}
    },

    async  analyseKeywords(qWord, html){

        let result = [];
        let wordComb = [];
        let filteredKeywords = [];
        const k = await this.findbyXpath(html, "//body//*[contains(text(),'')]")
        for (const kKey in k) {
            if(k[kKey].getText() !== undefined){ filteredKeywords.push(await k[kKey].getText())}   //pushes all found elems to filtered keywords
        }

            let f = filteredKeywords.filter(element => element !== " ")
            f.forEach(el => { wordComb.push(el.trimLeft().trimRight().toLowerCase())})   // trims all useless spaces

                let matchedSites = wordComb.filter(el => !el.match(">") && !el.match("{") );   // matchedSites is ready to use word combinations

                        if(qWord.split(" ").length > 1) {     //in case if qWord more then one word
                            result = matchedSites.filter(n => stopWords.indexOf(n) === -1) // filter by stop words list
                        }

                                if(qWord.split(" ").length === 1){  //in case if qWord is one word
                                    filteredKeywords = matchedSites.map(el => el.split(" ")).flat(); // split to separate words arr
                                    result = filteredKeywords.filter(n => stopWords.indexOf(n) === -1) // filter by stop words list
                                }

        let qty = result.filter(n => n.toLowerCase().includes(qWord.toLowerCase()))
        let density = qty.length/result.length*100

        let data = {wordsFound: result.length, queriedWordFound: qty.length, queriedWordDensity: density, phraseList: matchedSites, wordList: result}
        // console.log("___________________>>>>RESULT<<<<___________________")
        // console.log(`Total words found  ${data.wordsFound}`)
        // console.log(`Queried word: "${qWord}";`)
        // console.log(`found:  ${qty.length};`)
        // console.log(`Density ${density};`)
        // console.log("___________________>>>>RESULT<<<<___________________")

        return data
    },


    async topDensity(html,qWord){
        const start = Date.now()
        const data = await this.analyseKeywords(qWord,html)
        const wordList = data.wordList

        let result = new Array(data.wordsFound);
        for (let i = 0; i < result.length; i++) {
            result[i] = new Array(3);
        }
            for (const word in wordList) {
                let a = await this.analyseKeywords(wordList[word],html)
               result[word][0] = wordList[word]
                result[word][1] = a.queriedWordFound
                    result[word][2] = a.queriedWordDensity
            }
                const removeDublicates = result.reduce((o, i) => {
                    if (!o.find(v => v[0] === i[0])) {
                        o.push(i);
                    }
                    return o;
                }, []);


                        let sortedRes = removeDublicates.sort(function(a, b){
                            return b[1]-a[1]
                            })
        // console.log(sortedRes)

                                    console.log("___________________>>>>TOP TEN DENSITY RESULT<<<<___________________")
                                    console.log(`Total words found  ${data.wordsFound}`)

                                    for (let i = 0; i < 10; i++) {
                                        console.log("")
                                        console.log(`Queried word: "${sortedRes[i][0]}";`)
                                        console.log(`found:  ${sortedRes[i][1]};`)
                                        console.log(`Density: ${parseFloat(sortedRes[i][2].toFixed(3))}%;`)

                                    }
                                    const finishedIn = (Date.now() - start) / 1000

                                    console.log("___________________>>>>RESULT<<<<___________________")
                                    console.log(`Finished in ${finishedIn} seconds`)



        return sortedRes

    },

}