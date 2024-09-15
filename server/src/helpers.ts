/**
 * Transforms an error that occurred in a try/catch block into a string.
 * @param err Error passed to the catch block
 * @returns An error message string
 */
export const getErrorMessage = (err: unknown): string => {
  return err instanceof Error ? err.message : String(err);
};
