require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT=process.env.PORT || 8000;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
mongoose.set('strictQuery', true);
const mypass=process.env.ATLAS_PASSWORD;
mongoose.connect(`mongodb+srv://agmovies:${mypass}@agmovies.zjhbsiv.mongodb.net/agDB`);

const userSchema = new mongoose.Schema({
    userName: String,
    password: String
})

const User = mongoose.model("User", userSchema);

const nominationSchema = new mongoose.Schema({
    userName: String,
    movieId: []
})

const Nomination = mongoose.model("Nomination", nominationSchema);

const leaderSchema = new mongoose.Schema({
    movieId: String,
    Votes: Number
})

const Leader = mongoose.model("Leader", leaderSchema);


function verifyJWT(req, res, next) {
    const token = req.headers["x-access-token"].replace('Bearer', '');
    if (token) {

        jwt.verify(token, "agmovies", (err, decoded) => {
            if (err) return res.json({
                isLoggenIn: false,
                backres: "Failed to authenticate."
            })
            req.user = {};
            req.user.id = decoded.id
            req.user.userName = decoded.userName
            next()

        })
    } else {

        res.json({ backres: "Incorrect token given", isLoggenIn: false })
    }
}



app.get("/isUserAuth", verifyJWT, (req, res) => {
    res.json({ isLoggenIn: true, userName: req.user.userName })
})



app.post("/signup", (req, res) => {
    const takenUsername = User.findOne({ userName: req.body.email }, (err, found) => {
        if (!err) {
            if (found) {
                res.json({ backres: "Email has already been taken" });
            } else {
                bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                    const newusername = req.body.email;
                    const newpass = hash;
                    const newuser = new User({
                        userName: newusername,
                        password: newpass
                    });
                    newuser.save();
                    res.json({ backres: "Success" });
                });
            }
        }

    });





});

app.post("/login", (req, res) => {
    const newusername = req.body.email;
    const newpass = req.body.password;

    User.findOne({ userName: newusername }, function (err, found) {
        if (!err) {
            if (found) {
                bcrypt.compare(newpass, found.password, function (err, result) {
                    if (result == true) {
                        const payload = {
                            id: found._id,
                            userName: found.userName,
                        }
                        jwt.sign(
                            payload,
                            "agmovies",
                            { expiresIn: 86400 },
                            (err, token) => {
                                if (err) return res.json({ backres: err });
                                return res.json({
                                    backres: "Success",
                                    token: "Bearer" + token
                                })
                            }
                        )
                    } else {
                        res.json({ backres: "Invalid username or password" })
                    }
                });
            } else {
                res.json({ backres: "Invalid username or password" })
            }
        } else {
        }
    })
})

app.post("/nominate", (req, res) => {
    const newusername = req.body.userName;
    const newmovieid = req.body.movieId;
    const nom = req.body.nom;
    Nomination.findOne({ userName: newusername }, function (err, found) {
        if (!err) {
            if (found) {
                if (nom === "Nominated") {
                    found.movieId.pull(newmovieid);
                    found.save();
                } else {
                    found.movieId.push(newmovieid);
                    found.save();
                }
            } else {
                const newnomination = new Nomination({
                    userName: newusername,
                    movieId: newmovieid
                });
                newnomination.save();
            }
        } else {
        }
    })
})

app.post("/count", (req, res) => {
    const newusername = req.body.userName;
    const temparr=[];
    console.log("hi");
    Nomination.findOne({ userName: newusername }, function (err, found) {
        if (!err) {
            if (found) {
                res.json({ votedmovie: found.movieId });
                console.log("hi");
            } else {
                res.json({ votedmovie: temparr });
                console.log("hi2");
            }
        } else {
        }
    })
})

app.get("/databaseCall", (req, res) => {
    Nomination.find({}, function (err, found) {
        if (!err) {
            if (found) {
                res.json({ votedmovie: found });
            }
        }
    })
})

app.post("/leaders", (req, res) => {
    newmovieId = req.body.movieId;
    nom = req.body.nom;
    Leader.findOne({ movieId: newmovieId }, function (err, found) {
        if (!err) {
            if (found) {
                let vote = found.Votes;
                if (nom === "Nominate") {
                    found.Votes = vote + 1;
                    found.save();
                } else {
                    found.Votes = vote - 1;
                    found.save();
                }
            } else {
                const leader = new Leader({
                    movieId: newmovieId,
                    Votes: 1
                })
                leader.save();
            }
        }
    })
})

app.get("/leaderDb", (req, res) => {
    Leader.find({}, function (err, found) {
        if (!err) {
            res.send(found);
        }
    })
})


setInterval(() => {
    let currentDate = new Date();
    let hours = currentDate.getHours();
    let min = currentDate.getMinutes();
    let sec = currentDate.getSeconds();


    if (hours === 0 && min === 0 && sec === 0) {
        Nomination.deleteMany({}, (err) => {
            if (err)
                console.log(err);
            else
                console.log("Success");
        });
        Leader.deleteMany({}, (err) => {
            if (err)
                console.log(err);
            else
                console.log("Success");
        });
        console.log("Deleted Successfully");
    }

}, 1000);

app.listen(PORT, function () {
    console.log(`Server started on port ${PORT}.`);
});