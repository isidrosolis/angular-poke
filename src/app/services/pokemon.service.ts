import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PokemonListResponse, PokemonDetail } from '../models/pokemon.model';

@Injectable({
    providedIn: 'root'
})
export class PokemonService {
    private readonly apiUrl = 'https://pokeapi.co/api/v2';
    private readonly http = inject(HttpClient);

    getPokemons(limit: number = 20, offset: number = 0): Observable<PokemonListResponse> {
        console.log(this.http.get<PokemonListResponse>(`${this.apiUrl}/pokemon?limit=${limit}&offset=${offset}`));
        return this.http.get<PokemonListResponse>(`${this.apiUrl}/pokemon?limit=${limit}&offset=${offset}`);
    }

    getPokemonDetail(name: string): Observable<PokemonDetail> {
        console.log(`${this.apiUrl}/pokemon/${name}`);
        return this.http.get<PokemonDetail>(`${this.apiUrl}/pokemon/${name}`);
    }

    searchPokemon(name: string): Observable<PokemonDetail> {
        console.log(`${this.apiUrl}/pokemon/${name.toLowerCase()}`);
        return this.http.get<PokemonDetail>(`${this.apiUrl}/pokemon/${name.toLowerCase()}`);
    }
}
