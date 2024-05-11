import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import "./services/authService";

const app = express();

//security for http headers
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//log http requests
app.use(morgan("combined"));
//session middleware
app.use(session({ secret: "secret", resave: false, saveUninitialized: true}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next();
})

//routes
import { userRouter } from "./routes/userRoute";
app.use("/users", userRouter);

app.get('/', async(req,res)=> {
res.send('Hello World!s');
})
app.get('/users/login-success', async(req,res)=> {
res.send('Login successful');
})
const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
