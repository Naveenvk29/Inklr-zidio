import mongoose from "mongoose";

const viewSchema = new mongoose.Schema({
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  viewedAt: {
    type: Date,
    default: Date.now(),
  },
});

viewSchema.index({ blog: 1, user: 1 }, { unique: true });

const View = mongoose.model("View", viewSchema);

export default View;
