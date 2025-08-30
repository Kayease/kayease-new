import mongoose from "mongoose";

const CallbackRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 100,
    },
    preferredTime: {
      type: Date,
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["new", "in-progress", "contacted"],
      default: "new",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for status label
CallbackRequestSchema.virtual("statusLabel").get(function () {
  const statusLabels = {
    new: "New",
    "in-progress": "In Progress",
    contacted: "Contacted",
  };
  return statusLabels[this.status] || this.status;
});

// Virtual for formatted date
CallbackRequestSchema.virtual("formattedDate").get(function () {
  return new Date(this.createdAt).toLocaleDateString();
});

// Virtual for formatted time
CallbackRequestSchema.virtual("formattedTime").get(function () {
  return new Date(this.preferredTime).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

// Indexes
CallbackRequestSchema.index({ createdAt: -1 });
CallbackRequestSchema.index({ status: 1 });
CallbackRequestSchema.index({ isRead: 1 });

export default mongoose.model("CallbackRequest", CallbackRequestSchema);
