const express = require('express');
const bodyParser = require('body-parser');
var fs=require('fs');


var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Content-Type", 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

let user_data = JSON.parse(
    fs.readFileSync(
        './assets/user_data.json', 'utf8'
    )
);

let dati_fatture = JSON.parse(
    fs.readFileSync(
        './assets/dati_fatture.json', 'utf8'
    )
)


app.post('/user/login', function(req, res) {

    var username = req.body.username,
        password = req.body.password;

    if (!username || !password) {
        return res
            .status(400)
            .jsonp({
                error: "Needs a json body with { username: <username>, password: <password>}"
            });
    }

    for (const user of user_data) {
        if (username == user['username']) {
            if (password == user['password']) {
                return res
                    .status(200)
                    .jsonp(user);
            }
            return res
                .status(401)
                .jsonp({
                    error: "Wrong password.",
                });
        }
    }

    return res
        .status(401)
        .jsonp({
            error: "Unknown username",
        })

});


app.get('/user/:id', function(req, res) {

    var userId = req.params.id;

    if (!userId) {
        return res
            .status(400)
            .jsonp({
                error: "Needs a valid userId",
            });
    }

    for (const user of user_data) {
        if (userId == user['userId']) {
            return res
                .status(200)
                .jsonp(user);
        }
    }

    return res
        .status(401)
        .jsonp({
            error: "userId not found in the database",
        });

});


app.get('/user/fatture/:id', function(req, res){
    var userId = req.params.id;

    if (!userId) {
        return res
            .status(400)
            .jsonp({
                error: "Needs a valid userId",
            });
    }

    for (const fatture of dati_fatture) {
        if (userId == fatture['userId']) {
            return res
                .status(200)
                .jsonp(fatture['fatture']);
        }
    }

    return res
        .status(401)
        .jsonp({
            error: "userId not found in the database",
        });


});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    /*var err = new Error('Not Found');
    err.status = 404;
    next(err);*/
    return res.status(404).json({
        success: false,
        message: "not found"
    });
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err);
        return res.status(err.status || 500).jsonp({
            success: false,
            "data": [{
                message: err.message
            }]
        });
    });
}


var port = process.env.PORT || 9001;

const server = app.listen(port, function() {
    console.log('Server up at http://localhost:' + port);
});

process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing http server.');
    server.close(() => {
        console.log('Http server closed.');
    });
});

process.on('SIGINT', () => {
    console.info('SIGINT signal received.');
    console.log('Closing http server.');
    server.close(() => {
        console.log('Http server closed.');
    });
});
