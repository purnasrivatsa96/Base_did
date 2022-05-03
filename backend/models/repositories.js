const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const paperSchema = new Schema({
	name:{
		type:String,
        sparse: true,
		required: true
	},
	abstract: {
		type:String
	},
    keywords: 
        [ {
            name:String
        }
    ],
    parameters: [
        {
            parameter: String,
            value: Number
        }
    ],
    methodologies: [ {
        name:String
        }
    ],
    repo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Repository'
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

},{
	timestamps: true
});


const repositorySchema = new  Schema({
    name:{
        type: String,
        required: true
    },
    user:{
		type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
	},
    papers:[paperSchema]
},{
	timestamps: true
});

var Repositories = mongoose.model('Repository',repositorySchema);

module.exports = Repositories;