# Individual SQL Commands to Create Tables

## Step 1: Connect to MySQL
```bash
mysql -h 147.182.163.213 -u alanadmin -p
```
Enter password: `Alantur@123`

## Step 2: Select Database
```sql
USE value_aim;
```

## Step 3: Create Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    provider ENUM('email', 'google', 'microsoft', 'apple') DEFAULT 'email',
    providerId VARCHAR(255),
    picture VARCHAR(500),
    isFirstLogin BOOLEAN DEFAULT true,
    hasCompletedOnboarding BOOLEAN DEFAULT false,
    companyDetailsCompleted BOOLEAN DEFAULT false,
    serviceDetailsCompleted BOOLEAN DEFAULT false,
    plan ENUM('Free Plan', 'Pro Plan', 'Enterprise Plan') DEFAULT 'Free Plan',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Step 4: Create Companies Table
```sql
CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL UNIQUE,
    companyName VARCHAR(255),
    industry VARCHAR(255),
    website VARCHAR(500),
    country VARCHAR(255),
    city VARCHAR(255),
    employees ENUM('', '1-10', '11-50', '51-200', '201-1000', '1000+') DEFAULT '',
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Step 5: Create Services Table
```sql
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    interests JSON,
    keywords JSON,
    adjacencyExpansion JSON,
    targetIndustry JSON,
    functionType JSON,
    targetSegment JSON,
    offerStatus ENUM('Active', 'Inactive') DEFAULT 'Active',
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Step 6: Verify Tables
```sql
SHOW TABLES;
```

## Alternative: Using MySQL Workbench or phpMyAdmin

If command line doesn't work, you can:

1. **Open MySQL Workbench**
2. **Connect to your database:**
   - Host: 147.182.163.213
   - Port: 3306
   - Username: alanadmin
   - Password: Alantur@123
   - Schema: value_aim

3. **Copy and paste the SQL commands above one by one**

## Alternative: Using phpMyAdmin

1. **Open phpMyAdmin in your browser**
2. **Connect to your MySQL server**
3. **Select the `value_aim` database**
4. **Go to SQL tab**
5. **Copy and paste the commands above**

## Troubleshooting

If you get access denied errors:

1. **Check if the user has CREATE privileges:**
```sql
SHOW GRANTS FOR 'alanadmin'@'%';
```

2. **Make sure you're connecting from the right IP address**

3. **Try connecting without specifying the database first:**
```bash
mysql -h 147.182.163.213 -u alanadmin -p
```
Then select the database:
```sql
USE value_aim;
```
