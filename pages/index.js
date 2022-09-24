import { useState, useEffect } from "react";
import { client, recommendProfiles } from "../api";
import Link from "next/link";
import Image from "next/image";
import lens from "./lens.jpeg";

export default function Home() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      const response = await client.query(recommendProfiles).toPromise();
      console.log({ response });
      setProfiles(response.data.recommendedProfiles);
    } catch (error) {
      console.log({ error });
    }
  }
  // console.log(profiles[0]?.picture?.original.url);
  return (
    <div>
      {profiles.map((profile, index) => (
        <Link href={`/profile/${profile.id}`}>
          <a>
            <div>
              {profile.picture?.original?.url ? (
                <img
                  src={profile.picture.original.url}
                  width="60px"
                  heigth="60px"
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
              <h4> {profile.handle}</h4>
              <p> {profile.bio}</p>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
}
