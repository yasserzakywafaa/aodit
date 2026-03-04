import Agenda from "agenda";
import { getMongoDbUri } from "../../models/mongoDb";
import testScheduleJob from "./jobs/testSchedule";

// import cron from "node-cron";

// CRON EXPRESSIONS VISUALIZATION
// * * * * * *
// ┬ ┬ ┬ ┬ ┬ ┬
// │ │ │ │ │ │
// │ │ │ │ │ └─ Day of Week (0 - 7) (Sunday=0 or 7)
// │ │ │ │ └─ Month (1 - 12)
// │ │ │ └─ Day of Month (1 - 31)
// │ │ └─ Hour (0 - 23)
// │ └─ Minute (0 - 59)
// └─ Second (0 - 59) (Optional)

export enum AgendaJobsEnum {
  Test = "test",
}

let agenda: Agenda | undefined;

const agendaInit = async (): Promise<void> => {
  if (!agenda) {
    try {
      agenda = new Agenda({
        db: { address: getMongoDbUri(), collection: "agenda_jobs" },
        processEvery: "10 seconds",
      });

      agenda.define(AgendaJobsEnum.Test, testScheduleJob);

      await agenda.start();
      console.log("✅  Agenda has been initialized!");
    } catch (error) {
      console.error("❌  Error initializing Agenda:", error);
    }
  } else {
    console.log("✅  Agenda has already been initialized!", { agenda });
  }
};

const testScheduleHandler = async (data?: any): Promise<void> => {
  if (!agenda) {
    throw new Error("❌ Agenda is not initialized. Call agendaInit() first.");
  }
  await agenda.every("2 minutes", AgendaJobsEnum.Test, data, {});
};

const cancelJob = async (jobId: string): Promise<void> => {
  try {
    if (!agenda) {
      throw new Error("❌ Agenda is not initialized. Call agendaInit() first.");
    }
    await agenda.cancel({ _id: jobId as any });
    console.log(`Job with ID ${jobId} canceled.`);
  } catch (error) {
    console.error("Error canceling job:", error);
  }
};

const cancelJobs = async (jobIds: string[]): Promise<void> => {
  try {
    if (!agenda) {
      throw new Error("❌ Agenda is not initialized. Call agendaInit() first.");
    }
    for (const jobId of jobIds) {
      await agenda.cancel({ _id: jobId as any });
    }
    console.log(`🗑️  Canceled ${jobIds.length} jobs.`);
  } catch (error) {
    console.error("Error canceling jobs:", error);
  }
};

const stopAgenda = async (): Promise<void> => {
  if (!agenda) {
    throw new Error("❌ Agenda is not initialized. Call agendaInit() first.");
  }
  try {
    await agenda.stop();
    console.log("Agenda stopped manually.");
  } catch (error) {
    console.error("Error stopping Agenda:", error);
  }
};

export {
  agenda,
  agendaInit,
  cancelJob,
  cancelJobs,
  stopAgenda,
  testScheduleHandler,
};
