const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
// const cookiePaser = require('cookie-parser');
const User = require('./src/models/user');

const db = require('./src/utils/dbConnection');
const userService = require('./src/service/userService');

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    "secret": "randomSecretKey"
}))
// app.use(cookiePaser);

app.get("/", (req, res) => {
    console.log(req.session);
    if(req.session.user_id) {
        res.sendFile(__dirname + "/index.html");
    }
    //  redirect to user to login
    res.redirect("/user/login");
})

app.post("/user/signup", (req, res) => {
    // validate user object
    try {
    const user = req.body;
    // userService class
    return bcrypt.genSalt(10, (err, salt) => {
        if(err) {
            console.log(err);
            throw err;
        }
        return bcrypt.hash(req.body.password, salt, (e, hash) => {
            if(e) {
                console.log(e);
                throw e;
            }
            user.password = hash;
            return User.create(user)
            .then(createduser => {
                // store new user in session storage and redirect to dashboard
                console.log(createduser);
                res.status(201).send(createduser);
            })
            .catch(e => {
                console.log(e);
                throw e;
            }); 
        });
    });
    } catch(err) {
        console.log(err);
        throw err;
    }
    // Using save method
    // const user = new User(req.body);
    // user.save(e => err ? console.log(e): null);
    // console.log(user);
})

app.post("/user/login", (req, res) => {
    let username = req.body.userName;
    let password = req.body.password;
    if(!username || !password) {
        res.statusCode = 400;
        let data = {
            message: "Invalid userName or password"
        }
        res.send(data);
    }
    return User.findOne({userName: username})
    .then(user => {
        if(!user) {
            let data = {
                message: "No user with these username exitS"
            }
            return res.status(404).send(data);
            // throw new Error("No user with the username exit");
        }
        return bcrypt.compare(password, user.password, (err, success) => {
            if(err) {
                throw new Error("Error LoggingIn " + err);
            };
            if(!success) { 
                let data = {
                    message: "Invalid username or password"
                };
                return res.status(401).send(data);
            }
            req.session.username = user.userName;
            req.session.user_id = user._id;
            req.session.name = user.fullName;
            console.log(req.session);
            // redirect to dashboard
            return res.status(200).send(user); // sends back hashed password, to be modified
        })
    })
    .catch(err => {
        throw new Error("Error trying to logIn, please try again " + err);
    })
})

app.get("/logout", (req, res) => {
    if(req.session.user_id != undefined) {
        req.session.destroy();
        return res.redirect("/");
    }
    res.redirect("/");
})

let count = 0;
io.on('connection', socket => {
    let user = "User" + count++;
    console.log(user + " has connected");
    io.emit("chat message", user + " has connected")
    socket.on("chat message", msg => {
        io.emit("chat message",  msg);
    })

    socket.on('disconnect', () => {
        console.log("User disconnected");
    })

})

app.use((req, res) => {
    res.status(404).send("Ooops!! You have reached the edge of the world, please retrace your steps back");
})
server.listen(process.env.PORT || 3000, err => {
    if(err) console.log(err);
    console.log("App is running!");
    db.then(() => console.log("MongoDB succefully connected"))
    .catch(err => {
        console.log(err);
    });
    // .on("error", console.error.bind(console, 'connection.error'));
    // db.once('open', () => console.log("DB has connected"))
});