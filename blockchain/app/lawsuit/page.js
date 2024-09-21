'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
// const { ethers } = require("ethers");

export default function InvestButton() {

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const lawsuitAddress = '0x731faCF83a851Da4b0a17aE5B07528dA6438E68A'; // Replace with the actual lawsuit address

    const handleInvestClick = async () => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            console.log("INVEST button clicked");

            // Check if MetaMask or any Web3 wallet is installed
            if (typeof window.ethereum === 'undefined') {
                throw new Error('MetaMask or Web3 wallet not found');
            }
            console.log("MetaMask or Web3 wallet found");

            // Request user to connect their wallet
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Earlier in v5 provider = new ethers.providers.Web3Provider(window.ethereum)
            // In v6: provider = new ethers.BrowserProvider(window.ethereum)
            //v5 syntax
            // const provider = new ethers.providers.Web3Provider(window.ethereum);
            //v6 syntax
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            // Check if user is connected to Sepolia testnet
            const sepoliaChainId = '0xaa36a7'; // Sepolia chain ID in hexadecimal
            const network = await window.ethereum.request({ method: 'eth_chainId' });
            if (network !== sepoliaChainId) {
                throw new Error('Please connect to the Sepolia testnet');
            }

            // Define the transaction object
            const transaction = {
                to: lawsuitAddress,
                // syntax for ethers v5
                // value: ethers.utils.parseEther('0.005'), // Amount to send (0.005 ETH)
                // gasLimit: ethers.utils.hexlify(21000), // Optional gas limit for a simple transfer
                //syntax for ethers v6
                value: ethers.parseEther('0.005'), // Amount to send (0.005 ETH)
                gasLimit: ethers.toBeHex(21000), // Optional gas limit for a simple transfer

            };
            console.log("TRANSACTING ", transaction);

            // Send the transaction
            const txResponse = await signer.sendTransaction(transaction);

            // Wait for the transaction to be mined
            await txResponse.wait();

            alert('Transaction successful!');
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    function handleWhistleClick() {
        // This function will be called when the button is clicked
        // It will send a request to the server, to whistleblow information on the lawsuit
        console.log("Whistle button clicked");
    }

    return (
        <div>
            {/* lawsuit with an id */}
            <h1>Lawsuit (grab from db)</h1>
            <h2>Details: </h2>
            <p>(details grabbed from the database)</p>
            <h2>Actions: </h2>
            <button className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                onClick={handleWhistleClick}>Whistle Blow</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                onClick={handleInvestClick} disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Invest 0.005 SepoliaETH'}
            </button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        </div>

    );
}
