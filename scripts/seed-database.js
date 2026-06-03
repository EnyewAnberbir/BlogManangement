#!/usr/bin/env node
/**
 * Development seed script for local environments.
 * Requires MONGODB_URI and JWT_SECRET in environment.
 */
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const { connectDatabase } = require('../appi/db/connection');
const User = require('../appi/models/User');
const Post = require('../appi/models/Post');
const Category = require('../appi/models/Category');
const Tag = require('../appi/models/Tag');
const { hashPassword } = require('../appi/lib/password');

const sampleCategories = [
  { name: 'Engineering', description: 'Build logs and architecture notes' },
  { name: 'Product', description: 'Roadmaps and release notes' },
  { name: 'Community', description: 'Interviews and contributor stories' }
];

const sampleTags = ['nodejs', 'mongodb', 'react', 'editorial', 'performance'];

const samplePosts = [
  {
    title: 'Designing a layered publishing API',
    summary: 'How we split routes, services, and repositories for maintainability.',
    content: '<p>Layered boundaries keep auth and persistence concerns isolated.</p>'
  },
  {
    title: 'Comment moderation workflows that scale',
    summary: 'A practical state machine for pending, approved, and rejected comments.',
    content: '<p>Moderation queues should be visible to editors in one dashboard.</p>'
  },
  {
    title: 'Newsletter digests without over-mailing readers',
    summary: 'Weekly digests can reuse analytics rollups instead of ad-hoc queries.',
    content: '<p>Batch jobs should be idempotent and observable through audit logs.</p>'
  }
];

async function upsertEditor() {
  const username = process.env.SEED_EDITOR_USERNAME || 'editor';
  let user = await User.findOne({ username });
  if (!user) {
    user = await User.create({
      username,
      password: hashPassword(process.env.SEED_EDITOR_PASSWORD || 'editorPass123'),
      displayName: 'Lead Editor',
      role: 'editor'
    });
  }
  return user;
}

async function seedTaxonomy() {
  const categories = [];
  for (const entry of sampleCategories) {
    let category = await Category.findOne({ name: entry.name });
    if (!category) category = await Category.create(entry);
    categories.push(category);
  }

  const tags = [];
  for (const name of sampleTags) {
    let tag = await Tag.findOne({ name });
    if (!tag) tag = await Tag.create({ name });
    tags.push(tag);
  }

  return { categories, tags };
}

async function seedPosts(editor, categories, tags) {
  const created = [];
  for (let index = 0; index < samplePosts.length; index += 1) {
    const payload = samplePosts[index];
    const existing = await Post.findOne({ title: payload.title });
    if (existing) {
      created.push(existing);
      continue;
    }

    const post = await Post.create({
      ...payload,
      cover: `uploads/seed-cover-${index + 1}.png`,
      author: editor._id,
      status: 'published',
      category: categories[index % categories.length]._id,
      tags: [tags[index % tags.length]._id, tags[(index + 1) % tags.length]._id]
    });
    created.push(post);
  }
  return created;
}

async function main() {
  const mongodbUri = process.env.MONGODB_URI;
  if (!mongodbUri) {
    console.error('MONGODB_URI is required for seeding.');
    process.exit(1);
  }

  await connectDatabase(mongodbUri);
  const editor = await upsertEditor();
  const { categories, tags } = await seedTaxonomy();
  const posts = await seedPosts(editor, categories, tags);

  console.log(
    JSON.stringify(
      {
        editor: editor.username,
        categories: categories.length,
        tags: tags.length,
        posts: posts.length
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
