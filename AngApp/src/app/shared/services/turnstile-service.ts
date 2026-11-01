import { HttpClient } from '@angular/common/http';
import { afterNextRender, inject, Service, signal, WritableSignal } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { SharedConfigs } from './shared-configs';

declare const turnstile:any;

@Service()
export class TurnstileService {
    private readonly httpClient = inject(HttpClient);
    private sharedConfigs = inject(SharedConfigs);

    readonly turnstileSecurityKey = "0x4AAAAAAAkeZ2wTzJxqgC_K";

    isEnabled = signal(false);
    widgetId = signal("");

    constructor(){
        this.checkEnable();
        /*afterNextRender(()=>{
        });*/
    }

    checkEnable(){
        this.httpClient.get<{turnstileEnabled:boolean}>("/api/identity/IsTurnstileEnabled").subscribe({
            next: res => {
                //console.log(res);
                if(res && res.turnstileEnabled === true){
                    this.isEnabled.set(true);
                }
                else{
                    this.isEnabled.set(false);
                }
            },
        });
    }

    //loadWidget(turnstileFormField:FieldTree<{CfTurnstileResponse: string,}>, errorMessageSignal:WritableSignal<string>){
    loadWidget(cfTurnstileResponse:FieldTree<string, string, 'writable'>, errorMessageSignal:WritableSignal<string>){
        this.widgetId.set(
            turnstile.render("#widget-container", {
            sitekey: this.turnstileSecurityKey,
            size: "flexible",
            theme: this.sharedConfigs.colorScheme(),
            "response-field": false,
            action: "login",
            "refresh-expired": "manual",
            "refresh-timeout": "manual",
            callback: (token:string) => {
                cfTurnstileResponse().value.set(token);
            },
            'error-callback': (errorCode: string) => {
                errorMessageSignal.set("Turnstile error! error code: " + errorCode);
                console.error("turnstile error-callback: " + errorCode);
            },
            'expired-callback': () => {
                errorMessageSignal.set("Turnstile expired!");
                console.error("turnstile expired-callback");
            },
            'timeout-callback': () => {
                errorMessageSignal.set("Turnstile timeouted!")
                console.error("turnstile timeout-callback");
            },
            })
        );
    }

    resetWidget(){
        turnstile.reset(this.widgetId());
    }
}
