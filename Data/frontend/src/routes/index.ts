import { RouteProps } from "react-router-dom";
import { Dashboard } from "../pages/Dashboard";
import { CategoryList } from "../pages/Categories/CategoryList";

export interface MyRouteProp extends RouteProps {
  name: string;
  label: string;
}

const routes: MyRouteProp[] = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    path: '/',
    component: Dashboard,
    exact: true
  },
  {
    name: 'category.list',
    label: 'Listar categorias',
    path: '/categories',
    component: CategoryList,
    exact: true
  }
];

export default routes;