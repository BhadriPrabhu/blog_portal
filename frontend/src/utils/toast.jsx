import { ToastContainer, toast } from "react-toastify";

export default function ToastBlog(item){

    const notify = () => toast(item);
    notify();

    return(
    <>
        <ToastContainer />
    </>
    );
}