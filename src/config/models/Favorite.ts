import mongoose, { Schema } from "mongoose";

const FavoriteSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    propertyId: {
        type: String,
        required: true,
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});
const Favorite = mongoose.model('Favorite', FavoriteSchema);
export { Favorite, FavoriteSchema };