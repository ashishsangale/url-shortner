const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl')
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false}))

mongoose.connect('mongodb://localhost/urlShortner', {
    useNewUrlParser: true, useUnifiedTopology: true
});

app.get("/",async (req,res) => {
    const shortUrls = await ShortUrl.find()
    res.render("index", {shortUrls:shortUrls})
});

app.post("/shortUrls", async (req,res) => {
    await ShortUrl.create({full: req.body.fullUrl })

    res.redirect('/')
});

app.get("/:shortUrl", async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if(shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
});

app.listen(3000, process.env.IP);