# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refre

## Deployed App
[Access Frontend APP](https://value-glance-frontend.vercel.app/)

By default, the backend is configured to allow requests only from the deployed frontend (`https://value-glance-frontend.vercel.app`) and from any local `localhost` domains.
If you want to change it, get a clone of the backend [BackendRepo](https://github.com/Jessica-IX/ValueGlance-backend) and modify the CORS policy to allow requests from other domains.

## Run Locally
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2. Create a `.env` file and add the following environment variables:
    ```bash
    VITE_BACKEND_URL=https://valueglance-backend.vercel.app
    ```
       
3. Install frontend dependencies:
    ```bash
    npm install
    ```

4. Run the app:
    ```bash
    npm run dev
    ```
