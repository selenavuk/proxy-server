const express = require('express');
const cors = require('cors');
const axios = require('axios');
// const bodyParser = require('body-parser'); // For handling JSON requests

const app = express();
const port = process.env.PORT || 8080;

// Middleware to parse JSON request bodies
// app.use(bodyParser.json());


const corsOptions = {
  origin: 'https://rhv.rs', // Adjust this to your frontend domain
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
};

app.use(cors(corsOptions));

// Configure CORS
//app.use(cors());
// Configure CORS to allow all origins
// app.use(cors({
//   origin: 'https://rhv.rs', // Allow all origins for development; restrict in production
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//   allowedHeaders: 'Content-Type,Authorization',
//   credentials: true
// }));

// Proxy endpoint
app.get('/proxy/:fileId', async (req, res) => {
  const { fileId } = req.params;
  const googleDriveUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

  try {
    const response = await axios.get(googleDriveUrl, { responseType: 'stream' });
    res.setHeader('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (error) {
    res.status(500).send('Error fetching image');
  }
});

// // Proxy for all other API requests
// app.use('/api', async (req, res) => {
//   const targetUrl = `https://oks-api-production.up.railway.app${req.originalUrl}`;

//   try {
//     const response = await axios({
//       method: req.method,
//       url: targetUrl,
//       data: req.body,
//       headers: {
//         'Content-Type': req.headers['content-type'],
//         // Add other headers if needed
//       },
//       responseType: 'json',
//     });

//     res.status(response.status).json(response.data);
//   } catch (error) {
//     console.error('Error proxying request:', error);
//     res.status(error.response ? error.response.status : 500).send('Error proxying request');
//   }
// });

app.listen(port, () => {
  console.log(`Proxy server is running`);
});
