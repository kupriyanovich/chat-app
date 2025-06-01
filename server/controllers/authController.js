const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Можно вынести в .env для безопасности
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

const register = async (req, res) => {
  try {
    const { nickname, password } = req.body;

    const existingUser = await User.findOne({ nickname });
    if (existingUser) {
      return res.status(400).json({ message: "Никнейм уже занят" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ nickname, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Пользователь создан" });
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const login = async (req, res) => {
  try {
    const { nickname, password } = req.body;

    const user = await User.findOne({ nickname });
    if (!user) {
      return res.status(400).json({ message: "Неверный никнейм или пароль" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Неверный никнейм или пароль" });
    }

    // Генерация JWT с полем nickname
    const token = jwt.sign({ nickname: user.nickname }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error("Ошибка входа:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

module.exports = { register, login };
