require("dotenv").config();

import { ethers, BigNumber } from "ethers";
import { LiquidityMiningManager } from "./LiquidityMiningManager";
import { LiquidityMiningManager__factory } from "./LiquidityMiningManager__factory";

const provider = new ethers.providers.InfuraProvider("homestead", process.env.INFURA_KEY);

let wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
wallet = wallet.connect(provider);

// const ETHERSCAN_REQUEST = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.ETHERSCAN_KEY}`
const LIQUIDITY_MINING_MANAGER = "0x21b56371c9D064Fe18cCa5798E164C25D73b9d36";
const INTERVAL = 60 * 60 * 24; // EVERY 24 hours
const MAX_GAS_PRICE = 300000000000; // 300GWEI max
const MAX_PRIORITY_FEE = 3000000000; // 3 GWEI priority fee

let lm: LiquidityMiningManager;

const check = async () => {
    console.log("running");
    const lastUpdate = await lm.lastDistribution();
    const timestampInSeconds = BigNumber.from(Math.floor(Date.now() / 1000));

    // if lastUpdate + 24 hours has passed current timestamp execute
    if(lastUpdate.add(INTERVAL).lt(timestampInSeconds)) {
        lm.distributeRewards({maxFeePerGas: MAX_GAS_PRICE, maxPriorityFeePerGas: MAX_PRIORITY_FEE});
    } else {
        console.log("Not ready yet");
    }
}

const start = async() => {
    console.log("Starting");

    lm = new LiquidityMiningManager__factory(wallet).attach(LIQUIDITY_MINING_MANAGER);

    check();
    // every 10 minutes
    setInterval(check, 60 * 10 * 1000);
}

start();