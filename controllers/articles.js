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
