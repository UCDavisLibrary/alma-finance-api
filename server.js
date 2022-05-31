const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 5000;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

// instantiate an express app
const app = express();

// cors
app.use(cors({ origin: '*' }));

app.use('/public', express.static(process.cwd() + '/public')); //make public static

//Index page (static HTML)
app.route('/').get(function (req, res) {
  res.sendFile(process.cwd() + '/public/index.html');
});

/*************************************************/
// Express server listening...
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
