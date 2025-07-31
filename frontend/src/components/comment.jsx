import React from "react";
import Dialog from "./dialog";
import CommentData from "./commentData";

export default function Comment({ opened, isClose, commentData, userId }) {
    return (
        <Dialog
            children={<CommentData commentData={commentData} blogId={userId} />}
            opened={opened}
            onclose={isClose}
            width="650px"
            height="500px"
        />
    );
}