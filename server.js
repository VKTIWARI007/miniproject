// import the module require() is used and require() is predefined function used to  import the modules
const express=require('express');
const mongodb=require("mongodb");
const bodyparser=require('body-parser');
const cors=require('cors');
const jsonwebtoken=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();

//create the rest object api
const app=express();
//where app i the rest api object
//WHERE app object used to create the rest services like GET,POST,PULL,DELETE,PATCH..../
 


//MIME 
// used to connect communication between client and the server
app.use(express.json());

app.use(cors());

//create the reference variable to connect the mongodb database
const miniproject=mongodb.MongoClient;


//to create the post request
app.post('/login',(req,res)=>{
miniproject.connect(process.env.CONNECTION_URL,(err,connection)=>{
    if(err)
    throw err;
    else{
        const db=connection.db(process.env.DATABASE_NAME);
        db.collection(process.env.COLLECTION_NAME).find({'email':req.body.email , "password":req.body.password}).toArray((err,array)=>{
            if(err) throw err;
            else{
                let label=process.env.RESPONSE_LABEL
                let success=process.env.SUCCESS_RESPONSE
                let fail=process.env.FAIL_RESPONSE
                if(array.length>0){
                    //generate the token
                    const token=jsonwebtoken.sign({'email':req.body.email , "password":req.body.password},
                    process.env.SECRET_KEY,
                    {expiresIn:'30d'})
                    res.status(200).send( {[label]:success,'token':token});
                }else{
                    res.send({[label]:fail});
                }
            }
        })
    }
})
});
let port=process.env.PORT ||1234
app.listen(port,()=>{
    console.log('server listening the port number 8080')
});