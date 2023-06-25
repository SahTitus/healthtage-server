// // server.js (or your Express server file)

// const express = require('express');
// const { MongoClient } = require('mongodb');
// const app = express();

// // MongoDB connection URL
// const mongoURL = 'mongodb://localhost:27017';
// const dbName = 'blogDB';

// // Connect to MongoDB
// MongoClient.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
//   if (err) {
//     console.error('Error connecting to MongoDB:', err);
//     return;
//   }

//   console.log('Connected to MongoDB');

//   // Set the database object
//   const db = client.db(dbName);

//   // Define a route for search endpoint
//   app.get('/api/search', (req, res) => {
//     const { query, category, tags } = req.query;

//     // Perform search logic using MongoDB queries
//     const filter = {
//       $and: [
//         { $or: [{ title: { $regex: query, $options: 'i' } }, { content: { $regex: query, $options: 'i' } }] },
//         category ? { category } : {},
//         tags ? { tags: { $in: tags } } : {},
//       ],
//     };

//     // Fetch the filtered blog posts from MongoDB
//     db.collection('blogPosts')
//       .find(filter)
//       .toArray()
//       .then((filteredPosts) => {
//         // Return the search results
//         res.json(filteredPosts);
//       })
//       .catch((error) => {
//         console.error('Error retrieving blog posts:', error);
//         res.status(500).json({ error: 'An error occurred while retrieving blog posts' });
//       });
//   });

//   // Start the server
//   app.listen(3000, () => {
//     console.log('Server is running on port 3000');
//   });
// });


import Article from "../model/article.js";
import PublishedArticle from "../model/publishedArticle.js";


export const getArticles = async (req, res) => {
  const { skip } = req.query;
  const totalCount = await Article.countDocuments({});
  const total_pubCount = await PublishedArticle.countDocuments({});

  const skipCount = skip || 0;

  let articles1 = [];
  if (total_pubCount > skipCount) {
    articles1 = await PublishedArticle.find({}).sort({ _id: -1 }).skip(skipCount).limit(10).lean();
  }


  const articles2 = await Article.aggregate([{ $sample: { size: 6 } }]);
  const articles = [...articles1, ...articles2];
  res.status(200).json({ articles, totalCount, total_pubCount, noPubFetched: articles1.length });

  if (!articles) {
    return res.status(204).json({ message: "No articles found" });
  }
};

export const getArticlesByCategory = async (req, res) => {
  const { queryCategory } = req.query;

  try {
    const category_id = new RegExp(queryCategory, "i");

    const totalCount = await Article.countDocuments({
      category_id: category_id,
    });

    const total_pubCount = await PublishedArticle.countDocuments({
      category_id: category_id,
    });

    const articles1 = await Article.aggregate([
      {
        $match: {
          category_id: category_id,
        },
      },
      { $sample: { size: 10 } },
    ])
    const articles2 = await PublishedArticle.aggregate([
      {
        $match: {
          category_id: category_id,
        },
      },
      { $sample: { size: 10 } },
    ])

    const articles = [...articles2, ...articles1]

    res.status(200).json({ articles, totalCount, total_pubCount, noPubFetched: articles2.length });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
export const getArticlesBySearch = async (req, res) => {
  const { searchTerm } = req.query;

  const default_limit = 10;
  const skip = req.query.skip ? Number(req.query.skip) : 0;

  try {
    const title = new RegExp(searchTerm, "i");

    const totalCount = await Article.countDocuments({ title: title });
    const total_pubCount = await PublishedArticle.countDocuments({ title: title });

    const articles1 = await Article.find({ title: title })
      .skip(skip)
      .limit(default_limit)
      .sort({ title: 1 })
    const articles2 = await PublishedArticle.find({ title: title })
      .skip(skip)
      .limit(default_limit)
      .sort({ title: 1 })

    const articles = [...articles2, ...articles1]
    res.status(200).json({ articles, totalCount, total_pubCount, noPubFetched: articles2.length });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getArticle = async (req, res) => {
  const mentorId = req?.params?.id;
  if (!mentorId) {
    return res.status(400).json({ message: "Article ID is required." });
  }
  const article = await Article.findOne({ _id: mentorId }).exec();
  if (!article) {
    return res
      .status(400)
      .json({ message: `Article ID ${mentorId} not found` });
  }
  res.json(article);
};
