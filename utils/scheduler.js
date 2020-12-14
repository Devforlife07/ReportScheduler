var cron = require('node-cron');
const Order = require("../models/orders");
const Item = require("../models/items");
const path = require("path");
const fs = require("fs");
const moment = require("moment")
const { Parser } = require('json2csv');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var options = {
    auth: {
        api_key: process.env.SENDGRID_KEY
    }
}
var mailer = nodemailer.createTransport(sgTransport(options));

//Scheduling Mail
exports.scheduler = cron.schedule('*/2 * * * * *', async() => {
    const transactions = await Order.countDocuments();
    const successfullTransaction = await Order.find({}).where("paid").equals(true)
    let volume = 0;
    let result = []
    for(let i = 1;i<successfullTransaction.length;i++){
        const item = await Item.findOne({_id:successfullTransaction[i].item})
        let item_name = "";
        if(item){
     item_name = item.title;

        }
     result.push({...successfullTransaction[i]._doc,sl_no:i,paid_status:successfullTransaction[i].paid,order_id:successfullTransaction[i]._id,item_id:successfullTransaction[i].item,item_name,utm_params_source:successfullTransaction[i].utm_params.source,utm_params_medium:successfullTransaction[i].utm_params.medium,utm_params_campaign:successfullTransaction[i].utm_params.campaign,utm_params_term:successfullTransaction[i].utm_params.term});
     volume+= successfullTransaction[i].amount;

    }
   
    //Creating A CSV File
    const fields = ["sl_no", "order_id", "payment_id", "createdAt", "updatedAt", "item_id", "item_name", "coupon", "amount", "paid_status", "phone", "email", "utm_params_source", "utm_params_medium", "utm_params_campaign", "utm_params_term"]
const opts = { fields };
try {
    const parser = new Parser(opts);
    const csv = parser.parse(result);

     //Write File 
     fs.writeFileSync("Report.csv",csv);
     var email = {
        to: [process.env.SENDER_MAIL],
        from: process.env.EMAIL_ID,
        subject: `Report For Date ${moment().utcOffset(330).format("DD/MM/YYYY hh:mm:ss a")}`,
        text: 'Find here Attached Report for the Day',
        html:`<h1>Details</h1><h4>Number of Transactions: ${transactions}</h4><h4>Number of Successful Transactions: ${successfullTransaction.length}</h4><h4>Volume: ${volume}`,
        attachments:[{
            filename: 'Report.csv',
        path: path.join(__dirname,"../","Report.csv")
        }]
    };
    mailer.sendMail(email, function(err, res) {
        if (err) { 
            console.log(err) 
        }
        //Deleting File After it is sent successfully
        setTimeout(()=>{ fs.unlinkSync(path.join(__dirname,"../","Report.csv"))},100000)
       
    });
    
} catch (e) {
console.log(e);
}
  },{timezone:"Asia/Kolkata"});