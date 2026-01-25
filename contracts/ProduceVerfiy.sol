// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Agroledger {
    struct Listing {
        string produceId;
        uint256 price;
        uint256 quantity;
        uint256 timestamp;
        address syncedBy; // The "System Signature"
    }

    mapping(string => Listing) public listings;
    // Example of this mapping is something like this:
        // "65fd2ab3..." → {
        //             price: 22000,
        //             quantity: 50,
        //             timestamp: Jan 15, 2026
        //         }
    event ListingSynced(
        string indexed produceId, 
        uint256 price, 
        uint256 quantity, 
        address syncedBy
    );

    function syncProduce(
        string memory _produceId,
        uint256 _price,
        uint256 _qty
    ) public {
        require(bytes(_produceId).length > 0, "ID required");
        require(_price > 0, "Price must be > 0");
        // Ensure quantity is valid
        require(_qty > 0, "Quantity must be > 0 to publish");

        listings[_produceId] = Listing({
            produceId: _produceId,
            price: _price,
            quantity: _qty,
            timestamp: block.timestamp,
            syncedBy: msg.sender // Automatically captures your backend wallet address
        });

        emit ListingSynced(_produceId, _price, _qty, msg.sender);
    }

    function getListing(string memory _produceId) public view returns (Listing memory) {
        return listings[_produceId];
    }
}