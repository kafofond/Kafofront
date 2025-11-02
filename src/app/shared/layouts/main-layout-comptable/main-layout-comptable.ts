import { Component } from '@angular/core';
import { SidebarComptable } from "../../sidebar-comptable/sidebar-comptable";
import { NavbarComptable } from "../../navbar-comptable/navbar-comptable";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-main-layout-comptable',
  imports: [SidebarComptable, NavbarComptable, RouterModule],
  templateUrl: './main-layout-comptable.html',
  styleUrl: './main-layout-comptable.css'
})
export class MainLayoutComptable {

}
