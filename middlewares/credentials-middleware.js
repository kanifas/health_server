const allowedOrigins = [
  `${process.env.CLIENT_URL}:${process.env.CLIENT_PORT}`,
  'http://healthclient.onrender.com',
  'https://healthclient.onrender.com'
];

const credentials = (req, res, next) => {
  const origin = req.get('Origin');
  if (allowedOrigins.includes(origin)) {
      res.set({
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Credentials': true
      })
  }
  next();
}

module.exports = credentials
