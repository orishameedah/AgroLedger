// SPDX-License-Identifier: MIT
// This is a license identifier, allowing others to use this code under MIT terms (open-source).

pragma solidity ^0.8.20;

contract AgroledgerProduce {

    struct Listing {
        string produceId;  
        uint256 price;     
        uint256 quantity;  
        uint256 timestamp; 
        address syncedBy;  
    }

    mapping(string => Listing) public listings;
    // A public mapping (like a dictionary): keys are strings (produceId), values are Listing structs.
    // String (The Key): This is the ID. You are telling the blockchain, "I will give you a string (the produceId), and I want you to find something for me."
    // Listing (The Value): This is what you get back. You are telling the blockchain, "When I give you that ID, please return the whole bundle of data (the Listing) associated with it."

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

        require(_qty > 0, "Quantity must be > 0 to publish");

        listings[_produceId] = Listing({  //It looks up the unique _produceId in your listings "dictionary" and creates a new entry.
            produceId: _produceId,     
            price: _price,             
            quantity: _qty,            
            timestamp: block.timestamp, 
            syncedBy: msg.sender       
        });

        emit ListingSynced(_produceId, _price, _qty, msg.sender);
    }

    function getListing(string memory _produceId) public view returns (Listing memory) {
    
        return listings[_produceId];
       
    }
}