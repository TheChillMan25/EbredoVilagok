export interface User {
  id: string | null | undefined;
  username: string | null | undefined;
  email: string | null | undefined;
  characters: Character[];
  adventures: Adventure[];
}

export interface Character {
  id: string;
  name: string;
}

export interface Adventure {
  id: string;
  name: string;
}
