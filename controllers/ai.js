import { Configuration, OpenAIApi } from 'openai'
import AiQuery from '../model/aiQuery.js';

const rule = `NOTE! The actual query starts from 'MY QUERY IS'. 
If the rest of the questions is not within biology or health scope then, response to me that the question is out of scope and you're trained to answer questions or topics related to biology and health only. `

export const ai = async (req, res) => {
    const configuration = new Configuration({
        apiKey: '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',
    });

    const openai = new OpenAIApi(configuration);

    try {

        const query = req.body.prompt;

        const prompt = rule + "MY QUERY IS " + query + ` Note! Follow these rules 1. first check if the question or query or keyword and topics is outside the scope of biology or health, TELL the user that the query is out of scope! 
        2.don't answer questions that are outside health and biology scope!
        3. you CAN response to greetings if you are been greeted and then ask how you may help them! `;

        // await AiQuery.create({ query: query });
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0.7, // Higher values means the model will take more risks.
            max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
            top_p: 1, // alternative to sampling with temperature, called nucleus sampling
            frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
            presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
        });

        res.status(200).json({
            bot: response.data.choices[0].text,
            prompt: prompt,
        });

    } catch (error) {
        console.error(error.message)
        res.status(500).send(error || 'Something went wrong');
    }
}

