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
    displayName: 'Statistique',
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
  // {
  //   displayName: 'Mécanicien disponible',
  //   iconName: 'solar:user-line-duotone', // Icône par défaut compatible
  //   route: '/ui-components/meca_dispo',
  //   roles: ['manager'],
  // },
  {
    displayName: 'Créneaux',
    iconName: 'solar:alarm-line-duotone', 
    route: '/ui-components/creneaux',
    roles: ['manager'],
  },
  {
    displayName: 'Rendez-vous',
    iconName: 'solar:calendar-line-duotone',
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
    iconName: 'solar:bus-line-duotone', 
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
  {
    displayName: 'Devis',
    iconName: 'solar:file-text-line-duotone',
    route: '/ui-components/devis',
    roles: ['client'],
  },
  {
    displayName: 'Réparations',
    iconName: 'solar:settings-line-duotone',
    route: '/ui-components/reparations',
    roles: ['client'],
  },
  {
    displayName: 'Réparations',
    iconName: 'solar:settings-line-duotone',
    route: '/ui-components/rep_meca',
    roles: ['mecanicien'],
  },
  {
    displayName: 'Réparations',
    iconName: 'solar:settings-line-duotone',
    route: '/ui-components/rep_manag',
    roles: ['manager'],
  },
  {
    displayName: 'Factures',
    iconName: 'solar:bill-line-duotone',
    route: '/ui-components/facture',
    roles: ['client'],
  },
];
