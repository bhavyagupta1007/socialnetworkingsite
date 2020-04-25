const express=require('express');
const router=express.Router();
const passport=require('passport');

const postsAPI= require('../../../controllers/api/v1/posts_api');

router.get('/', postsAPI.index);
//session false to prevent session cookies from generating
router.delete('/:id',passport.authenticate('jwt',{sesssion: false}),postsAPI.destroy);

module.exports=router;