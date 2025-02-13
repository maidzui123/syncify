import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  content: { type: String, required: true },
  star: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

assessmentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Assessment = mongoose.model("assessments", assessmentSchema);

export { Assessment };
