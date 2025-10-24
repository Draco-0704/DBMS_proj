# Configuration Guide

## Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=employee_management_system

# Server Configuration
PORT=5000

# JWT Secret (for future authentication)
JWT_SECRET=your_jwt_secret_key_here
```

## Database Setup

1. **Install MySQL** (if not already installed)
   - Download from https://dev.mysql.com/downloads/mysql/
   - Follow installation instructions for your operating system

2. **Start MySQL Service**
   - Windows: Start MySQL service from Services
   - Linux/Mac: `sudo systemctl start mysql` or `brew services start mysql`

3. **Create Database**
   ```sql
   CREATE DATABASE employee_management_system;
   ```

4. **Run Setup Script**
   ```bash
   npm run setup-db
   ```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check if MySQL is running
   - Verify credentials in `.env` file
   - Ensure database exists

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill process using the port: `lsof -ti:5000 | xargs kill -9`

3. **Permission Denied**
   - Check MySQL user permissions
   - Grant necessary privileges to the user

### MySQL User Setup

If you need to create a MySQL user:

```sql
CREATE USER 'emp_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON employee_management_system.* TO 'emp_user'@'localhost';
FLUSH PRIVILEGES;
```

Then update your `.env` file:
```env
DB_USER=emp_user
DB_PASSWORD=your_password
```
