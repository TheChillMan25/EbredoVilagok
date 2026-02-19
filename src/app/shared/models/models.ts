import { FieldValue, Timestamp } from 'firebase/firestore';
import {
  ActiveStatus,
  Armour,
  Cigar,
  Food,
  Inventory,
  Item,
  SpecialItem,
  Weapon,
} from './game_interfaces';

export interface User {
  id: string | null | undefined;
  username: string | null | undefined;
  email: string | null | undefined;
  characters: string[];
  adventures: string[];
  games: string[];
  inGame: boolean;
}

export interface ForumUser {
  id: string | null | undefined;
  username: string | null | undefined;
  posts: ForumPost[];
}

export enum ForumTopic {
  CHARACTER = 'CHARACTER',
  ADVENTURE = 'ADVENTURE',
}

export interface Character {
  id: string;
  userId: string;
  currentAdventure: string;
  name: string;
  species: string;
  class: string;
  level: number;
  coins: number;
  specialProperties: {
    speciesProperty: number;
    home: number;
  };
  stats: {
    physical: {
      str: number;
      dex: number;
      end: number;
    };
    mental: {
      int: number;
      cun: number;
      wil: number;
    };
    main: {
      hp: number;
      maxHP: number;
      sp: number;
      maxSP: number;
    };
  };
  equipment: {
    left: Weapon;
    right: Weapon;
    armour: Armour;
  };
  virtues: {
    virtues: number[];
    disadv: number[];
  };
  items: {
    food: Food[];
    specialItems: SpecialItem[];
    generalItems: (Item | Inventory)[];
    equipmentItems: (Weapon | Armour)[];
  };
  wounds: {
    small: number;
    large: number;
  };
  activeStatuses: ActiveStatus[];
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

export interface AdventureEvent {
  id: number;
  name: string;
  desc: string;
  story: string;
  location: string;
  NPCs: NPC[];
  completed: boolean;
  finished: boolean;
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
  READY = 'READY',
  NOTREADY = 'NOTREADY',
}

export interface GameParticipant {
  id: string;
  name: string;
  character?: Character;
  lastAction: {
    performer: { id: string; name: string };
    primary: GameAction;
    secondary: GameAction;
  };
  actionsLeft: { primary: boolean; secondary: boolean };
  initiative: number | null;
  inCombat: boolean;
}

export interface Player extends GameParticipant {
  status: PlayerStatus;
  isVoting: boolean;
  campActionPoints: number;
}

export interface NPC extends GameParticipant {
  attitude: 'neutral' | 'hostile';
  isTrader: boolean;
  trades?: Record<string, { pieces: number; item: Food | SpecialItem | Cigar }[]> | null;
  isVisible: boolean;
}

export interface Game {
  id: string;
  ownerName: string;
  ownerId: string;
  name: string;
  maxPlayers: number;
  playerOrder: { id: string; initiative: number; finished: boolean }[];
  players: Player[];
  prevPlayer: string;
  currentPlayer: string;
  currentAction: {
    performer: { id: string; name: string };
    primary: GameAction;
    secondary: GameAction;
  };
  currentEvent: number;
  adventure?: Adventure;
  isOpen: boolean;
  isPublic: boolean;
  started: boolean;
  vote: { theme: string, starter: string, votes: { player: string, vote: boolean }[] };
  camp: {
    isCamping: boolean;
    raid: NPC[];
    campActions: {
      fire: number;
      tents: number;
      traps: number;
      guard: number;
    }
  }
}

export enum ActionType {
  USEITEM = 'USEITEM',
  CAMP = 'CAMP',
  TALK = 'TALK',
  TRADE = 'TRADE',
  ATTACK = 'ATTACK',
  LOOT = 'LOOT',
  NONE = 'NONE',
}

export enum MandatoryCampActions {
  START_FIRES = 'START_FIRES',
  SET_UP_TENTS = 'SET_UP_TENTS',
  SET_UP_TRAPS = 'SET_UP_TRAPS',
  GUARD = 'GUARD',
}

export enum StandardCampActions {
  TREAT_WOUNDS = 'TREAT_WOUNDS',
  CALM_OTHERS = 'CALM_OTHERS',
  GATHER_PLANTS = 'GATHER_PLANTS',
  HUNT = 'HUNT',
}

export interface GameAction {
  type: ActionType | MandatoryCampActions | StandardCampActions;
  target?: string;
  item?: string;
  value?: number;
  reaction?: {
    reacted: boolean,
    reactionType?: Reaction,
    success?: boolean | null,
    counterDamage?: number,
  };
}

export enum Reaction {
  NO_REACTION = 'NO_REACTION',
  DODGE = 'DODGE',
  ATTACK_BACK = 'ATTACK_BACK',
  PARRY = 'PARRY',
}
