const NewsletterSubscriber = require('../models/NewsletterSubscriber');

async function subscribe(email, source = 'web') {
  const existing = await NewsletterSubscriber.findOne({ email });
  if (existing) {
    existing.status = 'active';
    existing.source = source;
    await existing.save();
    return existing;
  }
  return NewsletterSubscriber.create({ email, source });
}

async function unsubscribe(email) {
  return NewsletterSubscriber.findOneAndUpdate(
    { email },
    { status: 'unsubscribed' },
    { new: true }
  );
}

async function countActive() {
  return NewsletterSubscriber.countDocuments({ status: 'active' });
}

async function listActive({ skip = 0, limit = 100 } = {}) {
  return NewsletterSubscriber.find({ status: 'active' })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
}

module.exports = { subscribe, unsubscribe, countActive, listActive };
