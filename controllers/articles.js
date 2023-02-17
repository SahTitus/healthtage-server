import Article from "../model/article.js";
import User from "../model/user.js";
import mongoose from "mongoose";

// getArticle

export const getArticles = async (req, res) => {
  const totalCount = await Article.countDocuments({});
  const articles = await Article.aggregate([{ $sample: { size: 10 } }]);

  res.status(200).json({ articles, totalCount });

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

    const articles = await Article.aggregate([
      {
        $match: {
          category_id: category_id,
        },
      },
      { $sample: { size: 10 } },
    ])
    res.status(200).json({ articles, totalCount });
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

    const articles = await Article.find({ title: title })
      .skip(skip)
      .limit(default_limit)
      .sort({ title: 1 })
      

    res.status(200).json({ articles, totalCount });
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
