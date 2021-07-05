/*  eslint linebreak-style: ["error", "windows"]    */
const express = require('express');
const path = require('path');
const debug = require('debug')('app');
const chalk = require('chalk');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const article = require('./src/models/articleSchema');

mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
const articleRouter = require('./src/routes/article');

app.set('views', './src/views');
app.set('view engine', 'ejs');
const port = process.env.PORT || 3000;

app.use('/articles', articleRouter);

app.get('/', async (req, res) => {
  const articles = await article.find().sort({ date: 'desc' });
  res.render('index',
    {
      title: 'Blogs',
      articles,
    });
});

app.listen(port, () => {
  debug(`Server is listening on port ${chalk.green(port)}`);
});
