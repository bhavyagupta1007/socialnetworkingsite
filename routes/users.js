const express=require('express');
const router=express.Router();
const passport=require('passport');

const usersController=require('../controllers/users-controller');
router.post('/update/:id',passport.checkAuthentication,usersController.update)
router.get('/profile/:id',passport.checkAuthentication,usersController.profile);
router.get('/sign-in',usersController.signIn);
router.get('/sign-up',usersController.signUp);
router.post('/create',usersController.create);
router.get('/forgot',usersController.forgot);
router.post('/forgotbuttonpressed',usersController.forgotbuttonpressed);
router.get('/reset_password/:id',usersController.forgotmailopened);
router.post('/reset_password/:id',usersController.changepassword);

//use passport as middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/sign-in'},
),
usersController.createSession);
router.get('/sign-out',usersController.destroySession);

//scope is the info w are looking to fetch
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect:'/users/sign-in'}), usersController.createSession);



module.exports=router;