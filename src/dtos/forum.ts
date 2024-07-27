export type PostRequest = {
    user_id: number;
    content: string;
    class_id: number;
};

export type PostResponse = {
    id: string;
    user_id: number;
    user_name: string;
    content: string;
    class_id: number;
    created_at: string;
}
