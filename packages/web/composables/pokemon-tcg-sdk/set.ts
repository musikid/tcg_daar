export interface SetImage {
  symbol: string
  logo: string
}

export class TCGSet {
  id: string
  name: string
  images: SetImage
  total: number

  static select = ['id', 'name', 'images', 'total']

  constructor(id: string, name: string, images: SetImage, total: number) {
    this.id = id
    this.name = name
    this.images = images
    this.total = total
  }

  static async find(id: string): Promise<TCGSet> {
    const { data } = await useFetch(`/api/protected/tcg/provider/sets/${id}`)
    const set = data.value!.data as TCGSet
    return new TCGSet(set.id, set.name, set.images, set.total)
  }

  static async search(query: string, _page: number, _pageSize: number) {
    const { data } = await useFetch(`/api/protected/tcg/provider/sets`, {
      query: {
        q: query,
        page: _page.toString(),
        pageSize: _pageSize.toString(),
        select: TCGSet.select.join(','),
      },
    })
    const { data: sets, count, totalCount, page, pageSize } = data.value!
    return { sets: (sets as TCGSet[]).map((set: TCGSet) => new TCGSet(set.id, set.name, set.images, set.total)), count, totalCount, page, pageSize }
  }
}
