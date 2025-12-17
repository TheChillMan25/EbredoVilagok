import { Component, Input, OnInit } from '@angular/core';
import { Adventure, Character, ForumPost } from '../../../shared/models/models';
import { MatIcon } from '@angular/material/icon';
import { KarakterTemplateComponent } from '../../profile/karakter-template/karakter-template.component';
import { KalandTemplateComponent } from '../../profile/kaland-template/kaland-template.component';
import { NgClass } from '@angular/common';
import { CharacterService } from '../../../shared/services/character/character.service';
import { AdventureService } from '../../../shared/services/adventure/adventure.service';
import { MatTooltip } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-post-template',
  imports: [
    MatIcon,
    KarakterTemplateComponent,
    KalandTemplateComponent,
    NgClass,
    MatTooltip,
    DatePipe,
  ],
  templateUrl: './post-template.component.html',
  styleUrl: './post-template.component.scss',
})
export class PostTemplateComponent {
  @Input() post!: ForumPost;
  @Input() type!: 'character' | 'adventure';

  showAttachments: boolean = false;

  attachments: (Character | Adventure)[] = [];

  constructor(
    private charService: CharacterService,
    private advService: AdventureService
  ) {}

  get createdAtDate(): Date | null {
    const value = this.post?.createdAt as Timestamp | Date | undefined;
    if (!value) return null;

    if (typeof (value as Timestamp).toDate === 'function') {
      return (value as Timestamp).toDate();
    }

    return value instanceof Date ? value : new Date();
  }

  async getAttachments() {
    for (let id of this.post.attachments) {
      if (this.type === 'character') {
        const character = await this.charService.getPublicCharacterByID(id);
        if (character) {
          this.attachments.push(character);
        }
      } else if (this.type === 'adventure') {
        const adventure = await this.advService.getPublicAdventureByID(id);
        if (adventure) {
          this.attachments.push(adventure);
        }
      }
    }
  }

  showAttached() {
    if (this.attachments.length === 0) this.getAttachments();
    this.showAttachments = true;
  }

  closeAttached() {
    this.showAttachments = false;
  }
}
