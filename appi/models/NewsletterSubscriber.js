const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const NewsletterSubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    status: { type: String, enum: ['active', 'unsubscribed'], default: 'active', index: true },
    source: { type: String, trim: true, maxlength: 40, default: 'web' }
  },
  { timestamps: true }
);

module.exports = model('NewsletterSubscriber', NewsletterSubscriberSchema);
