export function run (e: {
  reason?: string,
  time?: number | string
}) {
  console.log(`Shutting down for ${e.reason} in ${e.time} seconds.`);
}

export const event = "shutdown";
