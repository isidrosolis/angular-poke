import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Title, Meta } from '@angular/platform-browser';
import { PokemonService } from '../../services/pokemon.service';
import { FavoritesService } from '../../services/favorites.service';
import { PokemonDetail } from '../../models/pokemon.model';

@Component({
    selector: 'app-pokemon-detail',
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatChipsModule,
        MatProgressBarModule
    ],
    templateUrl: './pokemon-detail.html',
    styleUrl: './pokemon-detail.scss'
})
export class PokemonDetailComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly pokemonService = inject(PokemonService);
    private readonly favoritesService = inject(FavoritesService);
    private readonly titleService = inject(Title);
    private readonly metaService = inject(Meta);

    pokemon = signal<PokemonDetail | null>(null);
    loading = signal(true);

    ngOnInit(): void {
        const name = this.route.snapshot.paramMap.get('name');
        if (name) {
            this.loadPokemon(name);
        }
    }

    loadPokemon(name: string): void {
        this.loading.set(true);
        this.pokemonService.getPokemonDetail(name).subscribe({
            next: (pokemon) => {
                this.pokemon.set(pokemon);
                this.titleService.setTitle(`${pokemon.name.toUpperCase()} | Pokedex`);
                this.metaService.updateTag({ name: 'description', content: `Detailed stats and information about ${pokemon.name}.` });
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
                this.router.navigate(['/']);
            }
        });
    }

    isFavorite(): boolean {
        const poke = this.pokemon();
        return poke ? this.favoritesService.isFavorite(poke.id) : false;
    }

    toggleFavorite(): void {
        const poke = this.pokemon();
        if (poke) {
            this.favoritesService.toggleFavorite({
                id: poke.id,
                name: poke.name,
                image: poke.sprites.other['official-artwork'].front_default || poke.sprites.front_default,
                types: poke.types.map(t => t.type.name)
            });
        }
    }

    goBack(): void {
        this.router.navigate(['/']);
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

    getStatColor(stat: number): string {
        if (stat >= 100) return '#4caf50';
        if (stat >= 70) return '#8bc34a';
        if (stat >= 50) return '#ffc107';
        return '#ff9800';
    }

    getStatPercentage(stat: number): number {
        return Math.min((stat / 255) * 100, 100);
    }
}
