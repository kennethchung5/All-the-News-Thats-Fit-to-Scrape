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
  
      // res.send("Scrape Complete");
      res.redirect("/articles"); 
    });
  });

app.get("/", (req, res) => {
  res.redirect("/articles"); 
})

app.get("/articles", (req, res) => {

  db.Article.find({saved: false})
            .then(dbArticle => {
              res.render("article", {articles: dbArticle})
            })
            .catch(error => {
              res.json(error);
            })

})


app.get("/saved", (req, res) => {

  db.Article.find({saved: true})
            .then(dbArticle => {
              res.render("article", {articles: dbArticle})
            })
            .catch(error => {
              res.json(error);
            })
})

//route for saving an article; update saved to true
app.put("/articles/:id", (req, res) => {
  // console.log(`The put route is hit. The articleID is: ${req.params.id}`)
  db.Article.findOneAndUpdate({_id: req.params.id}, {$set: {saved: true}}, {new: true})
            .then(dbArticle => {
              res.json("/articles")
            })
            .catch(error => {
              res.json(error);
            })

})

app.delete("/articles/:id", (req, res) => {
  db.Article.findOneAndDelete({_id: req.params.id})
            .then(() => {
              //not sure what needs to be done here...
              res.json("/saved")
            })
            .catch(error => {
              res.json(error);
            })
})


//route for retrieving comments
app.get("/articles/:id", (req, res) => {

  //need to res.render passing articleID and 
  db.Article.findOne({_id: req.params.id})
            .populate("comments")
            .then(dbArticle => {
              // res.json(dbArticle);

              console.log(dbArticle);

              // res.render("comment", dbArticle)

              // res.render("comment", {layout: false, dbArticle});
              res.render("comment", {layout: false, _id: dbArticle._id, comments: dbArticle.comments});

              // res.json(dbArticle);
            })
            .catch(error => {
              res.json(error);
            })


})


//route for posting comments
app.post("/articles/:id", (req, res) => {

  db.Comment.create(req.body)
            .then(dbComment => {
              return db.Article.findOneAndUpdate({_id: req.params.id}, {$push: {comments: dbComment._id}}, {new: true})
            })
            .then(dbArticle => {
              res.json(dbArticle);
            })
            .catch(error => {
              res.json(error);
            })

})


app.get("/testroute", (req, res) => {

    const testArray = [
      {
        id: 1, 
        description: "toothbrush"
      }, 
      {
        id: 2, 
        description: "floss"
      },
      {
        id: 3,
        description: "mouthwash"
      }
    ]

    res.render("index", {items: testArray});

})




app.listen(PORT, () => {
    console.log("App running on port " + PORT + "!");
});