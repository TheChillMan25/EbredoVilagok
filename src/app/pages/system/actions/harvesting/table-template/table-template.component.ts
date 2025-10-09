import { Component, Input } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  displayedHarvestingCreatureColumns,
  HarvestingCreature,
} from '../../actions_harvesting';

@Component({
  selector: 'app-table-template',
  imports: [MatTableModule],
  templateUrl: './table-template.component.html',
  styleUrls: ['./table-template.component.scss', '../../../system_shared.scss'],
})
export class TableTemplateComponent {
  @Input() sourceData!: HarvestingCreature[];
  @Input() creatureName!: string;
  dataSource!: any;
  displayedColumns = displayedHarvestingCreatureColumns;

  ngOnInit() {
    this.dataSource = new MatTableDataSource<HarvestingCreature>(
      this.sourceData
    );
  }
}
