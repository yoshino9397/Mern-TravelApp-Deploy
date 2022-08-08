import mongoose from "mongoose";

const PinSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      min: 3,
      max: 60,
    },
    desc: {
      type: String,
      required: true,
      min: 3,
    },
    img: {
      type: String,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    long: {
      ///=longitude
      type: Number,
      required: true,
    },
    lat: {
      ///=lattitude
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
  ///ある値が作られた時間を記録するもの。サーバー側からもクライアント側からも使用することができる。
);

export default mongoose.model("Pin", PinSchema);
