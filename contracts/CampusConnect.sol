// contracts/CampusConnect.sol
pragma solidity ^0.8.0;

contract CampusConnect {
    struct Message {
        address sender;
        string content;
    }

    mapping(address => Message[]) public messages;

    event NewMessage(address indexed from, string content);

    function sendMessage(address to, string memory content) public {
        messages[to].push(Message(msg.sender, content));
        emit NewMessage(msg.sender, content);
    }

    function getMessages(address user) public view returns (Message[] memory) {
        return messages[user];
    }
}
