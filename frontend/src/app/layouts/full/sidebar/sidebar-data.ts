import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Accueil',
    iconName: 'solar:home-line-duotone',
    route: '/dashboard',
    roles: ['manager', 'mecanicien', 'client'],
  },
  {
    displayName: 'Stat rendez-vous',
    iconName: 'solar:chart-line-duotone',
    route: '/ui-components/stat_rdv',
    roles: ['manager'],
  },
  {
    displayName: 'Liste Rendez-vous',
    iconName: 'solar:calendar-line-duotone',
    route: '/ui-components/mecanicien_rdv',
    roles: ['mecanicien'],
  },
  {
    displayName: 'Assignation',
    iconName: 'solar:user-check-line-duotone',
    route: '/ui-components/manager_rdv',
    roles: ['manager'],
  },
  {
    displayName: 'Mécanicien disponible',
    iconName: 'solar:user-line-duotone', // Icône par défaut compatible
    route: '/ui-components/meca_dispo',
    roles: ['manager'],
  },
  {
    displayName: 'Créneaux',
    iconName: 'solar:clock-line-duotone', // Icône générique pour l'heure
    route: '/ui-components/creneaux',
    roles: ['manager'],
  },
  {
    displayName: 'Rendez-vous client',
    iconName: 'solar:calendar-event-line-duotone', // Icône par défaut pour un RDV
    route: '/ui-components/rendez_vous_client',
    roles: ['client'],
  },
  {
    displayName: 'Mécanicien',
    iconName: 'solar:user-line-duotone',
    route: '/ui-components/mecaniciens',
    roles: ['manager'],
  },
  {
    displayName: 'Véhicule',
    iconName: 'solar:car-line-duotone', // Icône par défaut pour un véhicule
    route: '/ui-components/vehicules',
    roles: ['client'],
  },
  {
    displayName: 'Catégorie',
    iconName: 'solar:list-line-duotone',
    route: '/ui-components/categorie_services',
    roles: ['manager'],
  },
  {
    displayName: 'Services',
    iconName: 'solar:settings-line-duotone',
    route: '/ui-components/services',
    roles: ['manager'],
  },
];