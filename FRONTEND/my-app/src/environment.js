let IS_PROD = true;
const server = IS_PROD ?
    "https://video-conferencing-application-backend.onrender.com" :

    "http://localhost:3000"


export default server;