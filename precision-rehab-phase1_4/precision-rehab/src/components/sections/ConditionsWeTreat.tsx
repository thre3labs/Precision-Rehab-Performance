import { conditionsTreated } from "@/lib/content";

export function ConditionsWeTreat() {
  return (
    <section className="cond" id="conditions">
      <div className="wrap">
        <div className="axis">
          <div className="axis-rail" aria-hidden="true" />
          <div className="axis-body">
            <span className="note">What we treat</span>
            <h2>Start where it hurts.</h2>
            <p className="lede">{conditionsTreated.intro}</p>
          </div>
        </div>

        <div className="reg">
          {conditionsTreated.groups.map((g) => (
            <div className="reg-col" key={g.region}>
              <h3>{g.region}</h3>
              <ul>
                {g.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="cond-foot">
          Don&rsquo;t see your exact condition listed? We likely still treat it.
          <a href="#screening">Call to find out, or ask in a free screening</a>
        </p>
      </div>
    </section>
  );
}
