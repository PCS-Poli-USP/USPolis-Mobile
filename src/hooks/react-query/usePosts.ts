import { IClass } from "@/dtos";
import { type PostRequest, type PostResponse, type ReportPostRequest } from "@/dtos/forum";
import api from "@/services/api";
import { useQuery } from "react-query";

export function usePosts(sclass: IClass) {
    const query = useQuery(['posts'], async () => {
        const response = await api.get<PostResponse[]>('forum/posts', {
            params: {
                class_id: sclass.id
            }
        });
        return response.data;
    });
    return query;
}

export function useCreatePost() {
    const handlePost = async (postDTO: PostRequest) => {
        
        const response = await api.post<PostResponse>('forum/posts', postDTO);
        return response.data;
    };
    return handlePost;
}

export function useReportPost(reportPost: ReportPostRequest) {

    const handleReportPost = async (reportPostDTO: ReportPostRequest) => {
        const response = await api.post<ReportPostRequest>('forum/reportPosts', reportPostDTO);
        return response.data;
    };
    return handleReportPost;
}