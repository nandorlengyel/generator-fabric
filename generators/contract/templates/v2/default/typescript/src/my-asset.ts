/*
 * <%= spdxAndLicense // SPDX-License-Identifier: Apache-2.0 %>
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class <%= assetPascalCase %> {
    @Property()
    <%  for (let structElement of structElements){ %>
         <%= structElement.dataName %> : <%= structElement.dataType %>;
    <% } %>   
}
