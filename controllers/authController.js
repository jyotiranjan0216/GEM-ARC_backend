// backend/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import generateToken from '../utils/generateToken.js';

export const userRegister = async (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return res.status(400).json({ msg: 'Passwords do not match' });

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ msg: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, phone, password: hashedPassword });

  const token = generateToken(user._id);
  res.status(201).json({ user, token });
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

  const token = generateToken(user._id);
  res.json({ user, token });
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(400).json({ msg: 'Invalid Admin credentials' });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ msg: 'Invalid Admin credentials' });

  const token = generateToken(admin._id, true);
  res.json({ admin, token });
};
