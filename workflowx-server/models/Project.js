import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["planning", "active", "on-hold", "completed"],
      default: "planning",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    deadline: {
      type: Date,
    },
    color: {
      type: String,
      default: "#3B82F6", 
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Project", projectSchema);