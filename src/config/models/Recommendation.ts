import mongoose , {Schema} from "mongoose";

const RecommendationSchema = new Schema({
    senderId: {   
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    propertyId: {
        type: String,
        required: true,
    },
    recipientId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});
const Recommendation = mongoose.model('Recommendation', RecommendationSchema);
export { Recommendation, RecommendationSchema };