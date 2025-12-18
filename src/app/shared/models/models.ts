import { FieldValue, Timestamp } from 'firebase/firestore';

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

export enum ForumTopic {
  CHARACTER,
  ADVENTURE,
}

export interface Character {
  id: string;
  currentAdventure: string;
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
  wounds: {
    small: number;
    large: number;
  };
}

export interface Forum {
  adventureForum: SubForum;
  characterForum: SubForum;
}

export interface SubForum {
  id: string;
  topic: string;
  posts: string[];
}

export interface ForumPost {
  id: string;
  forumID: ForumTopic;
  title: string;
  poster: string | null | undefined;
  posterUID: string | null | undefined;
  createdAt: Timestamp | FieldValue;
  text: string;
  attachments: string[];
}

export interface ForumPostComment {
  id?: string;
  authorUID: string | null | undefined;
  authorName: string | null | undefined;
  text: string;
  createdAt: Timestamp | FieldValue;
}

export interface Adventure {
  id: string;
  name: string | null;
  events: AdventureEvent[];
  players: Player[];
  currentPlayer: string;
}

export interface Player {
  id: string;
  userID: string;
  character: Character;
  currentAction: string;
}

export interface AdventureEvent {
  id: number;
  name: string;
  desc: string;
  story: string;
  location: string;
  NPCs: NPC[];
}

export interface NPC {
  id: string;
  name: string;
  character: Character | null;
  attitude: 'neutral' | 'hostile';
  actions: boolean[];
}
