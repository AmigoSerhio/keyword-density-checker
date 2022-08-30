# Density checker 
Should automate calculating keywords density on the html page 
It works fine with one word - it get all text elements from the crawled html file then filters them using stopwords.txt

It also works with word combinations but with word combinations it doesn't use filter by stopword and takes whole sentanses and word combinations so rresults may be incorrect. 


# How to analyze keywords step by step: 

- `npm i`
- edit urls.json file 
- `npm run test` 
- `npm run clean` to remove downloaded pages

`npm run test` - will automatically download html pages from urls.json to the ./pages folder then calculate results and log them to console. 

Your site may be protected from downloading data this way so you may use custom header (define it in the .env file) 
Or use query string e.g: /?spider=12345 
