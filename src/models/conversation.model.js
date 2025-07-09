import mongoose from 'mongoose';
const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isGroup:      { type: Boolean, default: false },
    groupName:    { type: String, required: false },  // must provide, if only group
  },
  { timestamps: true }
);

export default mongoose.model('Conversation', conversationSchema);