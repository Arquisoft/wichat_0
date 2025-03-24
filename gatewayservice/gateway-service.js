const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');
//libraries required for OpenAPI-Swagger
const swaggerUi = require('swagger-ui-express');
const fs = require("fs")
const YAML = require('yaml')

const app = express();
const port = 8000;

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const questionServiceUrl = process.env.QUESTION_SERVICE_URL || 'http://localhost:8004';
const llmServiceUrl = process.env.LLM_SERVICE_URL || 'http://localhost:8003';
const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8002';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';

app.use(cors({ origin: frontendUrl, credentials: true }));
app.use(express.json());

//Prometheus configuration
const metricsMiddleware = promBundle({ includeMethod: true });
app.use(metricsMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.post('/login', async (req, res) => {
  try {
    // Forward the login request to the authentication service
    const authResponse = await axios.post(authServiceUrl + '/login', req.body, { withCredentials: true, headers: { ...req.headers } });

    // Forward the cookie to the client from the authentication service
    if (authResponse.headers["set-cookie"])
      res.setHeader("Set-Cookie", authResponse.headers["set-cookie"]);

    res.json(authResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/logout', async (req, res) => {
  try {
    // Forward the logout request to the authentication service
    const authResponse = await axios.post(authServiceUrl + '/logout', req.body, { withCredentials: true, headers: { ...req.headers } });
    res.json(authResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.get("/refresh", async (req, res) => {
  try {
    // Forward the logout request to the authentication service
    const authResponse = await axios.get(authServiceUrl + '/refresh', { withCredentials: true, headers: { ...req.headers } });
    res.json(authResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/adduser', async (req, res) => {
  try {
    // Forward the add user request to the user service
    const userResponse = await axios.post(userServiceUrl + '/adduser', req.body);
    res.json(userResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/askllm', async (req, res) => {
  try {
    // Forward the add user request to the user service
    const llmResponse = await axios.post(llmServiceUrl + '/ask', req.body);
    res.json(llmResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

// Add the /loadQuestion endpoint for filling the data base
app.post('/loadQuestion', async (req, res) => {
  try {
    const { modes } = req.body;

    if (!modes || !Array.isArray(modes)) {
      return res.status(400).json({ error: "Invalid modes parameter" });
    }

    const questionResponse = await axios.post(questionServiceUrl + '/load', { modes });

    res.json(questionResponse.data);
  } catch (error) {
    console.error('Error fetching data from question service:', error);
    res.status(error.response?.status || 500).json({ error: 'Error fetching question data' });
  }
});

app.get('/getRound', async (req, res) => {
  try {
    const roundResponse = await axios.get(questionServiceUrl + '/getRound');
    res.json(roundResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});


// Read the OpenAPI YAML file synchronously
openapiPath = './openapi.yaml'
if (fs.existsSync(openapiPath)) {
  const file = fs.readFileSync(openapiPath, 'utf8');

  // Parse the YAML content into a JavaScript object representing the Swagger document
  const swaggerDocument = YAML.parse(file);

  // Serve the Swagger UI documentation at the '/api-doc' endpoint
  // This middleware serves the Swagger UI files and sets up the Swagger UI page
  // It takes the parsed Swagger document as input
  app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log("Not configuring OpenAPI. Configuration file not present.")
}


// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server
