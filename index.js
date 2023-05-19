require('dotenv').config()
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const router = require('./router/index');
const errorMiddleware = require('./middlewares/error-middleware');
const UserModel = require('./models/user-model');

// // Установим подключение по умолчанию
// mongoose.connect('mongodb://127.0.0.1/my_database');
// // Позволим Mongoose использовать глобальную библиотеку промисов
// mongoose.Promise = global.Promise;
// // Получение подключения по умолчанию
// var db = mongoose.connection;

// Привязать подключение к событию ошибки  (получать сообщения об ошибках подключения)
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: `${process.env.CLIENT_URL}:${process.env.CLIENT_PORT}`
}));
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
  const SERVER_PORT = process.env.SERVER_PORT || 5000;

  try {
    const connection = await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    // TODO: Создать базу, чтобы не было дефолтного названия
    
    app.listen(SERVER_PORT, () => console.log(`Server started on port ${SERVER_PORT}`))
  } catch (error) {
    console.log(error);
  }
}

start()
