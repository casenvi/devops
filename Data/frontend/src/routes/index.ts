import { RouteProps } from "react-router-dom";
import { Dashboard } from "../pages/Dashboard";
import { CategoryList } from "../pages/Categories/CategoryList";
import { CastMemberList } from "../pages/CastMembers/CastMemberList";
import { GenreList } from "../pages/Genres/GenreList";

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
  },
  {
    name: 'category.create',
    label: 'Criar categorias',
    path: '/categories/create',
    component: CategoryList,
    exact: true
  },
  {
    name: 'castmember.list',
    label: 'Listar elenco',
    path: '/cast_members',
    component: CastMemberList,
    exact: true
  },
  {
    name: 'castmember.create',
    label: 'Criar elenco',
    path: '/cast_members/create',
    component: CastMemberList,
    exact: true
  },
  {
    name: 'genre.list',
    label: 'Listar gêneros',
    path: '/genres',
    component: GenreList,
    exact: true
  },
  {
    name: 'genre.create',
    label: 'Criar gêneros',
    path: '/genres/create',
    component: GenreList,
    exact: true
  }
];

export default routes;