import fs from "fs";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 5000;

// --- EJS and static ---
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


function loadOurProducts() {
  return JSON.parse(fs.readFileSync("OurProductData.json", "utf8"));
  // return our_Product;
} 
function loadHomeProducts() {
  // return home_Product;
  return JSON.parse(fs.readFileSync("HomeProductData.json", "utf8"));
} 

// --- Routes ---
app.get("/", (req, res) => {
  // always load fresh data (in case JSON changed)
  const HomePictures = loadHomeProducts();
  res.render("index.ejs", { HomePictures });
});

app.get("/productSection", (req, res) => {
  const OurPictures = loadOurProducts();
  res.render("productSection.ejs", { OurPictures });
});

// --- Product details ---
app.get("/product/:slug", (req, res) => {
  const homeProducts = loadHomeProducts();
  const ourProducts = loadOurProducts();
  // const id = parseInt(req.params.id);
  const slug_name = req.params.slug;
  // console.log(slug_name);
  
  // find product in either JSON file
  let product = homeProducts.find(p => p.slug === slug_name) || ourProducts.find(p => p.slug === slug_name);

  if (!product) {
    return res.render("404.ejs");
  }

  // Normalize images array so template never breaks
  if (product.image && !product.images) {
    product.images = [product.image];
  }
  if (!product.images) {
    product.images = [];
  }



  res.render("agriculture_project_ReadMore.ejs", { product });
});

// --- Server ---
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});

