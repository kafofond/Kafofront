import { Component } from '@angular/core';
import { NavbarAdminSystem } from "../../navbar-admin-system/navbar-admin-system";
import { SidebarAdminSystem } from "../../sidebar-admin-system/sidebar-admin-system";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-main-layout-admin-system',
  imports: [NavbarAdminSystem, SidebarAdminSystem, RouterModule],
  templateUrl: './main-layout-admin-system.html',
  styleUrl: './main-layout-admin-system.css'
})
export class MainLayoutAdminSystem {

}
