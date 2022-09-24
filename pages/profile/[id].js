import { useRouter } from "next/router";
import { client, getProfiles, getPublications } from "../../api";
import { useState, useEffect } from "react";
import Image from "next/image";
import lens from "../lens.jpeg";
import ABI from "../../abi.json";
import { ethers } from "ethers";

const address = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";

export default function profile() {
  const router = useRouter();
  const { id } = router.query;
  const [profile, setProfile] = useState(null);
  const [pubs, setPubs] = useState([]);
  const [walletAddress, setWalletAddress] = useState(null);
  const [connectButtonText, setConnectButtonText] = useState("Connect Wallet");

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  async function fetchProfile() {
    try {
      const response = await client.query(getProfiles, { id }).toPromise();
      console.log("Response: ", response);
      setProfile(response.data.profiles.items[0]);

      const publicationData = await client
        .query(getPublications, { id })
        .toPromise();
      console.log(publicationData);
      setPubs(publicationData.data.publications.items);
    } catch (error) {
      console.log({ error });
    }
  }

  async function changeChain() {
    const val = "0x" + parseInt(137).toString(16);
    console.log(val);
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: val }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: val,
                chainName: "Polygon Mainnet",
                rpcUrls: ["https://polygon-rpc.com"] /* ... */,
              },
            ],
          });
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  }

  async function follow() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, ABI, signer);
    try {
      const tx = await contract.follow([id], [0x0]);
      await tx.wait(1);
      console.log("followed user successfully");
      console.log(tx);
    } catch (err) {
      console.log({ err });
    }
  }

  async function connect() {
    setWalletAddress(null);

    if (typeof window.ethereum !== "undefined") {
      try {
        console.log("EVM-Based wallet detected!");
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.log(error);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });
      setWalletAddress(accounts[0]);
      console.log(accounts);
      const chainId = await ethereum.request({ method: "eth_chainId" });
      const network = String(parseInt(chainId));
      if (network != 137) {
        changeChain();
      }
      console.log("Connected");
      setConnectButtonText("Connected!");
    } else {
      console.log("EVM-Based wallet NOT detected!");
      setConnectButtonText("Connect Wallet");
      window.alert(
        "Install an Ethereum wallet extension on any chromium based browser on your laptop or use Brave browser on mobile or laptop"
      );
    }
  }

  if (!profile) return null;

  return (
    <div>
      <button onClick={connect}> {connectButtonText} </button> <p />
      {walletAddress ? (
        <div>
          <h3> Wallet Address: {walletAddress} </h3> <p />{" "}
        </div>
      ) : (
        <h3> Connect your wallet to see your wallet address. </h3>
      )}
      {profile.picture ? (
        <img
          src={profile.picture.original.url}
          height="200px"
          width="200px"
          layout="fill"
          style={{ borderRadius: "100%" }}
        />
      ) : (
        <Image
          src={lens}
          width="60px"
          height="60px"
          style={{ borderRadius: "100%" }}
        />
      )}
      <p>
        <button onClick={follow}> Follow </button>
      </p>
      <div>
        <h4>{profile.handle} </h4>
        <p> {profile.bio} </p>

        <p> Followers: {profile.stats.totalFollowers} </p>
        <p> Following: {profile.stats.totalFollowing} </p>
      </div>
      {pubs.map((pub, index) => (
        <div style={{ padding: "20px", borderTop: "1px solid black" }}>
          {pub.metadata.content}
        </div>
      ))}
    </div>
  );
}
