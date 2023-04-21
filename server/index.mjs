import express from 'express';
import mongoose from 'mongoose';
import { ObjectId } from 'bson';
// use for expense
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();
const url = process.env.DB_URL;
const port = 3001;

const app = express();
app.use(express.json());

// deal with cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTION"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// users config
const usersSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true }
}, { versionKey: false });

const Users = mongoose.model('users', usersSchema);

// friends config
const friendsSchema = new mongoose.Schema({
  user_id: { type: ObjectId, required: true },
  friend_id: { type: ObjectId, required: true }
}, { versionKey: false });

const Friends = mongoose.model('friends', friendsSchema);

// categories config
const categoriesSchema = new mongoose.Schema({
  _id: { type: ObjectId, required: true },
  category_order: { type: Number, required: true },
  category_name: { type: String, required: true }
}, { versionKey: false });

const Categories = mongoose.model('categories', categoriesSchema);

// methods config
const methodsSchema = new mongoose.Schema({
  _id: { type: ObjectId, required: true },
  method_order: { type: Number, required: true },
  method_name: { type: String, required: true }
}, { versionKey: false });

const Methods = mongoose.model('methods', methodsSchema);

// processes config
const processesSchema = new mongoose.Schema({
  _id: { type: ObjectId, required: true },
  process_status: { type: Number, required: true },
  process_name: { type: String, required: true }
}, { versionKey: false });

const Processes = mongoose.model('process', processesSchema);

// groups config
const groupsSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  group_name: { type: String },
  member_id: { type: Array, required: true },
  registered_id: { type: ObjectId, required: true },
  registered_at: { type: Date, required: true },
  updated_id: { type: ObjectId },
  updated_at: { type: Date }
}, { versionKey: false });

const Groups = mongoose.model('groups', groupsSchema);

// expenses config
const expensesSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  payer_id: { type: ObjectId, required: true },
  method_id: { type: ObjectId, required: true },
  group_id: { type: ObjectId, required: true },
  process_id: { type: ObjectId, required: true },
  category_id: { type: ObjectId, required: true },
  description: { type: String, required: true },
  payment: { type: Number, required: true },
  registered_id: { type: ObjectId, required: true },
  registered_at: { type: Date, required: true },
  updated_id: { type: ObjectId },
  updated_at: { type: Date }
}, { versionKey: false });

const Expenses = mongoose.model('expenses', expensesSchema);

// ----------------------------------------------------------------------------
//  function: create a group
// ----------------------------------------------------------------------------
const createGroup = async (userData) => {

  const resultUser = await Users.findOne({
    email: userData.email
  }, { _id: 1 })

  const resultMember = await Users.find({ email: { $in: userData.members.email } },
    { _id: 1 });

  const groupMembers = [resultUser, ...resultMember];

  const newGroup = new Groups({
    uuid: userData.uuid,
    group_name: userData.group_name,
    member_id: groupMembers,
    registered_id: resultUser._id,
    registered_at: userData.date,
    updated_id: resultUser._id, // need to modify
    updated_at: userData.date, // need to modify
  })
  return await newGroup.save();
}

// ----------------------------------------------------------------------------
//  regsiter an expense
// ----------------------------------------------------------------------------
app.post('/api/register/expense', async (req, res) => {

  const userData = {
    uuid: uuidv4(),
    date: new Date(),
    group_name: req.body.group_name,
    email: req.body.email,
    members: req.body.members,
  }

  try {
    const resultGroup = await createGroup(userData);

    //  create an expense
    const categoryOrder = req.body.category_order;
    const methodOrder = req.body.method_order;
    const processStatus = req.body.process_status;
    const resultPayer = await Users.findOne({ email: req.body.payer });
    const resultCategory = await Categories.findOne({ category_order: categoryOrder }, { _id: 1 });
    const resultMethod = await Methods.findOne({ method_order: methodOrder }, { _id: 1 });
    const resultProcess = await Processes.findOne({ process_status: processStatus }, { _id: 1 });

    const newExpenses = new Expenses(
      {
        uuid: uuidv4(),
        payer_id: resultPayer._id,
        group_id: resultGroup._id,
        category_id: resultCategory._id,
        method_id: resultMethod._id,
        process_id: resultProcess._id,
        description: req.body.description,
        payment: req.body.payment,
        registered_id: resultGroup.registered_id,
        registered_at: resultGroup.registered_at,
        updated_id: resultGroup.registered_id,
        updated_at: resultGroup.registered_at,
      }
    );

    const resultExpense = await newExpenses.save();
    res.json(resultExpense);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// ----------------------------------------------------------------------------
//  get friends
// ----------------------------------------------------------------------------
app.post("/api/get/friends", async (req, res) => {
  const email = req.body.email;
  console.log(email);
  try {
    // get user id from users collection
    const userId = await Users.findOne({ email: email })
    console.log(userId);
    const friends = await Friends.find({ user_id: userId._id },
      { friend_id: 1, _id: 0 });
    console.log(friends);
    const friendIds = friends.map((friend) => friend.friend_id);
    const users = await Users.find({ _id: { $in: friendIds } },
      // { email: 1, name: 1, password: 0, _id: 0 }); why it gets an error?
      { email: 1, name: 1, _id: 0 });
    res.json(users);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// ----------------------------------------------------------------------------
//  register a group
// ----------------------------------------------------------------------------
app.post("/api/register/group", async (req, res) => {
  const userData = {
    uuid: uuidv4(),
    date: new Date(),
    group_name: req.body.group_name,
    email: req.body.email,
    members: req.body.members,
  }
  try {
    const resultGroup = await createGroup(userData);
    res.json(resultGroup);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// ----------------------------------------------------------------------------
//  get groups
// ----------------------------------------------------------------------------
app.post("/api/get/groups", async (req, res) => {
  const email = req.body.email;

  try {
    // get user id from users collection
    const userId = await Users.findOne({ email: email })

    const groups = await Groups.aggregate([
      { $sort: { registered_at: -1 } },
      {
        $match: {
          member_id: {
            $elemMatch: { _id: userId._id }
          },
          group_name: { $ne: "" },
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "member_id._id",
          foreignField: "_id",
          as: "users"
        }
      },
      {
        $project: {
          _id: 0,
          uuid: 1,
          group_name: 1,
          members: {
            name: 1,
            email: 1
          },
          registered_at: 1,
        },
      }
    ]);

    console.log("groups", groups);
    res.json(groups);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// ----------------------------------------------------------------------------
//  get categories
// ----------------------------------------------------------------------------
app.get("/api/get/categories", async (req, res) => {
  try {
    const categories = await Categories.find({},
      { _id: 0, category_order: 1, category_name: 1 });
    console.log(categories);
    res.json(categories);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// ----------------------------------------------------------------------------
//  check if a user exist
// ----------------------------------------------------------------------------
app.post("/api/exist/user", async (req, res) => {
  const email = req.body.email;
  try {
    const users = await Users.countDocuments({
      email: email
    })
    console.log(users);
    res.json(users);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// ----------------------------------------------------------------------------
//  check an user's email and password
// ----------------------------------------------------------------------------
app.post("/api/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const users = await Users.findOne({
      email: email,
      password: password
    })
    console.log(users);
    res.json(users);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// ----------------------------------------------------------------------------
//  get a user data
// ----------------------------------------------------------------------------
app.post("/api/get/user", async (req, res) => {
  const email = req.body.email;

  try {
    const users = await Users.findOne({
      email: email
    }, {
      _id: 0,
      name: 1,
      email: 1,
    },
      { password: 0 }
    )
    console.log(users);
    res.json(users);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// ----------------------------------------------------------------------------
//  get a userId
// ----------------------------------------------------------------------------
app.post("/api/get/userId", async (req, res) => {
  const email = req.body.email;
  try {
    const userId = await Users.findOne({ email: email },
      { _id: 1 })
    console.log(userId);
    res.json(userId);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// ----------------------------------------------------------------------------
//  register a user data
// ----------------------------------------------------------------------------
app.post('/api/register/user', async (req, res) => {
  const newUser = new Users({
    name: req.body.userName,
    email: req.body.email,
    password: req.body.password
  })

  try {
    const result = await newUser.save();
    res.json(result);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// ----------------------------------------------------------------------------
//  update a user data
// ----------------------------------------------------------------------------
app.post('/api/update/user', async (req, res) => {
  const currentEmail = req.body.currentEmail;
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const userData = await Users.findOneAndUpdate(
      { email: currentEmail },
      {
        $set:
        {
          name: name,
          email: email,
          password: password
        }
      },
      {
        new: true
      }

    )

    console.error(userData);
    res.json(userData);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// ----------------------------------------------------------------------------
//  get a user history
// ----------------------------------------------------------------------------
app.post("/api/get/history", async (req, res) => {
  const email = req.body.email;
  try {

    // get user id from users collection
    const userId = await Users.findOne({ email: email },
      { _id: 1 })
    // get groups that the user belongs
    const userGroups = await Groups.find({ member_id: { $elemMatch: { _id: userId._id } } },
      { _id: 1, member_id: 1 })
    // make an array for $in operator values
    const groupsArray = userGroups.map((group) => group._id);
    console.log(groupsArray);

    const expenses = await Expenses.aggregate([
      { $sort: { registered_at: -1 } },
      {
        $match: {
          group_id: { $in: groupsArray }
        }
      },
      {
        $lookup: {
          from: "groups",
          localField: "group_id",
          foreignField: "_id",
          as: "group"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "group.member_id._id",
          foreignField: "_id",
          as: "members"
        }
      },
      {
        $lookup: {
          from: "methods",
          localField: "method_id",
          foreignField: "_id",
          as: "methods"
        }
      },
      {
        $lookup: {
          from: "processes",
          localField: "process_id",
          foreignField: "_id",
          as: "processes"
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "categories"
        }
      },
      {
        $unwind: "$group"
      },
      {
        $unwind: "$categories"
      },
      {
        $unwind: "$methods"
      },
      {
        $unwind: "$processes"
      },
      {
        $addFields: {
          payer: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$members",
                  as: "member",
                  cond: { $eq: ["$$member._id", "$payer_id"] }
                }
              },
              0
            ]
          },
          registered_name: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$members",
                  as: "member",
                  cond: { $eq: ["$$member._id", "$registered_id"] }
                }
              },
              0
            ]
          }
        }
      },
      {
        $project: {
          _id: 0,
          uuid: 1,
          group: {
            group_name: 1
          },
          members: {
            name: 1,
            email: 1
          },
          categories: {
            category_order: 1,
            category_name: 1
          },
          methods: {
            method_order: 1,
            method_name: 1
          },
          processes: {
            process_status: 1,
            process_name: 1
          },
          description: 1,
          payer: {
            name: 1,
            email: 1
          },
          payment: 1,
          registered_name: {
            name: 1, email: 1
          },
          registered_at: 1,
        },
      }
    ]);

    console.log(expenses);
    res.json(expenses);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});
