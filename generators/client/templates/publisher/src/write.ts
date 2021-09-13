/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Gateway, Wallets } from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';


async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '<%=networkConfigPath%>');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '<%= walletPath %>');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('<%= identity %>');
        if (!identity) {
            console.log('An identity for the user "<%= identity %>" does not exist in the wallet');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: '<%= identity %>', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('<%= channel %>');

        // Get the contract from the network.
        const contract = network.getContract('<%= actualContract %>');

        // Evaluate take transaction.
        const result = await contract.evaluateTransaction('write', '1');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();
