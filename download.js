import { crawler } from "./crawler.js";
import fs from "fs";

const data = JSON.parse(fs.readFileSync("./urls.json"));
crawler.downloadPages(data);