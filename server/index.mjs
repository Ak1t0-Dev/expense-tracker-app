import express from 'express';
import mongoose from 'mongoose';
import { ObjectId } from 'bson';

// put the information in the env file
const uri = 'mongodb+srv://admin001:Adm1n001@cluster0.7hck5vk.mongodb.net/expense-tracker-db?retryWrites=true&w=majority';
const port = 3001;

const app = express();
app.use(express.json());


// cors対策
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTION"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// users config
const usersSchema = new mongoose.Schema({
  _id: { type: ObjectId, required: true },
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
  _id: { type: Number, required: true },
  category_name: { type: String, required: true }
}, { versionKey: false });

const Categories = mongoose.model('categories', categoriesSchema);

// group config
const groupsSchema = new mongoose.Schema({
  group_name: { type: String, required: true },
  registered_id: { type: ObjectId, required: true },
  registered_at: { type: Date, required: true },
  updated_id: { type: ObjectId },
  updated_at: { type: Date }
}, { versionKey: false });

const Groups = mongoose.model('groups', groupsSchema);

// members config
const membersSchema = new mongoose.Schema({
  group_id: { type: ObjectId, required: true },
  member_id: { type: ObjectId, required: true },
}, { versionKey: false });

const Members = mongoose.model('members', membersSchema);

app.post('/api/register/group', async (req, res) => {
  const email = req.body.email;
  const members = req.body.members;

  try {
    const resultUser = await Users.findOne({
      email: email
    })

    console.log(resultUser);

    const newGroup = new Groups({
      group_name: req.body.group_name,
      registered_id: resultUser._id,
      registered_at: new Date(),
      updated_id: resultUser._id, // need to modify
      updated_at: new Date(), // need to modify
    })
    const resultGroup = await newGroup.save();
    // const resultOne = await newMember.save();
    console.log(`Inserted user with id ${resultGroup._id}`);

    console.log(`Inserted user with id ${members}`);
    // create a member
    const membersEmail = await Users.find({ email: { $in: members } },
      { email: 0, name: 0, password: 0, _id: 1 });

    const groupMembers = membersEmail.map((memberEmail) => ({
      group_id: resultGroup._id,
      member_id: memberEmail,
    }));

    console.log("membersEmail", membersEmail);
    console.log("groupMembers", groupMembers);

    const resultMembers = await Members.insertMany(groupMembers);
    console.log(resultMembers);
    res.json(resultMembers);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get("/api/friends", async (req, res) => {
  try {
    const friends = await Friends.find({ user_id: "6420f19694702130209f4743" },
      { friend_id: 1, _id: 0 });
    const friendIds = friends.map((friend) => friend.friend_id);
    const users = await Users.find({ _id: { $in: friendIds } },
      { email: 1, name: 1, password: 0, _id: 0 });
    console.log(friendIds);
    console.log(users);
    res.json(users);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get("/api/get/categories", async (req, res) => {
  try {
    const categories = await Categories.find({},
      { _id: 1, category_name: 1 });
    console.log(categories);
    res.json(categories);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.post("/api/friend/exist", async (req, res) => {
  const value = req.body.value;
  try {
    const users = await Users.countDocuments({
      email: value
    })
    console.log(users);
    res.json(users);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

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

app.post("/api/get/user", async (req, res) => {
  const email = req.body.email;
  try {
    const users = await Users.findOne({
      email: email
    })
    console.log(users);
    res.json(users);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});


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

app.post('/api/register/user', async (req, res) => {
  const newUser = new Users({
    email: req.body.email,
    password: req.body.password
  })

  try {
    const result = await newUser.save();
    console.log(`Inserted user with id ${result._id}`);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});