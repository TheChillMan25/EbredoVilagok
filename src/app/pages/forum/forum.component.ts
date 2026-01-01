import { Component } from '@angular/core';
import { setBackground } from '../../shared/functional/functions';
import { UserService } from '../../shared/services/user/user.service';
import {
  Adventure,
  Character,
  ForumPost,
  ForumTopic,
  PublicAdventure,
  User,
} from '../../shared/models/models';
import { Subscription } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { NgClass, DatePipe } from '@angular/common';
import { ForumService } from '../../shared/services/forum/forum.service';
import {
  noWhitespaceValidator,
  PostTemplateComponent,
} from './post-template/post-template.component';
import {
  FormControl,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { Timestamp, FieldValue } from 'firebase/firestore';
import { isMobileView } from '../map/map.component';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

export function toDate(
  value: Timestamp | Date | FieldValue | null | undefined
): Date | null {
  if (!value) return null;
  const asTimestamp = value as Timestamp;
  if (typeof asTimestamp.toDate === 'function') {
    return asTimestamp.toDate();
  }
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}
@Component({
  selector: 'app-forum',
  imports: [
    MatIcon,
    RouterLink,
    NgClass,
    PostTemplateComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatError,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    DatePipe,
    MatButton,
    CdkTextareaAutosize,
    MatProgressSpinner,
  ],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.scss',
})
export class ForumComponent {
  user: User | null = null;
  myPosts: ForumPost[] = [];
  /**Mobileview Forum panel visibility */
  showForums: boolean = false;
  /**Mobileview User panel visibility */
  showUser: boolean = false;
  /**Mobileview panel to hide User/Forum panel */
  showCloseUI: boolean = false;

  characters: Character[] = [];
  adventures: Adventure[] = [];
  items: Character[] | Adventure[] = [];

  newPostUIVisible: boolean = false;
  newPost!: FormGroup;
  fb = new FormBuilder();
  maxText = 500;
  postError = '';

  isLoading: boolean = false;

  showCharForum: boolean = true;
  characterPosts!: ForumPost[];
  adventurePosts!: ForumPost[];

  forumTopic = ForumTopic;

  isLoggedIn: boolean = false;

  private myPostsSubscription: Subscription | null = null;
  private postSubscription: Subscription | null = null;

  private forumProfileSubscription: Subscription | null = null;
  constructor(
    private userService: UserService,
    private forumService: ForumService
  ) {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  ngOnInit() {
    setBackground('#222', true);
    this.loadForumUserData();
    this.loadPosts();
    this.initForm();
  }

  ngOnDestroy() {
    if (this.forumProfileSubscription)
      this.forumProfileSubscription.unsubscribe();
    if (this.postSubscription) this.postSubscription.unsubscribe();
    if (this.myPostsSubscription) this.myPostsSubscription.unsubscribe();
  }

  initForm() {
    this.newPost = this.fb.group({
      forum: new FormControl('', [Validators.required]),
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(this.maxText),
      ]),
      text: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(500),
        noWhitespaceValidator,
      ]),
      attachSelect: new FormControl(),
      attachments: this.fb.array([]),
    });
    this.newPost.get('forum')?.valueChanges.subscribe((value) => {
      this.selectForum(value);
    });
    this.newPost.get('attachSelect')?.valueChanges.subscribe((value) => {
      this.addAttachment(value);
    });
  }

  get attachments(): FormArray {
    return this.newPost.get('attachments') as FormArray;
  }
  get text(): FormControl {
    return this.newPost.get('text') as FormControl;
  }

  addAttachment(item: Character | Adventure) {
    if (!item) return;
    if (this.attachments.length >= 3) {
      this.postError = 'Nem lehet több csatolmányt hozzáadni! (max. 3)';
      return;
    }
    const alreadyExists = this.attachments.value.includes(item);

    if (!alreadyExists) {
      this.postError = '';
      this.attachments.push(new FormControl(item));
      this.newPost.get('attachSelect')?.reset();
    } else {
      this.postError = 'Ez az elem már csatolva van.';
      console.warn('Ez az elem már csatolva van.');
    }
  }

  toDate(value: Timestamp | Date | FieldValue | null | undefined): Date | null {
    return toDate(value);
  }

  removeAttachment(index: number) {
    this.attachments.removeAt(index);
  }

  loadForumUserData() {
    if (this.forumProfileSubscription) {
      this.forumProfileSubscription.unsubscribe();
    }
    this.forumProfileSubscription = this.userService
      .getUserProfile()
      .subscribe({
        next: (data) => {
          this.user = data.user;
          this.characters = data.characters;
          this.adventures = data.adventures;
        },
        error(err) {
          console.error('Hiba a forumprofil betöltésekor: ' + err);
        },
      });
    this.myPostsSubscription = this.forumService
      .getMyPosts()
      .subscribe((posts) => {
        this.myPosts = posts;
      });
  }

  selectForum(value: ForumTopic) {
    switch (value) {
      case ForumTopic.CHARACTER:
        this.items = this.characters;
        break;
      case ForumTopic.ADVENTURE:
        this.items = this.adventures;
        break;
    }
    this.attachments.clear();
  }

  loadPosts() {
    this.postSubscription = this.forumService.getAllPosts().subscribe({
      next: ({ charPosts, advPosts }) => {
        this.characterPosts = charPosts;
        this.adventurePosts = advPosts;
      },
      error(err) {
        console.error('Hiba a postok betöltésekor: ', err);
      },
    });
  }

  showUI(which: 'forum' | 'user') {
    switch (which) {
      case 'forum':
        this.showForums = true;
        break;
      case 'user':
        this.showUser = true;
        break;
      default:
        break;
    }
    this.showCloseUI = true;
  }

  closeUI() {
    if (this.showForums) this.showForums = false;
    if (this.showUser) this.showUser = false;
    this.showCloseUI = false;
  }

  changeForum(type: 'char' | 'adv') {
    if (type === 'char') this.showCharForum = true;
    else this.showCharForum = false;
    if (isMobileView()) this.closeUI();
  }

  addPost() {
    if (!this.newPost.valid) {
      this.postError = 'Töltsd ki a kötelező mezőket!';
      return;
    }
    this.isLoading = true;
    const formValue = this.newPost.value;

    let post: Omit<ForumPost, 'id' | 'poster' | 'posterUID' | 'createdAt'> = {
      forumID: formValue.forum,
      title: formValue.title,
      text: formValue.text,
      attachments:
        formValue.attachments.map((a: Character | Adventure) => {
          if ('events' in a)
            return { events: a.events, name: a.name } as PublicAdventure;
          else {
            let { id, currentAdventure, ...rest } = a;
            return rest;
          }
        }) || [],
    };

    this.forumService
      .addPost(post)
      .then(() => {
        this.newPostUIVisible = false;
        this.newPost.reset({
          forum: '',
          title: '',
          text: '',
          attachSelect: null,
          attachments: [],
        });
      })
      .catch((error) => {
        console.error('Hiba a poszt létrehozásakor: ', error);
        throw error;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  deletePost(id: string, forumID: ForumTopic) {
    this.forumService.deletePost(id, forumID);
  }

  showNewPostUI(show: boolean = true, event: MouseEvent | null = null) {
    if (event) {
      const target = event.target as HTMLElement;
      if (target.id === 'addPostUI') this.newPostUIVisible = false;
      return;
    }
    if (this.newPost.dirty && show === false) {
      if (confirm('Nem mentett módosításaid vannak. Biztosan bezárod?'))
        this.newPostUIVisible = show;
    } else {
      if (show) {
        this.closeUI();
      }
      this.newPostUIVisible = show;
    }
  }
  isMobileView() {
    return isMobileView();
  }
}
