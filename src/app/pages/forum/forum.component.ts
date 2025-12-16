import { Component } from '@angular/core';
import { setBackground } from '../../shared/functional/functions';
import { UserService } from '../../shared/services/user/user.service';
import { ForumPost, ForumUser } from '../../shared/models/models';
import { Observable, Subscription } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { ForumService } from '../../shared/services/forum/forum.service';
import { PostTemplateComponent } from "./post-template/post-template.component";

@Component({
  selector: 'app-forum',
  imports: [MatIcon, RouterLink, NgClass, PostTemplateComponent],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.scss',
})
export class ForumComponent {
  user: ForumUser | null = null;
  myPosts: ForumPost[] = [];
  showForums: boolean = false;
  showUser: boolean = false;
  showCloseUI: boolean = false;

  showCharForum: boolean = true;
  characterPosts!: ForumPost[];
  adventurePosts!: ForumPost[];

  isLoggedIn: boolean = false;

  postSubscription!: Subscription;

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
  }

  ngOnDestroy() {
    if (this.forumProfileSubscription)
      this.forumProfileSubscription.unsubscribe();
    if (this.postSubscription) this.postSubscription.unsubscribe();
  }

  loadForumUserData() {
    this.forumProfileSubscription = this.userService
      .getForumUserProfile()
      .subscribe({
        next: (data) => {
          (this.user = data.user), (this.myPosts = data.posts);
        },
        error(err) {
          console.error('Hiba a forumprofil betöltésekor: ' + err);
        },
      });
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
}
