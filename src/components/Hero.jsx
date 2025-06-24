export default function Hero() {
  return (
    <>
      <h1>
        Coffee Tracking for Coffee{" "}
        <abbr title="An enthusiast or devotee">Fellas</abbr>!
      </h1>
      <div className="benefit-list">
        <h3 className="font-bolder">
          Try <span className="text-gradient">Caffein Fellas</span>
        </h3>
        <p>✅ Tracking every coffee</p>
        <p>✅ Measuring your blood caffeine levels </p>
        <p>✅ Costing and quantifiying your addtion</p>
      </div>
      <div className="card card-info">
        <div className="container">
          <i className="fa-solid fa-circle-info"></i>
          <h3>Do You Know...</h3>
        </div>
        <h5>That caffeine&apos;s half-life is about 5 hours?</h5>
        <p>
          This means that after 5 hours, half the caffeine you consumed is still
          in your system, keeping you in alert longer! So if you drink a cup of
          coffee with 200 mg of caffeine, 5 hours, later, you&apos;ll still have
          about 100 mg of caffeine in your system.
        </p>
      </div>
    </>
  );
}
