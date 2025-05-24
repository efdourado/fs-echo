import app from './app.js';

const PORT = process.env.PORT || "https://echo-trvw.onrender.com/api";

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});