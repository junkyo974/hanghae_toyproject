const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");

let attachment;
const port = 3000;
const morgan = require("morgan")

const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const usersRouter = require("./routes/users.js");
const likesRouter = require("./routes/likes.js");

const connect = require('./schemas');
connect();

app.use(cors({
    origin: "http://localhost:3000 ", // 접근 권한을 부여하는 도메인
    credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
    optionsSuccessStatus: 200, // 응답 상태 200으로 설정
}));


app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('combined'))

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
