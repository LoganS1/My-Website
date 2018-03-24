var express = require("express"),
	app 			= express(),
  ejs       = require("ejs");

app.use(express.static('res'));
app.set("view engine", "ejs");
app.disable('x-powered-by');

app.get("/", (req, res)=>{
	res.render("pages/home");
})

app.get("/*", (req, res)=>{
  res.render("pages/404");
})

app.listen(8080, function(){
	console.log("Server is running on port 8080");
});
