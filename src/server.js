const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const avroConverter = require('./avroConverter');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/convert', (req, res) => {
  try {
    const { avroSchema, tableName } = req.body;
    
    if (!avroSchema) {
      return res.status(400).json({ error: 'Avro schema is required' });
    }
    
    const parsedSchema = typeof avroSchema === 'string' 
      ? JSON.parse(avroSchema) 
      : avroSchema;
    
    const hiveQL = avroConverter.generateHiveQL(parsedSchema, tableName || 'default_table');
    
    res.json({ hiveQL });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});