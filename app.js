const express = require("express");
const handlebars = require("express-handlebars");
const db = require("./models");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");

const methodOverride = require("method-override");

const app = express();
const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const passport = require("./config/passport");

app.engine("handlebars", handlebars({
    defaultLayout: "main",
    helpers: require("./config/handlebars-helpers")
  })
);
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride("_method"));
app.use("/upload", express.static(__dirname + "/upload"));

app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  res.locals.user = req.user;
  next();
});

app.listen(port, () => {
  db.sequelize.sync();
  console.log(`Example app listening on port ${port}`);
});

require("./routes")(app);



handleImgChange = e => {
  if (e.target.files[0]) {
    const image = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      this.setState({
        image: image,
        imageSrc: reader.result,
        staff: {
          ...this.state.staff,

          imageSrc: reader.result,
          image: image
        }
      });
    };
    reader.readAsDataURL(image);
    this.setState(prevState => ({
      error: {
        // object that we want to update
        ...prevState.error, // keep all other key-value pairs
        image: false // update the value of specific key
      }
    }));
  }
};