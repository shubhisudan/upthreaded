# UpThreaded

[![Watch the video](https://img.shields.io/badge/YouTube-Watch%20Video-red)](https://youtu.be/qzZn118cYqc)

A modern web application built with Node.js, Express, and MongoDB for managing designs, requests, and orders.

## Project Idea

UpThreaded is a comprehensive platform designed to streamline the process of managing design projects, client requests, and order fulfillment. The platform serves as a bridge between designers and clients, providing a seamless experience for:

- **Design Management**: Upload, organize, and manage design files with Cloudinary integration
- **Request Handling**: Efficiently process and track client design requests
- **Order Processing**: Manage orders from creation to fulfillment
- **Collaboration**: Facilitate smooth communication between designers and clients
- **Multilingual Support**: Reach a global audience with i18n integration

The platform aims to solve common challenges in the design industry by providing:
- Centralized file management
- Streamlined request processing
- Automated order tracking
- Secure user authentication
- Real-time updates and notifications

## Features

- User authentication and session management
- File upload and management with Cloudinary integration
- Design management system
- Request handling system
- Order management
- Internationalization support (i18n)
- Responsive web interface

## Tech Stack

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB (with Mongoose ODM)
  - Cloudinary for media storage
  - Express-session for session management
  - Multer for file uploads

- **Frontend:**
  - EJS templating engine
  - i18next for internationalization
  - Express-fileupload for file handling
  - Custom JavaScript modules

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd upthreaded
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
ATLAS_URI=your_mongodb_atlas_uri
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
upthreaded/
├── bin/                # Server startup scripts
├── html/              # HTML templates and components
├── javascripts/       # Client-side JavaScript
├── middleware/        # Express middleware
├── models/           # MongoDB models
├── node_modules/     # Dependencies
├── public/           # Static assets
├── routes/           # Express routes
├── scripts/          # Utility scripts
├── views/            # EJS views
├── app.js            # Main application file
├── package.json      # Project dependencies
└── .env              # Environment variables
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon

## Dependencies

Key dependencies include:
- express
- mongoose
- cloudinary
- express-session
- multer
- i18next
- bcrypt
- axios
- dotenv

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
