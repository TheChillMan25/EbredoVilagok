import { Component } from '@angular/core';
import { setBackground } from '../../shared/functional/functions';
import { UserService } from '../../shared/services/user/user.service';
import { ForumPost, ForumUser } from '../../shared/models/models';
import { Subscription } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-forum',
  imports: [MatIcon, RouterLink, NgClass],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.scss',
})
export class ForumComponent {
  user: ForumUser | null = null;
  myPosts: ForumPost[] = [];
  showForums: boolean = false;
  showUser: boolean = false;
  showCloseUI: boolean = false;
  forumTemplates = [{ name: 'Fórum' }, { name: 'Fórum' }, { name: 'Fórum' }];

  isLoggedIn: boolean = false;

  private forumProfileSubscription: Subscription | null = null;
  constructor(private userService: UserService) {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  ngOnInit() {
    setBackground('#222', true);
    this.loadForumUserData();
  }

  ngOnDestroy() {
    if (this.forumProfileSubscription)
      this.forumProfileSubscription.unsubscribe();
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
}
