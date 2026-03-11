import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastBlog = (message) => {
    toast(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    });
};

export default ToastBlog;