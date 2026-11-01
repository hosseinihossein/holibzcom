import { computed, DOCUMENT, effect, inject, Service, signal } from '@angular/core';

@Service()
export class SharedConfigs {
    private readonly _document = inject(DOCUMENT);
    private readonly _colorScheme = signal<'light'|'dark'>('light');
    readonly colorScheme = computed(()=>this._colorScheme());

    constructor(){
        let cs = localStorage.getItem("colorScheme");
        if(cs){
            if(cs === 'dark') 
                this._colorScheme.set('dark');
            else 
                this._colorScheme.set('light');
        }
    }

    toggleColorScheme(){
        if(this._colorScheme() === "dark"){
            this._colorScheme.set("light");
        }
        else{
            this._colorScheme.set("dark");
        }
        localStorage.setItem("colorScheme", this.colorScheme());
    }
}
