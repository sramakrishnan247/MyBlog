var express = require('express')
var app = express()
var mongoose = require("mongoose")
var bodyParser = require("body-parser")
var methodOverride = require("method-override")
var port = process.env.PORT || 8080;
// title 
// image 
// body
// date

mongoose.connect("mongodb://localhost/blogapp")
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
//Mongoose model config
var blogSchema = new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date, default : Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
// 	title:"test",
// 	image:"https://images.pexels.com/photos/251287/pexels-photo-251287.png?h=350&auto=compress&cs=tinysrgb",
// 	body:"hello, world"

// })

//RESTful Routes
//Index Route
app.get("/",function(req,res){
	res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err)console.log(err);
		else{
			res.render("index",{blogs:blogs});
		}
	});

});

app.get("/blogs/new",function(req,res){
	res.render("new");
})

app.post("/blogs",function(req,res) {
	Blog.create(req.body.blog, function(err,newBlogs){
		if(err){
			res.render("new");
		}
		else{
			res.redirect("/blogs");
		}
	});	
})

app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id, function (err,foundBlog) {
		if(err){
			console.log(err)
		}
		else{
			res.render("show",{blog:foundBlog});
		}
		// body...
	})

});
//edit blog
app.get("/blogs/:id/edit",function (req,res) {
	Blog.findById(req.params.id,function(err,foundBlog) {
		// body...
		if(err){
			res.redirect("/blogs");

		}
		else{
			res.render("edit",{blog:foundBlog})
		}
	})

	// res.render("edit");
	// body...
})
// update blog
app.put("/blogs/:id",function(req,res) {
	Blog.findByIdAndUpdate(req.params.id, req.body.blog,function(err,updatedBlog) {
		if(err){
			console.log(err)
		}
		else{
			console.log("updated")
			res.redirect("/blogs/"+req.params.id);
		}
		// body...
	})
})

//delete blog
app.delete("/blogs/:id",function(req,res) {
	Blog.findByIdAndRemove(req.params.id,function(err) 
	{
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/blogs")
		}
		// body...
	})
	// body...
})





app.listen(port,function() {
	console.log("server is running");
	// body...
})