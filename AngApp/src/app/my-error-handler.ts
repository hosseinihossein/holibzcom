import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { ErrorDetails, ErrorHandler, inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class MyErrorHandler implements ErrorHandler{
    private snackBar = inject(MatSnackBar);

    handleError(error: any): void {
        const err = error.rejection || error;
        let errTypeMessage = "";

        if(err instanceof HttpErrorResponse){
            switch(err.status){
                case 0:
                    errTypeMessage = "Connection Error";
                    break;
                case HttpStatusCode.Unauthorized:
                    errTypeMessage = "Unauthorized";
                    //this.identityService.logout();
                    break;
                case HttpStatusCode.Forbidden:
                    errTypeMessage = "Access Denied";
                    break;
                case HttpStatusCode.BadRequest:
                    errTypeMessage = "Bad Request";
                    break;
                default:
                    errTypeMessage = "Unknown Error";
            }
        }
        else{
            errTypeMessage = "Application Error";
        }

        this.snackBar.open(errTypeMessage, "Ok"/*, { duration: 5000 }*/);
        console.error(errTypeMessage, err);
    }

    onViewError?(error: Error, details: ErrorDetails): void {
        throw new Error("MyErrorHandler.onViewError: Method not implemented.");
    }

}