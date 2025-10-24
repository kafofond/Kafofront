import { Component } from '@angular/core';
import { SidebarDirec } from "../../sidebar-direc/sidebar-direc";
import { Navbar } from "../../navbar/navbar";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-main-layout-directeur',
  imports: [SidebarDirec, Navbar, RouterModule],
  templateUrl: './main-layout-directeur.html',
  styleUrl: './main-layout-directeur.css'
})
export class MainLayoutDirecteur {

}
