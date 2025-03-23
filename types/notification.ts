export interface Notification {
    id: string
    type: string
    content: string
    referenceId?: string
    isRead: boolean
    createdAt: string
    userId: string
    metadata?: {
      movieId?: string
      movieTitle?: string
      moviePoster?: string
      userName?: string
      userImage?: string
      followerId?: string
      [key: string]: any
    }
  }
  
  