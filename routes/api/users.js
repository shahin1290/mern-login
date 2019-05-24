const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../../models/User')


router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please valid email address').isEmail(),
  check('password', 'Password must be 5 characters or more').isLength({ min: 5 })
], async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body
  
  try {
    let user = await User.findOne({ email })

    if(user){
      return res.status(400).json({ errors: [{ msg: 'User already exists' }]})
    }

    user = new User({ name, email, password })

    const salt = await bcrypt.genSalt(8)

    user.password = await bcrypt.hash(password, salt)

    await user.save()

    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(
      payload, 
      config.get('jwtSecret'),
      { expiresIn: 360000 },
      (err, token) => {
        if(err) throw err
        res.json({ token })
      }

    )

  } catch (error) {
    console.error(error.message)

    res.status(500).send('Server error')
  }

})

module.exports = router