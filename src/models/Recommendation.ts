import mongoose, { Schema } from 'mongoose';

const RecommendationSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
}, { timestamps: true });

export const Recommendation = mongoose.model('Recommendation', RecommendationSchema);