// SPDX-License-Identifier: MIT
// This is a license identifier, allowing others to use this code under MIT terms (open-source).

pragma solidity ^0.8.20;
// Tells the compiler to use Solidity version 0.8.20 or higher (but not 0.9.x due to ^).

contract AgroledgerProduce {
    // Defines the smart contract named Agroledger. All code inside {} is part of it.

    struct Listing {
        // A custom data type (struct) to group related data for a produce listing.
        string produceId;  // A text string for the unique ID of the produce (e.g., "apple123").
        uint256 price;     // The price in wei (smallest Ethereum unit, like cents).
        uint256 quantity;  // How much produce (e.g., 50 units).
        uint256 timestamp; // When the listing was created (seconds since 1970).
        address syncedBy;  // The blockchain address of who created the listing (like a signature).
    }

    mapping(string => Listing) public listings;
    // A public mapping (like a dictionary): keys are strings (produceId), values are Listing structs.
    // Anyone can read this data. It stores all listings by their ID.

    // Example of this mapping is something like this:
    // "65fd2ab3..." → {
    //             price: 22000,
    //             quantity: 50,
    //             timestamp: Jan 15, 2026
    //         }
    // This is just a comment showing how the mapping might look in use.

    event ListingSynced(
        // Defines an event (a log/notification) emitted when a listing is synced.
        string indexed produceId,  // The produce ID (indexed for efficient searching).
        uint256 price,             // The price value.
        uint256 quantity,          // The quantity value.
        address syncedBy           // The address that synced it.
    );

    function syncProduce(
        // Defines a public function to add/update a produce listing.
        string memory _produceId,  // Input: the produce ID (stored in memory, not permanently).
        uint256 _price,            // Input: the price (uint256 is a large positive number).
        uint256 _qty               // Input: the quantity.
    ) public {
        // Function body starts here. 'public' means anyone can call it.

        require(bytes(_produceId).length > 0, "ID required");
        // Checks if the produceId is not empty. If empty, stops execution with error message.

        require(_price > 0, "Price must be > 0");
        // Checks if price is positive. If not, stops with error.

        // Ensure quantity is valid
        require(_qty > 0, "Quantity must be > 0 to publish");
        // Checks if quantity is positive. If not, stops with error.

        listings[_produceId] = Listing({
            // Assigns a new Listing struct to the mapping at key _produceId.
            produceId: _produceId,     // Sets the ID.
            price: _price,             // Sets the price.
            quantity: _qty,            // Sets the quantity.
            timestamp: block.timestamp, // Sets to current block time (when transaction mined).
            syncedBy: msg.sender       // Sets to the caller's address (who called the function).
        });

        emit ListingSynced(_produceId, _price, _qty, msg.sender);
        // Emits the event to log the action on the blockchain.
    }

    function getListing(string memory _produceId) public view returns (Listing memory) {
        // Defines a public view function to retrieve a listing. 'view' means it only reads data.
        // Takes a produceId and returns the full Listing struct (in memory).
        return listings[_produceId];
        // Returns the Listing from the mapping for the given ID. If ID doesn't exist, returns default (empty) values.
    }
}