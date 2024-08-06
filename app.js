import express from "express";
import path from "path";
import fs from "fs";
import hbs from "hbs";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import logger from "morgan";
import { fileURLToPath } from 'url';
import indexRouter from "./routes/index.js";

var app = express();
app.use(bodyParser.json());
// view engine setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("view engine", "hbs");
app.set("views", [
    path.join(__dirname, "views")
])
const partialsDir = __dirname + "/views/partials";
const filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
    const matches = /^([^.]+).hbs$/.exec(filename);
    if (!matches) {
        return;
    }
    const name = matches[1];
    const template = fs.readFileSync(partialsDir + "/" + filename, "utf8");
    hbs.registerPartial(name, template);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

export default app;