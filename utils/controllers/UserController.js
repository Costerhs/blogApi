import jwt from "jsonwebtoken"; 
import userModel from '../../models/User.js' 
import brcypt from 'bcryptjs'
// import User from "./models/User.js";
import { validationResult } from "express-validator"; 

export const register = async(req, res) => {
    try{
      const errors = validationResult(req);

    if(!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    
    const password = req.body.password;
    const salt = await brcypt.genSalt(10);
    const hash  = await brcypt.hash(password,salt)

    const doc = new userModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();
    const token = jwt.sign(
      {
      _id: user._id,
      },
       'secret123',
       {
        expiresIn: '30d'
       }
    )

    const {passwordHash, ...userData} = user._doc

    res.json({
      ...userData,
      token})
    } catch (err){
        console.log(err);
        res.status(500).json({
          message: 'Не удалось заристрироваться'
        })
    }
};

export const login = async(req, res) => {
    try{
      const user = await userModel.findOne({email:req.body.email});
  
      if(!user) {
        return res.status(404).json({
          message: "пользователь не найден"
        });
      }
  
      const isValidPass = await brcypt.compare(req.body.password, user._doc.passwordHash);
      if(!isValidPass) {
        return res.status(404).json({
          message: "неверный логин или пароль"
        });
      }
  
      const token = jwt.sign(
        {
        _id: user._id,
        },
         'secret123',
         {
          expiresIn: '30d'
         }
      );
  
      const {passwordHash, ...userData} = user._doc
  
      res.json({
        ...userData,
        token});
    } catch (err){
          console.log(err);
          res.status(500).json({
            message: 'Не удалось авторизоваться'
          })
    }
}
export const getMe = async (req, res) => {
    try {
      const user = await userModel.findById(req.userId);
  
      if (!user) {
        return res.status(404).json({
          message: 'такого нету ',
        });
      }
  
      const { passwordHash, ...userData } = user._doc;
      console.log(userData);
  
      res.json(userData);
  
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить данные пользователя',
      });
    }
};