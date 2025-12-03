import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Title, Meta } from '@angular/platform-browser';
import { FavoritesService } from '../../services/favorites.service';

@Component({
    selector: 'app-favorites',
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule
    ],
    templateUrl: './favorites.html',
    styleUrl: './favorites.scss'
})
export class FavoritesComponent {
    private readonly favoritesService = inject(FavoritesService);
    private readonly router = inject(Router);
    private readonly titleService = inject(Title);
    private readonly metaService = inject(Meta);

    favorites = this.favoritesService.favorites;
    favoritesCount = this.favoritesService.favoritesCount;

    constructor() {
        this.titleService.setTitle('My Favorites | Pokedex');
        this.metaService.updateTag({ name: 'description', content: 'View your favorite Pokemons in one place.' });
    }

    removeFavorite(id: number, event: Event): void {
        event.stopPropagation();
        this.favoritesService.removeFavorite(id);
    }

    viewDetail(name: string): void {
        this.router.navigate(['/pokemon', name]);
    }

    getTypeColor(type: string): string {
        const colors: { [key: string]: string } = {
            normal: '#A8A878',
            fire: '#F08030',
            water: '#6890F0',
            electric: '#F8D030',
            grass: '#78C850',
            ice: '#98D8D8',
            fighting: '#C03028',
            poison: '#A040A0',
            ground: '#E0C068',
            flying: '#A890F0',
            psychic: '#F85888',
            bug: '#A8B820',
            rock: '#B8A038',
            ghost: '#705898',
            dragon: '#7038F8',
            dark: '#705848',
            steel: '#B8B8D0',
            fairy: '#EE99AC'
        };
        return colors[type] || '#68A090';
    }

    goToHome(): void {
        this.router.navigate(['/']);
    }
}
