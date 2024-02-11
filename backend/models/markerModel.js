import mongoose from "mongoose";

const markerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isFriendly: {
      type: Boolean,
      default: true,
    },
    imgUrl: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

markerSchema.pre('save', function(next) {
  this.updatedBy = this.user;
  next();
});

const Marker = mongoose.model("Marker", markerSchema);

export default Marker;
