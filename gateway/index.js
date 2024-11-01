const express=require("express");
const proxy=require("express-http-proxy");
const cors=require("cors");

const app=express();

// Enable CORS
app.use(cors());
app.use(express.json());

// Proxy setup for API gateway
app.use('/customer',proxy("http://localhost:8001"))
app.use('/shopping',proxy("http://localhost:8002"))
app.use('/',proxy("http://localhost:8003"))  // for products

app.listen(8000,()=>{
    console.log("gateway is running on port om 8000")
})