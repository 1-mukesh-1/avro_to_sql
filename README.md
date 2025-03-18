# Avro to Hive SQL Converter

A simple web application that converts Avro schema definitions to Hive SQL CREATE TABLE statements. This tool helps data engineers and developers quickly generate Hive table definitions from existing Avro schemas.

## Features

- Convert Avro schema JSON to Hive SQL CREATE TABLE statements
- Support for complex Avro types (records, arrays, maps)
- Web-based UI for easy interaction
- RESTful API for programmatic access
- Handles nested structures with proper STRUCT conversion

## Installation

```bash
# Clone the repository (if you haven't already)
git clone <repository-url>
cd avro_to_sql

# Install dependencies
npm install

# Start the server
npm start
```

The application will be available at http://localhost:3000

## Usage

### Web Interface

1. Open your browser and navigate to http://localhost:3000
2. Paste your Avro schema JSON in the left panel
3. Enter a table name (optional, defaults to "default_table")
4. Click "Convert" to generate the Hive SQL
5. The resulting SQL will appear in the right panel
6. Use the "Copy" button to copy the SQL to your clipboard

### API

You can also use the REST API to convert schemas programmatically:

```
POST /api/convert
Content-Type: application/json

{
  "avroSchema": { your Avro schema JSON object },
  "tableName": "your_table_name" (optional)
}
```

Response:

```json
{
  "hiveQL": "CREATE EXTERNAL TABLE your_table_name (...)\nSTORED AS AVRO;"
}
```

## Type Conversion

The converter maps Avro types to Hive SQL types as follows:

| Avro Type | Hive SQL Type |
|-----------|---------------|
| string    | STRING        |
| int       | INT           |
| long      | BIGINT        |
| float     | FLOAT         |
| double    | DOUBLE        |
| boolean   | BOOLEAN       |
| bytes     | BINARY        |
| record    | STRUCT        |
| array     | ARRAY         |
| map       | MAP           |
| union     | Type of first non-null type |

## Example

### Input (Avro Schema)

```json
{
  "type": "record",
  "namespace": "Tutorialspoint",
  "name": "Employee",
  "fields": [
    { "name": "Name", "type": "string" },
    { "name": "Age", "type": "int" },
    { 
      "name": "Address",
      "type": {
        "type": "record",
        "name": "AddressRecord",
        "fields": [
          { "name": "street", "type": "string" },
          { "name": "city", "type": "string" }
        ]
      }
    }
  ]
}
```

### Output (Hive SQL)

```sql
CREATE EXTERNAL TABLE employee (
  Name STRING,
  Age INT,
  Address STRUCT<street:STRING, city:STRING>
)
STORED AS AVRO;
```

## Development

### Project Structure

```
avro_to_sql/
├── public/
│   └── index.html       # Web UI
├── src/
│   ├── avroConverter.js # Core conversion logic
│   └── server.js        # Express server and API endpoints
├── package.json         # Project dependencies
└── README.md           # This file
```

### Core Functions

- `convertAvroType()`: Converts Avro data types to Hive SQL data types
- `convertRecordToHiveStruct()`: Converts Avro record types to Hive STRUCT types
- `generateHiveQL()`: Generates the complete Hive SQL CREATE TABLE statement