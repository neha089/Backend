import mongoose, { Schema } from 'mongoose';

const FavoriteSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
}, { timestamps: true });

export const Favorite = mongoose.model('Favorite', FavoriteSchema);