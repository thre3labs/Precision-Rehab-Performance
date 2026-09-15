import Image from "next/image";
import { provider, missionVision } from "@/lib/content";

export function AboutPT() {
  return (
    <section className="about" id="about">
      <div className="wrap about-grid">
        <div className="photo-frame">
          <Image
            src="/images/kushal-patel.jpg"
            alt={provider.name}
            width={900}
            height={1200}
          />
          <div className="photo-tag">
            <b>{provider.name}</b>
            <span>{provider.role}</span>
          </div>
        </div>

        <div>
          <div className="axis">
            <div className="axis-rail" aria-hidden="true" />
            <div className="axis-body">
              <span className="note">Meet our team</span>
              <h2>{provider.teamHeadline}</h2>
            </div>
          </div>

          <p className="bio">{provider.experience}</p>

          <div className="mv">
            <div className="mv-card">
              <span className="note">Our mission</span>
              <p>{missionVision.mission}</p>
            </div>
            <div className="mv-card">
              <span className="note">Our vision</span>
              <p>{missionVision.vision}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
