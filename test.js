import fs from "fs";
import {crawler} from "./crawler.js";
import { keywords } from "./keywords.js";
let wordsQuantity = "OneWord" // "Two words" //"three words combination"

const test = async () =>{
   try{
        const htmls = fs.readdirSync(`./pages/`)
        for (const htmlKey in htmls) {
            let html = await crawler.fsReadFileHtml(`./pages/${htmls[htmlKey]}`)
            console.log(`DENSITY FOR ${htmls[htmlKey].split('.html')}` )
            console.log("")
            await keywords.topDensity(html,wordsQuantity)
            console.log("")

        }
    }
    catch (e) {
    console.log(e)
    }

}

test()