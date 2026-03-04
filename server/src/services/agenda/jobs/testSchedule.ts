import { Job } from "agenda";
import { agenda } from "../agendaService";

const testScheduleJob = async (job?: Job) => {
  try {
    if (!agenda) {
      throw new Error("❌ Agenda must be initialized before scheduling jobs.");
    }

    console.log('⌛︎  Running an Agenda job "testScheduleJob"');
  } catch (error) {
    throw new Error("❌ Error starting Agenda!", { cause: error });
  }
};

export default testScheduleJob;
