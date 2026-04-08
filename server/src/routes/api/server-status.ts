import express from 'express';
const router = express.Router();

async function checkServer(): Promise<boolean> {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch("http://192.168.170.77/ui", {
      method: "GET",
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}

router.get("/", async (_req, res) => {
    const online = await checkServer();
    res.status(200).json({ online });
});

export { router as serverStatusRouter };
export { checkServer };