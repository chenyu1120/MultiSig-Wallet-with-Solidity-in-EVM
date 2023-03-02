const { expect } = require("chai");
const { ethers } = require("hardhat");

let token;
let owner;
let user;

describe("Token", function () {
  it("Should return the new Token once it's changed", async function () {
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy();
    await token.deployed();

    expect(await token.name()).to.equal("Token");
    expect(await token.symbol()).to.equal("TKN");
    expect(await token.decimals()).to.equal(18);
  });
});

describe("MultiSigWallet", function () {
  it("Should return the new MultiSigWallet once it's changed", async function () {

    [owner, user] = await ethers.getSigners();

    const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
    const multiSigWallet = await MultiSigWallet.deploy([owner.address, user.address], 2);
    await multiSigWallet.deployed();
    
    let tx = await multiSigWallet.connect(owner).updateTokenAddress(token.address);
    await tx.wait();

    tx = await token.connect(owner).transfer(multiSigWallet.address, "100000000000000000000000000");
    await tx.wait();

    let transactions = await multiSigWallet.getTransactionCount();
    console.log("transactions before submitTransaction: ", transactions.toString());

    let balance = await token.balanceOf(user.address);
    console.log("Balance is ", balance.toString(), "before submitTransaction");

    tx = await multiSigWallet.connect(owner).submitTransaction(user.address, "1000000000000000000000000", "0x4669727374205472616e73616374696f6e");
    await tx.wait();

    transactions = await multiSigWallet.getTransactionCount();
    console.log("transactions after submitTransaction: ", transactions.toString());

    tx = await multiSigWallet.connect(owner).confirmTransaction(0);
    await tx.wait();

    tx = await multiSigWallet.connect(user).confirmTransaction(0);
    await tx.wait();

    tx = await multiSigWallet.connect(owner).executeTransaction(0);
    await tx.wait();

    balance = await token.balanceOf(user.address);
    console.log("Balance is ", balance.toString(), "after submitTransaction");
  });
});