import { Component } from '@angular/core';
import { getItem, setBackground } from '../../shared/functional/functions';
import { Character, NPC } from '../../shared/models/models';
import { MatIconModule } from '@angular/material/icon';
import { DiceRollerComponent } from '../../shared/functional/dice-roller/dice-roller.component';

@Component({
  selector: 'app-game',
  imports: [MatIconModule, DiceRollerComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  role: string = 'player';

  players: {
    userID: string;
    username: string;
    character: Character;
    effect: string;
    turn: string;
  }[] = [
    {
      userID: 'jatekos-1',
      username: 'Játékos 1',
      effect: '',
      turn: 'Várakozás',
      character: {
        currentAdventure: '',
        id: 'karakter-1',
        name: 'Karakter 1',
        class: 'Ördöglakatos',
        specialProperties: {
          speciesProperty: 0,
          home: 0,
        },
        equipment: {
          left: 0,
          right: -1,
          armour: 1,
        },
        level: 1,
        stats: {
          physical: {
            ero: 0,
            ugyesseg: 0,
            kitartas: 0,
          },
          mental: {
            esz: 0,
            fortely: 0,
            akaratero: 0,
          },
          main: {
            hp: 5,
            sp: 8,
          },
        },
        species: 'Folyóköz',
        virtues: {
          virtues: [0, 1],
          disadv: [0],
        },
        items: {
          food: [0],
          specialItems: [0, 1, 2],
          otherItems: [0, 1, 2, 3, 4],
          weaponItems: [],
        },
      },
    },
  ];

  npcs: { id: string; effect: string; turn: string; npc: NPC }[] = [
    {
      id: 'npc-1',
      effect: 'Égés',
      turn: 'Vége',
      npc: {
        id: 'npc-1',
        actions: [],
        attitude: 'neutral',
        character: {
          currentAdventure: '',
          id: 'karakter-1',
          name: 'Karakter 1',
          class: 'Ördöglakatos',
          specialProperties: {
            speciesProperty: 0,
            home: 0,
          },
          equipment: {
            left: 0,
            right: -1,
            armour: 1,
          },
          level: 1,
          stats: {
            physical: {
              ero: 0,
              ugyesseg: 0,
              kitartas: 0,
            },
            mental: {
              esz: 0,
              fortely: 0,
              akaratero: 0,
            },
            main: {
              hp: 5,
              sp: 8,
            },
          },
          species: 'Folyóköz',
          virtues: {
            virtues: [0, 1],
            disadv: [0],
          },
          items: {
            food: [0],
            specialItems: [0, 1, 2],
            otherItems: [0, 1, 2, 3, 4],
            weaponItems: [],
          },
        },
      },
    },
  ];

  ngOnInit() {
    setBackground('paper_bg.jpg');
  }

  getItem(which: string, index: number) {
    return getItem(which, index);
  }
}
