require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const articleRoutes = require('./Routes/articleRoutes');
const authRoutes = require('./Routes/authRoutes');


const app = express();
app.use(bodyParser.json());
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecté à MongoDB'))
  .catch((err) => console.log('Erreur de connexion à Mongodb', err));


app.use(cors());

app.use('/api/articles', articleRoutes); 
app.use('/api/auth', authRoutes);  


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server lancé sur http://localhost:${PORT}`);
});
