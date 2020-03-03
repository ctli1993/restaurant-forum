const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.User;
const Favorite = db.Favorite;
const Followship = db.Followship;
const Restaurant = db.Restaurant;
const Comment = db.Comment;
const Like = db.Like;
const imgur = require("imgur-node-api");
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

let userService = {
  signUpPage: (req, res) => {
    return res.render("signup");
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash("error_messages", "兩次密碼輸入不同！");
      return res.redirect("/signup");
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash("error_messages", "信箱重複！");
          return res.redirect("/signup");
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10),
              null
            )
          }).then(user => {
            req.flash("success_messages", "成功註冊帳號！");
            return res.redirect("/signin");
          });
        }
      });
    }
  },

  signInPage: (req, res) => {
    return res.render("signin");
  },

  signIn: (req, res) => {
    req.flash("success_messages", "成功登入！");
    res.redirect("/restaurants");
  },

  logout: (req, res) => {
    req.flash("success_messages", "登出成功！");
    req.logout();
    res.redirect("/signin");
  },

  addFavorite: (req, res, callback) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }).then(restaurant => {
      return callback({status: 'success', message: ''})
    });
  },

  removeFavorite: (req, res, callback) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    }).then(favorite => {
      favorite.destroy().then(restaurant => {
        return callback({status: 'success', message: '' })
      });
    });
  },

  addLike: (req, res, callback) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }).then(restaurant => {
      return callback({status: 'success', message: ''})
    });
  },

  removeLike: (req, res, callback) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    }).then(favorite => {
      favorite.destroy().then(restaurant => {
        return callback({status: 'success', message: ''})
      });
    });
  },

  getTopUser: (req, res, callback) => {
    // 撈出所有 User 與 followers 資料
    return User.findAll({
      include: [{ model: User, as: "Followers" }]
    }).then(users => {
      // 整理 users 資料
      users = users.map(user => ({
        ...user.dataValues,
        // 計算追蹤者人數
        FollowerCount: user.Followers.length,
        // 判斷目前登入使用者是否已追蹤該 User 物件
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }));
      // 依追蹤者人數排序清單
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount);
      callback({users: users})
    });
  },

  getUser: (req, res, callback) => {
    User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: [Restaurant] },
        { model: Restaurant, as: "FavoritedRestaurants" },
        { model: Restaurant, as: "LikedRestaurants" },
        { model: User, as: "Followers" },
        { model: User, as: "Followings" }
      ]
    }).then(user => {
      let commentedRestaurants = [];
      const isFollowed =  req.user.Followings.map(d => d.id).includes(user.id)
      const followerNum = user.Followers.length
      const followingNum = user.Followings.length
      const favoritedRestNum = user.FavoritedRestaurants.length
      user.Comments.map(comment => {
        commentedRestaurants.push(comment.Restaurant);
      });
      return callback({
        userProfile: user,
        commentedRestaurants,
        isFollowed, 
        followerNum,
        followingNum, 
        favoritedRestNum
      })
    });
  },

  putUser: (req, res, callback) => {
    if (!req.user.id) {
      return callback({ status:"error_messages", message:"僅限修改自的資料，請重新操作"})
    }

    const { file } = req;
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id).then(user => {
          user
            .update({
              name: req.body.name,
              image: file ? img.data.link : user.image
            })
            .then(user => {
              return callback({ status: 'success', message: 'User was successfully to update'})
            });
        });
      });
    } else
      return User.findByPk(req.params.id).then(user => {
        user
          .update({
            name: req.body.name,
            image: user.image
          })
          .then(user => {
            return callback({ status: 'success', message: 'User was successfully to update'})
          });
      });
  },

  addFollowing: (req, res, callback) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    }).then(followship => {
      return callback({status: 'success', message: ''})
    });
  },

  removeFollowing: (req, res, callback) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    }).then(followship => {
      followship.destroy().then(followship => {
        return callback({status: 'success', message: ''})
      });
    });
  }
};

module.exports = userService;
