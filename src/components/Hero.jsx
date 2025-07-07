import { Box } from "@mantine/core";

export default function Hero() {
  return (
    <Box>
      <Box mb={20}>
        <h1 className="font-bold font-mono">
          Coffee Tracking for Coffee{" "}
          <abbr title="An enthusiast or devotee">Fellas</abbr>!
        </h1>
        <div className="benefit-list">
          <h3 className="font-bold font-mono mb-2 mt-2">
            Try <span>Caffein Fellas</span>
          </h3>
          <p className="font-normal font-mono">✅ Tracking every coffee</p>
          <p className="font-normal font-mono">
            ✅ Measuring your blood caffeine levels{" "}
          </p>
          <p className="font-normal font-mono">
            ✅ Costing and quantifiying your addtion
          </p>
        </div>
      </Box>
      <Box>
        <div className="card card-info">
          <div className="container mb-3">
            <i className="fa-solid fa-circle-info"></i>
            <h3 className="ml-3 font-bold font-mono">Do You Know...</h3>
          </div>
          <h5 className="font-normal font-mono mb-2">
            That caffeine&apos;s half-life is about 5 hours?
          </h5>
          <p className="text-md font-normal font-mono mb-4">
            This means that after 5 hours, half the caffeine you consumed is
            still in your system, keeping you in alert longer! So if you drink a
            cup of coffee with 200 mg of caffeine, 5 hours, later, you&apos;ll
            still have about 100 mg of caffeine in your system.
          </p>
        </div>
      </Box>
    </Box>
  );
}
