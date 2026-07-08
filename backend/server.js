import express from 'express';
import 'dotenv/config';
import connectDB from './database/db.js';
import userRoute from './routes/userRoute.js';
import cors from 'cors'
import productRoute from './routes/productRoute.js';
import cartRoute from './routes/cartRoute.js';
import orderRoute from './routes/orderRoute.js';

const app=express();
const PORT=process.env.PORT || 3000

//middleware
app.use(express.json())

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
];

console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("Allowed Origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("EKART Backend is Running 🚀");
});

app.use('/api/v1/user',userRoute)
app.use('/api/v1/product', productRoute)
app.use('/api/v1/cart', cartRoute)
app.use('/api/v1/orders', orderRoute)


app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})