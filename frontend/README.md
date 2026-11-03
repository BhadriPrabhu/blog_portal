# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## System Architecture

```mermaid
graph TD
	User["User (Web Browser)"]
	Client["IFQM Portal Client (React 19 + Vite + React Router)"]
	API["Application REST API (Node.js + Express 5)"]
	Database[("Application Database (MongoDB Atlas + Mongoose)")]
	Gemini["AI Features (Google Gemini API)"]
	Cloudinary["Image and Media Storage (Cloudinary)"]
	EmailJS["OTP Email Delivery (EmailJS)"]

	User -->|"HTTP(S): load and use the single-page app"| Client
	Client -->|"HTTP/JSON: REST requests; JWT Bearer token where supplied"| API
	API -->|"MongoDB queries and updates via Mongoose"| Database
	Client -->|"HTTPS: Gemini generation requests"| Gemini
	Client -->|"HTTPS multipart upload: images"| Cloudinary
	Client -->|"HTTPS: OTP email requests"| EmailJS
```

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
