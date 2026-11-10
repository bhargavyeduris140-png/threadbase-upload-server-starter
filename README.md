# Threadbase - Upload Server

Implementation for **LU 4.9 - File Upload with Multer**.

## Features

- JWT-protected `POST /api/upload` endpoint.
- Accepts one image in the multipart form field named `avatar`.
- Stores files on disk in `uploads/` with generated filenames.
- Allows JPG/JPEG, PNG, GIF, and WebP images only.
- Enforces a 5 MB file-size limit.
- Serves uploaded files through `/uploads/<filename>`.

## Setup

```bash
cp .env.example .env
npm install
npm start
```

The server runs at `http://localhost:3001`.

## Get an access token

Demo account:
- Username: `ada`
- Password: `password`

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"ada","password":"password"}'
```

Copy the returned token and include it in the upload request.

## Upload an image

```bash
curl -X POST http://localhost:3001/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "avatar=@/path/to/image.png"
```

A successful upload returns HTTP 201 and a relative `url`, for example `/uploads/<generated-filename>.png`. Open `http://localhost:3001` followed by that URL to view the image.

## Expected errors

- Missing or invalid token: `401`.
- Unsupported file type (for example, PDF): `400`.
- File larger than 5 MB: `400`.
- Missing `avatar` field or unexpected file field: `400`.

## Security notes

- The upload route authenticates the request before Multer processes the file.
- Both MIME type and filename extension are checked. These checks are useful validation but are not a substitute for content-based file inspection in a production service.
- Uploaded files are excluded from Git by `.gitignore`.
- Set a strong, private `JWT_SECRET` in production and keep `.env` out of version control.
