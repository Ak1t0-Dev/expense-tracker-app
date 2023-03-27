import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://admin001:Adm1n001@cluster0.7hck5vk.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DBに接続しました。");
  })
  .catch(() => {
    console.log("DBに失敗しました。");
  });
