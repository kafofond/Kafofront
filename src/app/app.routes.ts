import { Routes } from '@angular/router';
import { MainLayout } from './shared/layouts/main-layout/main-layout';
import { ContentbodyDashbordGest } from './features/contentbody-dashbord-gest/contentbody-dashbord-gest';
import { ContentbodyListbudgetGest } from './features/contentbody-listbudget-gest/contentbody-listbudget-gest';
import { ContentbodyVoirlignesGest } from './features/contentbody-voirlignes-gest/contentbody-voirlignes-gest';
import { ContentbodyFicheDeBesoinGest } from './features/contentbody-fiche-de-besoin-gest/contentbody-fiche-de-besoin-gest';
import { ContentbodyDemandeAchatGest } from './features/contentbody-demande-achat-gest/contentbody-demande-achat-gest';
import { ContentbodyAttestationServiceFaitGest } from './features/contentbody-attestation-service-fait-gest/contentbody-attestation-service-fait-gest';
import { Parametres } from './shared/parametres/parametres';
import { Connexion } from './shared/connexion/connexion';
import { CreationDeCompte } from './shared/creation-de-compte/creation-de-compte';
import { MainLayoutDirecteur } from './shared/layouts/main-layout-directeur/main-layout-directeur';
import { ContentbodyDashbordDirect } from './features/directeur/contentbody-dashbord-direct/contentbody-dashbord-direct';
import { ContentbodyListbudgetDirect } from './features/directeur/contentbody-listbudget-direct/contentbody-listbudget-direct';
import { ContentbodyVoirlignesDirect } from './features/directeur/contentbody-voirlignes-direct/contentbody-voirlignes-direct';
import { RoleEtUtilisateur } from './features/directeur/role-et-utilisateur/role-et-utilisateur';
import { Depenses } from './features/directeur/depenses/depenses';
import { DocumentsExecution } from './features/directeur/documents-execution/documents-execution';
import { GestionPrelevement } from './features/directeur/gestion-prelevement/gestion-prelevement';

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
                path: 'listbudget-gest/listlignesbudget-gest',
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
        component: Connexion
    },
    {
        path: 'seconnecter',
        component: CreationDeCompte
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
                path: 'listbudget-directeur/listlignesbudget-directeur',
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
            }
        ]
    }
];
