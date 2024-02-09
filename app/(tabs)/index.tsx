import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Link } from 'expo-router';

export interface Post {
  post_content: string;
  post_id: string;
  hashtags: string[];
  post_images: string[] | [];
  user_id: string;
  post_type: string;
  liked_users: { user_id: string }[];
  likes: number;
  post_title: string;
  timestamp: { _seconds: number; _nanoseconds: number };
}

export default function TabOneScreen() {
  const [postData, setPostData] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contentLoading, setIsContentLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [maxPostReached, setMaxPostReached] = useState(false)

  const fetchData = async () => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsContentLoading(true);
      }
      const response = await fetch(
        `https://ngo-api.vercel.app/api/getpost/all?page=${page}`
      );
      const data = await response.json();

      // Assuming 'posts' is an array within the fetched data
      const posts = data.posts || [];
      if(posts.length === 0){
        setMaxPostReached(true)
        return
      }

      // Map and transform the data as needed
      const formattedPosts: Post[] = posts.map((post: any) => ({
        post_content: post.post_content,
        post_id: post.post_id,
        hashtags: post.hashtags || [],
        post_images: post.post_images || [],
        user_id: post.user_id,
        post_type: post.post_type,
        liked_users: post.liked_users || [],
        likes: post.likes || 0,
        timestamp: post.timestamp || { _seconds: 0, _nanoseconds: 0 },
      }));

      if(formattedPosts.length !== 0){
        setPostData((prevData) => [...prevData, ...formattedPosts]);
      } else {
        return 
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
      setIsContentLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleRefresh = () => {
    setRefreshing(true);
    setMaxPostReached(false);
    setPage(1)
    setPostData([])
    fetchData();
    setRefreshing(false);
  };

  const handleEndReached = () => {
    if(!maxPostReached){
      setPage(page + 1);
    }
  };

  return (
    <>
      {isLoading === false ? (
        <View style={styles.container}>
          <View
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              borderRadius: 40,
              backgroundColor: 'white',
            }}
          >
            <Link href={'/posttab/postScreen'} asChild>
              <AntDesign name="pluscircle" size={55} color="black" />
            </Link>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size={'large'} color={'#635bff'} />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 5,
    flexDirection: 'column',
    gap: 20,
  },
});
