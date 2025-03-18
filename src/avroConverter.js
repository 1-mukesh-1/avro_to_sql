function convertAvroType(avroType) {
    if (typeof avroType === 'string') {
      switch (avroType) {
        case 'string': return 'STRING';
        case 'int': return 'INT';
        case 'long': return 'BIGINT';
        case 'float': return 'FLOAT';
        case 'double': return 'DOUBLE';
        case 'boolean': return 'BOOLEAN';
        case 'bytes': return 'BINARY';
        default:      return 'STRING';
      }
    }
  
    else if (Array.isArray(avroType)) {
      const nonNull = avroType.find((t) => t !== 'null');
      return convertAvroType(nonNull);
    }
  
    else if (typeof avroType === 'object' && avroType !== null) {
      if (avroType.type === 'record') {
        return convertRecordToHiveStruct(avroType);
      } else if (avroType.type === 'array') {
        return `ARRAY<${convertAvroType(avroType.items)}>`;
      } else if (avroType.type === 'map') {
        return `MAP<STRING, ${convertAvroType(avroType.values)}>`;
      } else {
      
        return 'STRING';
      }
    }
    return 'STRING';
  }
  
  function convertRecordToHiveStruct(record) {
    if (!record.fields || !Array.isArray(record.fields)) return 'STRING';
    const queue = record.fields.slice(); 
    const structFields = [];
  
    while (queue.length > 0) {
      const field = queue.shift();
      const hiveFieldType = convertAvroType(field.type);
      structFields.push(`${field.name}:${hiveFieldType}`);
    }
    return `STRUCT<${structFields.join(", ")}>`;
  }
  
  
  function generateHiveQL(avroSchema, tableName) {
    if (avroSchema.type !== 'record') {
      throw new Error("Top-level schema must be a record type");
    }
    const columns = avroSchema.fields.map(field => {
      const hiveType = convertAvroType(field.type);
      return `${field.name} ${hiveType}`;
    });
    return `CREATE EXTERNAL TABLE ${tableName} (\n  ${columns.join(",\n  ")}\n)\nSTORED AS AVRO;`;
  }
  
  module.exports = {
    convertAvroType,
    convertRecordToHiveStruct,
    generateHiveQL
  };