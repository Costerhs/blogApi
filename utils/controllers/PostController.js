import PostModel from "../../models/Post.js"

export const create = async (req,res) => {
    try {
        const doc = new PostModel({
            title:req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        });

        const post = await doc.save();
        res.json(post);
    } catch (err){
        console.log(err);
        res.status(500).json({
          message: 'Не удалось создать статью',
          err
        })
    }
};

export const getAll = async(req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    const myPosts = posts.filter((el) => el.user._id == req.userId);
    res.json(myPosts)
  }catch (err){

    res.status(500).json({
      message: 'Не удалось создать статью',
      err
    })
}
}

export const getOne = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: id },
      { $inc: { viewsCount: 1 } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({
        message: "статья не найдена"
      });
    }

    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Не удалось получить статью',
      err
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const deletedPost = await PostModel.findOneAndDelete({
      _id: postId,
      user: userId
    });

    if (!deletedPost) {
      return res.status(404).json({
        success: false,
        message: 'Статья не найдена или у вас нет прав для удаления'
      });
    }
    console.log(deletedPost);
    
    if (deletedPost.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'У вас нет прав для удаления этой статьи'
      });
    }

    res.json({
      success: true,
      message: 'Статья успешно удалена'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Не удалось удалить статью',
      err
    });
  }
};

export const update = async (req, res) => {
  console.log('asdsad');
  
  try {
    const postId = req.params.id;
    const userId = req.userId;
    await PostModel.updateOne(
      {
        _id: postId,
        user: userId
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags,
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};