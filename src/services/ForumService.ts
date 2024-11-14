import { PostResponse, PostTag } from "@/dtos/forum";
import api from "./api";
import { IClass } from "@/dtos";
import { AuthUser } from "@/dtos/auth";
import { Post } from "@/screens/Forum/Forum";

const ERROR_TAG = 'ForumServiceError:';

export const fetchPosts = async (sclass: IClass, authUser: AuthUser | null, setPosts: React.Dispatch<React.SetStateAction<Post[]>>) => {
    try {
        const response = await api.get<PostResponse[]>('forum/posts', {
            params: {
                subject_id: sclass?.subject_id,
                user_id: authUser ? authUser.id : -1
            }
        });
        const data = response.data;

        if (data) {
            setPosts(data.map((post) => {
                return {
                    id: post.id,
                    author: post.user_name,
                    body: post.content,
                    createdAt: post.created_at,
                    replies_count: post.replies_count,
                    likes_count: post.likes_count,
                    user_liked: post.user_liked
                };
            }));
        }
    } catch (error) {
        console.log(ERROR_TAG, error);
    }
}

export const fetchFilteredPosts = async (
    sclass: IClass,
    authUser: AuthUser | null,
    filterTags: PostTag[],
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>
) => {
    try {
        const filters = filterTags.map((filterTag) => { return filterTag.tag })
        const response = await api.get<PostResponse[]>('forum/posts', {
            params: {
                subject_id: sclass?.subject_id,
                user_id: authUser ? authUser.id : -1,
                filter_tags: filters
            },
            paramsSerializer: {
                indexes: null // No braces in the request
            }
        });
        const data = response.data;

        if (data) {
            setPosts(data.map((post) => {
                return {
                    id: post.id,
                    author: post.user_name,
                    body: post.content,
                    createdAt: post.created_at,
                    replies_count: post.replies_count,
                    likes_count: post.likes_count,
                    user_liked: post.user_liked
                };
            }));
        }
    } catch (error) {
        console.log(ERROR_TAG, error);
    }
}
