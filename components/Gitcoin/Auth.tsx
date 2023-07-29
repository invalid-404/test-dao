import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import JoinTheDao from './DaoCard';
import { css } from "@emotion/css";

const APIKEY = process.env.NEXT_PUBLIC_GC_API_KEY;
const SCORERID = process.env.NEXT_PUBLIC_GC_SCORER_ID;

// Endpoint for submitting passport
const SUBMIT_PASSPORT_URI = 'https://api.scorer.gitcoin.co/registry/submit-passport';
// Endpoint for getting the signing message
const SIGNING_MESSAGE_URI = 'https://api.scorer.gitcoin.co/registry/signing-message';
// Score needed to see hidden message
const thresholdNumber = 10;
const headers = APIKEY ? ({
  'Content-Type': 'application/json',
  'X-API-Key': APIKEY
}) : undefined;

export default function Passport() {
  // Local state
  const [address, setAddress] = useState<string>('');
  const [score, setScore] = useState<string>('');
  const [isAboveThreshold, setIsAboveThreshold] = useState<Boolean>(false);

  useEffect(() => {
    checkConnection();

    async function checkConnection() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        // If the user is connected, set their account
        if (accounts && accounts[0]) {
          setAddress(accounts[0]);
        }
      } catch (err) {
        console.log('not connected...');
      }
    }
  }, []);

  // Function to connect to the wallet and submit the passport
  async function connectAndSubmitPassport() {
    try {
      // Connect to the wallet and get the user's address
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAddress(accounts[0]);

      // After connecting, submit the passport and get the score
      await submitPassport();
    } catch (err) {
      console.log('error connecting or submitting passport:', err);
    }
  }

  async function getSigningMessage() {
    try {
      const response = await fetch(SIGNING_MESSAGE_URI, {
        headers
      });
      const json = await response.json();
      console.log('signing message: ', json);
      return json;
    } catch (err) {
      console.log('error: ', err);
    }
  }

  async function submitPassport() {
    try {
      // Call the API to get the signing message and the nonce
      const { message, nonce } = await getSigningMessage();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      // Ask the user to sign the message
      const signature = await signer.signMessage(message);
      // Call the API, sending the signing message, the signature, and the nonce
      const response = await fetch(SUBMIT_PASSPORT_URI, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          address,
          scorer_id: SCORERID,
          signature,
          nonce
        })
      });

      const data = await response.json();
      console.log('data:', data);
      getScore();
    } catch (err) {
      console.log('error: ', err);
    }
  }

  async function getScore() {
    setScore('');
    const GET_PASSPORT_SCORE_URI = `https://api.scorer.gitcoin.co/registry/score/${SCORERID}/${address}`;
    try {
      const response = await fetch(GET_PASSPORT_SCORE_URI, {
        headers
      });
      const passportData = await response.json();
      if (passportData.score) {
        // If the user has a score, round it and set it in the local state
        const roundedScore = Math.round(passportData.score * 100) / 100;
        setScore(roundedScore.toString());
        if (roundedScore > thresholdNumber) {
          setIsAboveThreshold(true);
        } else {
          setIsAboveThreshold(false);
        }
        console.log("PASSPORT SCORE = ", roundedScore);
      } else {
        // If the user has no score, display a message letting them know to submit their passport
        console.log('No score available, please add stamps to your passport and then resubmit.');
      }
    } catch (err) {
      console.log('error: ', err);
    }
  }

  // CSS styles
  const container = css`
    flex-direction: column;
  `;

  const headerStyle = css`
    font-size: 44px;
  `;

  const buttonStyle = css`
    padding: 14px;
    width: 300px;
    border: none;
    cursor: pointer;
    border-radius: 999px;
    outline: 1px solid #fff;
    margin: 2rem 5rem 2rem 0;
    transition: all 0.25s;
    &:hover {
      background-color: rgba(0, 0, 0, 0.2);
    }
  `;

  return (
    <div className={container}>
      <h1 className={headerStyle}>Welcome to Passport DAO!</h1>
      <div>
        <button className={buttonStyle} onClick={connectAndSubmitPassport}>
          Connect Wallet and Submit Passport
        </button>
      </div>
      <div>
        <JoinTheDao isAboveThreshold={isAboveThreshold} score={score} />
      </div>
    </div>
  );
}
