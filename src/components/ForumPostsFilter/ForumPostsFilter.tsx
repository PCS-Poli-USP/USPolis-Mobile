import { Theme } from "@/theme/theme";
import { createBox, ResponsiveValue } from "@shopify/restyle";
import {
    FlatList,
    Pressable as NativePressable,
    PressableProps,
} from "react-native";
import { Box, Typography } from "../ui";
import React from "react";
import { PostTag } from "@/dtos/forum";

interface ForumPostsFilterProps {
    myProperty: ResponsiveValue<"xxs" | "xs" | "s" | "m" | "l" | "xl" | "auto", undefined>;
    activeFilters: PostTag[];
    filterPosts: (postFilterTag: PostTag, isActive: boolean) => void;
};

const postsTags: PostTag[] = [
    { name: "Prova", tag: 2 },
    { name: "Salas", tag: 3 },
    { name: "Dúvidas", tag: 5 },
    { name: "Outros", tag: 7 },
];

const Pressable = createBox<Theme, PressableProps>(NativePressable);

export const ForumPostsFilter = ({
    myProperty,
    activeFilters,
    filterPosts,
}: ForumPostsFilterProps) => {
    return (
        <Box my={myProperty}>
            <FlatList
                horizontal
                data={postsTags}
                keyExtractor={(item) => item.name}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item: postTag }) => (
                    <Tags
                        isActive={activeFilters.find((value) => { return value.name === postTag.name }) != undefined}
                        name={postTag.name}
                        handleFilterPosts={() => filterPosts(postTag, activeFilters.find((value) => { return value.name === postTag.name }) != undefined)}
                    />
                )}
            />
        </Box>
    );
};

interface TagsProps {
    name: string;
    isActive: boolean;
    handleFilterPosts: () => void;
}

const Tags = ({ name, isActive, handleFilterPosts }: TagsProps) => {
    return (
        <Pressable
            backgroundColor="graySix"
            padding={'s'}
            borderColor={isActive ? "primary" : "transparent"}
            borderWidth={isActive ? 1 : 0}
            borderRadius={4}
            mr={"xs"}
            alignItems="center"
            justifyContent="center"
            onPress={handleFilterPosts}
        >
            <Typography
                color={isActive ? "primary" : "grayTwo"}
                fontSize={12}
                fontWeight="bold"
                px={"m"}
                textTransform={"uppercase"}
            >
                {name}
            </Typography>
        </Pressable>
    );
};
