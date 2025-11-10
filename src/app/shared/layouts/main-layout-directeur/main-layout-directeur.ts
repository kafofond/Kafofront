import { Component } from '@angular/core';
import { SidebarDirec } from "../../sidebar-direc/sidebar-direc";
import { RouterModule } from "@angular/router";
import { NavbarDirecteur } from "../../navbar-directeur/navbar-directeur";

@Component({
  selector: 'app-main-layout-directeur',
  imports: [SidebarDirec, RouterModule, NavbarDirecteur],
  templateUrl: './main-layout-directeur.html',
  styleUrl: './main-layout-directeur.css'
})
export class MainLayoutDirecteur {

}
