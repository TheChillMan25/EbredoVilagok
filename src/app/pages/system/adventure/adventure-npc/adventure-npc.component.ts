import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-adventure-npc',
  imports: [],
  templateUrl: './adventure-npc.component.html',
  styleUrls: ['./adventure-npc.component.scss', './../../system_shared.scss']
})
export class AdventureNpcComponent {
  @Output() showEquipmentEvent = new EventEmitter<number>()
  showPage(index: number){
    this.showEquipmentEvent.emit(index)
  }
}
