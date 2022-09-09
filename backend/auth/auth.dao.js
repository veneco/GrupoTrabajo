const mongoose = require('mongoose');
const authSchema = require('./auth.model');

authSchema.statics = {
  create: function (data, cb) {
    const user = new this(data);
    user.save(cb);
  },
  login: function (query, cb) {
    this.find(query, cb);
  },
  delete: function (query, cb) {
    this.findOneAndDelete(query, cb);
  },
  update: function (query, cb) {
    this.findOneAndUpdate(query, cb);
  }

}

const authModel = mongoose.model('Users', authSchema);
module.exports = authModel;