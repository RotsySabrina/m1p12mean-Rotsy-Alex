import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'solar:atom-line-duotone',
    route: '/dashboard',
  },
  {
    navCap: 'Gestion',
    divider: true
  },
  {
    displayName: 'Stat rendez-vous',
    iconName: 'solar:tablet-line-duotone',
    route: '/ui-components/stat_rdv',
  },
  {
    displayName: 'Liste Rendez-vous',
    iconName: 'solar:tablet-line-duotone',
    route: '/ui-components/mecanicien_rdv',
  },
  {
    displayName: 'Assignation',
    iconName: 'solar:tablet-line-duotone',
    route: '/ui-components/manager_rdv',
  },
  {
    displayName: 'Mécanicien disponible',
    iconName: 'solar:tablet-line-duotone',
    route: '/ui-components/meca_dispo',
  },
  {
    displayName: 'Créneaux',
    iconName: 'solar:tablet-line-duotone',
    route: '/ui-components/creneaux',
  },
  {
    displayName: 'Rendez-vous client',
    iconName: 'solar:tablet-line-duotone',
    route: '/ui-components/rendez_vous_client',
  },
  {
    displayName: 'Mécanicien',
    iconName: 'solar:tablet-line-duotone',
    route: '/ui-components/mecaniciens',
  },
  {
    displayName: 'Véhicule',
    iconName: 'solar:tablet-line-duotone',
    route: '/ui-components/vehicules',
  },
  {
    displayName: 'Catégorie',
    iconName: 'solar:tablet-line-duotone',
    route: '/ui-components/categorie_services',
  },
  {
    displayName: 'Services',
    iconName: 'solar:tablet-line-duotone',
    route: '/ui-components/services',
  },
];
