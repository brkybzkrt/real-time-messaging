import mongoose from 'mongoose';
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content:      { type: String, required: true },
    readBy:       [{ type: Schema.Types.ObjectId, ref: 'User' }], // read by users
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
