Test the tool here - https://avro-to-sql.onrender.com/

# Avro to Hive SQL Converter using Depth-First-Search Algorithm

A simple web application that converts Avro schema definitions to Hive SQL CREATE TABLE statements. This tool helps data engineers and developers quickly generate Hive table definitions from existing Avro schemas.

## Features

- Convert Avro schema JSON to Hive SQL CREATE TABLE statements
- Support for complex Avro types (records, arrays, maps)
- Web-based UI for easy interaction
- RESTful API for programmatic access
- Handles nested structures with proper STRUCT conversion

## Installation

```bash
npm install
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
  "name": "ComplexRecord",
  "namespace": "com.example.avro",
  "fields": [
    {
      "name": "id",
      "type": "string"
    },
    {
      "name": "metadata",
      "type": {
        "type": "record",
        "name": "Metadata",
        "fields": [
          { "name": "created_at", "type": "long", "logicalType": "timestamp-millis" },
          { "name": "updated_at", "type": "long", "logicalType": "timestamp-millis" },
          { "name": "tags", "type": { "type": "array", "items": "string" } }
        ]
      }
    },
    {
      "name": "user",
      "type": {
        "type": "record",
        "name": "User",
        "fields": [
          { "name": "user_id", "type": "string" },
          { "name": "name", "type": "string" },
          { "name": "emails", "type": { "type": "array", "items": "string" } },
          { "name": "addresses", "type": {
            "type": "array",
            "items": {
              "type": "record",
              "name": "Address",
              "fields": [
                { "name": "street", "type": "string" },
                { "name": "city", "type": "string" },
                { "name": "state", "type": "string" },
                { "name": "zip", "type": "string" },
                { "name": "country", "type": "string" }
              ]
            }
          } }
        ]
      }
    },
    {
      "name": "transactions",
      "type": {
        "type": "array",
        "items": {
          "type": "record",
          "name": "Transaction",
          "fields": [
            { "name": "transaction_id", "type": "string" },
            { "name": "amount", "type": "double" },
            { "name": "currency", "type": "string" },
            { "name": "status", "type": { "type": "enum", "name": "Status", "symbols": ["PENDING", "COMPLETED", "FAILED"] } },
            { "name": "items", "type": {
              "type": "array",
              "items": {
                "type": "record",
                "name": "Item",
                "fields": [
                  { "name": "item_id", "type": "string" },
                  { "name": "name", "type": "string" },
                  { "name": "quantity", "type": "int" },
                  { "name": "price", "type": "double" }
                ]
              }
            } }
          ]
        }
      }
    },
    {
      "name": "optional_field",
      "type": ["null", "string"],
      "default": null
    }
  ]
}
```

### Output (Hive SQL)

```sql
CREATE EXTERNAL TABLE default_table (
  id STRING,
  metadata STRUCT<created_at:BIGINT, updated_at:BIGINT, tags:ARRAY<STRING>>,
  user STRUCT<user_id:STRING, name:STRING, emails:ARRAY<STRING>, addresses:ARRAY<STRUCT<street:STRING, city:STRING, state:STRING, zip:STRING, country:STRING>>>,
  transactions ARRAY<STRUCT<transaction_id:STRING, amount:DOUBLE, currency:STRING, status:STRING, items:ARRAY<STRUCT<item_id:STRING, name:STRING, quantity:INT, price:DOUBLE>>>>,
  optional_field STRING
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
