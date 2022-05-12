const router = require("express").Router();
const auth = require("../middleware/auth");
let User = require("../models/users.model");

//Test route
router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error :" + err));
});

router.get("/me", auth, async (req, res) => {
  // View logged in user profile
  res.send({ username: req.user.username });
});

router.post("/signup", async (req, res) => {
  // Create a new user
  try {
    console.log(req.body);
    Object.assign(req.body,{['role']:'user'});
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(203).send(error);
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  //Login a registered user
  try {
    const { username, password } = req.body;
    const user = await User.findByCredentials(username, password);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/me/logout", auth, async (req, res) => {
  // Log user out of the application
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send("User Logged out succesfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/me/logoutall", auth, async (req, res) => {
  // Log user out of all devices
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    res.send("User Logged out of all systems succesfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/get-list', auth, async (req,res)=>{
   User.find({role:"user"})
    .then((meals) => res.json(meals))
    .catch((err) => res.status(400).json("Error :" + err));
})

module.exports = router;
