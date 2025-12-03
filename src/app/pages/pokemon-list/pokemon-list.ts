import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { Title, Meta } from '@angular/platform-browser';
import { PokemonService } from '../../services/pokemon.service';
import { FavoritesService } from '../../services/favorites.service';
import { Pokemon, PokemonDetail } from '../../models/pokemon.model';
import { catchError, of, forkJoin } from 'rxjs';

@Component({
    selector: 'app-pokemon-list',
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatChipsModule
    ],
    templateUrl: './pokemon-list.html',
    styleUrl: './pokemon-list.scss'
})
export class PokemonListComponent implements OnInit {
    private readonly pokemonService = inject(PokemonService);
    private readonly favoritesService = inject(FavoritesService);
    private readonly router = inject(Router);
    private readonly titleService = inject(Title);
    private readonly metaService = inject(Meta);

    pokemons = signal<PokemonDetail[]>([]);
    loading = signal(false);
    searchTerm = signal('');
    totalPokemons = signal(0);
    pageSize = signal(20);
    pageIndex = signal(0);

    filteredPokemons = computed(() => {
        const search = this.searchTerm().toLowerCase();
        if (!search) {
            return this.pokemons();
        }
        return this.pokemons().filter(p => p.name.toLowerCase().includes(search));
    });

    ngOnInit(): void {
        this.titleService.setTitle('Pokedex | All Pokemons');
        this.metaService.updateTag({ name: 'description', content: 'Explore the complete list of Pokemons in our Pokedex application.' });
        this.loadPokemons();
    }

    loadPokemons(): void {
        this.loading.set(true);
        const offset = this.pageIndex() * this.pageSize();

        this.pokemonService.getPokemons(this.pageSize(), offset).subscribe({
            next: (response) => {
                this.totalPokemons.set(response.count);

                // Cargo los detalles de cada poke
                const detailRequests = response.results.map(pokemon =>
                    this.pokemonService.getPokemonDetail(pokemon.name).pipe(
                        catchError(() => of(null))
                    )
                );

                forkJoin(detailRequests).subscribe({
                    next: (details) => {
                        this.pokemons.set(details.filter(d => d !== null) as PokemonDetail[]);
                        this.loading.set(false);
                    },
                    error: () => this.loading.set(false)
                });
            },
            error: () => this.loading.set(false)
        });
    }

    onPageChange(event: PageEvent): void {
        this.pageIndex.set(event.pageIndex);
        this.pageSize.set(event.pageSize);
        this.loadPokemons();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    onSearch(): void {
        const term = this.searchTerm().trim();
        if (!term) {
            this.loadPokemons();
            return;
        }

        this.loading.set(true);
        this.pokemonService.searchPokemon(term).subscribe({
            next: (pokemon) => {
                this.pokemons.set([pokemon]);
                this.loading.set(false);
            },
            error: () => {
                this.pokemons.set([]);
                this.loading.set(false);
            }
        });
    }

    clearSearch(): void {
        this.searchTerm.set('');
        this.pageIndex.set(0);
        this.loadPokemons();
    }

    isFavorite(id: number): boolean {
        return this.favoritesService.isFavorite(id);
    }

    toggleFavorite(pokemon: PokemonDetail): void {
        this.favoritesService.toggleFavorite({
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
            types: pokemon.types.map(t => t.type.name)
        });
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
}
