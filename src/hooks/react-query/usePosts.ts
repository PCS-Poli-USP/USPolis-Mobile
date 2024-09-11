import { IClass } from "@/dtos";
import { type PostRequest, type PostResponse, type ReportPostRequest, type ForumPostReplyResponse, type ForumPostReply } from "@/dtos/forum";
import api from "@/services/api";
import { useQuery } from "react-query";

export function usePosts(sclass: IClass) {
    const query = useQuery(['posts'], async () => {
        const response = await api.get<PostResponse[]>('forum/posts', {
            params: {
                subject_id: sclass.subject_id
            }
        });
        return response.data;
    });
    return query;
}

export function useCreatePost() {
    const handlePost = async (postDTO: PostRequest, idToken: string |  null) => {

        const response = await api.post<PostResponse>(
            'forum/posts',
            postDTO,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${idToken}`,
                },
            }
        );
        return response.data;
    };
    return handlePost;
}

export function useReportPost() {

    const handleReportPost = async (reportPostDTO: ReportPostRequest) => {
        const response = await api.post<ReportPostRequest>('forum/reportPosts', reportPostDTO);
        return response.data;
    };
    return handleReportPost;
}

export function usePostReplies(post_id: number) {
    const query = useQuery(['post-replies'], async () => {

        const response = await api.get<ForumPostReplyResponse[]>(`forum/posts/${post_id}`)
        return response.data
    });

    return query;
}

export function useCreatePostReply() {
    const handlePostReply = async (post_id: number, forumPostReplyDTO: ForumPostReply, idToken: string) => {
        const response = await api.post<ForumPostReplyResponse>(
            `forum/posts/${post_id}`,
            forumPostReplyDTO,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${idToken}`,
                },
            }
        );
        return response.data;
    };
    return handlePostReply;
}

