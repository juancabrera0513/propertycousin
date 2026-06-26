import { useEffect, useMemo, useRef, useState } from "react";
import { stats } from "../data/stats";

function parseStatValue(value) {
  const text = String(value).trim();

  if (text.includes("-")) {
    const [start, end] = text.split("-").map((item) => item.trim());

    return {
      type: "range",
      start: parseStatValue(start),
      end: parseStatValue(end),
    };
  }

  const hasDollar = text.includes("$");
  const hasMillion = text.toUpperCase().includes("M");
  const hasThousand = text.toUpperCase().includes("K");
  const hasPercent = text.includes("%");

  const number = Number(text.replace(/[^0-9.]/g, ""));

  return {
    type: "single",
    number: Number.isNaN(number) ? 0 : number,
    hasDollar,
    hasMillion,
    hasThousand,
    hasPercent,
  };
}

function formatStatValue(parsed, currentValue) {
  if (parsed.hasMillion) {
    return `${parsed.hasDollar ? "$" : ""}${currentValue.toFixed(
      currentValue % 1 === 0 ? 0 : 1
    )}M`;
  }

  if (parsed.hasThousand) {
    return `${parsed.hasDollar ? "$" : ""}${Math.round(currentValue)}K`;
  }

  if (parsed.hasPercent) {
    return `${Math.round(currentValue)}%`;
  }

  if (parsed.hasDollar) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(currentValue);
  }

  return Math.round(currentValue).toLocaleString("en-US");
}

function AnimatedStatValue({ value, shouldAnimate }) {
  const parsed = useMemo(() => parseStatValue(value), [value]);

  const [singleValue, setSingleValue] = useState(0);
  const [rangeStart, setRangeStart] = useState(0);
  const [rangeEnd, setRangeEnd] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) return;

    let frameId;
    const duration = 1800;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      if (parsed.type === "range") {
        setRangeStart(parsed.start.number * easedProgress);
        setRangeEnd(parsed.end.number * easedProgress);
      } else {
        setSingleValue(parsed.number * easedProgress);
      }

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [parsed, shouldAnimate]);

  if (parsed.type === "range") {
    const start = formatStatValue(parsed.start, rangeStart);
    const end = formatStatValue(parsed.end, rangeEnd);

    return (
      <>
        {start} - {end}
      </>
    );
  }

  return <>{formatStatValue(parsed, singleValue)}</>;
}

function StatsSection() {
  const sectionRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldAnimate(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section stats-section" id="results" ref={sectionRef}>
      <div className="container">
        <div className="section-heading section-heading--center">
          <h2>Proven local insight with a relationship-first approach.</h2>
          <p>
            A focused real estate team helping buyers and sellers across
            Jefferson County and the greater St. Louis area make confident moves
            with clear guidance from start to finish.
          </p>
        </div>

        <div className="stats-grid">
          {stats.map((item, index) => (
            <div
              className="stat-card"
              data-reveal="up"
              style={{ "--reveal-delay": `${index * 120}ms` }}
              key={item.label}
            >
              <h3>
                <AnimatedStatValue
                  value={item.value}
                  shouldAnimate={shouldAnimate}
                />
              </h3>
              <p>{item.label}</p>
            </div>
          ))}
        </div>

        <div className="market-card" data-reveal="up">
          <div>
            <h3>
              Two agents, better communication, and a plan built around your
              goals.
            </h3>
          </div>

          <p>
            Every client works with both Chris and Travis, giving buyers and
            sellers more availability, two perspectives, and a team that stays
            involved through every step of the process. From pricing strategy to
            negotiations and closing, the focus is on preparation, communication,
            and a smoother real estate experience.
          </p>
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
