import { ChangeDetectionStrategy, Component, model, output } from '@angular/core';
import { ContextMenu } from '../../interfaces/context-menu.interface';
import { NgIf, NgStyle } from '@angular/common';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-context-menu',
  imports: [NgIf, NgStyle, ClickOutsideDirective],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuComponent {
  contextMenu = model<ContextMenu>({ x: 0, y: 0, isShow: false, isParent: false });
  appliedToAll = output<ContextMenu>();
  deletedRow = output<ContextMenu>();

  applyToAll() {
    this.hideContextMenu();

    if (this.contextMenu().value) {
      this.appliedToAll.emit(this.contextMenu())
    }
  }

  deleteRow() {
    this.hideContextMenu();

    this.deletedRow.emit(this.contextMenu())

  }

  hideContextMenu() {
    this.contextMenu.update(contextMenu => {
      contextMenu.isShow = false;
      return contextMenu;
    })
  }
}
