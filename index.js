import express  from "express"; 
import mongoose from "mongoose"; 
import { registerValidation,loginValidation, postCreateValidation } from "./validation.js"; 
import checkAuth from "./utils/checkAuth.js"; 
import * as UserController from "./utils/controllers/UserController.js";
import * as PostController from "./utils/controllers/PostController.js";
import multer from "multer";


mongoose.connect(
  'mongodb+srv://nuralim1232:nar!topo@cluster1.0wg8cej.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('db ok'))
  .catch((err) => console.log('db error',err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());

app.post('/auth/login',loginValidation, UserController.login)
app.post('/auth/register',registerValidation, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe);     

app.get('/posts',checkAuth,PostController.getAll)
app.get('/posts/:id',PostController.getOne)
app.delete('/posts/:id',checkAuth,PostController.remove)
app.patch('/posts/:id',checkAuth,postCreateValidation,PostController.update)

app.post('/posts/create',checkAuth,postCreateValidation,PostController.create)

app.listen(3000, () => {
    console.log('start');
})

