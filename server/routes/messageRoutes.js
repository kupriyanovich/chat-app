const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// Получить все сообщения
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при загрузке сообщений" });
  }
});

// Добавить новое сообщение
router.post("/", async (req, res) => {
  try {
    const { sender, text } = req.body;
    const message = new Message({ sender, text, timestamp: new Date() });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при отправке сообщения" });
  }
});

// Редактировать сообщение
router.put("/:id", async (req, res) => {
  try {
    const { text } = req.body;
    const updated = await Message.findByIdAndUpdate(req.params.id, { text }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при редактировании" });
  }
});

// Удалить сообщение
router.delete("/:id", async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Удалено" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка при удалении" });
  }
});

module.exports = router;
