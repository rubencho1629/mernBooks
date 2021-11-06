const mongoose = require('mongoose');

// tables-> collections

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            maxlength:33,
            unique:true
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("Category", categorySchema);