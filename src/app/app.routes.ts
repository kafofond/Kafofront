import { Routes } from '@angular/router';
import { MainLayout } from './shared/layouts/main-layout/main-layout';
import { ContentbodyDashbordGest } from './features/gestionnaire/contentbody-dashbord-gest/contentbody-dashbord-gest';
import { ContentbodyListbudgetGest } from './features/gestionnaire/contentbody-listbudget-gest/contentbody-listbudget-gest';
import { ContentbodyVoirlignesGest } from './features/gestionnaire/contentbody-voirlignes-gest/contentbody-voirlignes-gest';
import { ContentbodyFicheDeBesoinGest } from './features/gestionnaire/contentbody-fiche-de-besoin-gest/contentbody-fiche-de-besoin-gest';
import { ContentbodyDemandeAchatGest } from './features/gestionnaire/contentbody-demande-achat-gest/contentbody-demande-achat-gest';
import { ContentbodyAttestationServiceFaitGest } from './features/gestionnaire/contentbody-attestation-service-fait-gest/contentbody-attestation-service-fait-gest';
import { Parametres } from './shared/parametres/parametres';
import { MainLayoutDirecteur } from './shared/layouts/main-layout-directeur/main-layout-directeur';
import { ContentbodyDashbordDirect } from './features/directeur/contentbody-dashbord-direct/contentbody-dashbord-direct';
import { ContentbodyListbudgetDirect } from './features/directeur/contentbody-listbudget-direct/contentbody-listbudget-direct';
import { ContentbodyVoirlignesDirect } from './features/directeur/contentbody-voirlignes-direct/contentbody-voirlignes-direct';
import { RoleEtUtilisateur } from './features/directeur/role-et-utilisateur/role-et-utilisateur';
import { Depenses } from './features/directeur/depenses/depenses';
import { DocumentsExecution } from './features/directeur/documents-execution/documents-execution';
import { GestionPrelevement } from './features/directeur/gestion-prelevement/gestion-prelevement';
import { MainLayoutResponsable } from './shared/layouts/main-layout-responsable/main-layout-responsable';
import { ContentbodyDashbordRespo } from './features/responsable/contentbody-dashbord-respo/contentbody-dashbord-respo';
import { ContentbodyListbudgetRespo } from './features/responsable/contentbody-listbudget-respo/contentbody-listbudget-respo';
import { ContentbodyBonsDeCommandeRespo } from './features/responsable/contentbody-bons-de-commande-respo/contentbody-bons-de-commande-respo';
import { ContentbodyAttestationDeServiceRespo } from './features/responsable/contentbody-attestation-de-service-respo/contentbody-attestation-de-service-respo';
import { ContentbodyVoirlignesRespo } from './features/responsable/contentbody-voirlignes-respo/contentbody-voirlignes-respo';
import { ContentbodyValidationRespo } from './features/responsable/contentbody-validation-respo/contentbody-validation-respo';
import { ChangerMotDePasse } from './shared/changer-mot-de-passe/changer-mot-de-passe';
import { SeConnecter } from './shared/se-connecter/se-connecter';
import { CreerCompte } from './shared/creer-compte/creer-compte';
import { MainLayoutComptable } from './shared/layouts/main-layout-comptable/main-layout-comptable';
import { ContentbodyAttestationDeServiceComptable } from './features/comptable/contentbody-attestation-de-service-comptable/contentbody-attestation-de-service-comptable';
import { ContentbodyDashbordComptable } from './features/comptable/contentbody-dashbord-comptable/contentbody-dashbord-comptable';
import { ContentbodyBonsDeCommandeComptable } from './features/comptable/contentbody-bons-de-commande-comptable/contentbody-bons-de-commande-comptable';
import { ContentbodyDecisionPrelevementComptable } from './features/comptable/contentbody-decision-prelevement-comptable/contentbody-decision-prelevement-comptable';
import { ContentbodyOrdrePaiementComptable } from './features/comptable/contentbody-ordre-paiement-comptable/contentbody-ordre-paiement-comptable';
import { ContentbodyRapportFinancierComptable } from './features/comptable/contentbody-rapport-financier-comptable/contentbody-rapport-financier-comptable';
import { MainLayoutAdminSystem } from './shared/layouts/main-layout-admin-system/main-layout-admin-system';
import { ContentbodyDashbordAdminSystem } from './features/admin-system/contentbody-dashbord-admin-system/contentbody-dashbord-admin-system';
import { ContentbodyEntrepriseAdminSystem } from './features/admin-system/contentbody-entreprise-admin-system/contentbody-entreprise-admin-system';
import { ContentbodyUtilisateurAdminSystem } from './features/admin-system/contentbody-utilisateur-admin-system/contentbody-utilisateur-admin-system';
import { MainLayoutDSI } from './shared/layouts/main-layout-dsi/main-layout-dsi';
import { ContentbodyDashbordDsi } from './features/dsi/contentbody-dashbord-dsi/contentbody-dashbord-dsi';
import { ContentbodyUtilisateurDsi } from './features/dsi/contentbody-utilisateur-dsi/contentbody-utilisateur-dsi';
import { ContentbodyHistoriqueActionDsi } from './features/dsi/contentbody-historique-action-dsi/contentbody-historique-action-dsi';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: '',
                component: ContentbodyDashbordGest
            },
            {
                path: 'listbudget-gest',
                component: ContentbodyListbudgetGest
            },
            {
                path: 'listbudget-gest/listlignesbudget-gest/:budgetId', // ✅ AJOUT :budgetId
                component: ContentbodyVoirlignesGest
            },
            {
                path: 'fiche-de-besoin-gest',
                component: ContentbodyFicheDeBesoinGest
            },
            {
                path: 'demande-achat-gest',
                component: ContentbodyDemandeAchatGest
            },
            {
                path: 'attestation-de-service-fait-gest',
                component: ContentbodyAttestationServiceFaitGest
            },
            {
                path: 'parametres-gest',
                component: Parametres
            }
        ]
    }, 

    {
        path: "mot-de-passe-oublie",
        component: ChangerMotDePasse
    },
    {
        path: 'seconnecter',
        component: SeConnecter
    },
    {
        path: 'creer-un-compte',
        component:CreerCompte
    },

    {
        path: 'directeur',
        component: MainLayoutDirecteur,
        children: [
            {
                path: '',
                component: ContentbodyDashbordDirect
            },
            {
                path: 'listbudget-directeur',
                component: ContentbodyListbudgetDirect
            },
            {
                path: 'listbudget-directeur/listlignesbudget-directeur/:budgetId', // ✅ AJOUT :budgetId
                component: ContentbodyVoirlignesDirect
            },
            {
                path: 'utilisateurs-directeur',
                component: RoleEtUtilisateur
            },
            {
                path: 'depenses-directeur',
                component: Depenses
            },
            {
                path: 'documents-execution-directeur',
                component: DocumentsExecution
            },
            {
                path: 'gestion-prelevement',
                component: GestionPrelevement
            },
            {
                path: 'historiques-directeur',
                component: ContentbodyHistoriqueActionDsi
            },
            {
                path: 'parametres-directeur',
                component: Parametres
            }
        ]
    },
    {
        path: 'responsable',
        component: MainLayoutResponsable,
        children: [
            {
                path: '',
                component: ContentbodyDashbordRespo
            },
            {
                path: 'listbudget-responsable',
                component: ContentbodyListbudgetRespo
            },
            {
                path: 'listbudget-responsable/listlignesbudget-responsable/:budgetId', // ✅ AJOUT :budgetId
                component: ContentbodyVoirlignesRespo
            },
            {
                path: 'depenses-responsable',
                component: Depenses
            },
            {
                path: 'gestion-prelevement',
                component: GestionPrelevement
            },
            {
                path: 'bons-de-commande-responsable',
                component: ContentbodyBonsDeCommandeRespo
            },
            {
                path: 'attestation-de-service-fait-responsable',
                component: ContentbodyAttestationDeServiceRespo
            
            },
            
            {
                path: 'validation-responsable',
                component: ContentbodyValidationRespo
            },
            
            {
                path: 'parametres-responsable',
                component: Parametres
            }
        ]
    },
    {
        path: 'comptable',
        component: MainLayoutComptable,
        children: [
            {
                path: '',
                component: ContentbodyDashbordComptable
            },
            {
                path: 'depenses-comptable',
                component: Depenses
            },
            {
                path: 'attestation-de-service-fait-comptable',
                component: ContentbodyAttestationDeServiceComptable
            },
            {
                path: 'bons-de-commande-comptable',
                component: ContentbodyBonsDeCommandeComptable
            },
            {
                path: 'decision-prelevement-comptable',
                component: ContentbodyDecisionPrelevementComptable
            },
            {
                path: 'ordre-paiement-comptable',
                component: ContentbodyOrdrePaiementComptable
            },
            {
                path: 'rapport-financier-comptable',
                component: ContentbodyRapportFinancierComptable
            },
            {
                path: 'parametres-comptable',
                component: Parametres
            }
        ]
    },
    {
        path: 'admin-system',
        component: MainLayoutAdminSystem,
        children: [
            {
                path: '',
                component: ContentbodyDashbordAdminSystem
            },
            {
                path: 'entreprises-admin-system',
                component: ContentbodyEntrepriseAdminSystem
            },
            {
                path: 'utilisateurs-admin-system',
                component: ContentbodyUtilisateurAdminSystem
            },
            {
                path: 'parametres-admin-system',
                component: Parametres
            }
        ]
    },
    {
        path: 'dsi',
        component: MainLayoutDSI,
        children: [
            {
                path: '',
                component: ContentbodyDashbordDsi
            },
            {
                path: 'utilisateurs-dsi',
                component: ContentbodyUtilisateurDsi
            },
            {
                path: 'historiques-dsi',
                component: ContentbodyHistoriqueActionDsi
            },
            {
                path: 'parametres-dsi',
                component: Parametres
            }
        ]
    },

    {
        path: '',
        redirectTo: 'seconnecter',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'seconnecter'
    },
];