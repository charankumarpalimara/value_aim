# MySQL Database Setup Guide

This guide will help you set up MySQL database for the Value Aim backend application.

## Prerequisites

- MySQL Server installed on your system
- Node.js and npm installed

## Step 1: Install MySQL Server

### For macOS (using Homebrew):
```bash
brew install mysql
brew services start mysql
```

### For Windows:
1. Download MySQL Installer from [mysql.com](https://dev.mysql.com/downloads/installer/)
2. Run the installer and follow the setup wizard
3. Remember the root password you set

### For Ubuntu/Linux:
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

## Step 2: Database Configuration

Your MySQL database is already configured with the following details:
- **Host**: 147.182.163.213
- **User**: alanadmin
- **Password**: Alantur@123
- **Database**: value_aim

The application will connect to this remote MySQL database automatically.

## Step 3: Install Dependencies

Navigate to the backend directory and install the required packages:

```bash
cd backend
npm install
```

This will install:
- `sequelize` - MySQL ORM
- `mysql2` - MySQL driver for Node.js
- Other existing dependencies

## Step 4: Environment Configuration (Optional)

Since your database credentials are already configured in the code, you can optionally create a `.env` file to override them:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# MySQL Database Configuration (Optional - already configured)
MYSQL_HOST=147.182.163.213
MYSQL_PORT=3306
MYSQL_USER=alanadmin
MYSQL_PASSWORD=Alantur@123
MYSQL_DATABASE=value_aim

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_make_it_strong
JWT_EXPIRE=7d
```

**Note**: The database connection is already configured with your credentials in the code.

## Step 5: Database Tables

The application will automatically create the following tables when you start the server:

### Users Table
- `id` (Primary Key, Auto Increment)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, Hashed)
- `provider` (ENUM: email, google, microsoft, apple)
- `providerId` (VARCHAR)
- `picture` (VARCHAR)
- `isFirstLogin` (BOOLEAN)
- `hasCompletedOnboarding` (BOOLEAN)
- `companyDetailsCompleted` (BOOLEAN)
- `serviceDetailsCompleted` (BOOLEAN)
- `plan` (ENUM: Free Plan, Pro Plan, Enterprise Plan)
- `createdAt` (DATETIME)
- `updatedAt` (DATETIME)

### Companies Table
- `id` (Primary Key, Auto Increment)
- `userId` (Foreign Key to Users)
- `companyName` (VARCHAR)
- `industry` (VARCHAR)
- `website` (VARCHAR)
- `country` (VARCHAR)
- `city` (VARCHAR)
- `employees` (ENUM)
- `description` (TEXT)
- `createdAt` (DATETIME)
- `updatedAt` (DATETIME)

### Services Table
- `id` (Primary Key, Auto Increment)
- `userId` (Foreign Key to Users)
- `interests` (JSON)
- `keywords` (JSON)
- `adjacencyExpansion` (JSON)
- `targetIndustry` (JSON)
- `functionType` (JSON)
- `targetSegment` (JSON)
- `offerStatus` (ENUM: Active, Inactive)
- `description` (TEXT)
- `createdAt` (DATETIME)
- `updatedAt` (DATETIME)

## Step 6: Start the Server

1. Start the backend server:
```bash
npm run dev
```

2. You should see output like:
```
MySQL Connected: Connection established successfully.
Database synchronized successfully.
Server running on port 5000
Environment: development
```

## Step 7: Test the Connection

1. The server will automatically create tables if they don't exist
2. You can verify tables were created by connecting to MySQL:
```bash
mysql -u root -p
USE value_aim_db;
SHOW TABLES;
```

You should see: `companies`, `services`, `users`

## Troubleshooting

### Connection Issues

**Error: "Access denied for user 'root'@'localhost'":**
- Check your MySQL password in the `.env` file
- Try resetting MySQL password:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

**Error: "Can't connect to MySQL server":**
- Make sure MySQL service is running:
```bash
# macOS
brew services start mysql

# Windows
net start mysql

# Ubuntu/Linux
sudo systemctl start mysql
```

**Error: "Database 'value_aim_db' doesn't exist":**
- Create the database manually:
```sql
CREATE DATABASE value_aim_db;
```

### Port Issues

**Error: "Port 5000 already in use":**
- Change the PORT in your `.env` file to a different number (e.g., 5001)
- Or stop the service using port 5000

### Table Creation Issues

**Error: "Table doesn't exist":**
- Make sure the database exists
- Check your MySQL user has CREATE privileges
- Restart the server to trigger table creation

## Production Setup

For production deployment:

1. **Use a dedicated MySQL user:**
```sql
CREATE USER 'value_aim_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON value_aim_db.* TO 'value_aim_user'@'localhost';
FLUSH PRIVILEGES;
```

2. **Update .env file:**
```bash
MYSQL_USER=value_aim_user
MYSQL_PASSWORD=strong_password
NODE_ENV=production
```

3. **Use environment variables** instead of hardcoding credentials

4. **Set up SSL** for database connections in production

## Database Backup

To backup your database:
```bash
mysqldump -u root -p value_aim_db > backup.sql
```

To restore from backup:
```bash
mysql -u root -p value_aim_db < backup.sql
```

## Performance Optimization

1. **Add indexes** for frequently queried fields:
```sql
ALTER TABLE users ADD INDEX idx_email (email);
ALTER TABLE companies ADD INDEX idx_user_id (userId);
ALTER TABLE services ADD INDEX idx_user_id (userId);
```

2. **Configure MySQL** for better performance in production
3. **Use connection pooling** (already configured in the application)

## Security Best Practices

1. **Never commit** your `.env` file to version control
2. **Use strong passwords** for MySQL users
3. **Limit database user privileges** to only what's needed
4. **Enable SSL** for database connections in production
5. **Regular backups** of your database
6. **Monitor database logs** for suspicious activity

## Next Steps

After setting up MySQL:

1. Test the API endpoints
2. Set up OAuth credentials for Google, Microsoft, and Apple
3. Configure frontend to connect to the backend
4. Test the complete authentication flow

## Support

If you encounter issues:

1. Check MySQL error logs
2. Verify your `.env` configuration
3. Ensure MySQL service is running
4. Check database user permissions
5. Review the application logs for detailed error messages

Your MySQL database is now ready for the Value Aim application! 🎉
