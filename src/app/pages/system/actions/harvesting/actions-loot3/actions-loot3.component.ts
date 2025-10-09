import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  harvestingBestia,
  harvestingNovenyszerzet,
  harvestingGepszulott,
  harvestingTunder,
  harvestingOrdog,
  harvestingSarkany,
  harvestingDemon,
  harvestingEloholt,
  harvestingOrias,
  harvestingAbominaciok,
  HarvestingSizeData,
  harvestingSizeData,
} from '../../actions_harvesting';
import { TableTemplateComponent } from '../table-template/table-template.component';

@Component({
  selector: 'app-actions-loot3',
  imports: [MatTableModule, TableTemplateComponent],
  templateUrl: './actions-loot3.component.html',
  styleUrls: ['./actions-loot3.component.scss', '../../../system_shared.scss'],
})
export class ActionsLoot3Component {
  harvestingSizeData = harvestingSizeData;
  harvestingSizeDataSource = new MatTableDataSource<HarvestingSizeData>(
    harvestingSizeData
  );
  displaySizeColumns = ['size', 'time', 'helpers'];

  sourceDatas = [
    {
      name: 'Bestia',
      data: harvestingBestia,
    },
    {
      name: 'Növényszerzet',
      data: harvestingNovenyszerzet,
    },
    {
      name: 'Gépszülött',
      data: harvestingGepszulott,
    },
    {
      name: 'Tündér',
      data: harvestingTunder,
    },
    {
      name: 'Ördög',
      data: harvestingOrdog,
    },
    {
      name: 'Sárkány',
      data: harvestingSarkany,
    },
    {
      name: 'Démon',
      data: harvestingDemon,
    },
    {
      name: 'Élőholt',
      data: harvestingEloholt,
    },
    {
      name: 'Óriás',
      data: harvestingOrias,
    },
    {
      name: 'Abominációk',
      data: harvestingAbominaciok,
    },
  ];
}
