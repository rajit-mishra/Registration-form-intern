const express=require("express");
const mongoose= require("mongoose");
const bodyParser =require("body-parser");
const dotenv =require("dotenv");


const app =express();
dotenv.config();

const port= process.env.PORT || 3000;
const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;


mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.daxsy2h.mongodb.net/?retryWrites=true&w=majority`,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
});


//registration schema
const registrationschema =new mongoose.Schema({
    username : String,
    email : String,
    Dob : String,
    password : String,
    confirmpassword : String
});


//model of registration schema:

const registration=mongoose.model("registration",registrationschema);
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get("/",(req,res) => {
    res.sendFile(__dirname + "/index.html");
})



app.post("/register",async(req,res)=>{
    try{
        const {username,email,Dob,Gender,password,cpassword}=req.body;
        const exixtinguser =await registration.findOne({email: email});
        if(!exixtinguser){
        const registrationData= new registration ({
            username,
            email,
            Dob,
            Gender,
            password,
            cpassword
        });
        await registrationData.save();
        res.redirect("/sucess");
    }
    else{
        console.log("user already exist");
        res.redirect("/error");
    }
    }

    catch (error){
        console.log(error);
        res.redirect("/error");
    }


})

app.get("/sucess",(req,res)=>{
    res.sendFile(__dirname+"/sucess.html");
})

app.get("/error",(req,res)=>{
    res.sendFile(__dirname+"/error.html");
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})