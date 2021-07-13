const Newsletter = require("../models/newsletter");
const { check, validationResult } = require("express-validator");

exports.getNewsletterEmail = (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0].msg,
      });
    }
  
    const userNewsletterEmail = new Newsletter(req.body);
    // console.table(req.body);
    userNewsletterEmail.save((err, user) => {
      if (err) {
        return res.status(400).json({
          err: "NOT able to save user in DB",
        });
      }
      res.json({
        email: user.email,
        id: user._id,
      });
    });
  };