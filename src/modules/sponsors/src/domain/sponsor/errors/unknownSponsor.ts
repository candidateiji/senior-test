export class UnknownSponsorError extends Error {
  constructor(sponsorName: string) {
    super(`${sponsorName} is not a known sponsor`);
  }
}
