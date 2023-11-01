export interface SetImage {
    symbol: string
    logo: string
}

export class Set {
    id: string
    name: string
    images: SetImage

    static select = ['id', 'name', 'images']

    constructor(id: string, name: string, images: SetImage) {
        this.id = id
        this.name = name
        this.images = images
    }

    static async find(id: string): Promise<Set> {
        const { data } = await useFetch(`/api/tcg/provider/sets/${id}`)
        const set = data.value as Set
        return new Set(set.id, set.name, set.images)
    }

    static async search(query: string, page: number, pageSize: number): Promise<Set[]> {
        const { data } = await useFetch(`/api/tcg/provider/sets`, {
            query: {
                q: query,
                page,
                pageSize,
                select: Set.select,
            },
        })
        const sets = data.value as Set[]
        return sets.map((set: Set) => new Set(set.id, set.name, set.images))
    }
}