import { Routes } from '@angular/router';
import { CustomersComponent } from './customers/customers.component';
import { AccountsComponent } from './accounts/accounts.component';
import { NewCustomerComponent } from './new-customer/new-customer.component';
import { AdminTemplateComponent } from './admin-template/admin-template.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: "", redirectTo: "/admin/home", pathMatch: "full" },
  {
    path: "admin",
    component: AdminTemplateComponent,
    children: [
      { path: "customers", component: CustomersComponent },
      { path: "accounts", component: AccountsComponent },
      { path: "new-customer", component: NewCustomerComponent },
      { path: "home", component: HomeComponent }
    ]
  },
];
