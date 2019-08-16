const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const Comments = require('./models/comments');

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/test';
mongoose.connect(MONGODB_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const router = express.Router();

 router.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

router.get('/comments', (req, res) => {
  Comments.find((err, comments) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: comments });
  });
});

router.post('/comments', (req, res) => {

  const Comment = new Comments();
  const { username, comment, userPic } = req.body;
  if (!username || !comment) {
    
    return res.json({
      success: false,
      error: console.log(req.body)
    });
  }
  Comment.username = username;
  Comment.comment = comment;
  Comment.userPic = userPic;
  console.log(Comment)
  Comment.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  app.use('/api', router);

  app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
  });
}
