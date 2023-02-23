import Topic from "../model/topic.js";

export const getTopics = async (req, res) => {
  const skip = req.query.skip ? Number(req.query.skip) : 0;

  try {
    const topics = await Topic.find().skip(skip).limit(20).sort({ title: 1 });

    if (!topics) {
      return res.status(200).send({ message: `No data` });
    }

    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

export const getTopicsBySearch = async (req, res) => {
  const { searchTerm } = req.query;
  const skip = req.query.skip ? Number(req.query.skip) : 0;

  try {
    const topic = new RegExp(searchTerm, "i");

    const totalCount = await Topic.countDocuments({ title: topic });

    const topics = await Topic.find({ title: topic })
      .skip(skip)
      .limit(15)
      .sort({ title: 1 })

    res.status(200).json({ topics, totalCount });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};