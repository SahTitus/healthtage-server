import striptags from "striptags";
import PublishedArticle from "../model/publishedArticle.js";
import mongoose from "mongoose";


export const getArticles = async (req, res) => {
    const totalCount = await PublishedArticle.countDocuments({});
    const articles = await PublishedArticle.aggregate([{ $sample: { size: 10 } }]);

    res.status(200).json({ articles, totalCount });

    if (!articles) {
        return res.status(204).json({ message: "No articles found" });
    }
};



export const publishArticle = async (req, res) => {
    const article = req.body;

    try {


        const strippedText = striptags(article.content);
        const wordsPerMinute = 200; // Adjust the words per minute

        const words = countWords(strippedText);
        const readingTime = Math.ceil(words / wordsPerMinute);

        // Helper function to count the number of words in the content
        function countWords(content) {
            // Remove extra white spaces and line breaks
            const cleanedContent = content?.replace(/\s+/g, ' ').trim();

            const words = cleanedContent?.split(' ');
            // Filter out empty words (e.g., multiple white spaces)
            const filteredWords = words?.filter(word => word !== '');

            return filteredWords?.length;
        }


        const result = await PublishedArticle.create({
            ...article,
            author: 'Sah Titus Samuel',
            healthtage: true,
            reading_time: readingTime,
            publishedAt: new Date().toISOString(),
        });

        res.status(200).json({ result, status: '200' });
    } catch (err) {
        console.error(err);
    }
};


export const getArticle = async (req, res) => {
    const articleId = req?.params?.id;

    const objectId = mongoose.Types.ObjectId(articleId);
    if (!articleId) {
        return res.status(400).json({ message: "Article ID is required." });
    }

    if (!mongoose.Types.ObjectId.isValid(articleId)) {
        return res.status(400).send({ message: ` ID ${articleId} not found` });
    }
    try {
        const article = await PublishedArticle.findById(objectId)
        res.json(article);

    } catch (error) {
        res.status(400).json({ message: `Article ID ${articleId} not found` });
    }
}

