import axios from "axios"

const instance = axios.create({
    baseURL: "https://ai-job-tracker-resume-backend.onrender.com",
})

export default instance;
