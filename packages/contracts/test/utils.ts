import { TransferEvent } from "../typechain-types/@openzeppelin/contracts/token/ERC721/IERC721";
import { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog } from "../typechain-types/common";

type FiltersTransfer =
    {
        filters: {
            "Transfer(address,address,uint256)": TypedContractEvent<
                TransferEvent.InputTuple,
                TransferEvent.OutputTuple,
                TransferEvent.OutputObject
            >;
            Transfer: TypedContractEvent<
                TransferEvent.InputTuple,
                TransferEvent.OutputTuple,
                TransferEvent.OutputObject
            >;
        };
        queryFilter<TCEvent extends TypedContractEvent>(
            filter: TypedDeferredTopicFilter<TCEvent>,
            fromBlockOrBlockhash?: string | number | undefined,
            toBlock?: string | number | undefined
        ): Promise<Array<TypedEventLog<TCEvent>>>;
    }

export async function getTokenIds(contract: FiltersTransfer, target: TransferEvent.InputTuple[1], fromBlock?: number) {
    const filter = contract.filters.Transfer(undefined, target)
    return await contract.queryFilter(filter, fromBlock).then(evs => evs.map(e => e.args.tokenId))
}