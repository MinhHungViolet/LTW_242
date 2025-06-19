# LTW_242 Project

A web application project with separate backend and frontend modules.

## Project Structure

The project is structured into three main components:

- `backend`: PHP backend with JWT authentication
- `frontend_admin`: Admin dashboard interface
- `frontend_user`: User-facing interface

## Requirements

### Backend
- PHP 7.4 or higher
- XAMPP
- MySQL/MariaDB database

### Frontend
- Modern web browser
- Node.js (optional, for development)

## Deployment Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/MinhHungViolet/LTW_242.git
cd LTW_242
```
### 2. Using XAMPP
1. Install XAMPP from https://www.apachefriends.org/
2. Start Apache and MySQL services from the XAMPP Control Panel
3. Clone or copy this repository to your htdocs folder
4. Create a database in phpMyAdmin (accessible at http://localhost/phpmyadmin)
5. Import database schema from backend/db/schema.sql file
### 3. Frontend Setup
#### Install Dependencies
``` bash
cd backend
composer install
```
