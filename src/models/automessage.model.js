import mongoose from 'mongoose';
const { Schema } = mongoose;

const autoMessageSchema = new Schema(
  {
    sender:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content:     { type: String, required: true },
    sendDate:    { type: Date,   required: true },
    isQueued:    { type: Boolean, default: false },
    isSent:      { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('AutoMessage', autoMessageSchema);
