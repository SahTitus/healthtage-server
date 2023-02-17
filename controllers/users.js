import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../model/user.js";

const secret = "test";

export const getUsers = async (req, res) => {
  const users = await User.find();
  if (!users) {
    return res.status(204).json({ message: "No user found" });
  }
  res.json(users);
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

  try {
    const existingUser = await User.findOne({ email });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!existingUser || !isPasswordCorrect)
    return res.status(404).json({ message: "Invalid credentials", type: 'msg' });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      secret,
      { expiresIn: "1000h" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong.", });
  }
};

export const signup = async (req, res) => {
  const { email, firstName, image, lastName, password, confirmPassword } =
    req.body;

  try {
    const existingUser = await User.findOne({ email });
    const passwordExist = await User.findOne({ password });

    if (existingUser)
      return res.status(400).json({ message: "User already exists", type: 'msg' });

    if (passwordExist)
      return res.status(400).json({ message: "Password already exists", type: 'msg' });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password doesn't match", type: 'msg' });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      mentorshipDp: null,
      image: image,
      mentorshipName: "",
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "1000h",
    });

    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const googleAuth = async (req, res) => {
  const { email, photoURL, displayName } = req.body;

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
        mentorshipDp: null,
        image: photoURL,
        mentorshipName: "",
        password: "1321334578222",
        name: displayName,
        department: "",
        age: "",
        religion: "",
        program: "",
        rationale: "",

      });

      const token = jwt.sign({ email: result.email, id: result._id }, secret, {
        expiresIn: "1000h",
      });

      res.status(200).json({ result, token });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const user = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send({ message: `User ID ${id} not found` });

  const token = jwt.sign({ email: user.email, id: user._id }, secret, {
    expiresIn: "1h",
  });

  const result = await User.findByIdAndUpdate(id, user, { new: true }).sort({
    updatedAt: -1,
  });

  res.json({ result, token });
};