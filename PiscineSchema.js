
const mongoose = require("mongoose");
const piscine = new mongoose.Schema(
    {
        nom: {
            type: String,
        },
        adresse: {
           type: String
        },
        tel: {
            type: String
         },
         description: {
            type: String
         }
    },
);
const piscines = mongoose.model('piscine : ', piscine)
module.exports = { piscines };