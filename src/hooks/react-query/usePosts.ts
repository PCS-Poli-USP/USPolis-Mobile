import { IClass } from "@/dtos";
import { type PostRequest, type PostResponse } from "@/dtos/forum";
import api from "@/services/api";
import { useQuery } from "react-query";

export function usePosts(sclass: IClass) {
    const query = useQuery(['posts'], async () => {
        const response = await api.get<PostResponse[]>('forum/posts', {
            params: {
                class_id: sclass.id
            }
        });
        //console.log("ForumGetResponse=",response.data);
        return response.data;
    });
    return query;
}

export function useCreatePost() {
    const handlePost = async (postDTO: PostRequest) => {
        console.log("entrou aqui")
        
        const response = await api.post<PostResponse>('forum/posts', postDTO);
        return response.data;
    };
    return handlePost;
}
