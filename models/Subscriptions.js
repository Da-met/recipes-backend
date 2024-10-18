import mongoose from 'mongoose';

const SubscriptionsSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subscriptions: {
        type: Array,
    },

    }, 
);

export default mongoose.model('Subscriptions', SubscriptionsSchema);