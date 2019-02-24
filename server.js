const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");

const PORT = 3000;

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

//connect to mongoDB (decide on a name first)
mongoose.connect("mongodb://localhost/newsArticlesDB", { useNewUrlParser: true });


app.get("/scrape", (req, res) => {
    // console.log("The scrape route is hit!")    
    axios.get("https://www.nytimes.com/section/technology").then(response => {
      
      const $ = cheerio.load(response.data);  
      
      $("li article div.css-10wtrbd").each((i, element) => {
        
        const newArticle = {};  
        
        newArticle.headline = $(element).children("h2").children("a").text();
        newArticle.author = $(element).find("[itemprop=name]").text();

        // do some string manipulation to remove the By [author] at end of summary.
        let newSummary = $(element).find("p").text();        

        if (newSummary.lastIndexOf(".By ") > -1) {
            newSummary = newSummary.substring(0, newSummary.lastIndexOf(".By ") + 1);
        }        

        newArticle.summary = newSummary;        
        
        // href values omit the "https://www.nytimes.com/" at the beginning. Is there a more elegant way to get the full path than hardcoding the beginning?
        newArticle.url = "https://www.nytimes.com" + $(element).children("h2").children("a").attr("href");
  
        
        db.Article.create(newArticle)
          .then(dbArticle => {
            console.log(dbArticle);
          })
          .catch(error => {            
            console.log(error);
          });
      });
  
      res.send("Scrape Complete");
    });
  });






app.listen(PORT, () => {
    console.log("App running on port " + PORT + "!");
});