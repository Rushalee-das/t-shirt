const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors()); // Use the cors middleware
app.use(express.json({ limit: "50mb" }));

//enable body parser
app.use(express.json())
app.use(express.urlencoded({extended: false}))


app.get('/', (req, res) => {
    res.status(200).json({ message: "Hello from DALL.E" })
  })

  app.use('/openai', require('./routes/openAiRoutes'))

app.listen(port, () => 
    console.log('server is started at port 5000')
)