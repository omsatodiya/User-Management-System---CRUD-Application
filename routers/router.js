const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const multer = require("multer");

//uploading image in diskstorage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
}).single("image");

//add user to db

router.post("/add", upload, async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: req.file ? `/images/${req.file.filename}` : null,
    });

    await user.save();

    req.session.message = {
      type: "success",
      message: "User added successfully!",
    };
    res.redirect("/");
  } catch (err) {
    req.session.message = {
      type: "danger",
      message: err.message,
    };
    res.redirect("/");
  }
});

//get all users from db
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.render("index", { title: "Home Page", users: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

//edit the user
router.post("/edit/:id", upload, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.session.message = {
        type: "danger",
        message: "User not found",
      };
      return res.redirect("/");
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    if (req.file) {
      user.image = `/images/${req.file.filename}`;
    }

    await user.save();

    req.session.message = {
      type: "success",
      message: "User updated successfully!",
    };
    res.redirect("/");
  } catch {
    req.session.message = {
      type: "danger",
      message: err.message,
    };
    res.redirect("/");
  }
});

router.get("/edit/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.session.message = {
        type: 'danger',
        message: 'User not found!'
      };
      return res.redirect("/");
    }
    res.render("edit", { title: "Edit User", user: user });
  } catch (err) {
    req.session.message = {
      type: 'danger',
      message: err.message
    };
    res.redirect("/");
  }
});

//delete route 
router.post("/delete/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      req.session.message = {
        type: 'danger',
        message: 'User not found!'
      };
      return res.redirect("/");
    }

    req.session.message = {
      type: 'success',
      message: 'User deleted successfully!'
    };
    res.redirect("/");
  } catch (err) {
    req.session.message = {
      type: 'danger',
      message: err.message
    };
    res.redirect("/");
  }
});

//about route
router.get("/about", (req, res) => {
  res.render("about",{title: "About"});
})

//contact route
router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact" });
});

router.post("/contact", (req, res) => {
  req.session.message = {
    type: 'success',
    message: 'Contact Info. shared successfully!'
  };
  res.redirect("/");
});

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/add", (req, res) => {
  res.render("add", { title: "Add User" });
});

module.exports = router;
