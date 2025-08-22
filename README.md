# Nexus Core

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

> Nexus is the vibrant Computer Science and Engineering club at NIT Surat. This project showcases our commitment to innovation with a modern web application built using the MERN stack.

## 📑 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Development Guidelines](#development-guidelines)
- [Component Documentation](#component-documentation)
- [Contributing](#contributing)

## 🌟 Project Overview

Nexus Core is a comprehensive platform that serves multiple purposes:
- Event management and registration
- Alumni network and engagement
- Project showcase and collaboration
- Achievement tracking and verification
- Team member management
- Post management with verification system
- Form management with Google Drive integration

## 💻 Tech Stack

### Backend
- **Node.js & Express**: Server framework
- **MongoDB**: Database
- **JWT**: Authentication
- **Google APIs**: Drive and Sheets integration
- **Nodemailer**: Email services
- **Multer**: File uploads
- **Express Rate Limit**: API rate limiting

### Dependencies
```json
{
  "axios": "^1.7.7",
  "bcrypt": "^5.1.1",
  "cors": "^2.8.5",
  "express": "^4.19.2",
  "googleapis": "^131.0.0",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.3.2",
  "nodemailer": "^6.9.14"
}
```

## 📁 Project Structure

### Server Components

#### Controllers
Located in `/server/controllers/`:
- `achievementController.js`: Manages user achievements
- `alumniController.js`: Handles alumni-related operations
- `authController.js`: Authentication and authorization
- `eventController.js`: Event management
- `formController.js`: Form creation and management
- `issueController.js`: Issue tracking system
- `postController.js`: Blog/post management
- `projectController.js`: Project management
- `teamMembersController.js`: Team member operations
- `userController.js`: User management

#### Models
Located in `/server/models/`:
- `achievementModel.js`: Achievement schema
- `codingProfileModel.js`: Coding profiles schema
- `commentModel.js`: Comments schema
- `CompanyModel.js`: Company information schema
- `contestModel.js`: Contest schema
- `eventModel.js`: Event schema
- `formModel.js`: Form schema
- `projectModel.js`: Project schema
- `userModel.js`: User schema
- And more...

#### Routes
Located in `/server/routes/`:
- Organized routing for each controller
- Middleware integration
- Request validation

#### Utilities
Located in `/server/utils/`:
- `driveUtils.js`: Google Drive integration
- `emailUtils.js`: Email functionality
- `emailTemplates.js`: Email template management
- `validateAlumni.js`: Alumni data validation
- `validateCodingProfiles.js`: Coding profile validation

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Google Cloud Platform account (for Drive integration)
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Nexus-SVNIT/Nexus-Core.git
cd Nexus-Core
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Set up environment variables:
Create a `.env` file in the server directory with:
```env
PORT=3000
MONGO_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

4. Start the development server:
```bash
npm run dev
```

## 📚 API Documentation

Detailed API documentation is available in:
- `api-docs.md`: Markdown documentation
- `Nexus-Core.postman_collection.json`: Postman collection with examples

## 👩‍💻 Development Guidelines

### Code Style
- Use ES6+ features
- Follow the ESLint configuration
- Use async/await for asynchronous operations
- Implement proper error handling
- Add JSDoc comments for functions

### Git Workflow
1. Create a feature branch from `develop`
2. Make changes and commit with meaningful messages
3. Push changes and create a pull request
4. Request review from team members
5. Merge after approval

### Error Handling
- Use the `ExpressError` utility for consistent error responses
- Implement try-catch blocks in async functions
- Return appropriate HTTP status codes
- Log errors for debugging

## 🧩 Component Documentation

### Authentication System
- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Token verification middleware

### Form System
- Dynamic form creation
- Google Sheets integration for responses
- File upload support
- Team registration capability
- Response tracking and management

### Event Management
- Event creation and updates
- Image handling with Multer
- Event status tracking
- Participant management

### Alumni System
- Alumni profile management
- Verification system
- Company and expertise tracking
- Email notifications

### Project Management
- Project creation and tracking
- Team member assignment
- GitHub integration
- Mentor assignment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests if available
5. Create a pull request

### Pull Request Guidelines
- Describe the changes made
- Reference related issues
- Update documentation if needed
- Add screenshots for UI changes

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- NIT Surat CSE Department
- All contributors and maintainers
- Open source community

For more information or support, please contact the Nexus team at [nexus@coed.svnit.ac.in](mailto:nexus@coed.svnit.ac.in)
