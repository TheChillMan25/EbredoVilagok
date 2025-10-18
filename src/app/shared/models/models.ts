export interface User {
  id: string | null | undefined;
  username: string | null | undefined;
  email: string | null | undefined;
  characters: Character[];
  adventures: Adventure[];
}

export interface ForumUser {
  id: string | null | undefined;
  username: string | null | undefined;
  posts: ForumPost[];
}

export interface Character {
  id: string;
  name: string;
}

export interface Adventure {
  id: string;
  name: string;
}

export enum PostType {
  MAIN,
  CHARACTER,
  ADVENTURE,
  FRIEND,
}

export interface ForumPost {
  id: string;
  title: string;
  type: PostType;
  text: string;
  attachments: string[];
}
