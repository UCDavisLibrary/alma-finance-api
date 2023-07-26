const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const PORT = process.env.PORT || 5000;

const routes = require('./routes/routes');
const db = require('./util/database');

// instantiate an express app
const app = express();

// cors
app.use(cors({ origin: '*' }));

// here you set that all templates are located in `/views` directory
app.set('views', __dirname + '/views');

// here you set that you're using `ejs` template engine, and the
// default extension is `ejs`
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/views', express.static(process.cwd() + '/views')); //make public static

app.use(routes);

/*************************************************/
// Express server listening...
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
