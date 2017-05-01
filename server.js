const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
const app = express();

hbs.registerPartials(__dirname + '/views/partials');    //setting up partials
app.set('view engine', 'hbs');

//registering middleware - in order!
app.use( (req, res, next) => {
    const now = new Date().toString();
    const log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append server.log.');
        }
    });
    next();
});

//displays the content of the file instead of all pages - settings coming after this
// app.use( (req, res, next) => {
//     res.render('maintenance.hbs');  
// });

app.use(express.static(__dirname + '/public')); //take the absolute path to the folder we want to serve up

hbs.registerHelper('getCurrentYear', () => {    //anything this func returns gets rendered under the 'getCurrentYear' call
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

//set up a handler for sending back data eg html page
app.get('/', (req, res) => {
    // res.send('<h1>Hello Express!</h1>');     //sending back html
    // res.send({
    //     name: 'Arpad',
    //     likes: [
    //         'Biking',
    //         'Cities'
    //     ]
    // });
    res.render('home.hbs', {
        pageTitle: 'Welcome Page',
        welcomeMessage: 'Welcome to my website!'
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {   //allows to render dynamic templates made with the view engine
        pageTitle:'About Page'
    });                      
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to handle request'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});