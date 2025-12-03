import { Routes } from '@angular/router';
import { PokemonListComponent } from './pages/pokemon-list/pokemon-list';
import { PokemonDetailComponent } from './pages/pokemon-detail/pokemon-detail';
import { FavoritesComponent } from './pages/favorites/favorites';
import { ContactComponent } from './pages/contact/contact';

export const routes: Routes = [
    { path: '', component: PokemonListComponent },
    { path: 'pokemon/:name', component: PokemonDetailComponent },
    { path: 'favorites', component: FavoritesComponent },
    { path: 'contact', component: ContactComponent },
    { path: '**', redirectTo: '' }
];
