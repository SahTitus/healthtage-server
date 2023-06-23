import striptags from "striptags";
import publishedArticle from "../model/publishedArticle.js";

export const publishArticle = async (req, res) => {
    const article = req.body;

    try {
        // if (!mongoose.Types.ObjectId.isValid(article.id))
        //     return res.status(400).send({ message: `User ID ${id} not found` });

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


        const result = await publishedArticle.create({
            ...article,
            author: 'Sah Titus Samuel',
            healthtage: true,
            reading_time: readingTime,
            publishedAt: new Date().toISOString(),
        });

        res.status(200).json({result, status: '200'});
    } catch (err) {
        console.error(err);
    }
};