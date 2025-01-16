export type TFiltersGood = {
    name: string,
}

export type TCreateGood = {
    name: string,
    category: string | null,
    description: string,
    description2: string,
    relevant_goods: bigint[] | null,
    files: TGoodFile[],
};

export type TGood = TCreateGood & {
    goodId: bigint
}

export type TGoodFile = {
    fileName: string,
    fileDataIntro: string,
    bucketName: string,
}

export type TFiltersGoodResponse = {
    allGoods: TGood[]
    filtered: TGood[]
}