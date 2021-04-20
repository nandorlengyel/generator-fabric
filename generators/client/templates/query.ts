/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Gateway, Wallet, Wallets } from "fabric-network";
import * as path from "path";
import * as fs from "fs";

async function main() {
    try {
        const ccp = JSON.parse(fs.readFileSync("<%=networkConfigPath%>", "utf8"));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "wallet");

        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const identity = JSON.parse(fs.readFileSync("<%= identityPath %>", "utf8"));
        wallet.put("<%= identity %>", identity);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "<%= identity %>",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("<%= channel %>");

        let pubContracts = new Array();
 
        <%  for (let pubContract of pubContractsArray){ %>
            pubContracts.push("<%= pubContract %>");
       <% } %>  

       let subContracts = new Array();

       <%  for (let subContract of subContractsArray){ %>
        subContracts.push("<%= subContract %>");
      <% } %>  


      while (true) {

        pubContracts.forEach(async function (pubContract) {
            const contract = network.getContract(pubContract);

            const result = await contract.evaluateTransaction(
                "write","test1","test2"
            );
            console.log(
                `Transaction has been evaluated, result is: ${result.toString()}`
            );
          }); 
        
          subContracts.forEach(async function (subContract) {
            const contract = network.getContract(subContract);

            const result = await contract.evaluateTransaction(
                "take"
            );
            console.log(
                `Transaction has been evaluated, result is: ${result.toString()}`
            );
          }); 

          //wait method
          //pl.: await timer(1000).pipe(take(1)).toPromise();

    }
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();
