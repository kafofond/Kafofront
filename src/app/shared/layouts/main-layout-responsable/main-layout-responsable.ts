import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarResponsable } from "../../navbar-responsable/navbar-responsable";
import { SidebarResponsable } from "../../sidebar-responsable/sidebar-responsable";

@Component({
  selector: 'app-main-layout-responsable',
  imports: [RouterOutlet, NavbarResponsable, SidebarResponsable],
  templateUrl: './main-layout-responsable.html',
  styleUrls: ['./main-layout-responsable.css']
})
export class MainLayoutResponsable {

}
