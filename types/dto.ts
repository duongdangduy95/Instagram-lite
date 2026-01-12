export type UserBasicDTO = {
  id: string
  fullname: string
  username: string
  image?: string | null
}

// Dùng cho client-only contexts: đôi khi chỉ có `id` (vd: lấy từ session) là đủ.
export type CurrentUserSafe =
  | {
    id: string
    fullname?: string | null
    username?: string | null
    image?: string | null
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

export type BlogMusicDTO = {
  provider: 'deezer'
  trackId: number
  title: string
  artist: string
  previewUrl: string
  coverUrl?: string | null
  durationSec?: number | null
} | null

export type SharedFromDTO = {
  id: string
  caption?: string | null
  imageUrls: string[]
  createdAt: string
  author: BlogAuthorDTO
  _count: BlogCountsDTO
  music?: BlogMusicDTO
  isdeleted?: boolean
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
  isSaved?: boolean
  music?: BlogMusicDTO
  isdeleted?: boolean
}

export type SuggestUserDTO = UserBasicDTO & {
  followers?: FollowEdgeDTO[]
  _count?: { followers: number }
}


