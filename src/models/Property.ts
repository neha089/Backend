import mongoose, { Schema } from 'mongoose';

const PropertySchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  amenities: [{ type: String }], // Array of strings
  tags: [{ type: String }], // Array of strings
  listingType: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Property = mongoose.model('Property', PropertySchema);