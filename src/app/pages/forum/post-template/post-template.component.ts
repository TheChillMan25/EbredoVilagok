import { Component, Input } from '@angular/core';
import { ForumPost } from '../../../shared/models/models';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-post-template',
  imports: [MatIcon],
  templateUrl: './post-template.component.html',
  styleUrl: './post-template.component.scss',
})
export class PostTemplateComponent {
  @Input() post!: ForumPost;

  
}
