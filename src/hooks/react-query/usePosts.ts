import { IClass } from "@/dtos";
import { PostDTO } from "@/dtos/forum";
import api from "@/services/api";
import axios from "axios";
import { useQuery } from "react-query";

export function usePosts(sclass: IClass) {
    const query = useQuery(['posts'], async () => {
        const response = await api.get<PostDTO[]>('forum/posts', {
            params: {
                event_id: sclass.schedule[0].id.$oid
            }
        });
        console.log("Response=",response.data);
        return response.data;
    });
    return query;
}

export function useCreatePost(postDTO: PostDTO) {
    const query = useQuery(['posts'], async () => {
        const response = await api.post('forum/posts', {
            author: postDTO.author,
            content: postDTO.content,
            event_id: postDTO.event_id
        });
        return response.data;
    })
    return query;
}