const db = require("../models");
const Restaurant = db.Restaurant;
const Category = db.Category;
const Comment = db.Comment;
const User = db.User;
const pageLimit = 10;
const restService = require("../services/restService");

let restController = {
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, data => {
      return res.render("restaurants", JSON.parse(JSON.stringify(data)));
    });
  },
  getRestaurant: (req, res) => {
    restService.getRestaurant(req, res, data => {
      return res.render("restaurant", JSON.parse(JSON.stringify(data)));
    });
  },
  getFeeds: (req, res) => {
    restService.getFeeds(req, res, data => {
      return res.render("feeds", JSON.parse(JSON.stringify(data)));
    });
  },

  getDashboard: (req, res) => {
    restService.getDashboard(req, res, data => {
      return res.render("dashboard", JSON.parse(JSON.stringify(data)));
    });
  },

  getTopRestaurants: (req, res) => {
    restService.getTopRestaurants(req, res, data => {
      return res.render("topRestaurants", JSON.parse(JSON.stringify(data)));
    });
  }
};

module.exports = restController;
