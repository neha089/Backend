import mongoose, {Schema} from "mongoose";

const PropertySchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    state: {
        type: String,
    },
    city: {
        type: String,
    },
    areaSqFt: {
        type: Number,
        required: true,
    },
    bedrooms: {
        type: Number,
        required: true,
    },
    bathrooms: {
        type: Number,
        required: true,
    },
    amenities: {
        type: [String],
        default: []
    },
    furnished: {
        enum: ['Furnished', 'Semi', 'Unfurnished'],
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        default: []
    },
    availableFrom: {
        type: Date,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0
    },
    colorTheme: {
        type: String,
    },
    listingType: {
        type: String,
        enum: ['Rent', 'Sale'],
        required: true
    },
    listedBy: {
        type: String,
        enum: ['Owner', 'Agent', 'Builder'],
        required: true
    },
    createdBy: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});
export const Property = mongoose.model('Property', PropertySchema);
