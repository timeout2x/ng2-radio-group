export class Repository {
    constructor(public id: number,
                public name: string, 
                public owner: { name: string }) {
    }
}