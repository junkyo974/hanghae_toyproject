const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

let attachment;
const port = 3000;
const morgan = require("morgan")

const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const usersRouter = require("./routes/users.js");
const likesRouter = require("./routes/likes.js");

const connect = require('./schemas');
connect();

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.send('/ Test!!!');
});

app.use('/newposts', postsRouter);

app.use('/posts', [likesRouter]);
app.use('/posts', [postsRouter, commentsRouter]);
app.use('/', [usersRouter, postsRouter])


app.listen(port, () => {
    console.log(`${port} 포트로 서버가 열렸습니다.`)
})
