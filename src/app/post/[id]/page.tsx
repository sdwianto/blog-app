// src/app/post/[id]/page.tsx
'use client';

import { Icon } from '@iconify/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useState, useMemo } from 'react';

import { FALLBACK_AUTHOR_IMAGE, PostCard } from '@/components/post/PostCard';
import { Button } from '@/components/ui/Button';

import Footer from '@/app/home/partials/footer';
import Navbar from '@/app/home/partials/navbar';
import { getCommentsByPost } from '@/lib/api/comments';
import { postComment } from '@/lib/api/comments';
import { getPostById, getPostLikes, getPostsByAuthor } from '@/lib/api/posts';
import { Post } from '@/types/post';

interface Comment {
  id: number;
  author: {
    name: string;
    image?: string;
  };
  content: string;
  createdAt: string | Date;
}

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: post, isLoading: isLoadingPost } = useQuery<Post | undefined>({
    queryKey: ['post', id],
    queryFn: () => getPostById(Number(id)),
  });

  const { data: commentsData } = useQuery<Comment[]>({
    queryKey: ['comments', id],
    queryFn: () => getCommentsByPost(Number(id)),
  });

  const {
    data: sameAuthorPosts,
    isLoading: isLoadingSameAuthorPosts,
    error: sameAuthorPostsError,
  } = useQuery<Post[]>({
    queryKey: ['posts', post?.author?.id],
    queryFn: async () => {
      if (!post?.author?.id) return [];
      const result = await getPostsByAuthor(Number(post.author.id), 100, 1);
      return result || [];
    },
    enabled: !!post?.author?.id,
  });

  useEffect(() => {
    if (sameAuthorPostsError) {
      console.error('Error fetching same author posts:', sameAuthorPostsError);
    }
  }, [sameAuthorPostsError]);

  const { data: likes } = useQuery({
    queryKey: ['likes', id],
    queryFn: () => getPostLikes(Number(id)),
    enabled: !!post,
  });

  const filteredPosts = useMemo(
    () => sameAuthorPosts?.filter((p: Post) => p.id !== post?.id) || [],
    [sameAuthorPosts, post?.id]
  );

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    if (commentsData) {
      setComments(commentsData);
    }
  }, [commentsData, setComments]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (content: string) =>
      postComment(Number(id), Number(localStorage.getItem('userId')), content),
    onSuccess: () => {
      setNewComment('');
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
    },
  });
  const handleSubmitComment = () => {
    if (newComment.trim()) {
      mutation.mutate(newComment.trim());
    }
  };

  return (
    <>
      <Navbar />
      <div className='custom-container mt-24 flex flex-col gap-6'>
        {post ? (
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4'>
              <h1 className='text-2xl font-bold'>{post?.title}</h1>
              <div className='flex gap-1'>
                {post?.tags.map((tag: string) => (
                  <span key={tag} className='rounded-md px-2 py-0.5 text-xs'>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className='flex flex-col gap-2 text-sm text-neutral-700'>
              <div className='flex items-center gap-2'>
                <div className='flex items-center gap-2'>
                  <Image
                    src={post.author?.image || FALLBACK_AUTHOR_IMAGE}
                    alt={post.author?.name}
                    width={40}
                    height={40}
                    className='rounded-full'
                  />
                  <p className='text-xl text-neutral-900'>
                    {post.author?.name}
                  </p>
                </div>
                <Icon
                  icon='ion:ellipse'
                  width='6'
                  height='6'
                  className='text-neutral-400'
                />
                <p className='font-regular text-sm text-neutral-600'>
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className='flex items-center gap-5 text-neutral-600'>
                <div className='flex items-center gap-1.5'>
                  <ThumbsUp /> {likes?.length}
                </div>
                <div className='flex items-center gap-1.5'>
                  <MessageSquare /> {post?.comments}
                </div>
              </div>
            </div>
            {post?.imageUrl ? (
              <Image
                src={post?.imageUrl}
                alt={post?.title}
                width={800}
                height={400}
                className='rounded-lg object-cover'
              />
            ) : null}
            <p className='mt-4 text-neutral-700'>{post?.content}</p>
          </div>
        ) : (
          <p>Loading post...</p>
        )}
        <hr className='border-t border-neutral-300' />
        <div className='gap-4'>
          <h2 className='text-display-xs font-bold text-neutral-900'>
            Comments ({comments?.length})
          </h2>
          <div className='flex items-center gap-4'>
            {post && post.author && (
              <>
                <Image
                  src={post.author.image || FALLBACK_AUTHOR_IMAGE}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className='rounded-full'
                />
                <p className='text-sm font-semibold text-neutral-900'>
                  {post.author.name}
                </p>
              </>
            )}
          </div>
          <div className='flex flex-col gap-1'>
            <p className='text-sm font-semibold text-neutral-950'>
              Give your Comments
            </p>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className='w-full rounded-xl border border-neutral-300 p-4 placeholder:text-neutral-500'
              placeholder='Enter your comments'
            />
          </div>
          <div className='flex justify-end'>
            <Button
              className='bg-primary-300 mt-3 w-51 cursor-pointer rounded-full p-2 text-sm font-medium text-white'
              onClick={handleSubmitComment}
              disabled={mutation.isPending}
            >
              Send
            </Button>
          </div>
          <hr className='mt-4 border-t border-neutral-300' />
        </div>

        <div className='gap-4'>
          {comments?.length ? (
            <div className='flex flex-col gap-4'>
              {[...comments]
                .reverse()
                .slice(0, 3)
                .map((c) => (
                  <React.Fragment key={c.id}>
                    <div className='flex flex-col gap-2'>
                      <div className='flex items-center gap-3'>
                        <Image
                          src={c.author?.image || FALLBACK_AUTHOR_IMAGE}
                          alt={c.author?.name}
                          width={40}
                          height={40}
                          className='rounded-full'
                        />
                        <div className='gap-(-1) flex flex-col items-start'>
                          <p className='text-sm font-semibold text-neutral-900'>
                            {c.author?.name}
                          </p>
                          <p className='font-regular text-sm text-neutral-600'>
                            {new Date(c.createdAt).toLocaleDateString()}
                          </p>{' '}
                        </div>
                      </div>
                      <p className='text-sm text-neutral-700'>
                        {c.content || 'No content available'}
                      </p>
                    </div>
                    <hr className='border-t border-neutral-300' />
                  </React.Fragment>
                ))}
            </div>
          ) : (
            <p className='mt-2 text-neutral-500'>No comments yet.</p>
          )}
        </div>
        {showAllComments && (
          <div className='mt-(-4) flex flex-col gap-4'>
            {[...comments].reverse().map((c) => (
              <React.Fragment key={c.id}>
                <div className='flex flex-col gap-2'>
                  <div className='flex items-center gap-3'>
                    <Image
                      src={c.author?.image || FALLBACK_AUTHOR_IMAGE}
                      alt={c.author?.name}
                      width={40}
                      height={40}
                      className='rounded-full'
                    />
                    <div className='gap-(-1) flex flex-col items-start'>
                      <p className='text-sm font-semibold text-neutral-900'>
                        {c.author?.name}
                      </p>
                      <p className='font-regular text-sm text-neutral-600'>
                        {new Date(c.createdAt).toLocaleDateString()}
                      </p>{' '}
                    </div>
                  </div>
                  <p className='text-sm text-neutral-700'>
                    {c.content || 'No content available'}
                  </p>
                </div>
                <hr className='border-t border-neutral-300' />
              </React.Fragment>
            ))}
          </div>
        )}
        {comments.length > 3 && (
          <p
            className='text-primary-300 cursor-pointer text-sm font-semibold underline'
            onClick={() => setShowAllComments(!showAllComments)}
          >
            {showAllComments ? 'See Less Comments' : 'See All Comments'}
          </p>
        )}
        <div className='mt-12 flex flex-col gap-4'>
          <p className='text-display-xs font-bold text-neutral-900'>
            Another Post
          </p>

          <div className='flex flex-col gap-6'>
            {isLoadingPost || isLoadingSameAuthorPosts ? (
              <p className='text-neutral-500'>Loading other posts...</p>
            ) : post?.author?.id === undefined ? (
              <p className='text-neutral-500'>
                No author information available
              </p>
            ) : sameAuthorPosts === undefined ? (
              <p className='text-neutral-500'>
                Failed to load posts by this author
              </p>
            ) : filteredPosts.length === 0 ? (
              <p className='text-neutral-500'>No other posts by this author</p>
            ) : (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  content={post.content}
                  tags={post.tags || []}
                  imageUrl={post.imageUrl || ''}
                  author={{ name: post.author?.name || 'Unknown' }}
                  createdAt={post.createdAt}
                  likes={post.likes || 0}
                  comments={post.comments || 0}
                />
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
