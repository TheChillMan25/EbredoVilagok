export interface User {
  id: string | null | undefined;
  username: string | null | undefined;
  email: string | null | undefined;
  characters: string[];
  adventures: string[];
}

export interface ForumUser {
  id: string | null | undefined;
  username: string | null | undefined;
  posts: ForumPost[];
}

export interface Character {
  id: string;
  name: string;
  species: string;
  class: string;
  level: number;
  specialProperties: {
    speciesProperty: number;
    home: number;
  };
  stats: {
    physical: {
      ero: number;
      ugyesseg: number;
      kitartas: number;
    };
    mental: {
      esz: number;
      fortely: number;
      akaratero: number;
    };
    main: {
      hp: number;
      sp: number;
    };
  };
  equipment: {
    left: number;
    right: number;
    armour: number;
  };
  virtues: {
    virtues: number[];
    disadv: number[];
  };
  items: {
    food: number[];
    specialItems: number[];
    otherItems: number[];
    weaponItems: string[];
  };
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

export interface AdventureEvent {
  id: number;
  name: string;
  desc: string;
  story: string;
  NPCs: NPC[];
  location: string;
}

export interface NPC {
  character: Character;
  attitude: 'neutral' | 'hostile';
  actions: string[];
}
