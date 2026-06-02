const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
const { getConfig } = require('./config');
const requestIdMiddleware = require('./middleware/requestId');
const requestLogger = require('./middleware/requestLogger');
const { requireAuth } = require('./middleware/auth');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { createHttpError } = require('./lib/httpError');
const {
  validateRegisterPayload,
  validateLoginPayload,
  validatePostPayload,
  parsePagination
} = require('./lib/validators');

const salt = bcrypt.genSaltSync(10);
const authCookieName = 'token';
const authCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production'
};

function createApp(config = getConfig()) {
  const app = express();
  const ensureAuth = requireAuth(config.jwtSecret);

  app.use(requestIdMiddleware);
  app.use(requestLogger);
  app.use(cors({ credentials: true, origin: config.corsOrigin }));
  app.use(express.json());
  app.use(cookieParser());
  app.use('/uploads', express.static(__dirname + '/uploads'));

  app.get('/health', (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.post('/register', async (req, res, next) => {
    try {
      const { username, password } = validateRegisterPayload(req.body);
      const userDoc = await User.create({
        username,
        password: bcrypt.hashSync(password, salt)
      });
      res.json(userDoc);
    } catch (error) {
      if (error.code === 11000) {
        return next(createHttpError(409, 'username already exists'));
      }
      next(createHttpError(400, error.message));
    }
  });

  app.post('/login', async (req, res, next) => {
    try {
      const { username, password } = validateLoginPayload(req.body);
      const userDoc = await User.findOne({ username });
      if (!userDoc) {
        throw createHttpError(400, 'wrong credentials');
      }
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (!passOk) {
        throw createHttpError(400, 'wrong credentials');
      }

      jwt.sign({ username, id: userDoc._id }, config.jwtSecret, {}, (err, token) => {
        if (err) return next(err);
        res.cookie(authCookieName, token, authCookieOptions).json({
          id: userDoc._id,
          username
        });
      });
    } catch (error) {
      next(error);
    }
  });

  app.get('/profile', ensureAuth, (req, res) => {
    res.json(req.auth);
  });

  app.post('/logout', (_req, res) => {
    res.cookie(authCookieName, '', {
      ...authCookieOptions,
      expires: new Date(0)
    });
    res.json('ok');
  });

  app.post('/post', ensureAuth, uploadMiddleware.single('file'), async (req, res, next) => {
    try {
      if (!req.file) {
        throw createHttpError(400, 'file is required');
      }

      const { title, summary, content } = validatePostPayload(req.body, 'create');
      const { originalname, path: uploadPath } = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      const newPath = `${uploadPath}.${ext}`;
      fs.renameSync(uploadPath, newPath);

      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: req.auth.id
      });

      res.json(postDoc);
    } catch (error) {
      next(error);
    }
  });

  app.put('/post', ensureAuth, uploadMiddleware.single('file'), async (req, res, next) => {
    try {
      const { id, title, summary, content } = validatePostPayload(req.body, 'update');
      const postDoc = await Post.findById(id);

      if (!postDoc) {
        throw createHttpError(404, 'post not found');
      }
      if (!postDoc.author.equals(req.auth.id)) {
        throw createHttpError(403, 'you are not the author');
      }

      let coverPath = postDoc.cover;
      if (req.file) {
        const { originalname, path: uploadPath } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = `${uploadPath}.${ext}`;
        fs.renameSync(uploadPath, newPath);
        coverPath = newPath;
      }

      postDoc.title = title;
      postDoc.summary = summary;
      postDoc.content = content;
      postDoc.cover = coverPath;
      await postDoc.save();

      res.json(postDoc);
    } catch (error) {
      next(error);
    }
  });

  app.get('/post', async (req, res, next) => {
    try {
      const { page, limit, skip } = parsePagination(req.query);
      const [items, total] = await Promise.all([
        Post.find()
          .populate('author', ['username'])
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Post.countDocuments()
      ]);

      if (req.query.withMeta === 'true') {
        return res.json({
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          items
        });
      }

      return res.json(items);
    } catch (error) {
      next(error);
    }
  });

  app.get('/post/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const postDoc = await Post.findById(id).populate('author', ['username']);
      if (!postDoc) {
        throw createHttpError(404, 'post not found');
      }
      res.json(postDoc);
    } catch (error) {
      next(error);
    }
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

async function startServer() {
  const config = getConfig();
  if (config.mongodbUri) {
    try {
      await mongoose.connect(config.mongodbUri);
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection failed:', error.message);
      throw error;
    }
  } else {
    console.warn('MONGODB_URI is not set. Database-backed routes may fail.');
  }
  const app = createApp(config);
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  });
}

module.exports = { createApp, startServer };
