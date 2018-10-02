const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const logger = require('morgan');

const app = express();
const dbConfig = require("./config/secret");
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

app.use(cors());
// CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET", "POST", "DELETE", "PUT");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use(
    express.json({
        limit: "50mb"
    })
);
app.use(
    express.urlencoded({
        extended: true,
        limit: "60mb"
    })
);
app.use(cookieParser()); // find why use cookieParser
//app.use(logger('dev'));  // find why use morgan

mongoose.Promise = global.Promise;
mongoose.connect(
    dbConfig.url, {
        useNewUrlParser: true
    }
);

require('./socket/streams')(io);

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const friendsRoutes = require("./routes/friendsRoutes");
const messageRoutes = require('./routes/messageRoutes')


app.use("/api/chatapp", authRoutes);
app.use("/api/chatapp", postRoutes);
app.use("/api/chatapp", userRoutes);
app.use("/api/chatapp", friendsRoutes);
app.use("/api/chatapp", messageRoutes);


server.listen(3000, () => {
    console.log("Listening on port 3000");
});