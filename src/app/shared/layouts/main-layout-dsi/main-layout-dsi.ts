import { Component } from '@angular/core';
import { SidebarDsi } from "../../sidebar-dsi/sidebar-dsi";
import { NavbarDsi } from "../../navbar-dsi/navbar-dsi";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-main-layout-dsi',
  imports: [SidebarDsi, NavbarDsi, RouterModule],
  templateUrl: './main-layout-dsi.html',
  styleUrl: './main-layout-dsi.css'
})
export class MainLayoutDSI {

}
