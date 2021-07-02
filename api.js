const express = require('express');
const xlsx = require('xlsx');
const app = express();
var cors = require('cors');

//Twilio
const accountSid = 'AC220d54cfc9d53dc7b90404a3683d0d4d';
const authToken = '74071727b65166faa97655397aa37775'
const twilio = require('twilio');
var client = new twilio(accountSid,authToken);

app.use(cors())

var corsOptions = {
    origin: 'http://example.com',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }


app.get("/getNames", cors(corsOptions),function(req, res){
    var wb = xlsx.readFile('bd.xls');
    var ws = wb.Sheets[wb.SheetNames[0]];   
    xlsx.utils.sheet_to_json();
    var names = [];
    for(let cell in ws){
        const cellAsString = cell.toString();
        if(cellAsString[1] !== "r" 
        && cellAsString !=='m' && cellAsString[1]>=1){
            if(cellAsString[0]==='B'){
                names.push(ws[cell].v);
            }else
            
            //if cell being read is a phone number we nee to send a message.
            if(cellAsString[0]==='C'){
                try{
                    if(ws[cell].v!='' && ws[cell].v!= ' ' && ws[cell].v!= '0' && ws[cell].v!= null && ws[cell].v!= undefined ){
                        client.messages.create({
                            body: 'Yorgo says Hi from his Server',
                            to: `+${ws[cell].v}` ,  // Text this number
                            from: '+16122556603' // From a valid Twilio number
                    
                   
                    })
                    .then((message) => console.log(message.sid)).done();
                 }

                }catch(err){
                    alert(err.toString);
                }
               
            }
        }
    }
    console.log(names);
    res.send(names);
    
})



app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));