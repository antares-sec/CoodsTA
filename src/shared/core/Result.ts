export abstract class Result{
    protected readonly message: string
    
    constructor(message: string){
        this.message = message
    }

    fail(){
        throw new Error(`[ERROR]${this.message}`)
    }

    success(){
        console.log(`[SUCCESS]${this.message}`)
    }

}