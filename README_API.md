# Portfolio Email API Setup

This backend API allows visitors to send emails through your portfolio contact form.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Email Settings

#### Option A: Gmail (Recommended for testing)
1. Create a `.env` file in the root directory
2. Add your Gmail credentials:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Important:** Use an "App Password" from Gmail, not your regular password:
- Go to Google Account Settings → Security
- Enable 2-Factor Authentication
- Generate an App Password for "Mail"

#### Option B: Other Email Services
Modify `server.js` to use your preferred email service (Outlook, Yahoo, etc.)

### 3. Start the Server
```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3000`

### 4. Test the API
- Health check: `GET http://localhost:3000/api/health`
- Send email: `POST http://localhost:3000/api/send-email`

## API Endpoints

### POST /api/send-email
Sends a contact form email.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'd like to connect!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully!"
}
```

## Frontend Integration

The frontend JavaScript has been updated to:
- Show loading state while sending
- Handle API responses
- Display success/error messages
- Reset form on success

## Security Notes

- The API is configured with CORS for local development
- For production, restrict CORS origins to your domain
- Consider adding rate limiting to prevent spam
- Use environment variables for sensitive data

## Troubleshooting

1. **Email not sending**: Check your Gmail app password
2. **CORS errors**: Ensure the backend is running on the expected port
3. **Port conflicts**: Change PORT in `.env` if 3000 is busy

## Production Deployment

For production deployment:
1. Use a proper email service (SendGrid, AWS SES, etc.)
2. Set up proper CORS restrictions
3. Add rate limiting and validation
4. Use HTTPS
5. Consider using a process manager like PM2
