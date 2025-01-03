const { CUSTOMER_BINDING_KEY, SHOPPING_BINDING_KEY } = require('../config');
const ProductService = require('../services/product-service');
const { PublishCustomerEvent, PublishShoppingEvent, PublishMessage } = require('../utils');
// const CustomerService = require('../services/customer-service');
const UserAuth = require('./middlewares/auth')

module.exports = (app,channel) => {
    
    const service = new ProductService();
    // const customerService = new CustomerService();


    app.post('/product/create', async(req,res,next) => {
        
        try {
            const { name, desc, type, unit,price, available, suplier, banner } = req.body; 
            // validation
            const { data } =  await service.CreateProduct({ name, desc, type, unit,price, available, suplier, banner });
            return res.json(data);
            
        } catch (err) {
            next(err)    
        }
        
    });

    app.get('/category/:type', async(req,res,next) => {
        
        const type = req.params.type;
        
        try {
            const { data } = await service.GetProductsByCategory(type)
            return res.status(200).json(data);

        } catch (err) {
            next(err)
        }

    });

    app.get('/:id', async(req,res,next) => {
        
        const productId = req.params.id;

        try {
            const { data } = await service.GetProductDescription(productId);
            return res.status(200).json(data);

        } catch (err) {
            next(err)
        }

    });

    app.post('/ids', async(req,res,next) => {

        try {
            const { ids } = req.body;
            const products = await service.GetSelectedProducts(ids);
            return res.status(200).json(products);
            
        } catch (err) {
            next(err)
        }
       
    });
     
    app.put('/wishlist',UserAuth, async (req,res,next) => {

        const { _id } = req.user;
        const {data}=await service.getProductPayload(_id,{productId:req.body._id},'ADD_TO_WISHLIST');
        try {
         
             await PublishMessage(channel,CUSTOMER_BINDING_KEY,JSON.stringify(data))
            // const wishList = await customerService.AddToWishlist(_id, product)
            return res.status(200).json(data.data.product);
        } catch (err) {
            console.log(err)
        }
    });
    
    app.delete('/wishlist/:id',UserAuth, async (req,res,next) => {

        const { _id } = req.user;
        const productId = req.params.id;


        try {

            const {data}=service.getProductPayload(_id,{productId},"REMOVE_FROM_WISHLIST");


            await PublishMessage(channel,CUSTOMER_BINDING_KEY,JSON.stringify(data));

            return res.status(200).json(data.data.product);
        } catch (err) {
            next(err)
        }
    });


    app.put('/cart',UserAuth, async (req,res,next) => {
        
        const {_id}=req.user;
        const { product_id, qty } = req.body;
        
        try {     
            const {data}=await service.getProductPayload(_id,{productId:product_id,quantity:qty},"ADD_TO_CART");

            await PublishMessage(channel,CUSTOMER_BINDING_KEY,JSON.stringify({...data,binding_key:CUSTOMER_BINDING_KEY}));

            await PublishMessage(channel,SHOPPING_BINDING_KEY,JSON.stringify({...data,binding_key:SHOPPING_BINDING_KEY}));
            const response={
                product:data.data.product,
                qty:data.data.qty,
            }
    
            // const result =  await customerService.ManageCart(req.user._id, product, qty, false);
    
            return res.status(200).json(response);
            
        } catch (err) {
            next(err)
        }
    });
    
    app.delete('/cart/:id',UserAuth, async (req,res,next) => {

        const { _id } = req.user;

        try {
            const {data}=await service.getProductPayload(_id,{productId:req.params.id},"REMOVE_FROM_CART");

             await PublishMessage(channel,CUSTOMER_BINDING_KEY,JSON.stringify(data));

             await PublishMessage(channel,SHOPPING_BINDING_KEY,JSON.stringify(data));

            const response={
                product:data.data.product,
                qty:data.data.qty,
            }
    
            // const result =  await customerService.ManageCart(req.user._id, product, qty, false);
    
            return res.status(200).json(response);
            
        } catch (err) {
            next(err)
        }
    });

    //get Top products and category
    app.get('/', async (req,res,next) => {
        //check validation
        try {
            const { data} = await service.GetProducts();        
            return res.status(200).json(data);
        } catch (error) {
            next(err)
        }
        
    });
    
}