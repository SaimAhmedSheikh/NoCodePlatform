/**
 * @param success - return value on success
 * @param error - message on failure
 * @param errorCode - Message code on failure. Keep it concise with capital letters and underscores. (Example: NO_ID, NOT_ENOUGH_INFO, WORKER_ERROR, etc.)
 * @param detail - entire error
 * @param type - error or warning 
**/
export class CustomResponse<T = boolean> {
    success?: T
    error?: string
    errorCode?: string
    detail?: any
    type?: 'error' | 'warn'
}
