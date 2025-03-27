import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'solar:atom-line-duotone',
    route: '/dashboard',
    roles: ['manager', 'mecanicien', 'client'], // Accessible à tous
  },
  {
    navCap: 'Gestion',
    divider: true
  },
  {
    displayName: 'Stat rendez-vous',
    iconName: 'solar:tablet-line-duotone',
    route: '/ui-components/stat_rdv',
    roles: ['manager'], // Seulement pour le manager
  },
  {
    displayName: 'Assignation',
    iconName: 'solar:tablet-line-duotone',
    route: '/ui-components/manager_rdv',
    roles: ['manager'],
  },
  {
    displayName: 'Mécanicien disponible',
    iconName: 'solar:tablet-line-duotone',
    route: '/ui-components/meca_dispo',
    roles: ['manager'],
  },
  {
    displayName: 'Créneaux',
    iconName: 'solar:tablet-line-duotone',
    route: '/ui-components/creneaux',
    roles: ['manager'],
  },
  {
    displayName: 'Rendez-vous client',
    iconName: 'solar:tablet-line-duotone',
    route: '/ui-components/rendez_vous_client',
    roles: ['client'],
  },
  {
    displayName: 'Mécanicien',
    iconName: 'solar:tablet-line-duotone',
    route: '/ui-components/mecaniciens',
    roles: ['manager'],
  },
  {
    displayName: 'Véhicule',
    iconName: 'solar:tablet-line-duotone',
    route: '/ui-components/vehicules',
    roles: ['manager', 'mecanicien'],
  },
  {
    displayName: 'Catégorie',
    iconName: 'solar:tablet-line-duotone',
    route: '/ui-components/categorie_services',
    roles: ['manager'],
  },
  {
    displayName: 'Services',
    iconName: 'solar:tablet-line-duotone',
    route: '/ui-components/services',
    roles: ['manager', 'mecanicien'],
  },
];
