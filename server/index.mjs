import express from 'express';
import mongoose from 'mongoose';

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


const usersSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
}, { versionKey: false });

const Users = mongoose.model('users', usersSchema);

app.get("/api/friend", async (req, res) => {
  try {
    const users = await Users.find({},
      { email: 1, password: 0, _id: 0 });
    console.log(users);
    res.json(users);
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

app.post('/api/user', async (req, res) => {
  const newUser = new Users({
    email: req.body.email,
    password: req.body.password
  })

  try {
    const result = await newUser.save();
    console.log(`Inserted user with id ${result._id}`);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});