'use client'

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ethers } from 'ethers';

export default function Component() {
  const [lawsuits, setLawsuits] = useState([]) // State to hold the fetched lawsuits
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const lawsuitAddress = '0x731faCF83a851Da4b0a17aE5B07528dA6438E68A'; // Replace with the actual lawsuit address

  const handleInvestClick = async (id) => {
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

          fetch(`http://localhost:8000/lawsuit/${id}/donate`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: id,
              amount: 0.005,
              wallet_id: signer.getAddress(),
            }),
          });

          alert('Transaction successful!');
      } catch (error) {
          setErrorMessage(error.message);
      } finally {
          setIsLoading(false);
      }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetch('http://localhost:8000/lawsuits/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json()) // Parse the JSON from the response
      .then(data => {
        setLawsuits(data) // Set the lawsuits data into state
      })
      .catch(error => {
        console.error("Error fetching lawsuits:", error)
      })
  }, []) // Empty array ensures this effect runs once when the component mounts

  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="container grid gap-6 md:gap-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <h2 className="text-2xl font-bold tracking-tight">Explore Our Car Rental Options</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 xl:gap-8">
          {lawsuits.length > 0 ? (
            lawsuits.map((lawsuit) => (
              <Card
                key={lawsuit.id}
                className="group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 ease-in-out hover:-translate-y-2"
              >
                {/* <Link href={`/lawsuit/${lawsuit.id}`} className="absolute inset-0 z-10" prefetch={false}>
                  <span className="sr-only">View</span>
                </Link> */}
                <img
                  src="/placeholder.svg" // Placeholder image
                  alt="Lawsuit Image"
                  width={500}
                  height={300}
                  className="object-cover w-full h-56"
                  style={{ aspectRatio: "500/300", objectFit: "cover" }}
                />
                <CardContent className="bg-white p-4 dark:bg-gray-950">
                  <h3 className="font-bold text-xl">{lawsuit.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{lawsuit.owner}</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span>{lawsuit.description}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <h4 className="font-semibold text-lg md:text-xl">Amount Collected: ${lawsuit.amount_collected}</h4>
                    <Button onClick={() => handleInvestClick(lawsuit.id)} size="sm" variant="outline" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Donate'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No lawsuits found.</p>
          )}
        </div>
      </div>
    </section>
  )
}
