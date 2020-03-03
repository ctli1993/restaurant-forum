const db = require("../models");
const Restaurant = db.Restaurant;
const Category = db.Category;
const adminService = require("../services/adminService");

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, data => {
      return res.render(
        "admin/restaurants",
        JSON.parse(JSON.stringify(data))
      );
    });
  },

  getUsers: (req, res) => {
    adminService.getUsers(req, res, data => {
      return res.render(
        "admin/users",
        JSON.parse(JSON.stringify(data))
      );
    })
  },

  putUsers: (req, res) => {
    adminService.putUsers(req, res, data => {
      req.flash(
        "success_messages", data['message']
      );
      return res.redirect("/admin/users");
    })
  },

  createRestaurant: (req, res) => {
    Category.findAll().then(categories => {
      return res.render(
        "admin/create",
        JSON.parse(JSON.stringify({ categories: categories }))
      );
    });
  },

  postRestaurant: (req, res) => {
   adminService.postRestaurant(req, res, (data) => {
     if (data['status'] === 'error'){
       req.flash('error_messages', data['message'])
       return res.redirect('back')
     }
     req.flash('success_messages', data['message'])
     res.redirect('/admin/restaurants')
   })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, data => {
      return res.render(
        "admin/restaurant",
        JSON.parse(JSON.stringify( data ))
      );
    });
  },

  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      Category.findAll().then(categories => {
        return res.render(
          "admin/create",
          JSON.parse(
            JSON.stringify({ categories: categories, restaurant: restaurant })
          )
        );
      });
    });
  },

  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, data => { 
      if (data['status'] === 'error'){
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => { 
      if (data['status'] === 'success'){ 
        return res.redirect('/admin/restaurants')
      }
    })
  }
};

module.exports = adminController;
