import fs from "fs";    
// import {promises as fs} from 'fs';
import express from "express";
import bodyParser from "body-parser";
import favicon from 'serve-favicon';
import path from 'path';
import axios from "axios";
import { fileURLToPath } from 'url';
import nodemailer from "nodemailer";



const app = express();
// Use import.meta.url to calculate __dirname 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// const port = 5000;

// Vercel will set the PORT environment variable automatically
const port = process.env.PORT || 3000;


// FOR NODEMAIL CONFIG 
const COMPANY_EMAIL = process.env.COMPANY_EMAIL; 
const SENDER_EMAIL = process.env.SENDER_EMAIL; 
const SENDER_PASSWORD = process.env.SENDER_PASSWORD; 

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email provider here (e.g., 'outlook', 'SendGrid', or use 'smtp')
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_PASSWORD,
  },
});



//Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// the line below, replaces 'path/to/your/favicon.ico'
app.use(favicon(path.join(__dirname, "public", "images", "favicon_io", 'favicon.ico')));



// --- EJS and static ---
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


// LOAD OUR PRODUCT FUNCTION
function loadOurProducts() {
   const dataPath = path.join(__dirname, "OurProductData.json");
   const data = fs.readFileSync(dataPath, "utf8");
   return JSON.parse(data);
  
} 

//LOAD HOME-PRODUCT FUNCTION using ASYNC for fs promises (faster loading)
function loadHomeProducts() {
      const dataPath = path.join(__dirname, "HomeProductData.json");
      const data =  fs.readFileSync(dataPath, "utf-8");
      return JSON.parse(data);
     
      //single line of the above broken line
      // return JSON.parse(fs.readFileSync((path.join(__dirname, "HomeProductData.json") ), "utf-8"));
} 

// --- Routes ---
app.get("/",  (req, res) => {
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
        const ourProducts =  loadOurProducts();
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



// CONTACT FORM SUBMIT HANDLER 

app.post("/contactForm", async(req, res)=>{


  // 1. Extract Data from the Form Body
    const { name, email, phone, subject, message } = req.body;
    // console.log("name");


    // 2. Simple Data Validation
    if (!name || !email || !message) {
        // You can redirect back or send a JSON error
        return res.status(400).send('Error: Name, email, and message are required.');
    }

    // 3. Define Email Content
    const mailOptions = {
        from: `Contact Form Submission <${SENDER_EMAIL}>`, // Sender's account
        to: COMPANY_EMAIL, // Your company's recipient email
        replyTo: email, // Allows you to reply directly to the user
        subject: `[${subject.toUpperCase()}] New Inquiry from ${name}`,
        html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Topic:</strong> ${subject}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <hr>
            <h3>Message:</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `,
    };

    // 4. Send the Email
    try {
        await transporter.sendMail(mailOptions);
        
        // Success: Redirect the user to a "thank you" page
        res.redirect('/thank-you'); 
        
    } catch (error) {
        console.error('Nodemailer Error:', error);
        // Failure: Redirect to an error page or render a message
        res.status(500).render('contact', { 
            error: 'Failed to send message. Please try again later.' 
        });
    }
});




// --- Server ---
// app.listen(port, () => {
//   console.log(`✅ Server is running on http://localhost:${port}`);
// });

// Export the app instance so Vercel can run it as a Serverless function
// module.exports = app; old
 export default app;