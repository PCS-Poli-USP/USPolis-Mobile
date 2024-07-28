export type PostRequest = {
    user_id: number;
    content: string;
    class_id: number;
};

export type PostResponse = {
    id: number;
    user_id: number;
    user_name: string;
    content: string;
    class_id: number;
    created_at: string;
}

export type ReportPostRequest = {
    user_id: number;
    post_id: number;

}
