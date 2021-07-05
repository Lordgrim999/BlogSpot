/*  eslint linebreak-style: ["error", "windows"]    */
const express = require('express');
const Article = require('../models/articleSchema');

const articleRouter = express.Router();

function articleMiddleware(path) {
  return async (req, res) => {
    let { article } = req;
    article.title = req.body.title;
    article.category = req.body.category;
    article.description = req.body.description;
    article.markdown = req.body.markdown;
    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (err) {
      res.render(`${path}`, {
        article,
      });
    }
  };
}

articleRouter.route('/new')
  .get((req, res) => {
    res.render('newArticle',
      {
        title: 'New Article',
        article: new Article(),
      });
  });

articleRouter.route('/:slug')
  .get((req, res) => {
    (async function show() {
      try {
        const article = await Article.findOne({ slug: req.params.slug });
        if (article == null) {
          res.redirect('/');
        } else {
          res.render('showArticle', {
            article,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }());
  });

articleRouter.route('/')
  .post((req, res, next) => {
    req.article = new Article();
    next();
  }, articleMiddleware('newArticle'));

articleRouter.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

articleRouter.put('/:slug', async (req, res, next) => {
  req.article = await Article.findOne({ slug: req.params.slug });
  next();
}, articleMiddleware('Edit'));
articleRouter.get('/edit/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  res.render('Edit', { article });
});

module.exports = articleRouter;
