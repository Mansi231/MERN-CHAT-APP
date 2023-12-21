const asyncHandler = require('express-async-handler')
const { ValidateRegister } = require('../validator/Validator');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env?.CLOUDINARY_CLOUD_NAME,
  api_key: process.env?.CLOUDINARY_API_KEY,
  api_secret: process.env?.CLOUDINARY_API_SECRET,
  secure: true
});

const registerUser = asyncHandler(async (req, res) => {

  let { error, value } = ValidateRegister(req?.body)
  if (error) return res.status(400).send({ status: false, code: 400, message: error.message, error: 'Error!' });

  const alreadyExists = await User.findOne({ email: req.body.email });
  if (alreadyExists) return res.status(400).json({ status: false, code: 400, message: 'Already exist!' });

  cloudinary.uploader.upload(req?.files?.pic?.tempFilePath, async (err, picResult) => {
    const result = await User.create({ email: value.email, password: value?.password, name: value?.name, pic: picResult?.url });
    if (result && picResult) return res.status(201).json({ _id: result?._id, email: result?.email, name: result?.name, pic: picResult?.url, token: generateToken(result?._id) })
    return res.status(400).json({ message: 'Failed to create user !', err: err })
  })
})

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const result = await User.findOne({ email });

  if (result && (await result.matchPassword(password))) return res.json({ _id: result?._id, email: result?.email, name: result?.name, pic: result?.pic, token: generateToken(result?._id) })
  else return res.status(401).json({ message: 'Invalid name or password !', status: false, statusCode: 401 })

})

const authGoogleLogin = asyncHandler(async (req, res) => {
  const { email, password ,pic} = req.body
        
  const alreadyExists = await User.findOne({ email });
  if(alreadyExists) return res.status(201).json({ _id: alreadyExists?._id, email: alreadyExists?.email, name: alreadyExists.pic?.name, pic: alreadyExists.pic ,token : generateToken(alreadyExists?._id)})

  const result = await User.create({ email: req.body.email, name: req.body.name, pic: req.body.pic ,password:' '});
  if (result) return res.status(201).json({ _id: result?._id, email: result?.email, name: result?.name, pic: result.pic , token: generateToken(result?._id) })
  return res.status(400).json({ message: 'Failed to create user !', err: err })

})

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req?.query?.search ? {
    $or: [
      { name: { $regex: req?.query?.search, $options: 'i' } },
      { email: { $regex: req?.query?.search, $options: 'i' } },
    ],
  } : {};

  const users = await User.find({ ...keyword, _id: { $ne: req?.user?._id } }).select('-password');
  res.json(users);
}); 


module.exports = { registerUser, authUser, allUsers ,authGoogleLogin}