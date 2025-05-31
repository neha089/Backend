import mongoose, { Schema } from 'mongoose';

const SearchHistorySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  query: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const SearchHistory = mongoose.model('SearchHistory', SearchHistorySchema);