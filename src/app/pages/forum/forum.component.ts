import { Component } from '@angular/core';
import { setBackground } from '../../shared/functional/functions';
import { UserService } from '../../shared/services/user/user.service';
import {
  Adventure,
  Character,
  ForumPost,
  ForumTopic,
  ForumUser,
} from '../../shared/models/models';
import { Observable, Subscription } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { NgClass, AsyncPipe, DatePipe } from '@angular/common';
import { ForumService } from '../../shared/services/forum/forum.service';
import { PostTemplateComponent } from './post-template/post-template.component';
import {
  FormControl,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { CharacterService } from '../../shared/services/character/character.service';
import { AdventureService } from '../../shared/services/adventure/adventure.service';
import { MatButton } from '@angular/material/button';
import { serverTimestamp, Timestamp, FieldValue } from 'firebase/firestore';
import { isMobileView } from '../map/map.component';

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
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    AsyncPipe,
    DatePipe,
    MatButton,
  ],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.scss',
})
export class ForumComponent {
  user: ForumUser | null = null;
  myPosts: ForumPost[] = [];
  showForums: boolean = false;
  showUser: boolean = false;
  showCloseUI: boolean = false;

  characters$!: Observable<Character[]>;
  adventures$!: Observable<Adventure[]>;
  items!: Observable<Character[] | Adventure[]>;

  newPostUIVisible: boolean = false;
  newPost!: FormGroup;
  fb = new FormBuilder();
  maxText = 500;
  postError = '';

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
    private forumService: ForumService,
    private charService: CharacterService,
    private advService: AdventureService
  ) {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  ngOnInit() {
    setBackground('#222', true);
    this.loadForumUserData();
    this.loadPosts();
    this.characters$ = this.charService.getAllCharacters();
    this.adventures$ = this.advService.getAllAdventures();
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

  addAttachment(item: string) {
    const alreadyExists = this.attachments.value.includes(item);

    if (!alreadyExists) {
      this.attachments.push(new FormControl(item));
    } else {
      console.warn('Ez az elem már csatolva van.');
    }
  }

  removeAttachment(index: number) {
    this.attachments.removeAt(index);
  }

  loadForumUserData() {
    if (this.forumProfileSubscription) {
      this.forumProfileSubscription.unsubscribe();
    }
    this.forumProfileSubscription = this.userService
      .getForumUserProfile()
      .subscribe({
        next: (data) => {
          this.user = data.user;
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
        this.items = this.characters$;
        break;
      case ForumTopic.ADVENTURE:
        this.items = this.adventures$;
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
  }

  toDate(value: Timestamp | Date | FieldValue | null | undefined): Date | null {
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

  addPost() {
    if (!this.newPost.valid) {
      this.postError = 'Töltsd ki a kötelező mezőket!';
      return;
    }
    const formValue = this.newPost.value;

    let post: Omit<ForumPost, 'id'> = {
      forumID: formValue.forum,
      title: formValue.title,
      text: formValue.text,
      createdAt: serverTimestamp(),
      poster: this.user?.username,
      posterUID: this.user?.id,
      attachments: formValue.attachments.map((e: any) => e.id) || [],
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
