import { Component, Input } from '@angular/core';
import {
  Adventure,
  Character,
  ForumPost,
  ForumPostComment,
  ForumTopic,
} from '../../../shared/models/models';
import { MatIcon } from '@angular/material/icon';
import { KarakterTemplateComponent } from '../../profile/karakter-template/karakter-template.component';
import { KalandTemplateComponent } from '../../profile/kaland-template/kaland-template.component';
import { NgClass } from '@angular/common';
import { CharacterService } from '../../../shared/services/character/character.service';
import { AdventureService } from '../../../shared/services/adventure/adventure.service';
import { MatTooltip } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { FieldValue, Timestamp } from 'firebase/firestore';
import { ForumService } from '../../../shared/services/forum/forum.service';
import {
  FormBuilder,
  FormsModule,
  FormControl,
  FormGroup,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { toDate } from '../forum.component';
import { Subscription } from 'rxjs';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noWhitespaceValidator(
  control: AbstractControl
): ValidationErrors | null {
  const isWhitespace = (control.value || '').trim().length === 0;
  return isWhitespace ? { whitespace: true } : null;
}

@Component({
  selector: 'app-post-template',
  imports: [
    MatIcon,
    KarakterTemplateComponent,
    KalandTemplateComponent,
    NgClass,
    MatTooltip,
    DatePipe,
    MatFormField,
    MatLabel,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatInput,
    CdkTextareaAutosize,
    MatError,
  ],
  templateUrl: './post-template.component.html',
  styleUrl: './post-template.component.scss',
})
export class PostTemplateComponent {
  @Input() post!: ForumPost;
  @Input() type!: 'character' | 'adventure';
  @Input() userUID!: string | null | undefined;
  isLoading: boolean = false;
  isLoggedIn!: boolean;

  showAttachments: boolean = false;
  showComments: boolean = false;
  addCommentVisible: boolean = false;

  maxCommentLen = 200;
  commentForm!: FormGroup;
  fb = new FormBuilder();

  attachments: (Character | Adventure)[] = [];

  comments: ForumPostComment[] = [];

  private commentsSub: Subscription | null = null;

  constructor(
    private charService: CharacterService,
    private advService: AdventureService,
    private forumService: ForumService
  ) {}

  ngOnInit() {
    this.initCommentForm();
    this.getComments();
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  ngOnChanges() {
    this.comments = [];
    if (this.commentsSub) {
      this.commentsSub.unsubscribe();
      this.getComments();
    }
  }

  initCommentForm() {
    this.commentForm = this.fb.group({
      text: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(this.maxCommentLen),
        noWhitespaceValidator,
      ]),
    });
  }

  get createdAtDate(): Date | null {
    const value = this.post?.createdAt as Timestamp | Date | undefined;
    if (!value) return null;

    if (typeof (value as Timestamp).toDate === 'function') {
      return (value as Timestamp).toDate();
    }

    return value instanceof Date ? value : new Date();
  }

  toDate(value: Timestamp | Date | FieldValue | null | undefined): Date | null {
    return toDate(value);
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

  addComment() {
    if (!this.commentForm.valid) {
      return;
    }
    this.isLoading = true;
    const comment = this.commentForm.value;
    this.forumService
      .addComment(comment.text, this.post.forumID, this.post.id)
      .then(() => {
        this.commentForm.reset({
          text: '',
        });
        this.addCommentVisible = false;
      })
      .catch((error) => {
        console.error('Hiba a komment posztolásakor: ', error);
        throw error;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  deleteComment(commentID: string, topic: ForumTopic, postID: string){
    this.forumService.deleteComment(commentID, topic, postID)
  }

  getComments() {
    this.commentsSub = this.forumService
      .getComments(this.post.id, this.post.forumID)
      .subscribe((value) => {
        this.comments = value;
      });
  }

  showAttached() {
    if (this.attachments.length === 0) this.getAttachments();
    this.showAttachments = true;
  }

  closeAttached() {
    this.showAttachments = false;
  }

  toggle(what: 'comments' | 'addCommentBar') {
    switch (what) {
      case 'comments':
        this.showComments = !this.showComments;
        break;
      case 'addCommentBar':
        if (!this.addCommentVisible === false) {
          if (this.commentForm.get('text')?.dirty) {
            if (confirm('Nem küldted el a kommented. Biztosan bezárod?'))
              this.commentForm.reset({
                text: '',
              });
          }
        }
        this.addCommentVisible = !this.addCommentVisible;

        break;
    }
  }
}
