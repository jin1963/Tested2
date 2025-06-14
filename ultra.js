let web3;
let contract;
let tokenContract;
let userAccount;

const stakingAddress = "0x18d9d27fbf87306aefe2a4a9c1d9e62ccb3635f0";
const tokenAddress = "0x65e47d9bd03c73021858ab2e1acb2cab38d9b039";

window.addEventListener("load", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        userAccount = accounts[0];
        document.getElementById("walletAddress").innerText = `Connected: ${userAccount}`;

        contract = new web3.eth.Contract(stakingABI, stakingAddress);
        tokenContract = new web3.eth.Contract([
            {
                "constant": false,
                "inputs": [
                    { "name": "_spender", "type": "address" },
                    { "name": "_value", "type": "uint256" }
                ],
                "name": "approve",
                "outputs": [{ "name": "", "type": "bool" }],
                "type": "function"
            }
        ], tokenAddress);
    } else {
        alert("Please install MetaMask.");
    }
});

document.getElementById("approveButton").onclick = async () => {
    const amount = document.getElementById("amountInput").value;
    const amountWei = web3.utils.toWei(amount, "ether");
    await tokenContract.methods.approve(stakingAddress, amountWei).send({ from: userAccount });
    document.getElementById("status").innerText = "✅ Approved!";
};

document.getElementById("stakeButton").onclick = async () => {
    const amount = document.getElementById("amountInput").value;
    const tier = document.getElementById("tierSelect").value;
    const amountWei = web3.utils.toWei(amount, "ether");
    await contract.methods.stake(amountWei, tier).send({ from: userAccount });
    document.getElementById("status").innerText = "✅ Staked!";
};

document.getElementById("claimButton").onclick = async () => {
    const index = document.getElementById("stakeIndex").value;
    await contract.methods.claim(index).send({ from: userAccount });
    document.getElementById("status").innerText = "✅ Claimed!";
};

document.getElementById("unstakeButton").onclick = async () => {
    const index = document.getElementById("stakeIndex").value;
    await contract.methods.unstake(index).send({ from: userAccount });
    document.getElementById("status").innerText = "✅ Unstaked!";
};
