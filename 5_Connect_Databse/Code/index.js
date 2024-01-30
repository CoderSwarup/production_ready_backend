import connectDB from "./db/DBConnection.js";
import app from "./app.js";

// dotenv.config()
// const app = express()
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MogoDB Error :", err);
  });

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
