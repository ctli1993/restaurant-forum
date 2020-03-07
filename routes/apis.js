const express = require('express')
const router = express.Router()
const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/categoryController.js')
const userController = require('../controllers/api/userController.js')
const restController = require('../controllers/api/restController.js')
const commentController = require('../controllers/api/commentController.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const passport = require('../config/passport')

// const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

router.get('/',   (req, res) => res.redirect('restaurants'))
router.get('/restaurants',   restController.getRestaurants)
router.get('/restaurants/top',   restController.getTopRestaurants)
router.get('/restaurants/feeds',   restController.getFeeds)
router.get('/restaurants/:id',   restController.getRestaurant)
router.get('/restaurants/:id/dashboard',   restController.getDashboard)

router.get('/admin',   authenticatedAdmin, (req, res) => res.redirect('/api/admin/restaurants'))
router.get('/admin/restaurants',   authenticatedAdmin, adminController.getRestaurants )
router.get('/admin/restaurants/:id',   authenticatedAdmin, adminController.getRestaurant)
router.post('/admin/restaurants', upload.single('image'),   authenticatedAdmin, adminController.postRestaurant)
router.put('/admin/restaurants/:id', upload.single('image'),   authenticatedAdmin, adminController.putRestaurant)
router.delete('/admin/restaurants/:id',   authenticatedAdmin, adminController.deleteRestaurant)

router.get('/admin/categories',   authenticatedAdmin, categoryController.getCategories)
router.post('/admin/categories',   authenticatedAdmin, categoryController.postCategory)
router.put('/admin/categories/:id',   authenticatedAdmin, categoryController.putCategory)
router.delete('/admin/categories/:id',   authenticatedAdmin, categoryController.deleteCategory)

router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
router.put('/admin/users/:id', authenticatedAdmin, adminController.putUsers)

router.get('/users/top',   userController.getTopUser)
router.get('/users/:id',   userController.getUser)
router.put('/users/:id',   userController.putUser)
router.post('/favorite/:restaurantId',   userController.addFavorite)
router.delete('/favorite/:restaurantId',   userController.removeFavorite)
router.post('/like/:restaurantId',  userController.addLike)
router.delete('/like/:restaurantId',   userController.removeLike)
router.post('/following/:userId',   userController.addFollowing)
router.delete('/following/:userId',   userController.removeFollowing)

router.post('/comments',   commentController.postComment)
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)


module.exports = router 