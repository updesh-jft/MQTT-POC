import mongoose from 'mongoose';

const schema = mongoose.Schema;

const mqtt = new schema({
        total : {
            type: Number,
            required:true
        },
        success : {
            type : Number,
            required : true
        },
        failed : {
            type : Number,
            required : true
        },
})


export default  mongoose.model('mqtt',mqtt);