const Joi = require("joi");
const categoryModel = require("../model/categoryModel")
const { Schema } = require("mongoose");


async function addCategory(req,res){
try {
    const {category_name} = req.body;
    const catSchema = Joi.object({
        category_name:Joi.string().alphanum().max(30).required()
    })

    const { error } = catSchema.validate(req.body);
    
    if(error){
        res.writeHead(400);
        res.end(error.details[0].message);
        return;
    }
} catch (err) {
    console.error(err);
    res.writeHead(500);
    res.end("Internal Server Error");
  }
}

module.exports = {addCategory}