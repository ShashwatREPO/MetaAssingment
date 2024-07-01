// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

contract ERC20Token {
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) public allowance;

    uint256 totalSupply;
    string public Token_Name;
    string public Token_Abbr;
    address public owner;

    constructor(string memory tokenName, string memory tokenAbbr, uint value) {
        Token_Name = tokenName;
        Token_Abbr = tokenAbbr;
        totalSupply = value;
        owner = msg.sender;
        balances[msg.sender] = totalSupply;
    }

    //modifiers

    modifier OnlyOwner() {
        require(msg.sender == owner, "Only owner can call these functions");
        _;
    }

    //events
    event Transfer(address indexed from, address indexed to, uint txtoken);
    event Approval(
        address indexed tokenOwner,
        address indexed spender,
        uint256 tokens
    );

    //fucntions
    function reTotalSupply() public view returns (uint256) {
        return totalSupply;
    }

    function balanceOf(address tokenOwner) public view returns (uint256) {
        return balances[tokenOwner];
    }

    function transfer(
        address recivever,
        uint256 txTokens
    ) public returns (bool) {
        require(balances[msg.sender] >= txTokens, "Not enough token");
        balances[msg.sender] -= txTokens;
        balances[recivever] += txTokens;
        emit Transfer(msg.sender, recivever, txTokens);
        return true;
    }

    function transferFrom(
        address owner,
        address buyer,
        uint txTokens
    ) public returns (bool) {
        require(balances[owner] >= txTokens, "Not enough tokens");
        require(txTokens <= allowance[owner][msg.sender], "Exceeds allowance");
        balances[owner] -= txTokens;
        allowance[owner][msg.sender] -= txTokens;
        balances[buyer] += txTokens;
        emit Transfer(owner, buyer, txTokens);
        return true;
    }

    function approval(address delegate, uint numTokens) public returns (bool) {
        allowance[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function mint(address to, uint256 amount) public OnlyOwner {
        totalSupply += amount;
        balances[to] += amount;
    }

    function burn(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Not enough tokens to burn");

        totalSupply -= amount;
        balances[msg.sender] -= amount;
    }

    //not implemented safemath for security
}
