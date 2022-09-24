import { HttpErrorResponse } from '@angular/common/http';

export class CustomErrorHandler {
    handlerHttpError(error: HttpErrorResponse): string {
        switch (error.status) {
            case 403:
                return 'Você não tem permissão para realizar esta ação.';
            default:
                return 'Não foi possivel realizar esta ação, tente novamente.';
        }
    }
}
