import { productService, receiptService, userService } from "../services/services.js"
import UserDTO from "../dao/DTO/User.dto.js"
import User from "../dao/MongoDB/models/User.model.js"
import { render } from "ejs"

const login = (req,res)=>{
    res.render("login")
}
const register = (req,res)=>{
    res.render("register")
}
const failedLogin = (req,res)=>{
    res.render("failedLogin")
}
const failedRegister = (req,res)=>{
    res.render("failedRegister")
}

const index = async(req,res)=>{
    res.render("index")
}

const notExists = async(req,res)=>{
    req.logger.warning("A non-existent route was entered with the method "+ req.method +": " + req.url)
    res.send("This site does not exist")
}

const apiUsers =async(req,res)=>{
    const users = await userService.getAll()
    res.send({status:"success",payload:users})
}

const products = async(req,res)=>{
    let userInfo;
    if(req.session.user){
            userInfo = UserDTO.getPresenterFrom(req.session.user)
        }else{
            userInfo = undefined
        } 
    const products = await productService.getAll()
    res.render("products",{user:userInfo,products:products})
}

const apiProducts = async(req,res)=>{
    const products = await productService.getAll()
    res.send({status:"success",payload:products})
}
const productDetails = async(req,res)=>{
    let userInfo;
    if(req.session.user){
            userInfo = UserDTO.getPresenterFrom(req.session.user)
        }else{
            userInfo = undefined
        } 
    const productId = req.params.pid
    const product = await productService.getBy({id:productId})
    if(!product) return res.status(400).send({status:"error",error:"Product not found"})
res.render("productDetails",{user:userInfo,product:product})
}

const logout = async(req,res)=>{
    req.session.destroy(err=>{
        if(!err) res.redirect("/login")
        else res.send({status:"error",body:err})
    })
}

const cart = async(req,res)=>{
    const userInfo = req.session.user
    if(userInfo){
        const user = await userService.getBy({email:userInfo.email})
        let productInCart = []
for (let index = 0; index < user.cart.length; index++) {
    const oneProduct = await productService.getBy({id:user.cart[index].productId})
        const finalProduct = {
            title:oneProduct.title,
            thumbnail:oneProduct.thumbnail,
            price:oneProduct.price*user.cart[index].quantity,
            quantity: user.cart[index].quantity,
            id:user.cart[index].productId
        }
        productInCart.push(finalProduct)
}
const sum = productInCart.reduce((accumulator, object) => {
    return accumulator + object.price;
}, 0);
const renderUser = UserDTO.getPresenterFrom(user)

        res.render("cart",{user:renderUser,products:productInCart,finalPrice:sum})
    }else{
        res.render("cart",{user:false})
    }
}

const apiReceipts = async(req,res)=>{
    const receipts = await receiptService.getAll();
    res.send({status:"success",payload:receipts})
}

export default{
    login,
    register,
    failedLogin,
    failedRegister,
    index,
    notExists,
    products,
    productDetails,
    logout,
    cart,
    apiUsers,
    apiProducts,
    apiReceipts
}