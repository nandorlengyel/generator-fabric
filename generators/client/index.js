/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const camelcase = require('camelcase');
const decamelize = require('decamelize');
const Generator = require('yeoman-generator');
const path = require('path');
const process = require('process');
const fs = require('fs')

let typeAnswer, answers;
module.exports = class extends Generator {

    async prompting() {

        const questions = [{
                type: 'input',
                name: 'name',
                message: 'Please specify the client name:',
                default: path.basename(process.cwd()),
                when: () => !this.options.name
            }, {
                type: 'input',
                name: 'channel',
                message: 'Please specify the channel name:',
                default: path.basename(process.cwd()),
                when: () => !this.options.name
            }, {
                type: 'input',
                name: 'networkConfigPath',
                message: 'Please specify the network config file path:',
                default: path.basename(process.cwd()),
                when: () => !this.options.name
            }, {
                type: 'input',
                name: 'identityPath',
                message: 'Please specify the identity file path:',
                default: path.basename(process.cwd()),
                when: () => !this.options.name
            },
            {
                type: 'input',
                name: 'identity',
                message: 'Please specify the identity name:',
                default: path.basename(process.cwd()),
                when: () => !this.options.name
            },
            {
                type: 'input',
                name: 'pubContracts',
                message: 'Please specify the publisher contracts:',
                default: path.basename(process.cwd()),
                when: () => !this.options.name
            },
            {
                type: 'input',
                name: 'subContracts',
                message: 'Please specify the subscriber contracts:',
                default: path.basename(process.cwd()),
                when: () => !this.options.name
            }
        ];


        answers = await this.prompt(questions);
        Object.assign(this.options, answers);

        this.options.pubContractsArray = new Array();
        this.options.pubContracts = this.options.pubContracts.replace("[","");
        this.options.pubContracts = this.options.pubContracts.replace("]","");
        this.options.pubContractsArray = this.options.pubContracts.split(',');

        this.options.subContractsArray = new Array();
        this.options.subContracts = this.options.subContracts.replace("[","");
        this.options.subContracts = this.options.subContracts.replace("]","");
        this.options.subContractsArray = this.options.subContracts.split(',');
    }

    _rename(from, to) {
        if (from === to) {
            return;
        }
        this.fs.move(from, to);
    }

    async writing() {
        console.log('Generating files...');

        this.fs.copyTpl(this.templatePath(``), this._getDestination(), this.options, undefined, {
            globOptions: {
                dot: true
            }
        });


    }

    async install() {

        this.installDependencies({
            bower: false,
            npm: true
        });

    }

    _getDestination() {
        return (this.options.destination) ? (this.destinationRoot(this.options.destination)) : ((this.destinationRoot()));
    }

    end() {
        console.log('Finished generating contract');
    }
};
