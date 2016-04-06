Ethereum authentication
=======================

This project contains a first draft version of a authentication and authorizaion service in blockchain technolgy. The sevice provides a library with a set of solidity contracts which together form a authorization service.

Text from hackaton
------------------
From 2018 onwards banks must grant third party apps access to client information. For example, the application where you manage your payments does not have to be from your own bank. Allowing third party applications to interact with this data will drive innovation. However, banks will still be held accountable for the security and integrity of client information. We believe the best way to guarantee client security is using blockchain technology.
Currently, banks provide proprietary apps and an internal API to their customers. For example ING Mobile Pay. An API functions as a gateway to the banks information. Whenever you check your current balance with your banking app, the app will send a structured message to the API. In return the API replies in a structured manner.
Banks will have to open up their API’s to third party providers. However, banks will not know what happens beyond the API. Did the customer give permission for a transaction, or not? Did the customer give permission for companies to use this data, or not? In order to tackle this issue we add blockchain technology to the system. A bank account is linked to a blockchain contract where the accountholder signs messages with a private key. Using this contract the accountholder authorizes an individual or company. Subsequently this contract can be used to obtain account information or initiate payments on his behalf.
The advantage of using a decentralized and public blockchain over a traditional database within the bank is the resilient nature of the blockchain. Moreover, the creation of new blocks based on the previous chain hardens the data and makes the information it holds irrefutable. Harnessing blockchain technology presents the next generation in omnichannel payments where the customer is in control.
