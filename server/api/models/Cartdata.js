/**
 * Cartdata.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
 identity : 'Cartdata',
  attributes: {
    name : String,
    image : String,
    price : String,
      owner : {
    model : 'Cartuser'
  }
  },

};

