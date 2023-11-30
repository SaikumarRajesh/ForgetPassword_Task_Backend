import express from "express"

import bcrypt from "bcrypt"

import { user as usermodel } from "./dbmodel/model.js";

import dbconnect from "./dbmodel/mongoose_connection.js";

import { transporter, mailOptions } from "./mail.js";

import { v4 } from "uuid";

import cors from "cors"

const app =express();

app.use(express.static('public'));

app.use(express.json());

app.use(cors());

const port = 8000;

await dbconnect();


///Adding user
app.post('/users', async (req,res)=>{
    try{
      const payload = req.body
      const Appuser = await usermodel.findOne({email:payload.email})
    if(Appuser){
      res.status(409).send({ msg: 'User already exists' });
      return;
    }

    bcrypt.hash(payload.password,10,async function(err,hash){

      if(err){
        res.status(500).send({ msg: 'Error in registering' });
        return;
      }
      const user = new usermodel({...payload,password:hash, user_Id: v4()})
      await user.save();
      res.send({msg:"user created successfully"})
    })
    }
    catch(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    } 
  });

  app.get('/',  async(req,res)=>{
    try{
       res.send(await usermodel.find());
    }
    catch(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    } 
  });

  app.post('/login', async (req,res)=>{
    try{
      const payload = req.body
      const Appuser = await usermodel.findOne({email:payload.email})
  if(Appuser){
    const randomString =v4();
    
    Appuser.verificationToken = randomString;
    await Appuser.save();

    const link=`${process.env.FRONTEND_URL}/password?token=${randomString}`

    const EXPIRATION_TIME = 1* 60 * 1000; 
    const expirationTime = Date.now() + EXPIRATION_TIME;
    const linkWithExpiration = `${link}&expires=${expirationTime}`;

    transporter.sendMail({ ...mailOptions, to:payload.email,text: `Hi Hello, please verify Your email ${linkWithExpiration} The link expires with in 1 minutes` })

    const response =Appuser.toObject();
    res.send(response)
   
  }else{
    res.status(401).send({ msg: ' user not found! Register now' });
  }
    }
    catch(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    } 
  });

  app.post('/password', async function (req, res) {
    try {
      
      const {newpassword,confirmpassword,token} =req.body

      console.log(token);

      const user =await usermodel.findOne({verificationToken : token});
  
      if(user.verificationToken === token){

        if (newpassword === confirmpassword) {
  
          const hashedpassword = await bcrypt.hash(newpassword, 10)
   
          user.password=hashedpassword;
          user.set({ verificationToken: undefined });
         
         user.save()
       
          return res.send({ msg: 'Password changed successfully' });
        } else {
          return res.status(401).send({ msg: 'Passwords do not match' });
        }
      }
   else{
    res.send({msg:'Invalid token'})
    }
   
    } catch (err) {
      console.log(err);
      return res.status(500).send({ msg: 'Error occurred while changing password' });
    }
  });

app.listen(port, () => {
    console.log('Application Started on port 8000');
  
      });