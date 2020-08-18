import { RouteProps } from "react-router-dom";
import { Dashboard } from "../pages/Dashboard";
import { CategoryList } from "../pages/Categories/CategoryList";
import { CategoryForm } from "../pages/Categories/CategoryForm";
import { CastMemberList } from "../pages/CastMembers/CastMemberList";
import { CastMemberForm } from "../pages/CastMembers/CastMemberForm";
import { GenreList } from "../pages/Genres/GenreList";
import { GenreForm } from "../pages/Genres/GenreForm";
import { VideoList } from "../pages/Videos/VideoList";
import { VideoForm } from "../pages/Videos/VideoForm";


export interface MyRouteProp extends RouteProps {
  name: string;
  label: string;
}

const routes: MyRouteProp[] = [
  //dashboard
  {
    name: 'dashboard',
    label: 'Dashboard',
    path: '/',
    component: Dashboard,
    exact: true
  },
  //categories
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
    component: CategoryForm,
    exact: true
  },
  {
    name: 'category.edit',
    label: 'Editar categorias',
    path: '/categories/:id/edit',
    component: CategoryForm,
    exact: true
  },
  //castmember
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
    component: CastMemberForm,
    exact: true
  },
  {
    name: 'castmember.edit',
    label: 'Editar elenco',
    path: '/cast_members/:id/edit',
    component: CastMemberForm,
    exact: true
  },
  //genre
  {
    name: 'genre.list',
    label: 'Listar gêneros',
    path: '/genres',
    component: GenreList,
    exact: true
  },
  {
    name: 'genre.create',
    label: 'Criar gênero',
    path: '/genres/create',
    component: GenreForm,
    exact: true
  },
  {
    name: 'genre.edit',
    label: 'Editar gênero',
    path: '/genres/:id/edit',
    component: GenreForm,
    exact: true
  },
  //videos
  {
    name: 'video.list',
    label: 'Listar vídeos',
    path: '/video',
    component: VideoList,
    exact: true
  },
  {
    name: 'video.create',
    label: 'Criar vídeos',
    path: '/video/create',
    component: VideoForm,
    exact: true
  },
  {
    name: 'video.edit',
    label: 'Editar vídeos',
    path: '/video/:id/edit',
    component: VideoForm,
    exact: true
  },
];

export default routes;