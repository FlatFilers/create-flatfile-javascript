import { FlatfileListener } from "@flatfile/listener";
import api, { FlatfileClient } from "@flatfile/api";
import { recordHook } from "@flatfile/plugin-record-hook";

const flatfile = new FlatfileClient({
  token: process.env.FLATFILE_API_KEY,
  environment: process.env.BASE_URL + "/v1",
});

export const listener = FlatfileListener.create((listener) => {
  listener.on("**", (event) => {
    console.log("Event =>", event);
  });

  listener.use(
    recordHook("contacts", (record) => {
      const firstName = record.get("firstName");
      console.log({ firstName });
      record.set("lastName", "Rock");
      return record;
    })
  );

  listener.filter({ job: "workbook:submitActionFg" }, (configure) => {
    configure.on("job:ready", async ({ context: { jobId } }) => {
      try {
        await flatfile.jobs.ack(jobId, {
          info: "Getting started.",
          progress: 10,
        });

        // Make changes after cells in a Sheet have been updated
        console.log("Make changes here when an action is clicked");

        await flatfile.jobs.complete(jobId, {
          outcome: {
            message: "This job is now complete.",
          },
        });
      } catch (error) {
        console.error("Error:", error.stack);

        await flatfile.jobs.fail(jobId, {
          outcome: {
            message: "This job encountered an error.",
          },
        });
      }
    });
  });
});
