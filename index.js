const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Request auth header
const headers = {
  'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
};

const hs_custom_endpoint = 'https://api.hubspot.com/crm/v3/objects/researchers';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data.
// Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
  try {
    const resp = await axios.get(hs_custom_endpoint, {
      headers,
      params: {
        limit: 10,
        properties: 'name,field_study,institution',
      },
    });

    const data = resp.data.results;

    res.render('homepage', {
      title: 'Researchers | Integrating With HubSpot I Practicum',
      data,
    });
  } catch (error) {
    console.error(error);
  }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create
// or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
  });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create
// or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
  const formData = {
    properties: {
      name: req.body.name,
      field_study: req.body.field_study,
      institution: req.body.institution,
    },
  };

  try {
    const resp = await axios.post(hs_custom_endpoint, formData, { headers });
    
    if (resp.data && resp.data.id) {
      res.redirect('/');
    } else {
      throw new Error('Failed to create researcher record: Invalid response from HubSpot');
    }
  } catch (error) {
    console.error(error);
  }
});

// Listener
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
