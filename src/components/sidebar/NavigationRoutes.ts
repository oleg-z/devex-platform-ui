export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'menu.dashboard',
      meta: {
        icon: 'home',
      },
    },
    {
      name: 'catalog',
      displayName: 'Catalog',
      meta: {
        icon: 'menu_book',
      },
    },
    {
      name: 'management',
      displayName: 'Management',
      meta: {
        icon: 'manage_accounts',
      },
      children: [
        {
          name: 'users',
          displayName: 'Users',
        },
        {
          name: 'projects',
          displayName: 'Projects',
        }
      ],
    },
    {
      name: 'faq',
      displayName: 'menu.faq',
      meta: {
        icon: 'quiz',
      },
    }
  ] as INavigationRoute[],
}
