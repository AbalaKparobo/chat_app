const User = require('../models/user');


const createUser = (user) => {
    // validate recieved user

    // save user to db
    User.create(user)
    .then(usr => {
        console.log(usr);
        return usr;
    })
    .catch(e => {
        console.log(e);
        return e;
    });
}