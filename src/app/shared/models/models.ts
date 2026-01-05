import { FieldValue, Timestamp } from 'firebase/firestore';
import { Food, Item, SpecialItem } from './game_interfaces';

export interface User {
  id: string | null | undefined;
  username: string | null | undefined;
  email: string | null | undefined;
  characters: string[];
  adventures: string[];
  games: string[];
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
  userId: string;
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
    generalItems: number[];
    weaponItems: string[];
  };
  wounds: {
    small: number;
    large: number;
  };
}

export type PublicCharacter = Omit<
  Character,
  'id' | 'currentAdventure' | 'userId'
>;

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
  attachments: PublicCharacter[] | PublicAdventure[];
}

export interface ForumPostComment {
  id: string;
  authorUID: string | null | undefined;
  authorName: string | null | undefined;
  text: string;
  createdAt: Timestamp | FieldValue;
}

export interface Adventure {
  id: string;
  userId: string;
  name: string | null;
  events: AdventureEvent[];
}

export type PublicAdventure = Omit<
  Adventure,
  'id' | 'players' | 'currentPlayer' | 'userId'
>;

export enum PlayerStatus {
  READY,
  NOTREADY,
}

export interface Player {
  userId: string;
  username: string;
  status: PlayerStatus;
  character?: Character;
  canDoPrimary: boolean;
  currentAction: string;
  initiative: number | null;
  inCombat: boolean;
}

export interface AdventureEvent {
  id: number;
  name: string;
  desc: string;
  story: string;
  location: string;
  NPCs: NPC[];
  completed: boolean;
}

export interface NPC {
  id: string;
  name: string;
  character: Character | null | undefined;
  attitude: 'neutral' | 'hostile';
  actions: boolean[];
}

export interface Game {
  id: string;
  ownerName: string;
  ownerId: string;
  name: string;
  maxPlayers: number;
  players: Player[];
  currentPlayer: string;
  currentAction: GameAction | null;
  currentEvent: number;
  adventure?: Adventure;
  isOpen: boolean;
  isPublic: boolean;
  started: boolean;
  isCamping: boolean;
}

export enum ActionType {
  USEITEM,
  CAMP,
  TALK,
  TRADE,
  FIGHT,
  STEAL,
}

export interface GameAction {
  type: ActionType;
  isPrimary: boolean;
  isPartyWide: boolean;
  targetId?: string;
  item?: Food | SpecialItem | Item;
}
