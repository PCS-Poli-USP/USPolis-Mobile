export type PostRequest = {
    user_id: number;
    content: string;
    class_id: number;
    subject_id: number;
};

export type PostResponse = {
    id: number;
    user_id: number;
    user_name: string;
    content: string;
    class_id: number;
    subject_id: number;
    created_at: string;
    replies_count: number;
};

export type ReportPostRequest = {
    user_id: number;
    post_id: number;
};

export type ForumPostReplyResponse = {
    id: number;
    forum_post_id: number;
    class_id: number;
    subject_id: number;
    content: string;
    user_id: number;
    user_name: string;
    created_at: string;
};

export type ForumPostReply = {
    class_id: number;
    content: string;
    user_id: number;
    subject_id: number;
};
