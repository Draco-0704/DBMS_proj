#!/usr/bin/env node

const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
};

console.log('Setting up Employee Management System Database...');
console.log('Database Host:', dbConfig.host);
console.log('Database User:', dbConfig.user);

// Create connection
const connection = mysql.createConnection(dbConfig);

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    console.log('\nPlease make sure:');
    console.log('1. MySQL server is running');
    console.log('2. The user has proper permissions');
    console.log('3. The database credentials are correct');
    process.exit(1);
  }
  
  console.log('Connected to MySQL successfully');
  
  // Read schema file
  const schemaPath = path.join(__dirname, 'database', 'schema.sql');
  const seedPath = path.join(__dirname, 'database', 'seed.sql');
  
  if (!fs.existsSync(schemaPath)) {
    console.error('Schema file not found at:', schemaPath);
    process.exit(1);
  }
  
  const schema = fs.readFileSync(schemaPath, 'utf8');
  const seed = fs.existsSync(seedPath) ? fs.readFileSync(seedPath, 'utf8') : '';
  
  console.log('Executing database schema...');
  
  // Execute schema
  connection.query(schema, (err) => {
    if (err) {
      console.error('Error executing schema:', err);
      connection.end();
      process.exit(1);
    }
    
    console.log('Database schema created successfully');
    
    if (seed) {
      console.log('Inserting sample data...');
      
      // Execute seed data
      connection.query(seed, (err) => {
        if (err) {
          console.error('Error executing seed data:', err);
          connection.end();
          process.exit(1);
        }
        
        console.log('Sample data inserted successfully');
        console.log('\nDatabase setup completed!');
        console.log('You can now start the server with: npm start');
        console.log('\nDefault login credentials:');
        console.log('Username: Srikant, Password: test1234');
        console.log('Username: rajesh.kumar, Password: password123');
        console.log('Username: priya.sharma, Password: password123');
        
        connection.end();
      });
    } else {
      console.log('No seed data found. Database schema created successfully.');
      console.log('You can now start the server with: npm start');
      connection.end();
    }
  });
});
