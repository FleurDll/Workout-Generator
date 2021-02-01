const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const jsdom = require("jsdom");
const {
  JSDOM
} = jsdom;

const app = express();

app.use(express.static(__dirname + "/public"));

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

///////////////////////////// MONGOOSE ////////////////////////////////////
mongoose.connect('mongodb://localhost:27017/workoutDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const workoutSchema = new mongoose.Schema({
  name: String,
  duration: Number,
  series: Number,
  position: String,
  corps: String,
  partie: String
});

const Workout = mongoose.model("Workout", workoutSchema);

let workouts = [];

let upperName = [];
let leg1Name = [];
let leg2Name = [];
let gluteName = [];

let workoutGenerated = [];

function randomNumberGenerator(list) {
  randomNumber = Math.floor(Math.random() * list.length);
  return randomNumber;
};

function findWorkoutAndShowThem() {
  Workout.find({}, (err, data) => {
    data.forEach(workoutsFound =>
      workouts.push(workoutsFound));

    const glute = workouts.filter(obj => obj.partie == "fesses");
    if (gluteName.length === 0) {
      glute.forEach(workout => gluteName.push(workout.name));
    }
    const randomWorkout1 = gluteName[randomNumberGenerator(gluteName)];

    const leg1 = workouts.filter(obj => obj.corps == "bas" && obj.series == 1 && obj.partie == "cuisses");
    if (leg1Name.length === 0) {
      leg1.forEach(workout => leg1Name.push(workout.name));
    }
    const randomWorkout5 = leg1Name[randomNumberGenerator(leg1Name)];

    const leg2 = workouts.filter(obj => obj.corps == "bas" && obj.series == 2);
    if (leg2Name.length === 0) {
      leg2.forEach(workout => leg2Name.push(workout.name));
    }
    const randomWorkout3 = leg2Name[randomNumberGenerator(leg2Name)];

    const upper = workouts.filter(obj => obj.corps == "haut");
    if (upperName.length === 0) {
      upper.forEach(workout => upperName.push(workout.name));
    }

    while (workoutGenerated.length < 6) {
      const randomWorkout2 = upperName[randomNumberGenerator(upperName)];
      const randomWorkout4 = upperName[randomNumberGenerator(upperName)];
      const randomWorkout6 = upperName[randomNumberGenerator(upperName)];

      if (randomWorkout2 != randomWorkout4 && randomWorkout4 != randomWorkout6) {
        workoutGenerated.push(randomWorkout1, randomWorkout2, randomWorkout3, randomWorkout4, randomWorkout5, randomWorkout6)
      }
    }
  });
}

// /////////////////////////////// HOME ROUTE /////////////////////////////////
app.route("/")

  .get((req, res) => {
    res.render("main");
  })

  .post((req, res) => {
    res.redirect("/workout");
  });

app.route("/workout")

  .get((req, res) => {

    findWorkoutAndShowThem();

    res.render("workout", {
      workoutGenerated: workoutGenerated
    });
  })

  .post((req, res, next) => {

    if (req.body.hasOwnProperty("reloadWorkouts")) {
      workoutGenerated = [];
      findWorkoutAndShowThem();
    } else if (req.body.hasOwnProperty("buttonStart")) {
    }




    res.redirect("/workout");
  });


app.listen(3000, () => {
  console.log("Server stared on port 3000");
});
