export type UserBasicDTO = {
  id: string
  fullname: string
  username: string
}

// Dùng cho client-only contexts: đôi khi chỉ có `id` (vd: lấy từ session) là đủ.
export type CurrentUserSafe =
  | {
      id: string
      fullname?: string | null
      username?: string | null
    }
  | null

export type FollowEdgeDTO = { followerId: string }

export type BlogAuthorDTO = UserBasicDTO & {
  // Có mặt khi server select followers theo currentUser
  followers?: FollowEdgeDTO[]
}

export type BlogCountsDTO = {
  likes: number
  comments: number
}

export type BlogLikeEdgeDTO = { userId: string }

export type SharedFromDTO = {
  id: string
  caption?: string | null
  imageUrls: string[]
  createdAt: string
  author: UserBasicDTO
  _count: BlogCountsDTO
} | null

export type BlogDTO = {
  id: string
  caption?: string | null
  imageUrls: string[]
  createdAt: string
  author: BlogAuthorDTO
  likes?: BlogLikeEdgeDTO[]
  _count: BlogCountsDTO
  sharedFrom?: SharedFromDTO
}

export type SuggestUserDTO = UserBasicDTO & {
  followers?: FollowEdgeDTO[]
  _count?: { followers: number }
}


