import { Service } from '@angular/core';

@Service()
export class LibraryService {
    readonly libraryCardInfoUrl = "/api/library/GetLibraryCardInfo?libId=";
}
