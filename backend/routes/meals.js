const router = require("express").Router();
const moment = require('moment')

const today = moment().startOf('day')
const auth = require("../middleware/auth");
let Meal = require("../models/meals.model");
let User = require('../models/users.model')

//Test route
router.route("/").get((req, res) => {
  Meal.find()
    .then((meals) => res.json(meals))
    .catch((err) => res.status(400).json("Error :" + err));
});

router.get("/me", auth, async (req, res) => {
  // View logged in user meals
  if(req.user.role==="admin"){
     Meal.find()
     .populate('user')
    .then((meals) => res.json(meals))
    .catch((err) => res.status(400).json("Error :" + err));
  }else{
     Meal.find({ user: req.user._id })
    .then((meals) => res.json(meals))
    .catch((err) => res.status(400).json("Error :" + err));
  }
});

router.get("/me/:id", auth, async (req, res) => {
  // View logged in user meals

  Meal.findOne({ _id: req.params.id })
    .then((meal) => res.json(meal))
    .catch((err) => res.status(400).json("Error :" + err));
});

router.post("/me", auth, async (req, res) => {
  // Add new meal to logged in user
  try {
    const body = req.body;
    const userId = body.user ?? req.user._id;
    // CHECK IF USER ADDED 20O CALERIOS FOR TODAY
    const meals = await Meal.find({user:userId,date:{
      $gte: today.toDate(),
      $lte: moment(today).endOf('day').toDate()
    }});
    const sum = meals.reduce(function(sum,current){
      return sum + current.calories;
    },0);
    if(sum > 200){
      return res.send({success:false,sum:sum,'message':'You can not caleries more than 200'});
    }

    // CHECK IF USER HAS ALREADY 1000$ FOR PREVIOUS 30 DAYS
    const previousdate = moment(today).subtract(30,'days').toDate();
    const priceCheck = await Meal.find({user:userId,date:{
      $gte: previousdate
    }});
    
    const pricesum = priceCheck.reduce(function(sum,current){
      return sum + current.price;
    },0);
    if(sum > 1000){
      return res.send({success:false,price:pricesum,'message':'You can not add more then 1000$ for a month'});
    }
    
    Object.assign(body,{['user']:userId});
    const meal = new Meal(body);
    await meal.save();
    res.status(201).send({ meal });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

router.delete("/me/:id", auth, async (req, res) => {
  // Delete meal of logged in user
  Meal.findByIdAndDelete(req.params.id)
    .then(() => res.json("Meal deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.put("/me/:id", auth, async (req, res) => {
  // Update meal of logged in user
  Meal.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((meal) => res.json(meal))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.get('/get-statistics', auth, async(req,res) =>{
  const previoussevendate = moment(today).subtract(7,'days').toDate()
  try{
    const previous7daysEntries = await Meal.find({date:{
      $gte: previoussevendate,
    }}).countDocuments();

    const beforeSevenDays = await Meal.find({date:{
      $lte: previoussevendate,
    }}).countDocuments();
  
    Meal.find({date:{
      $gte: previoussevendate,
    }})
    .populate('user')
    .then(result=>{
      let data = [];
      result.forEach(item=>{
        const filter = data?.filter(user=>user.id===item.user.id);
        if(filter?.length>0){
          let filterItem = filter[0];
          const index = data.indexOf(filterItem);
          filterItem = {...filterItem,count:filterItem.count+1};
          data[index] = filterItem;
        }else{
          data.push({
            id:item.user.id,
            name:item.user.username,
            count:1
          })
        }
      })
      res.send({previous7daysEntries,beforeSevenDaysEntries:beforeSevenDays,entriesByUser:data})
    });

    // Meal.aggregate([

    //   {
    //     $lookup: {
    //           from: "users", // collection to join
    //           localField: "user",//field from the input documents
    //           foreignField: "_id",//field from the documents of the "from" collection
    //           as: "users"// output array field
    //       }
    //   },
    // ]).then(result=>{
    //   res.send(result)
    // })
    // Meal.find({})
    // .populate("user")
    // .aggregate([
    //   {
    //     $group:{_id:{user:'$user'}}
    //   }
    // ])
    // .then(function(messsages) {
    //    res.send(messsages)
    // });
    // res.send(result)
    // .then((result)=>{
    //   res.send({totalSevenDaysEnteries:previous7daysEntries,beforeSevenDays,previousSevenDaysByUser:result});
    // }).catch(err=>{
    //   console.log(err)
    // });
  }catch(error){
    res.status(400).send(error);
  }
});

module.exports = router;
