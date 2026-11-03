import { afterNextRender, computed, DOCUMENT, effect, inject, Service, signal } from '@angular/core';

@Service()
export class SharedConfigs {
    private readonly _document = inject(DOCUMENT);
    private readonly _colorScheme = signal<'light'|'dark'>('light');
    readonly colorScheme = computed(()=>this._colorScheme());

    constructor(){
        afterNextRender(()=>{
            let cs = localStorage.getItem("colorScheme");
            if(cs){
                if(cs === 'dark'){
                    this._colorScheme.set('dark');
                    this._document.body.classList.add("dark-mode");
                }
                else{
                    this._colorScheme.set('light');
                    this._document.body.classList.remove("dark-mode");
                }
            }
        });
    }

    toggleColorScheme(){
        if(this._colorScheme() === "dark"){
            this._colorScheme.set("light");
            this._document.body.classList.remove("dark-mode");
        }
        else{
            this._colorScheme.set("dark");
            this._document.body.classList.add("dark-mode");
        }
        localStorage.setItem("colorScheme", this.colorScheme());
    }
}
