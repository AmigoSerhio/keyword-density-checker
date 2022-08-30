import fs from "fs";
import path from "path";
import request from "request";
import * as dotenv from "dotenv";
dotenv.config();


export const crawler = {
  rmdir(dir) {
    let list = fs.readdirSync(dir);
    for (let i = 0; i < list.length; i++) {
      let filename = path.join(dir, list[i]);
      let stat = fs.statSync(filename);

      if (filename == "." || filename == "..") {
        // pass these files
      } else if (stat.isDirectory()) {
        // rmdir recursively
        rmdir(filename);
      } else {
        // rm fiilename
        fs.unlinkSync(filename);
      }
    }
    fs.rmdirSync(dir);
  },

  async fsReadFileHtml(fileName) {
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, "utf8", (error, htmlString) => {
        if (!error && htmlString) {
          resolve(htmlString);
        } else {
          reject(error);
        }
      });
    });
  },


  downloadPages(urls) {
    if (!fs.existsSync("./pages")) {
      fs.mkdirSync("./pages");
    }
    Promise.all(
      urls.map((url) => {
        console.log(url);
        let fileName = this.createFileNameFromUrl(url);
        this.downloadHtml(url, fileName);
      })
    ).catch(function(err) {
      throw new Error(err.message);
    });
  },

  createFileNameFromUrl(url) {
    return url
      .replace("https://", "")
      .replace("/", "_");
  },

  downloadHtml(url, name) {
    url = url + "?spider=seoreviewtools.8B4NgW4Uda87sMHdwASMccTP22anh459"
    return request({
      url,
      // headers: {
      //   "headerName": process.env.YOUR_CUSTOM_HEADER,
      // },
    }).pipe(fs.createWriteStream(`./pages/${name}.html`)).on('error', function(e){throw new Error(e)});
  },

};
