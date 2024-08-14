// controllers/usersController.js
const usersStorage = require("../storages/usersStorage");



exports.usersListGet = (req, res) => {
  res.render("index", {
    title: "User list",
    users: usersStorage.getUsers(),
  });
};

exports.usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: "Create user",
  });
};

exports.usersCreatePost = (req, res) => {
  const { firstName, lastName } = req.body;
  usersStorage.addUser({ firstName, lastName });
  res.redirect("/");
};


// This just shows the new stuff we're adding to the existing contents
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";

const validateUser = [
  body("firstName").trim()
    .isAlpha().withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
  body("lastName").trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
  body("email").trim()
    .contains('@').withMessage(`email ${alphaErr}`)
    .isLength({ min: 1, max: 50 }).withMessage(`email ${lengthErr}`),
  body("age").trim()
    .isNumeric().withMessage(`age ${TypeError}`)
    .isInt({ min: 18, max: 120 }).withMessage(`age Age must be between 18 and 120`),
 body("bio").trim()
    .isLength({ min: 0, max: 200 }).withMessage(`bio ${lengthErr}`),
];

// We can pass an entire array of middleware validations to our controller.
exports.usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: "Create user",
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.addUser({ firstName, lastName, email, age, bio });
    res.redirect("/");
  }
];

exports.usersUpdateGet = (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    res.render("updateUser", {
      title: "Update user",
      user: user,
    });
  };

  exports.usersUpdatePost = [
    validateUser,
    (req, res) => {
      const user = usersStorage.getUser(req.params.id);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("updateUser", {
          title: "Update user",
          user: user,
          errors: errors.array(),
        });
      }
      const { firstName, lastName, email, age, bio } = req.body;
      usersStorage.updateUser(req.params.id, { firstName, lastName, email, age, bio });
      res.redirect("/");
    }
  ];

exports.usersDeletePost = (req, res) => {
    usersStorage.deleteUser(req.params.id);
    res.redirect("/");
  };


exports.searchUsersPost = (req, res) => {
    const { emailSearch } = req.body;
    const lst = usersStorage.getUsers();
    let currId = null;
    for (let i = 0; i < lst.length; i++) {
        const matchEmail = lst[i].email;
        if (emailSearch == matchEmail) {
            console.log('WE FOUND A MATCH')
            currId = lst[i].id
            break;

        }
    }
    if (currId != null)  {
        res.redirect(`/search?currId=${currId}`); // Redirect with currId as a query parameter
    } else {
        res.redirect("/"); // Handle case where no match is found
    }


  };

  exports.searchUsersGet = (req, res) => {
    const currId = req.query.currId;
    console.log(currId)
    const user = usersStorage.getUser(currId);

    res.render("search", {
          user: user,
        });



  };
