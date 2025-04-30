export interface BookmarkData {
  url: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
}

export interface Settings {
  apiUrl: string;
  userId: string;
  discordEnabled: boolean;
}
