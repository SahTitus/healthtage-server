import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import isEmail from "validator/lib/isEmail.js";
import User from "../model/user.js";
import normalizeEmail from "validator/lib/normalizeEmail.js";
import Article from "../model/article.js";

const secret =
  "1**2v****hft26525w5d2sswxkbXX`Y8******771@425525DS8GCGGGSHV****a12e2e78e22e";

const verifyEmail = (userEmail) => {
  userEmail = normalizeEmail(userEmail);

  if (!isEmail(userEmail)) {
    res
      .status(400)
      .json({ error: { message: "The email you entered is invalid." } });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.status(204).json({ message: "No user found" });
  }

  res.json(user);
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  verifyEmail(email);

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      secret,
      { expiresIn: "1000h" }
    );


    // return no password
    existingUser.password = undefined;

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const signup = async (req, res) => {
  const { email, name, password } = req.body;

  verifyEmail(email);

  try {
    const existingUser = await User.findOne({ email });
    const existingPassword = await User.findOne({ password });

    if (existingUser || existingPassword) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      name,
      isGoogle: false,
    });

    result.password = null;

    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "1000h",
    });

    result.password = undefined;

    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const googleAuth = async (req, res) => {
  const { email, photo, name } = req.body;

  try {
    const userExist = await User.findOne({ email });

    if (userExist) {
      const token = jwt.sign(
        { email: userExist.email, id: userExist._id },
        secret,
        { expiresIn: "1000h" }
      );
      res.status(200).json({ result: userExist, token });
    } else {
      const result = await User.create({
        email: email,
        photo: photo,
        password: "1321334578222",
        name: name,
        isGoogle: true,
      });

      const token = jwt.sign({ email: result.email, id: result._id }, secret, {
        expiresIn: "1000h",
      });

      result.password = undefined;

      res.status(200).json({ result, token });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const addToFavoriteArticles = async (req, res) => {
  const articleId = req.query.articleId
  const userId = req.params.id

  const userData = await User.findOne({ _id: userId });

  try {

    if (!userId || !articleId) return res.status(403).json({ message: 'Invalid user' })

    const article = await Article
      .findOne({ _id: articleId });


    const index = userData.favoriteArticles.findIndex((id) => id === articleId);

    if (index === -1) {
      userData.favoriteArticles.push(articleId);
      article.saves.push(userId);
    } else {
      userData.favoriteArticles = userData.favoriteArticles.filter(
        (id) => id !== articleId
      );
      article.saves = article.saves.filter((id) => id !== userId);
    }

    await
      Article.findOneAndUpdate(
        { _id: articleId },
        { $set: article }
      )

    await User.findOneAndUpdate(
      { _id: userId },
      { $set: userData },
      { projection: { password: 0 } }
    )

    res.status(200).json({ message: 'Added to your favorites successfully' });
  } catch (error) {
    console.log(error)
    res.status(200).json({ message: 'Something went wrong' });
  }

};

export const fetchFavoriteArticles = async (req, res) => {
  const userId = req.params.id;

  try {
    const userData = await User.findOne({ _id: userId });

    const ids = userData?.favoriteArticles

    const articles = await Article
      .find({ _id: { $in: ids } })
      .sort({
        _id: -1,
      })

    res.status(200).json(articles);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' });
  }

};