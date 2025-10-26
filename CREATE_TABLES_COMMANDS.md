# Database Tables Creation Commands

## Option 1: Using MySQL Command Line

1. **Connect to your MySQL database:**
```bash
mysql -h 147.182.163.213 -u alanadmin -p
# Enter password: Alantur@123
```

2. **Run the SQL commands:**
```bash
# Copy and paste the contents of CREATE_TABLES.sql
# Or run the file directly:
source CREATE_TABLES.sql
```

## Option 2: Using MySQL Workbench or phpMyAdmin

1. **Connect to your database:**
   - Host: 147.182.163.213
   - Username: alanadmin
   - Password: Alantur@123
   - Database: value_aim

2. **Copy and paste the SQL commands from CREATE_TABLES.sql**

## Option 3: One-line command to run the SQL file

```bash
mysql -h 147.182.163.213 -u alanadmin -p value_aim < CREATE_TABLES.sql
```

## Option 4: Individual table creation commands

If you prefer to run commands one by one:

```sql
-- Connect to database
USE value_aim;

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NULL,
    provider ENUM('email', 'google', 'microsoft', 'apple') DEFAULT 'email',
    providerId VARCHAR(255) NULL,
    picture VARCHAR(500) NULL,
    isFirstLogin BOOLEAN DEFAULT true,
    hasCompletedOnboarding BOOLEAN DEFAULT false,
    companyDetailsCompleted BOOLEAN DEFAULT false,
    serviceDetailsCompleted BOOLEAN DEFAULT false,
    plan ENUM('Free Plan', 'Pro Plan', 'Enterprise Plan') DEFAULT 'Free Plan',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Companies table
CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL UNIQUE,
    companyName VARCHAR(255) NULL,
    industry VARCHAR(255) NULL,
    website VARCHAR(500) NULL,
    country VARCHAR(255) NULL,
    city VARCHAR(255) NULL,
    employees ENUM('', '1-10', '11-50', '51-200', '201-1000', '1000+') DEFAULT '',
    description TEXT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Services table
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    interests JSON NULL,
    keywords JSON NULL,
    adjacencyExpansion JSON NULL,
    targetIndustry JSON NULL,
    functionType JSON NULL,
    targetSegment JSON NULL,
    offerStatus ENUM('Active', 'Inactive') DEFAULT 'Active',
    description TEXT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Verification Commands

After creating tables, verify they were created successfully:

```sql
-- Show all tables
SHOW TABLES;

-- Check table structures
DESCRIBE users;
DESCRIBE companies;
DESCRIBE services;

-- Check if tables have any data
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM companies;
SELECT COUNT(*) FROM services;
```

## Expected Output

You should see:
```
+-------------------+
| Tables_in_value_aim |
+-------------------+
| companies         |
| services          |
| users             |
+-------------------+
```

## Troubleshooting

If you get errors:

1. **"Table already exists"** - This is fine, the `IF NOT EXISTS` clause prevents errors
2. **"Access denied"** - Make sure you're using the correct credentials
3. **"Database doesn't exist"** - Make sure the `value_aim` database exists
4. **"Connection refused"** - Check if the MySQL server is running and accessible

## Next Steps

After creating the tables:
1. Test the backend server connection
2. Verify the tables are accessible
3. Start using the API endpoints
